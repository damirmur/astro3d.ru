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
class AstroChartSet extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("change", (e) => {
         })
    }
    static #types = {};
    static #houses = {};
    static #planets = {};
    static #aspects = {};
    #value = {};
    #html;
    set types(value) {
        AstroChartSet.#types = value || {};
        this.#html.querySelector('select[name=type]').innerHTML=``;
        for (let key in this.types) {
            this.#html.querySelector('select[name=type]').append(new Option(this.types[key], key));
        }
    }
    get types() {
        return AstroChartSet.#types;
    }
    set houses(value) {
        AstroChartSet.#houses = value || {};
        this.#html.querySelector('select[name=house]').innerHTML=``;
        for (let key in this.houses) {
            this.#html.querySelector('select[name=house]').append(new Option(this.houses[key], key));
        }
        this.#setvalueEl();
    }
    get houses() {
        return AstroChartSet.#houses;
    }
    set planets(value) {
        AstroChartSet.#planets = value || AstroChartSet.#planets;
        this.#render();
    }
    get planets() {
        return AstroChartSet.#planets;
    }
    set aspects(value) {
        AstroChartSet.#aspects = value || AstroChartSet.#aspects;

        this.#render();
    }
    get aspects() {
        return AstroChartSet.#aspects;
    }
    get value() {
        return this.#value;
    };
    set value(val) {
        this.#value=val;
        this.#setvalueEl();
        this.#render();
    };
    #setvalueEl = ((value = this.#value) => {
        this.#html.querySelector('input[name=reloc]').checked = (value.reloc)?true:false;
        this.#html.querySelector('select[name=type]').value = value.type;
        this.#html.querySelector('select[name=house]').value = value.house;
        this.#html.querySelector('select-checkbox[name=planets]').value = value.planets;
        this.#html.querySelector('select-checkbox[name=aspects]').value = value.aspects;
    })
    get styleSheets() {
        return this.#html.styleSheets;
    }
    set styleSheets(val) {
        this.#html.styleSheets = val || this.#html.styleSheets;
        this.#render();
    }
    // set templateCSS(val) {
    //     AstroChartSet.#templateCSS = val || AstroChartSet.#templateCSS;
    //     this.render();
    // }
    // get templateCSS() {
    //     return AstroChartSet.#templateCSS;
    // }
    static #templateHTML = `
        <input name="newD" class="btn" type="button" title="Now date" value="⌚">
        <input type="checkbox" name="reloc" title="Relocation. Local time may change."><label for="reloc" title="Relocation. Local time may change.">reloc.</label>
        <select name="type"></select>
        <select name="house" title="Houses"></select>
        <br>
        <select-checkbox id='planets' name="planets"></select-checkbox>
        <select-checkbox id='aspects' name="aspects"></select-checkbox>

    `;
    static #templateCSS = `
    <style>
    select {
        max-width: 150px;
    }
    select[name="house"] {
        width: 150px;
    }
    * {
        margin: 1px
    }
    span {
        max-width: 400px; 
    }
    </style>
    `;
    #render() {
        //<link rel="stylesheet" href="style.css"></link>
        // const linkElem = document.createElement("link");
        // linkElem.setAttribute("rel", "stylesheet");
        // linkElem.setAttribute("href", "style.css");
        // shadow.appendChild(linkElem);
        this.#html.innerHTML = ``;
        this.#html.innerHTML = AstroChartSet.#templateCSS + AstroChartSet.#templateHTML;
        this.#html.querySelector('#planets').name='planets';
        this.#html.querySelector('#planets').obj=this.planets;
        this.#html.querySelector('#planets').addEventListener("change", (e) => {
            this.#value['planets'] = e.target.value;
            this.dispatchEvent(new CustomEvent('change', { detail: { 'name': 'planets', 'value': e.target.value } }));
        })
        this.#html.querySelector('#aspects').name='aspects';
        this.#html.querySelector('#aspects').obj=this.aspects;
        this.#html.querySelector('#aspects').addEventListener("change", (e) => {
            this.#value['aspects'] = e.target.value;
            this.dispatchEvent(new CustomEvent('change', { detail: { 'name': 'aspects', 'value': e.target.value } }));
        })

        for (let key in this.types) {
            this.#html.querySelector('select[name=type]').append(new Option(this.types[key], key));
        }
        for (let key in this.houses) {
            this.#html.querySelector('select[name=house]').append(new Option(this.houses[key], key));
        }
        this.#setvalueEl();
        this.#html.addEventListener("change", (e) => {
            e.stopImmediatePropagation();
            let name = e.target.name;
            let value = (e.target.type == "checkbox") ? ((e.target.checked) ? true : false) : e.target.value;
            this.#value[name] = value;
            this.dispatchEvent(new CustomEvent('change', { detail: {'target':this.tagName,  'name': name, 'value': value } }));
        })
        this.#html.querySelector('input[name=newD]').addEventListener("click", (e) => {
            this.dispatchEvent(new CustomEvent('change', { detail: { 'name': 'dateToJSON'}}));
        })
        this.#html.addEventListener("select", (e) => {
            this.dispatchEvent(new CustomEvent('change', { detail: { 'name': name, 'value': value }}));
        })

    };
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'closed' });
        this.#html = shadow;
        this.#render();
    }
}
customElements.define('astro-chartset', AstroChartSet);