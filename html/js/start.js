/**
* Copyright 2023, Muratov Damir.
*astro3d.ru
* https://github.com/damirmur/
* All rights reserved.
* Licensed under the MIT license
v 0.0.1
*/

//Please register at https://timezonedb.com/account. And don't use my key because there is a time limit on the number of requests.
sessionStorage.setItem('tz', JSON.stringify('42QFART9B46M'));
//Please register https://www.geonames.org/login. And don't use my key because there is a time limit on the number of requests.
sessionStorage.setItem('geonames', JSON.stringify('qwerty'));

const dbSave = (data, key = 'defA3D') => { localStorage.setItem(key, JSON.stringify(data)) };
const dbLoad = (key = 'defA3D') => { return JSON.parse(localStorage.getItem(key)) };

let defA3D = {
    planets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    aspects: [0, 60, 90, 120, 180],
    type: 'horo',
    houses: 'P',
    rotate: "0",
    direction: "clockwise",
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: (navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language),
    city: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1],
    i18n: undefined
};
if (dbLoad()) {
    const c = dbLoad();
    defA3D.planets = c.planets || defA3D.planets;
    defA3D.aspects = c.aspects || defA3D.aspects;
    defA3D.type = c.type || defA3D.type;
    defA3D.tz = c.tz || defA3D.tz;
    defA3D.locale = c.locale || defA3D.locale;
    defA3D.houses = c.houses || defA3D.houses;
    defA3D.rotate = c.rotate || defA3D.rotate;
    defA3D.direction = c.direction || defA3D.direction;
    defA3D.city = c.city || defA3D.city;
    defA3D.latitude = c.latitude;
    defA3D.longitude = c.longitude;
    defA3D.i18n = c.i18n || defA3D.i18n;
};
window.defA3D = defA3D;
dbSave(defA3D);
if (!defA3D.i18n) {
    switch (defA3D.locale.slice(0, 2)) {
        case 'ru':
            fetch('/js/i18n/ru.json').then((response) => response.json()).then((json) => { defA3D.i18n = json; dbSave(defA3D); });
            break;
        default:
            fetch('/js/i18n/en.json').then((response) => response.json()).then((json) => { defA3D.i18n = json; dbSave(defA3D); });
            break;
    }
}
if (!(defA3D.latitude || defA3D.longitude)) {
    const getJSON = ((url) => {
        let res = fetch(url, { method: 'GET', redirect: 'follow' })
            .catch(error => console.log('Request failed', error))
            .then(response =>
                response.json().then(data => ({ data: data, status: response.status }))
                    .then(result => {
                        if (result.status == 200) { result.data.status = 'OK'; return result.data; }
                    }))
        return res;
    });
    getJSON('https://nominatim.openstreetmap.org/search?format=json&city=' + defA3D.city)
        .then(pos => {
            defA3D.latitude = pos[0].lat;
            defA3D.longitude = pos[0].lon;
            defA3D.city = pos[0].name;
            dbSave(defA3D);
        });
};



