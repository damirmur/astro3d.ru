/**
* Copyright 2023, Muratov Damir.
*astro3d.ru
* https://github.com/damirmur/
* All rights reserved.
* Licensed under the MIT license
v 0.0.1
*/
class AstroChartIn extends HTMLElement {
    static #getOffset(timeZone = 'UTC', date = new Date()) {
        const utcDate = new Date(date.toLocaleString('en-US', { 'timeZone': 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { 'timeZone': timeZone }));
        return (utcDate.getTime() - tzDate.getTime()) / 6e4;
    };
    static #searchCity;
    set searchCity(searchCity) {
        AstroChartIn.#searchCity = searchCity;
        this.#html.querySelector('cities-autocomplete').searchCity = this.searchCity;
        this.#render();
    };
    get searchCity() {
        return AstroChartIn.#searchCity;
    };
    static #searchTZ;
    set searchTZ(searchTZ) {
        AstroChartIn.#searchTZ = searchTZ;
        this.#render();
    };
    get searchTZ() {
        return AstroChartIn.#searchTZ;
    };
    static #sourceMap;
    set sourceMap(sourceMap) {
        AstroChartIn.#sourceMap = sourceMap;
        this.#render();
    };
    get sourceMap() {
        return AstroChartIn.#sourceMap;
    };

