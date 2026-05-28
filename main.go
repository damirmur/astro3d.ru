package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/damirmur/swisseph_build/pkg/astro"
	"github.com/damirmur/swisseph_build/pkg/interactive"
)

// Конфигурация сервера
const (
	Port          = ":8080"
	CacheDuration = 24 * time.Hour
)

// Структура для кэширования ответов в памяти
type CacheEntry struct {
	Response   []byte
	Expiration time.Time
}

type MemoryCache struct {
	mu    sync.RWMutex
	items map[string]CacheEntry
}

func NewMemoryCache() *MemoryCache {
	cache := &MemoryCache{
		items: make(map[string]CacheEntry),
	}
	go cache.startCleanupTimer()
	return cache
}

func (c *MemoryCache) Get(key string) ([]byte, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	item, found := c.items[key]
	if !found {
		return nil, false
	}
	if time.Now().After(item.Expiration) {
		return nil, false
	}
	return item.Response, true
}

func (c *MemoryCache) Set(key string, response []byte, duration time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items[key] = CacheEntry{
		Response:   response,
		Expiration: time.Now().Add(duration),
	}
}

func (c *MemoryCache) startCleanupTimer() {
	ticker := time.NewTicker(1 * time.Hour)
	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for k, v := range c.items {
			if now.After(v.Expiration) {
				delete(c.items, k)
			}
		}
		c.mu.Unlock()
	}
}

// Глобальный кэш
var cache = NewMemoryCache()

// Вспомогательная функция для генерации ключа кэша
func generateCacheKey(prefix string, params url.Values) string {
	hash := sha256.Sum256([]byte(prefix + "?" + params.Encode()))
	return fmt.Sprintf("%x", hash)
}

// Middleware для CORS
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// GetExecutableDir возвращает абсолютный путь к папке, где лежит исполняемый файл
func GetExecutableDir() string {
	exePath, err := os.Executable()
	if err != nil {
		log.Printf("Ошибка получения пути процесса: %v, используем текущую директорию", err)
		return "."
	}
	return filepath.Dir(exePath)
}

// Парсинг конфигурации фильтров из URL-запроса
func parseFilterConfig(q url.Values) astro.FilterConfig {
	cfg := astro.FilterConfig{}

	// 1. Фильтр по точности (орбису)
	if maxOrbStr := q.Get("max_orb"); maxOrbStr != "" {
		if val, err := strconv.ParseFloat(maxOrbStr, 64); err == nil {
			cfg.MaxOrb = &val
		}
	}

	// 2. Фильтр по планетам (Sun,Moon,Mars или 0,1,4)
	if planetsStr := q.Get("planets"); planetsStr != "" {
		cfg.Planets = make(map[string]bool)
		for _, p := range strings.Split(planetsStr, ",") {
			p = strings.TrimSpace(p)
			if p != "" {
				cfg.Planets[p] = true
			}
		}
	}

	// 3. Фильтр по типам аспектов (Conjunction,Square,etc.)
	if aspectsStr := q.Get("aspects"); aspectsStr != "" {
		cfg.AspectTypes = make(map[string]bool)
		for _, a := range strings.Split(aspectsStr, ",") {
			a = strings.TrimSpace(a)
			if a != "" {
				cfg.AspectTypes[a] = true
			}
		}
	}

	// 4. Фильтр по типам событий (lunD,noC,chS,exA)
	if eventTypesStr := q.Get("event_types"); eventTypesStr != "" {
		cfg.EventTypes = make(map[string]bool)
		for _, e := range strings.Split(eventTypesStr, ",") {
			e = strings.TrimSpace(e)
			if e != "" {
				cfg.EventTypes[e] = true
			}
		}
	}

	return cfg
}

