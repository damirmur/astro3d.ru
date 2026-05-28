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

*/
class SelectCheckbox extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", (e) => {
      //      console.log(this.value);
    })
  }
  #shadow;
  #name = 'Select checkbox';
  #obj = { 0: 0, 1: 1 };
  get obj() {
    return this.#obj;
  };
  set obj(val) {
    this.#obj = val;
    this.#render();
  }
  get name() {
    return this.#name;
  };
  set name(val) {
    this.#name = val;
    this.#shadow.querySelector('select').innerHTML = `<option>` + this.name + `</option>`;
  }
  set value(val = []) {
    let checkboxes = this.#shadow.querySelector("#checkboxes");
    for (let item of checkboxes.childNodes) { item.querySelector('div label input').checked = false }
    if (Array.isArray(val)) {
      val.forEach((el) => {
        checkboxes.querySelector('#a' + String(el)).checked = true;
      });
    }
  };

  get value() {
    let arr = [];
    for (let item of this.#shadow.querySelector("#checkboxes").childNodes) {
      const inp = item.querySelector('div label input');
      if (inp.checked) arr.push((inp.id).slice(1))
    };
    return arr;
  };
  #render() {
    const parent = this.#shadow;
    function showCheckboxes() {
      const checkboxes = parent.querySelector("#checkboxes");
      checkboxes.style.display = (checkboxes.style.display == "block") ? "none" : "block";
    };
    parent.innerHTML = SelectCheckbox.#templateCSS + SelectCheckbox.#templateHTML;
    parent.querySelector('select').innerHTML = `<option>` + this.name + `</option>`;
    parent.querySelector('.selectBox').addEventListener('click', (e) => { showCheckboxes() });
    parent.querySelector('#checkboxes').addEventListener('mouseleave', (e) => { showCheckboxes() });
    parent.querySelector("#checkboxes").innerHTML = ``;
    for (const [key, value] of Object.entries(this.obj)) {
      if (!(typeof value === 'function')) {
        const div = document.createElement('div');
        div.innerHTML = `<label for=a` + key + `><input type="checkbox" id=a` + key + ` />` + value + `</label>`;
        div.addEventListener("change", (e) => {
          this.dispatchEvent(new CustomEvent('change', { detail: { 'type': e.target.type, 'value': value } }));
        });
        parent.querySelector("#checkboxes").appendChild(div);
      }
    }
  };
  static #templateHTML = `
  <span class="multiselect">
    <span class="selectBox">
      <select></select>
      <div class="overSelect">
      </div>
    </span>
    <div id="checkboxes">
      <div class='checkboxes-items'>
        <label for="one"><input type="checkbox" id="one" />First checkbox</label>
      </div>
    </div>
  </span>
    `;
  static #templateCSS = `
  <style>
  *{
    box-sizing: border-box;
    width: 100%;


  }
  .multiselect {
    position: relative;
    display: inline-block;
    width: 100%;


  }
  select {
    border:0;
  }

  .selectBox select {
    font-family: monospace;
    font-weight: bold;
    font-optical-sizing: auto;
  }
  .overSelect {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .checkboxes-items{
    cursor: pointer;

    top: 100%;
    left: 0;
    right: 0;
  }
  #checkboxes {
    text-align: left;
    width: 100%;
    background-color: #f1f1f1;
    display: none;
    border: 1px #dadada solid;
    position: absolute;
    z-index: 1001;  }
    #checkboxes input {
      width: auto;
    }
  #checkboxes label {
    display: block;
  }
  #checkboxes label:hover {
 background-color: #1e90ff;
  }
  </style>
  `;
  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: 'closed' });
    this.#render();
  }
}
customElements.define('select-checkbox', SelectCheckbox);

