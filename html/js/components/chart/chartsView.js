/*
MIT License

Copyright (c) 2023 Muratov Damir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

cities-autocomplete - exextends HTMLElement. The autocomplete element is designed to select a city with data (timezone, longitude, latitude) in an array of objects filtered by an external function by city name.
cities-autocomplete.value - set, get Object={'city':,'latitude':,'longitude':,'timeZone':,'country': }
cities-autocomplete.searchCity - сonnecting an external function with a city name parameter searchCity(nameCity="Ors") that returns an array of objects [... {"id":,"name": "Ors","nameA": "Ors","latLng": [lat,lng],"country": "FR","tz": "Europe/Paris"]
cities-autocomplete customEvent('select', { detail: cities-autocomplete.value}). The event occurs when a city is selected in the search box.

*/
class AstroCharts extends HTMLElement {
    static #minToText(tzmin) {
        let d = new Date(new Date(0).setMinutes(Math.abs(tzmin)));
        return (((tzmin <= 0) ? '+' : '-') + d.getUTCHours().toString().padStart(2, "0") + ':' + d.getUTCMinutes().toString().padStart(2, "0"));
    };
    static #stringLatLng = ((lat, lng) => {
        let stringLat = Number(lat).toFixed(2).replace('.', ((Number(lat) > 0) ? 'N' : 'S'));
        let stringLng = Number(lng).toFixed(2).replace('.', ((Number(lng) > 0) ? 'E' : 'W'));
        return [stringLat, stringLng]
    });

    static #localDate(dateJSON, tzMin) {
        let d = new Date(dateJSON);
        let lTZ = d.getTimezoneOffset();
        let dl = new Date(d.getTime() + (lTZ - tzMin) * 6e4);
        return dl.toLocaleString();
    };
    constructor() {
        super();
    }
    #value = [];
    #currentValueIndex = -1;
    #html;
    get currentValueIndex() {
        return this.#currentValueIndex;
    };
    set currentValueIndex(val) {
        this.#currentValueIndex = val;
        let el = this.#html.querySelector('.activeRows');
        if (el) {
            el.classList.remove('activeRows');
        }
        if (this.#currentValueIndex > -1) {
            this.#html.getElementById(val).classList.add('activeRows');
            this.#html.querySelector('.activeRows').scrollIntoView(false);
        };

    };
    get value() {
        return this.#value;
    };
    set value(val) {
        this.#value = val;
        this.#currentValueIndex = -1;
        this.#setTable(this.#value);
    };
    #setTable(val = this.#value) {
        let tab = this.#html.querySelector("table");
        tab.innerHTML = ``;
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        tr.innerHTML = `<th name = 'name'>Name</th><th>Sex</th><th name = 'date'>Date, time</th><th>City</th><th>Co.</th><th name = 'timezone'>Timezone</th><th>Lat.</th><th>Long.</th><th>GMT</th>`
        thead.appendChild(tr);
        tab.appendChild(thead);
        val.forEach((el = {}, idx) => {
            let tr = document.createElement("tr");
            tr.id = idx;
            let td = document.createElement("td");
            td.name = 'name';
            td.innerHTML = el.name;
            tr.appendChild(td);
            td = document.createElement("td");
            td.name = 'sex';
            td.innerHTML = el.sex;
            tr.appendChild(td);
            td = document.createElement("td");
            td.name = 'date';
            td.innerHTML = AstroCharts.#localDate(el.dateToJSON, el.tzMin);
            tr.appendChild(td);
            td = document.createElement("td");
            td.name = 'city';
            td.innerHTML = el.city;
            tr.appendChild(td);
            td = document.createElement("td");
            td.name = 'country';
            td.innerHTML = el.country;
            tr.appendChild(td);
            td = document.createElement("td");
            td.name = 'timezone';
            td.innerHTML = el.timezone;
            tr.appendChild(td);
            let [latitude, longitude] = AstroCharts.#stringLatLng(el.latitude, el.longitude);
            td = document.createElement("td");
            td.name = 'latitude';
            td.innerHTML = latitude;
            tr.appendChild(td);
            td = document.createElement("td");
            td.name = 'longitude';
            td.innerHTML = longitude;
            tr.appendChild(td);
            td = document.createElement("td");
            td.name = 'tzMin';
            td.innerHTML = AstroCharts.#minToText(el.tzMin);
            tr.appendChild(td);
            tr.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentValueIndex = Number(tr.id);
                this.dispatchEvent(new CustomEvent('click', { detail: {value: this.#value,currentValueIndex: this.#currentValueIndex } }));

            })
            tab.appendChild(tr);
        })

    }
    static templateHTML = `<table></table>`;
    static templateCSS = `
    <style>
        *{
            display: 'block';
        }
        table {
        width: 100%;
        font-size:small;
        min-width:400; 
        max-width:600px; 
        height:200px;
        color:blue;
        display: inline-block;
        margin: 0px;
        overflow: auto;
        white-space: normal;
        border-spacing: 0px;
        background-color: #fafafa;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    table tr td{
        border: 1px solid white;        
    }
    table tr th{
        border: 1px solid white; 
     }
    table thead tr th {
        background-color: #E0E0E0;
        position: sticky;
        z-index: 1;
        top: 0px;
      }
    table tr th[name = 'name']{
        width: 25%;
    }

    table tr th[name = 'date']{
        width: 25%;
    }
    table tr th[name = 'timezone']{
        width: 25%;
    }

    .activeRows{
        font-weight: bold;
    }
    </style>
    `;
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.innerHTML = AstroCharts.templateCSS + AstroCharts.templateHTML;
        this.#html = shadow;
        this.#setTable();
    }
}
customElements.define('astro-charts', AstroCharts);