// Вспомогательная структура для возврата метаданных
type ResponseMeta struct {
	City               string    `json:"city,omitempty"`
	Latitude           float64   `json:"lat"`
	Longitude          float64   `json:"lon"`
	Timezone           string    `json:"timezone,omitempty"`
	UTCOffset          float64   `json:"utc_offset"`
	CalculationTimeUTC string    `json:"calculation_time_utc"`
	City2              string    `json:"city2,omitempty"`
	Latitude2          float64   `json:"lat2,omitempty"`
	Longitude2         float64   `json:"lon2,omitempty"`
	Timezone2          string    `json:"timezone2,omitempty"`
	UTCOffset2         float64   `json:"utc_offset2,omitempty"`
	CalculationTimeB   string    `json:"calculation_time_b,omitempty"`
}

type APIResponse struct {
	Meta    ResponseMeta         `json:"meta"`
	Planets []astro.Position     `json:"planets,omitempty"`
	Houses  []astro.House        `json:"houses,omitempty"`
	Aspects []astro.Aspect       `json:"aspects,omitempty"`
	Events  []astro.CalendarEvent `json:"events,omitempty"`
	Slices  []astro.TimeSlice    `json:"slices,omitempty"`
}

// Функция для получения геоданных и автоматического перевода локального времени в UTC
func resolveGeoAndTime(city string, dateStr string, timeStr string) (*interactive.GeoData, time.Time, error) {
	// Если город не передан, то считаем по дефолту UTC+0 и координаты Москвы
	if city == "" {
		t, err := time.Parse("2006-01-02 15:04", dateStr+" "+timeStr)
		if err != nil {
			return nil, time.Time{}, err
		}
		return &interactive.GeoData{
			City:      "UTC Mode",
			Latitude:  55.7558,
			Longitude: 37.6173,
			Timezone:  "UTC",
			UTCOffset: 0,
		}, t, nil
	}

	// Получаем геоданные
	gd, err := interactive.GetGeoData(&interactive.UserInput{
		City: city,
		Date: dateStr,
		Time: timeStr,
	})
	if err != nil {
		return nil, time.Time{}, err
	}

	// Парсим локальное время
	locTime, err := time.Parse("2006-01-02 15:04", dateStr+" "+timeStr)
	if err != nil {
		return nil, time.Time{}, err
	}

	// Переводим в UTC
	utcTime := locTime.Add(time.Duration(-gd.UTCOffset) * time.Hour)
	return gd, utcTime, nil
}

