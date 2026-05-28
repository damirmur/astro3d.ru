/**
* Copyright 2023, Muratov Damir.
*astro3d.ru
* https://github.com/damirmur/
* All rights reserved.
* Licensed under the MIT license
v 0.0.2


cities-autocomplete - exextends HTMLElement. The autocomplete element is designed to select a city with data (timezone, longitude, latitude) in an array of objects filtered by an external function by city name.
cities-autocomplete.value - set, get Object={'city':,'latitude':,'longitude':,'timeZone':,'country': }
cities-autocomplete.searchCity - сonnecting an external function with a city name parameter searchCity(nameCity="Ors") that returns an array of objects [... {"id":,"name": "Ors","nameA": "Ors","latLng": [lat,lng],"country": "FR","tz": "Europe/Paris"]
cities-autocomplete customEvent('input', { detail: string}). The event returns a string in the search box.
cities-autocomplete customEvent('select', { detail: cities-autocomplete.value}). The event occurs when a city is selected in the search box.

*/
class CitiesAutocomplete extends HTMLElement {
    static #templateCSS = `
    <style>
* {
  box-sizing: border-box;
}

.autocomplete {
  position: relative;
  display: inline-block;
}

input {
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 1px;
}
input[type=text] {
  background-color: #f1f1f1;
  width: 100%;
}
input[type=submit] {
  background-color: DodgerBlue;
  color: #fff;
  cursor: pointer;
}
.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 401;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
}
.autocomplete-items div {
  padding: 5px;
  cursor: pointer;
  background-color: #fff; 
  border-bottom: 1px solid #d4d4d4; 
}
/*when hovering an item:*/
.autocomplete-items div:hover {
  background-color: #e9e9e9; 
}
/*when navigating through the items using the arrow keys:*/
.autocomplete-active {
  background-color: DodgerBlue !important; 
  color: #ffffff; 
}
</style>`;
    static #templateHTML = `
    <div class="autocomplete" >
        <input id="myInput" type="text" placeholder="name city" style="width:200px;">
    </div>`;
    static searchCity;
    #value;
    #textEl;
    get value() { return this.#value };
    set value(value) {
        this.#value = value;
        this.#textEl.value = value.city;
    };
    constructor() {
        super();
        this.addEventListener("change", (e) => {
            this.value = e.detail;
        });
    }
    connectedCallback() {
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            let x = shadow.querySelectorAll(".autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        const parent = this;
        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.innerHTML = CitiesAutocomplete.#templateCSS + CitiesAutocomplete.#templateHTML;
        const inp = shadow.querySelector('input');
        inp.onfocus = ((e) => {
            e.target.value = '';
        })
        inp.onblur = ((e) => {
            if((e.target.value!=this.#value.city)) e.target.value=this.#value.city;
        })
        inp.onchange = ((e) => { e.target.blur(); })
        document.addEventListener("change", function (e) {
            closeAllLists(e.target);
        });
        this.#textEl = inp;
        let currentFocus;
        inp.addEventListener("input", function (e) {
            const val = this.value.trim();
            closeAllLists();
            e.stopPropagation();
            if ((!val) || (val.length < 2)) { return false; }
            currentFocus = -1;
            const a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            parent.dispatchEvent(new CustomEvent('input', { detail: val }));
            parent.searchCity(inp.value).then(
                (res) => {
                    res.forEach((el) => {
                        let b = document.createElement("DIV");
                        let text=(el.city||el.nameA) + `<br> lat: ` + Number(el.latLng[0]).toFixed(2)+' lng: '+Number(el.latLng[1]).toFixed(2);
                        b.innerHTML = (el.tz)?(text +  `<br>` + el.country + ' ' + el.tz):(text);
                        b.innerHTML = (el.timezone)?(text +  `<br>` + el.country + ' ' + el.timezone):(text);
                        b.innerHTML += "<input type='text' hidden value='" + val + "'>";
                        b.addEventListener("click", function (e) {
                            inp.value = this.querySelector("input").value;
                            const data = {
                                'city': inp.value,
                                'latitude': el.latLng[0],
                                'longitude': el.latLng[1],
                                'timeZone': el.tz||el.timezone,
                                'country': el.country
                            }
                            parent.dispatchEvent(new CustomEvent('change', { detail: data }));
                            closeAllLists();
                        });
                        a.appendChild(b);
                    });
                })
        });
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { //up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });

    }
}
// register component
customElements.define('cities-autocomplete', CitiesAutocomplete);