    static #localDate(dateJSON, tzMin) {
        let d = new Date(dateJSON);
        let dl = new Date(d.setMinutes(d.getMinutes() - tzMin));
        return dl.toJSON();
    };
    static #UTCDate(dateLocalJSON, tzMin) {
        let d = new Date(dateLocalJSON);
        let dUTC = new Date(d.setMinutes(d.getMinutes() + tzMin));
        return dUTC.toJSON();
    };
    static #textTimetoMin(strTime) {
        const matchData = strTime.match(/([+-])(\d+)(?::(\d+))?/);
        if (!matchData) throw `cannot parse : ${strTime}`;
        const [, sign, hour, minute] = matchData;
        let result = parseInt(hour) * 60;
        if (sign === "+") result *= -1;
        if (minute) result += parseInt(minute);
        return result;
    };
    static #minToText(tzmin) {
        let d = new Date(new Date(0).setMinutes(Math.abs(tzmin)));
        return (((tzmin <= 0) ? '+' : '-') + d.getUTCHours().toString().padStart(2, "0") + ':' + d.getUTCMinutes().toString().padStart(2, "0"));
    };

    static #fillDataList(datalistId, data) {
        const datalist = document.getElementById(datalistId);
        datalist.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            datalist.append(new Option(data[i], data[i]));
        }
    }

    #relocate;
    set relocate(relocate) {
        if (typeof relocate == "boolean") {
            this.#relocate = relocate;
        }
    };
    get relocate() {
        return this.#relocate;
    };
    #value = { 'dateToJSON': new Date().toJSON, 'tzMin': new Date().getTimezoneOffset };
    #html;
    set value(value) {
        this.#value = value;
        this.#value.date = this.#value.date || String(AstroChartIn.#localDate(value.dateToJSON, value.tzMin)).slice(0, 16);
        this.#setvalueEl();
    };
    get value() {
        return this.#value;
    };
    static #sex = { '-': '-', 'M': 'M', 'W': 'W' };
    set sex(value) {
        AstroChartIn.#sex = value || AstroChartIn.#sex;
        for (let key in this.sex) {
            this.#html.querySelector('select[name=sex]').append(new Option(this.sex[key], key));
        }
    }
    get sex() {
        return AstroChartIn.#sex;
    }
    static #listTZ = Intl.supportedValuesOf('timeZone');
    set listTZ(value) {
        AstroChartIn.#listTZ = value || AstroChartIn.#listTZ;
        for (let key in this.listTZ) {
            this.#html.querySelector('datalist#list_tz').append(new Option(this.listTZ[key]));
        }
    }
    get listTZ() {
        return AstroChartIn.#listTZ;
    }
    constructor() {
        super();
        this.addEventListener("change", (e) => {
            this.#setvalueEl();
        })
    }
    static #templateCSS = `
    <style>

    *{
        margin: 1px; 
        max-width: 400px; 

    }
    input:valid {
        background-color: transparent;
    }
    input:invalid {
        background-color: lightpink;
    }
    </style>`
    //
    static #templateHTML = `
        <label for="name">Name: </label>
        <input name="name" type="text">
        <select name="sex"></select>
        <input type="button" name='comment' title="Сomment" value="🗒">
        <input type="button" name='foto' title="Foto" value="👤">
        <br>
        <input name="date" type="datetime-local">
        <input name="tzTime" type="text" size="4" required="required" placeholder="+00:00" title="Warning! Due to various political events, actual time zones and the difference with GMT may not coincide. Check with other sources.">
        <input list='list_tz' name="timezone" size="12" type="text" title="Warning! Due to various political events, actual time zones and the difference with GMT may not coincide. Check with other sources.">
        <datalist id="list_tz"></datalist>
        <br>
        <label for="city">City: </label><cities-autocomplete name="aname"></cities-autocomplete><input name="country" size="2" type="text">
        <input type="button" name='map' title="Find on the map" value="🗺">
        <br>
        <div id="maps" hidden>
        </div>
        <label for="latitude"> Lat: </label>
        <input name="latitude" size="6" maxlenght="6" type="number" min="-90" max='90' step="0.01">
        <label for="longitude">Lng: </label>
        <input name="longitude" size="7" maxlenght="7" type="number" min="-180" max='180' step="0.01">
        <br>
        <textarea hidden id="description" title="Description" name="description" rows="5" col='80' style="width:97%"></textarea>
    `;
    #setvalueEl = ((value = this.#value) => {
        this.#html.querySelector('input[name="name"]').value = value.name || '';
        this.#html.querySelector('input[name="date"]').dateToJSON = value.dateToJSON;
        this.#html.querySelector('input[name="date"]').value = String(value.date || String(AstroChartIn.#localDate(value.dateToJSON, value.tzMin))).slice(0, 16);
        this.#html.querySelector('input[name="date"]').title = 'UTC: ' + String(value.dateToJSON).slice(0, 16);
        this.#html.querySelector('input[name="country"]').value = value.country;
        this.#html.querySelector('select[name="sex"]').value = value.sex;
        this.#html.querySelector('input[name="timezone"]').value = value.timezone;
        this.#html.querySelector('input[name="latitude"]').value = Number(value.latitude).toFixed(2);
        this.#html.querySelector('input[name="longitude"]').value = Number(value.longitude).toFixed(2);
        this.#html.querySelector('input[name="tzTime"]').value = AstroChartIn.#minToText(value.tzMin);
        this.#html.querySelector('cities-autocomplete').value = { 'city': value.city };
        this.#html.querySelector('textarea').value = value.description || '';
        let map = this.#html.querySelector('geo-map');
        if (map) {
            map.value = { latitude: Number(value.latitude), longitude: Number(value.longitude) }
        }

    });

    #render() {
        this.#html.innerHTML = ``;
        this.#html.innerHTML = AstroChartIn.#templateCSS + AstroChartIn.#templateHTML;
        this.sex = AstroChartIn.#sex;
        this.listTZ = AstroChartIn.#listTZ;
        this.#html.querySelector('cities-autocomplete').searchCity = this.searchCity;
        this.#html.querySelector('cities-autocomplete').addEventListener("change", (e) => {
            const value = e.detail;
            this.value.latitude = value.latitude;
            this.value.longitude = value.longitude;
            this.value.city = value.city;
            if (value.timeZone && value.country) {
                this.value.timezone = value.timeZone;
                this.value.country = value.country;
                this.value.tzMin = AstroChartIn.#getOffset(value.timeZone, new Date(this.value.date));
                this.value.date = (this.#relocate) ? (String(AstroChartIn.#localDate(this.value.dateToJSON, this.value.tzMin)).slice(0, 16)) : this.value.date;
                this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
            } else {
                AstroChartIn.#searchTZ(value.longitude, value.latitude, new Date(this.value.dateToJSON).getTime())
                    .then(res => {
                        this.value.timezone = res.timezone;
                        this.value.country = res.country;
                        this.value.tzMin = res.tzMin;
                        this.value.date = (this.#relocate) ? (String(AstroChartIn.#localDate(this.value.dateToJSON, this.value.tzMin)).slice(0, 16)) : this.value.date;
                        this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
                    })
            }
        });

        this.#html.addEventListener("change", (e) => {
            e.stopImmediatePropagation();
            this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
        });
        this.#html.querySelector('input[name="comment"]').addEventListener("click", (e) => {
            this.#html.querySelector('#description').hidden = !this.#html.querySelector('#description').hidden;
        });
        this.#html.querySelector('input[name="map"]').addEventListener("click", (e) => {
            const el = this.#html.querySelector('#maps');
            el.hidden = !el.hidden;
            if (!el.hidden) {
                const geomap = document.createElement('geo-map');
                el.appendChild(geomap);
                geomap.source = this.sourceMap;
                geomap.value = { latitude: Number(this.#value.latitude), longitude: Number(this.#value.longitude) };
                geomap.addEventListener('change', (e) => {
                    this.value.latitude = geomap.value.latitude;
                    this.value.longitude = geomap.value.longitude;
                    AstroChartIn.#searchTZ(this.value.longitude, this.value.latitude, new Date(this.value.dateToJSON).getTime())
                        .then(res => {
                            this.value.timezone = res.timezone;
                            this.value.city = res.city;
                            this.value.country = res.country;
                            this.value.tzMin = res.tzMin;
                            this.value.date = (this.#relocate) ? (String(AstroChartIn.#localDate(this.value.dateToJSON, this.value.tzMin)).slice(0, 16)) : this.value.date;
                            this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
                        })
                })

            } else {
                el.innerHTML = ``;
            }
        });
        this.#html.querySelector('input[name="date"]').addEventListener("change", (e) => {
            let value = e.target.value;
            if (value == '') { return }
            this.value.date = value;
            this.value.tzMin = AstroChartIn.#getOffset(this.value.timezone, new Date(value));
            this.value.dateToJSON = AstroChartIn.#UTCDate(value + ':00Z', this.value.tzMin);
            e.target.dateToJSON = AstroChartIn.#UTCDate(value + ':00Z', this.value.tzMin);

        });
        this.#html.querySelector('input[name="timezone"]').addEventListener("change", (e) => {
            let value = e.target.value;
            if (value == '') { return }
            this.value.timezone = value;
            this.value.tzMin = (AstroChartIn.#getOffset(value, new Date(this.value.date)));
            if (!this.#relocate) {
                return
            };
            this.value.date = String(AstroChartIn.#localDate(this.value.dateToJSON, this.value.tzMin)).slice(0, 16);

        });
        this.#html.querySelector('select[name="sex"]').addEventListener("change", (e) => {
            this.value.sex = e.target.value;
        });
        this.#html.querySelector('input[name="name"]').addEventListener("change", (e) => {
            this.value.name = e.target.value;
        });
        this.#html.querySelector('textarea').addEventListener("input", (e) => {
            this.value.description = e.target.value;
        });
        this.#html.querySelector('input[name="tzTime"]').addEventListener("change", (e) => {
            let value = e.target.value;
            this.value.tzMin = AstroChartIn.#textTimetoMin(value);
            if (!this.#relocate) {
                return
            };
            this.value.date = String(AstroChartIn.#localDate(this.value.dateToJSON, this.value.tzMin)).slice(0, 16);
        });
        const inptzTime = this.#html.querySelector('input[name=tzTime]');
        inptzTime.pattern = "([\\-,\\+])([0,1][0-9]|[2][0-3])([:])([0-5][0-9])";
        inptzTime.oldvalue = "+00:00";
        inptzTime.value = AstroChartIn.#minToText(this.value.tzMin) || "+00:00";
        inptzTime.addEventListener('input', (e) => {
            const regExp = new RegExp(e.target.pattern);
            let valLength = e.target.selectionStart;
            e.target.value = e.target.value.substring(0, valLength) + e.target.placeholder.substring(valLength);
            if (regExp.test(e.target.value)) {
                e.target.oldvalue = e.target.value;
                e.target.selectionStart = (valLength === 3) ? valLength + 1 : valLength;
            } else {
                e.target.value = e.target.oldvalue;
                e.target.selectionStart = valLength - 1;
            }
        })
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'closed' });
        this.style.display = 'block';
        this.#html = shadow;
        this.#render();
    };
};

customElements.define('astro-chartin', AstroChartIn);