// 1. Обработчик /api/v1/natal
func handleNatal(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	city := q.Get("city")
	date := q.Get("date")
	timeVal := q.Get("time")
	hsys := q.Get("hsys")

	// Фолбек на старый формат параметров, если новые не переданы
	if date == "" {
		date = q.Get("date") // Ожидает YYYY-MM-DD HH:MM
		if strings.Contains(date, " ") {
			parts := strings.Split(date, " ")
			date = parts[0]
			timeVal = parts[1]
		}
	}

	if date == "" {
		http.Error(w, `{"error": "Parameter 'date' (YYYY-MM-DD) is required"}`, http.StatusBadRequest)
		return
	}
	if timeVal == "" {
		timeVal = "12:00"
	}
	if hsys == "" {
		hsys = "P"
	}

	// Кэширование
	cacheKey := generateCacheKey("natal", q)
	if cachedData, found := cache.Get(cacheKey); found {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache", "HIT")
		w.WriteHeader(http.StatusOK)
		w.Write(cachedData)
		return
	}

	// Поиск геокоординат и расчет UTC времени
	latVal := q.Get("lat")
	lonVal := q.Get("lon")

	var gd *interactive.GeoData
	var utcTime time.Time
	var err error

	if latVal != "" && lonVal != "" {
		// Старый формат: переданы точные координаты напрямую
		latF, _ := strconv.ParseFloat(latVal, 64)
		lonF, _ := strconv.ParseFloat(lonVal, 64)
		utcTime, err = time.Parse("2006-01-02 15:04", date+" "+timeVal)
		if err != nil {
			http.Error(w, `{"error": "Invalid date/time format. Expected YYYY-MM-DD HH:MM"}`, http.StatusBadRequest)
			return
		}
		gd = &interactive.GeoData{
			City:      "Coordinates Mode",
			Latitude:  latF,
			Longitude: lonF,
			Timezone:  "UTC",
			UTCOffset: 0,
		}
	} else {
		// Новый формат: по названию города
		gd, utcTime, err = resolveGeoAndTime(city, date, timeVal)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to resolve geo/time: %v"}`, err), http.StatusBadRequest)
			return
		}
	}

	// Расчет натальной карты
	exeDir := GetExecutableDir()
	ephePath := filepath.Join(exeDir, "ephe")
	calc := astro.NewCalculator(ephePath)
	defer calc.Close()

	res, err := calc.ComputeNatal(r.Context(), utcTime, gd.Latitude, gd.Longitude, hsys)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "Calculation error: %v"}`, err), http.StatusInternalServerError)
		return
	}

	// Применяем фильтрацию
	filter := parseFilterConfig(q)
	res.ApplyFilter(filter)

	// Формируем ответ
	response := APIResponse{
		Meta: ResponseMeta{
			City:               gd.City,
			Latitude:           gd.Latitude,
			Longitude:          gd.Longitude,
			Timezone:           gd.Timezone,
			UTCOffset:          gd.UTCOffset,
			CalculationTimeUTC: utcTime.Format(time.RFC3339),
		},
		Planets: res.Planets,
		Houses:  res.Houses,
		Aspects: res.Aspects,
	}

	jsonBytes, _ := json.Marshal(response)
	cache.Set(cacheKey, jsonBytes, CacheDuration)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Cache", "MISS")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

// 2. Обработчик /api/v1/synastry
func handleSynastry(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	city1 := q.Get("city1")
	date1 := q.Get("date1")
	time1 := q.Get("time1")

	city2 := q.Get("city2")
	date2 := q.Get("date2")
	time2 := q.Get("time2")

	hsys := q.Get("hsys")

	// Фолбек на старые параметры
	if date1 == "" {
		date1 = q.Get("date1")
		if strings.Contains(date1, " ") {
			parts := strings.Split(date1, " ")
			date1 = parts[0]
			time1 = parts[1]
		}
	}
	if date2 == "" {
		date2 = q.Get("date2")
		if strings.Contains(date2, " ") {
			parts := strings.Split(date2, " ")
			date2 = parts[0]
			time2 = parts[1]
		}
	}

	if date1 == "" || date2 == "" {
		http.Error(w, `{"error": "Parameters 'date1' and 'date2' are required"}`, http.StatusBadRequest)
		return
	}
	if time1 == "" {
		time1 = "12:00"
	}
	if time2 == "" {
		time2 = "12:00"
	}
	if hsys == "" {
		hsys = "P"
	}

	cacheKey := generateCacheKey("synastry", q)
	if cachedData, found := cache.Get(cacheKey); found {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache", "HIT")
		w.WriteHeader(http.StatusOK)
		w.Write(cachedData)
		return
	}

	latVal := q.Get("lat")
	lonVal := q.Get("lon")

	var gd1, gd2 *interactive.GeoData
	var utcTime1, utcTime2 time.Time
	var err error

	if latVal != "" && lonVal != "" {
		latF, _ := strconv.ParseFloat(latVal, 64)
		lonF, _ := strconv.ParseFloat(lonVal, 64)
		utcTime1, _ = time.Parse("2006-01-02 15:04", date1+" "+time1)
		utcTime2, _ = time.Parse("2006-01-02 15:04", date2+" "+time2)
		gd1 = &interactive.GeoData{
			City:      "Coordinates Mode",
			Latitude:  latF,
			Longitude: lonF,
			Timezone:  "UTC",
			UTCOffset: 0,
		}
		gd2 = gd1
	} else {
		gd1, utcTime1, err = resolveGeoAndTime(city1, date1, time1)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to resolve city1: %v"}`, err), http.StatusBadRequest)
			return
		}
		gd2, utcTime2, err = resolveGeoAndTime(city2, date2, time2)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to resolve city2: %v"}`, err), http.StatusBadRequest)
			return
		}
	}

	exeDir := GetExecutableDir()
	ephePath := filepath.Join(exeDir, "ephe")
	calc := astro.NewCalculator(ephePath)
	defer calc.Close()

	res, err := calc.ComputeSynastry(r.Context(), utcTime1, utcTime2, gd1.Latitude, gd1.Longitude, hsys)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "Calculation error: %v"}`, err), http.StatusInternalServerError)
		return
	}

	filter := parseFilterConfig(q)
	res.ApplyFilter(filter)

	response := APIResponse{
		Meta: ResponseMeta{
			City:               gd1.City,
			Latitude:           gd1.Latitude,
			Longitude:          gd1.Longitude,
			Timezone:           gd1.Timezone,
			UTCOffset:          gd1.UTCOffset,
			CalculationTimeUTC: utcTime1.Format(time.RFC3339),
			City2:              gd2.City,
			Latitude2:          gd2.Latitude,
			Longitude2:         gd2.Longitude,
			Timezone2:          gd2.Timezone,
			UTCOffset2:         gd2.UTCOffset,
			CalculationTimeB:   utcTime2.Format(time.RFC3339),
		},
		Planets: res.Planets,
		Houses:  res.Houses,
		Aspects: res.Aspects,
	}

	jsonBytes, _ := json.Marshal(response)
	cache.Set(cacheKey, jsonBytes, CacheDuration)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Cache", "MISS")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

// 3. Обработчик /api/v1/period
func handlePeriod(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	start := q.Get("start")
	end := q.Get("end")
	step := q.Get("step")
	city := q.Get("city")

	if start == "" || end == "" {
		http.Error(w, `{"error": "Parameters 'start' and 'end' (YYYY-MM-DD HH:MM) are required"}`, http.StatusBadRequest)
		return
	}

	cacheKey := generateCacheKey("period", q)
	if cachedData, found := cache.Get(cacheKey); found {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache", "HIT")
		w.WriteHeader(http.StatusOK)
		w.Write(cachedData)
		return
	}

	// Обработка локального времени, если указан город
	var tStart, tEnd time.Time
	var gd *interactive.GeoData
	var err error

	if city != "" {
		var partsS []string
		if strings.Contains(start, " ") {
			partsS = strings.Split(start, " ")
		} else {
			partsS = []string{start, "00:00"}
		}
		gd, tStart, err = resolveGeoAndTime(city, partsS[0], partsS[1])
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to resolve city start time: %v"}`, err), http.StatusBadRequest)
			return
		}

		var partsE []string
		if strings.Contains(end, " ") {
			partsE = strings.Split(end, " ")
		} else {
			partsE = []string{end, "23:59"}
		}
		_, tEnd, err = resolveGeoAndTime(city, partsE[0], partsE[1])
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to resolve city end time: %v"}`, err), http.StatusBadRequest)
			return
		}
	} else {
		tStart, _ = time.Parse("2006-01-02 15:04", start)
		tEnd, _ = time.Parse("2006-01-02 15:04", end)
		gd = &interactive.GeoData{
			City:      "UTC Mode",
			Latitude:  55.7558,
			Longitude: 37.6173,
			Timezone:  "UTC",
			UTCOffset: 0,
		}
	}

	stepHours := 24
	if step != "" {
		if val, err := strconv.Atoi(step); err == nil && val > 0 {
			stepHours = val
		}
	}

	exeDir := GetExecutableDir()
	ephePath := filepath.Join(exeDir, "ephe")
	calc := astro.NewCalculator(ephePath)
	defer calc.Close()

	res, err := calc.ComputePeriod(r.Context(), tStart, tEnd, stepHours)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "Calculation error: %v"}`, err), http.StatusInternalServerError)
		return
	}

	// Поддержка вывода меток времени в часовом поясе пользователя
	if city != "" && gd != nil {
		loc, err := time.LoadLocation(gd.Timezone)
		if err == nil {
			for idx := range res.Slices {
				res.Slices[idx].Timestamp = res.Slices[idx].Timestamp.In(loc)
			}
		}
	}

	filter := parseFilterConfig(q)
	res.ApplyFilter(filter)

	response := APIResponse{
		Meta: ResponseMeta{
			City:               gd.City,
			Latitude:           gd.Latitude,
			Longitude:          gd.Longitude,
			Timezone:           gd.Timezone,
			UTCOffset:          gd.UTCOffset,
			CalculationTimeUTC: tStart.Format(time.RFC3339),
		},
		Slices: res.Slices,
	}

	jsonBytes, _ := json.Marshal(response)
	cache.Set(cacheKey, jsonBytes, CacheDuration)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Cache", "MISS")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

// 4. Обработчик /api/v1/calendar
func handleCalendar(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	yearStr := q.Get("year")
	monthStr := q.Get("month")
	city := q.Get("city")

	year := time.Now().Year()
	if yearStr != "" {
		if y, err := strconv.Atoi(yearStr); err == nil {
			year = y
		}
	}

	month := 0
	if monthStr != "" {
		if m, err := strconv.Atoi(monthStr); err == nil && m >= 0 && m <= 12 {
			month = m
		}
	}

	cacheKey := generateCacheKey("calendar", q)
	if cachedData, found := cache.Get(cacheKey); found {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache", "HIT")
		w.WriteHeader(http.StatusOK)
		w.Write(cachedData)
		return
	}

	var tStart, tEnd time.Time
	if month > 0 {
		tStart = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		tEnd = tStart.AddDate(0, 1, 0)
	} else {
		tStart = time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
		tEnd = time.Date(year, 12, 31, 23, 59, 0, 0, time.UTC)
	}

	// Определение геоданных и временной зоны
	var loc *time.Location = time.UTC
	var gd *interactive.GeoData
	var err error

	if city != "" {
		gd, err = interactive.GetGeoData(&interactive.UserInput{
			City: city,
			Date: tStart.Format("2006-01-02"),
			Time: "00:00",
		})
		if err == nil {
			l, err := time.LoadLocation(gd.Timezone)
			if err == nil {
				loc = l
			} else {
				offsetSeconds := int(gd.UTCOffset * 3600)
				loc = time.FixedZone(gd.Timezone, offsetSeconds)
			}
		}
	} else {
		gd = &interactive.GeoData{
			City:      "UTC Mode",
			Latitude:  55.7558,
			Longitude: 37.6173,
			Timezone:  "UTC",
			UTCOffset: 0,
		}
	}

	// Расширяем временные границы для компенсации сдвигов часовых поясов
	calcStart := tStart.Add(-24 * time.Hour)
	calcEnd := tEnd.Add(24 * time.Hour)

	exeDir := GetExecutableDir()
	ephePath := filepath.Join(exeDir, "ephe")
	calc := astro.NewCalculator(ephePath)
	defer calc.Close()

	res, err := calc.ComputeCalendar(r.Context(), calcStart, calcEnd, loc)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "Calculation error: %v"}`, err), http.StatusInternalServerError)
		return
	}

	filter := parseFilterConfig(q)
	res.ApplyFilter(filter)

	response := APIResponse{
		Meta: ResponseMeta{
			City:               gd.City,
			Latitude:           gd.Latitude,
			Longitude:          gd.Longitude,
			Timezone:           gd.Timezone,
			UTCOffset:          gd.UTCOffset,
			CalculationTimeUTC: tStart.Format(time.RFC3339),
		},
		Events: res.Events,
	}

	jsonBytes, _ := json.Marshal(response)
	cache.Set(cacheKey, jsonBytes, CacheDuration)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Cache", "MISS")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

// Проверка здоровья
func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "healthy", "engine": "integrated"}`))
}

func main() {
	http.HandleFunc("/healthz", corsMiddleware(handleHealth))
	http.HandleFunc("/api/v1/natal", corsMiddleware(handleNatal))
	http.HandleFunc("/api/v1/synastry", corsMiddleware(handleSynastry))
	http.HandleFunc("/api/v1/period", corsMiddleware(handlePeriod))
	http.HandleFunc("/api/v1/calendar", corsMiddleware(handleCalendar))

	log.Printf("Астрологический API-сервер запущен на порту %s", Port)
	log.Printf("Режим работы: Интегрированная Go-архитектура (без вызовов exec)")
	if err := http.ListenAndServe(Port, nil); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
