const transitGraph = (id, transitState) => {
    const direction = transitState.direction || (typeof defA3D !== 'undefined' ? defA3D.direction : "counterclockwise");
    const rotate = Number(transitState.rotate || (typeof defA3D !== 'undefined' ? defA3D.rotate : 0)) || 0;

    // Вся карта ориентируется по куспидам Радикса (Натала)
    const start = ((direction == "clockwise") ? (transitState.radixChart.out.cusps[0]) : (-transitState.radixChart.out.cusps[0])) + rotate;
    
    const rImagesX = .27;
    const rImagesY = rImagesX * 1.7;
    
    // Иконки знаков зодиака на внешнем ободе
    const zodiacImages = Array.from(Array(12), (el, i) =>
        el = {
            "source": '/img/zodiac/' + String(i) + '.png',
            "x": .5 + rImagesX * Math.cos(((direction == "clockwise") ? -start : start) * Math.PI / 180 + Math.PI / 6 * i + Math.PI / 12),
            "y": .5 + ((direction == "clockwise") ? (- (rImagesY * Math.sin((-start) * Math.PI / 180 + Math.PI / 6 * i + Math.PI / 12))) : ((rImagesY * Math.sin(start * Math.PI / 180 + Math.PI / 6 * i + Math.PI / 12)))),
            "sizex": .04,
            "sizey": .04,
            "xanchor": "center",
            "yanchor": "middle",
            opacity: 0.6,
        }
    );

    const layout = {
        images: zodiacImages,
        margin: { t: 20, b: 20, l: 0, r: 0 },
        polar: {
            domain: { x: [0, 1], y: [0, 1] },
            font: { family: 'monospace', size: 15 },
            angularaxis: {
                direction: direction,
                rotation: start,
                tickmode: 'array',
                ticktext: $ad.HouseName,
                tickvals: transitState.radixChart.out.cusps, // Дома строятся по Радиксу
            },
            radialaxis: { visible: false, range: [0, 1] }
        },
    };

    // Сектора знаков зодиака (внешнее кольцо)
    const zodiacSector = Array.from(Array(12), (elz, i) =>
        elz = {
            type: "scatterpolargl",
            mode: "lines",
            name: 'zodiacSector',
            textinfo: 'none',
            hoverinfo: 'skip',
            theta: [30 * i, ...Array.from(Array(31), (el, y) => el = 30 * i + y), ...Array.from(Array(31), (el, y) => el = 30 * (i + 1) - y)],
            r: [0.85, ...Array.from(Array(31), (el) => el = 1), ...Array.from(Array(31), (el) => el = 0.85)],
            fill: "toself",
            fillcolor: $ad.zodiac.color[i],
            showlegend: false,
            line: { color: $ad.zodiac.color[i], size: 0 },
            opacity: .15,
            subplot: "polar"
        }
    );

    // Белая подложка для внутренней части карты (до 0.85, чтобы покрыть оба круга планет)
    const zodiacHole = {
        name: 'hole',
        type: "scatterpolargl",
        mode: "lines",
        textinfo: 'none',
        hoverinfo: 'none',
        theta: Array.from(Array(361), (el, i) => i),
        r: Array.from(Array(361), (el) => el = 0.85),
        fill: "toself",
        fillcolor: 'white',
        showlegend: false,
        line: { color: "#888888" },
        opacity: 1,
        subplot: "polar"
    };

    // Серая разделительная линия между наталом и транзитом
    const dividingCircle = {
        name: 'divider',
        type: "scatterpolargl",
        mode: "lines",
        textinfo: 'none',
        hoverinfo: 'none',
        theta: Array.from(Array(361), (el, i) => i),
        r: Array.from(Array(361), (el) => el = 0.70),
        showlegend: false,
        line: { color: "#cccccc", width: 1 },
        subplot: "polar"
    };

    // Вспомогательная функция распределения планет для предотвращения наложения символов
    const posPltoArr = (planets, sizePosdeg = 4) => {
        const objPos = {};
        let arrSort = $ad.planetSortByDegree(planets) || [];
        let currentPos = -1;
        arrSort.forEach((el) => {
            let pos = ~~(el[1][0] / sizePosdeg);
            pos = (currentPos >= pos) ? (currentPos + 1) : pos;
            objPos[el[0]] = pos * sizePosdeg + sizePosdeg / 2;
            currentPos = pos;
        });
        return Array.from(planets, (el) => [el[0], el[1], objPos[el[0]]]);
    };

    // 1. Натальные планеты (Радикс) — внутренний круг (r = 0.58)
    const radixPls = {
        name: "Natal Planet",
        mode: 'text',
        type: "scatterpolar",
        r: Array.from(transitState.radixChart.out.planets, () => 0.58),
        theta: Array.from(posPltoArr(transitState.radixChart.out.planets, 5), el => el[2]),
        text: Array.from(transitState.radixChart.out.planets, el => $ad.plSign[el[0]]),
        texttemplate: '%{text}',
        textfont: { 
            family: 'monospace', 
            size: 14, 
            color: Array.from(transitState.radixChart.out.planets, () => 'blue') // Синие символы для натала
        },
        customdata: Array.from(transitState.radixChart.out.planets, el => `Natal ${$ad.plSign[el[0]]}: ${$ad.strZod([el[1][0], el[1][1]]).text}`),
        hovertemplate: `<b>%{customdata}</b><extra></extra>`,
        showlegend: false,
        subplot: "polar"
    };

    // 2. Транзитные планеты — внешний круг (r = 0.78)
    const transitPls = {
        name: "Transit Planet",
        mode: 'text',
        type: "scatterpolar",
        r: Array.from(transitState.transitChart.out.planets, () => 0.78),
        theta: Array.from(posPltoArr(transitState.transitChart.out.planets, 5), el => el[2]),
        text: Array.from(transitState.transitChart.out.planets, el => $ad.plSign[el[0]]),
        texttemplate: '%{text}',
        textfont: { 
            family: 'monospace', 
            size: 14, 
            color: Array.from(transitState.transitChart.out.planets, () => 'green') // Зеленые символы для транзита
        },
        customdata: Array.from(transitState.transitChart.out.planets, el => `Transit ${$ad.plSign[el[0]]}: ${$ad.strZod([el[1][0], el[1][1]]).text}`),
        hovertemplate: `<b>%{customdata}</b><extra></extra>`,
        showlegend: false,
        subplot: "polar"
    };

    // 3. Расчет аспектных пар между транзитом (data[0]) и радиксом (data[1])
    const rawAspects = $ad.aspectRadixTransitChart([transitState.transitChart, transitState.radixChart]);
    
    // Форматируем под стандарт отрисовки
    const transitAsp = rawAspects.map(item => {
        let min = Math.min(item[0][1][0], item[1][1][0]);
        let max = Math.max(item[0][1][0], item[1][1][0]);
        let degree = max - min;
        degree = (degree > 191) ? (min - max + 360) : (degree);
        return [
            item[0], // натал (inner)
            item[1], // транзит (outer)
            { asp: Number(item[2]), degree: degree }
        ];
    });

    const hoverAsp = (el) => {
        return `Natal ${$ad.plSign[el[0][0]]} ${$ad.aspName[el[2].asp]} Transit ${$ad.plSign[el[1][0]]} (орбис: ${Math.abs(el[2].asp - el[2].degree).toFixed(2)}°)<br>` +
               `Натал: ${$ad.strZod([el[0][1][0], el[0][1][1]]).text}<br>` +
               `Транзит: ${$ad.strZod([el[1][1][0], el[1][1][1]]).text}`;
    };

    const traceTransitAsp = [];
    const signTransitAsp = [];

    transitAsp.forEach((aspect) => {
        let colors = $ad.colorAsp[aspect[2].asp] || 'black';
        const min = Math.min(aspect[0][1][0], aspect[1][1][0]);
        const max = Math.max(aspect[0][1][0], aspect[1][1][0]);
        const aspStart = ((max - min) < 180) ? min : max;
        const theta = aspStart + aspect[2].asp / 2;
        const aspRad = aspect[2].degree * (Math.PI / 360);
        
        // Линии аспектов рисуются внутри натального круга (r = 0.55)
        const rSignTransitAsp = Math.abs(Math.cos(aspRad)) * 0.55;
        const customdata = hoverAsp(aspect);
        const name = `Natal ${$ad.plSign[aspect[0][0]]} - Transit ${$ad.plSign[aspect[1][0]]}`;

        if (aspect[2].asp > 0) {
            // Иконка аспекта
            signTransitAsp.push({
                name: name,
                type: "scatterpolargl",
                mode: "text+markers",
                r: [rSignTransitAsp],
                theta: [theta],
                text: [$ad.aspSign[aspect[2].asp]],
                customdata: [customdata],
                textfont: { color: [colors], family: 'monospace' },
                marker: { color: 'white', size: 15 },
                subplot: "polar",
                showlegend: false,
                hovertemplate: "<b>%{customdata}</b><extra></extra>",
                textposition: '"middle center"',
            });
        }

        // Линия аспекта (хорда внутри натального круга r=0.55)
        traceTransitAsp.push({
            customdata: [customdata, customdata],
            name: name,
            type: "scatterpolargl",
            mode: "lines",
            r: [0.55, 0.55],
            theta: [aspect[0][1][0], aspect[1][1][0]],
            marker: { color: colors, size: 5 },
            line: { width: 1.5, dash: 'dot' }, // Пунктирные линии для транзитов — классика
            subplot: "polar",
            showlegend: false,
            hovertemplate: "<b>%{customdata}</b><extra></extra>",
        });
    });

    const data = [
        ...zodiacSector, 
        zodiacHole, 
        dividingCircle,
        radixPls, 
        transitPls, 
        ...traceTransitAsp, 
        ...signTransitAsp
    ];

    const HTML = document.getElementById(id);
    HTML.textContent = ``;
    Plotly.newPlot(HTML, data, layout, { 
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'] 
    });

    HTML.on('plotly_relayout', (e) => {
        if (Object.keys(e).length < 3) {
            layout.polar.radialaxis.range = [0, 1];
            layout.polar.angularaxis.rotation = 0;
            Plotly.relayout(HTML, layout);
        }
    });
};