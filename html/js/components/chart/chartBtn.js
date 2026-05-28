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
class AstroChart extends HTMLElement {
    static #localDate(dateJSON, tzMin) {
        let d = new Date(dateJSON);
        let lTZ = d.getTimezoneOffset();
        let dl = new Date(d.getTime() + (lTZ - tzMin) * 6e4);
        return dl.toLocaleString();
    };

    constructor() {
        super();
        this.addEventListener("change", (e) => { console.log(e); })
    }
    #shadow;
    #source = {};
    get source() {
        return this.#source;
    };
    set source(val = undefined) {
        const zodiac = {
            '0': 'Aries',
            '1': 'Taurus',
            '2': 'Gemini',
            '3': 'Cancer',
            '4': 'Leo',
            '5': 'Virgo',
            '6': 'Libre',
            '7': 'Scorpio',
            '8': 'Sagittarius',
            '9': 'Capricorn',
            '10': 'Aquarius',
            '11': 'Pisces',
        }
        this.#source = val ||
            new Chart().then(res => {
                return {
                    'newChart': res,
                    "getAstroData": Source.net.getAstroData,
                    'searchCities': Source.net.searchCities,
                    'findTZByLngLat': Source.net.findTZByLngLat,
                    'sourceMap': Source.net.sourceMap,
                    'viewChart': $ad.tableOutTableChart,
                    'planets': Source.net.planets,
                    'types': { "cosmo": "Cosmo", "horo": "Horo", "zod": "Zodiac", "planets": "Planets" },
                    'houses': Source.net.houses,
                    'aspects': Source.net.aspects,
                    'zodiac': zodiac
                }
            });
        if (!this.#source.zodiac) { this.#source.zodiac = zodiac };
        if (!this.#source.aspects) { this.#source.aspects = Source.net.aspects };
        if (!this.#source.planets) { this.#source.planets = Source.net.planets };
        if (!this.#source.houses) { this.#source.houses = Source.net.houses };
        if (!this.#source.types) { this.#source.types = { "cosmo": "Cosmo", "horo": "Horo", "zod": "Zodiac", "planets": "Planets" } };
        if (!this.#source.getAstroData) { this.#source.getAstroData = Source.net.getAstroData };
        if (!this.#source.searchCities) { this.#source.searchCities = Source.net.searchCities };
        if (!this.#source.findTZByLngLat) { this.#source.findTZByLngLat = Source.net.findTZByLngLat };
        if (!this.#source.sourceMap) { this.#source.sourceMap = Source.net.sourceMap };
        if (!this.#source.viewChart) { this.#source.viewChart = $ad.tableOutTableChart };
        if (!this.#source.newChart) {
            new Chart().then(res => this.#source.newChart = res)
        }
    };
    #value = {};
    get value() {
        return this.#value;
    };
    set value(val) {
        this.#value = val || new Chart(this.#source.newChart);
        this.#shadow.querySelector('astro-chartin').value = this.#value.in;
        this.#shadow.querySelector('astro-chartset').value = this.#value.set;
    };

    static templateHTML = `
    <div class="block">
        <astro-chartset></astro-chartset>
    </div>
    <div class="block">
        <astro-chartin></astro-chartin>
    </div>
    <div class="blockElement">
    <input type="button" name="btnSave" value="💾" style="float: left;" title="Save chart">
    <input type="button" name="btnLoad" value="📂" style="float: left;" title="Load chart">
    <input type="button" name="btn2d" value="❂" style="float: left;color: blueviolet;/* font-size: large; */" title="View horoscop 2d">
    <input type="button" name="btn2dT" value="📑" style="float: left;color: blueviolet;/* font-size: large; */" title="View transit 2d">
    <input type="button" name="btn3d" value="📦" style="float: left;color: blueviolet;/* font-size: large; */" title="View horoscop 3d">
    <input type="button" name="btnTable" value="📰" style="float: left;" title="View table">
    <input type="button" name="btnText" value="📄" style="float: left;" title="View text">
    <select-checkbox></select-checkbox>
    </div>
`;
    static templateCSS = `
    <style>
    .block {
        border-width: 1px;
        border-color: rgb(190, 190, 190);
        border-style: solid;
        display: flex;
    }

    .blockElement {
        max-width: 400px;
        border-width: 1px;
        border-color: rgb(190, 190, 190);
        border-style: solid;
        align-items: center;
        display: flex;
    }
    </style>
    `;
    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: 'closed' });
        this.#shadow.innerHTML = AstroChart.templateCSS + AstroChart.templateHTML;
        this.source = undefined;
        this.#shadow.querySelector('astro-chartin').searchCity = this.source.searchCities;
        this.#shadow.querySelector('astro-chartin').searchTZ = this.source.findTZByLngLat;
        this.#shadow.querySelector('astro-chartin').sourceMap = this.source.sourceMap;
        this.#shadow.querySelector('astro-chartset').houses = this.source.houses;
        this.#shadow.querySelector('astro-chartset').planets = this.source.planets;
        this.#shadow.querySelector('astro-chartset').aspects = this.source.aspects;
        this.#shadow.querySelector('astro-chartset').types = this.source.types;
        new Chart()
            .then(res => {
                this.#shadow.querySelector('astro-chartset').value = res.set;
                this.#shadow.querySelector('astro-chartin').value = res.in;
                this.#value = res;
            })
        this.#shadow.querySelector("astro-chartin").addEventListener("change", (e) => {
            console.log('chart In change', e.detail);
        })
        this.#shadow.querySelector("astro-chartset").addEventListener("change", (e) => {
            this.#value.set = e.target.value;
            if (e.detail.name == 'type') {
                this.#value.set.type = e.detail.value;
                switch (e.detail.value) {
                    case 'cosmo': { e.target.houses = {}; break; };
                    case 'horo': {
                        e.target.houses = this.#source.houses;
                        break;
                    };
                    case 'zod': {
                        e.target.houses = this.#source.zodiac;
                        this.#value.set.house = 0;
                        break
                    };
                    case 'planets': {
                        e.target.houses = this.#source.planets;
                        this.#value.set.house = '0';
                        break;
                    };
                    default: { };
                }
                e.target.value = this.#value.set;
            }
            if (e.detail.name == 'reloc') { this.#shadow.querySelector('astro-chartin').relocate = e.detail.value }
            if (e.detail.name == 'dateToJSON') {
                let valueIn = this.#value.in;
                valueIn.dateToJSON = new Date().toJSON();
                valueIn.date = undefined;
                this.#shadow.querySelector("astro-chartin").value = valueIn;
            }
        })
        this.#shadow.addEventListener("click", (e) => {
            e.stopPropagation();
            let command='';
            switch (e.target.name) {
                case 'btnSave': {
                    localStorage.setItem('chartTemp', JSON.stringify(this.#value));
                    command='save';
                    break;
                }
                case 'btnLoad': {
                    command='load';
                    this.value=JSON.parse(localStorage.getItem('chartTemp'));
                      break;
                  }
                  case 'btn2d': {
                    command='chart2d';
                      break;
                  } 
                  case 'btn2dT': {
                    command='chart2dT';
                      break;
                  }                  
                  case 'btn3d': {
                    command='chart3d';
                      break;
                  }                  
                  default: {
                    console.log(e.target.name, 'command=',command);
                      break;
                  }
                }
            this.dispatchEvent(new CustomEvent('click', { detail: { 'value': this.#value,'command':command } }));
        })
    }
}
customElements.define('astro-chart', AstroChart);