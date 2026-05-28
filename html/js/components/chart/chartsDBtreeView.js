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
class AstroChartsDBtreeView extends HTMLElement {
    static #templateHTML = `
    <div id="astro-folders" class='block'>

    <div id="folders"></div>
    </div>
    `;
    static #templateCSS = `
    <style>
    .block {
        display: block;
        border-width: 1px;
        border-color: rgb(190, 190, 190);
        border-style: none;
        height: 98%;
        padding: 1px;
        min-width:130px;
    }
    .none {
        display: none;
        height: 0;
    }

    .collapse li {
        height: 0;
        overflow: hidden;
        list-style-type: "📁";
    }
    li.collapse::marker  {
        content:'📁';
    }

    .select {
        background-color: lightblue;
        list-style-type: "📂";
    }

    #foldRoot {
        padding-left: 15px;
    }

    #folders {
        font-size: small;
        font-family: monospace;
        max-height: 220px;
        overflow: auto;
    }

    ul li {
        padding-left: 0px;
        position: relative;
        cursor: pointer;
        list-style-type: "📂";

    }

    ul {
        padding-left: 5px;
        margin: 0px;
        background-color: white;
    }
   </style>
    `;
    constructor() {
        super();
    }
    #value = { "0": { id: "0", "text": "/", "child": {}, "charts": [] } };
    get value() {
        return this.#value;
    };
    set value(val) {
        this.#value = val || this.#value;
        this.#render();
    };
    #shadow;
    #index = '0';
    get index() {
        return this.#index;
    };
    set index(val) {
        const uncollapse = ((el) => {
            el.classList.remove('collapse');
            if (el.parentElement.parentElement.tagName == 'LI') {
                uncollapse(el.parentElement.parentElement);
            }
        });

        this.#index = val || this.#index;
        const sel = this.#shadow.getElementById(this.#index);
        uncollapse(sel);
        sel.classList.add('select');
    };
    #render() {
        const load = ((obj) => {
            let ul = document.createElement("ul");
            for (let key in obj) {
                let li = document.createElement("li");
                if (key == "0") {
                    ul.id = "foldRoot";
                }
                li.id = key;
                let text = document.createTextNode(obj[key].text);
                li.appendChild(text);
                let child = obj[key]['child'];
                if (Object.keys(child).length > 0) {
                    let subList = load(obj[key].child);
                    li.appendChild(subList);
                    ul.appendChild(li);
                } else {
                    li.appendChild(document.createElement("ul"));
                    ul.appendChild(li)
                }
                li.classList.add('collapse');

            }
            return ul;
        });
        this.#shadow.querySelector("#folders").textContent = ``;
        this.#shadow.querySelector("#folders").appendChild(load(this.#value));
    };
    connectedCallback() {
        const addFolder = ((owner) => {
            let parent = owner.querySelector(".select");
            if (!parent) {
                parent = owner.getElementById("0");
            }
            parent.classList.remove('collapse');
            const li = document.createElement('li');
            li.id = new Date().getTime();
            let name = prompt('Name folders?', new Date().toISOString());
            let text = document.createTextNode((name) ? name : text);
            li.appendChild(text);
            li.appendChild(document.createElement('ul'));
            if (owner.querySelector(".select")) { owner.querySelector(".select").classList.remove('select'); }
            li.classList.add('select');
            parent.children[0].appendChild(li);
        });
        function editFolder(owner) {
            if (owner.querySelector(".select").id == '0') { return };
            let text = owner.querySelector(".select").childNodes[0].nodeValue;
            let name = prompt('Name folders?', text);
            owner.querySelector(".select").childNodes[0].nodeValue = (name) ? name : text;
        };
        function delFolder(owner) {
            if (owner.querySelector(".select").id == '0') { return };
            let el = owner.querySelector(".select");
            let ul = el.parentElement;
            ul.removeChild(el);
            ul.parentElement.classList.add("select");
        };
        function saveFolder(owner) {
            function save(ul) {
                let obj = {};
                if (!ul) { return obj }
                let lis = ul.children;
                for (let i = 0; i < lis.length; i++) {
                    let li = lis[i];
                    obj[li.id] = {};
                    obj[li.id]['text'] = li.childNodes[0].nodeValue;
                    obj[li.id]['child'] = save(li.children[0]);
                    obj[li.id]['charts'] = [];
                }
                return obj;
            };
            return save(owner.querySelector("#foldRoot"));
        };
        const clickHandler = ((e) => {
            e.stopPropagation();
            if (e.target.tagName === 'LI') {
                let sel = e.target.getRootNode().querySelector(".select");
                if (sel == e.target) { }
                if (sel) {
                    if (sel == e.target) {
                        sel.classList.remove('select');
                        e.target.classList.add('collapse');
                    } else {
                        sel.classList.remove('select');
                        e.target.classList.add('select');
                        e.target.classList.remove('collapse');

                    }
                } else {
                    e.target.classList.add('select');
                    e.target.classList.remove('collapse');
                }
            }
        });
        this.#shadow = this.attachShadow({ mode: 'closed' });
        this.#shadow.innerHTML = AstroChartsDBtreeView.#templateCSS + AstroChartsDBtreeView.#templateHTML;
        this.#shadow.querySelector('#folders').addEventListener('click', (e) => {
            this.#index = e.target.id;
            clickHandler(e);
            this.dispatchEvent(new CustomEvent('click', { detail: { 'value': this.#value, 'index': this.#index } }));
        });
        this.#render();
    }
}
customElements.define('astro-chartsdbreeview', AstroChartsDBtreeView);
