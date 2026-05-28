/**
* Copyright 2023, Muratov Damir.
*astro3d.ru
* https://github.com/damirmur/
* All rights reserved.
* Licensed under the MIT license
v 0.0.1
*/
class AstroChartsDBview extends HTMLElement {
    static #templateHTML = `
    <div id='view' class='flex'>
        <div style="width: 29%;">
        <select id="controlFolders" class="controlSelect">
        <option value='0' selected hidden>Folders</option>
        <option value="➕📁">➕📁</option>
        <option value="📝📁">📝📁</option>
        <option value="➖📁">➖📁</option>
        </select>
            <input type="button" name="btnHid" class="button" value="❌" onclick="parentElement.classList.add('none')"
                title="Hidden form" style="color: transparent;  
    text-shadow: 0 0 0 seagreen; float: right;font-size: x-small; margin: 0;height: min-content;">
            <astro-chartsdbreeview></astro-chartsdbreeview>
        </div>
        <div class='block' id="panel-charts" style="width: 69%;">
            <div class="panel">
                <input type="button" name="btnFolders" class="buttonСhart" value="📚" title="Сhart Folders">
                <input type="button" name="btnAdd" class="buttonСhart" value="➕" title="Add chart"
                    style="color: transparent;text-shadow: 0 0 0 seagreen;">
                <input type="button" name="btnEdit" class="buttonСhart" value="📝" title="Edit chart">
                <input type="button" name="btnCopy" class="buttonСhart" value="🗊" title="Copy chart">
                <input type="button" name="btnPaste" class="buttonСhart" value="📋" title="Paste chart">
                <input type="button" name="btnDel" class="buttonСhart" value="➖" title="Del chart" style="color: transparent;  
                    text-shadow: 0 0 0 red;">
                <select id="controlCharts" style="padding: 3px" class="controlSelect">
                    <option value='0' selected hidden>Charts</option>
                    <option value="📚">📚Сhart Folders</option>
                    <option value="➕">➕Add chart</option>
                    <option value="📝">📝Edit chart</option>
                    <option value="🗊">🗊Copy chart</option>
                    <option value="📋">📋Paste chart</option>
                    <option value="➖">➖Del chart</option>
                    <option value="💽">💽Save File</option>
                    <option value="📀">📀Load File</option>
                </select>
            </div>
            <astro-charts></astro-charts>
        </div>
    </div>
    <div class='block chartin none'>
        <input type="button" name="btnHid" class="button" value="❌" onclick="parentElement.classList.add('none')"
            title="Hidden form" style="color: transparent;  
            text-shadow: 0 0 0 seagreen; float: right;font-size: x-small; margin: 0;height: min-content;">
        <astro-chartin></astro-chartin>
    </div>
    <div class='block chartouttab none'>
        <input type="button" name="btnHid" class="button" value="❌" onclick="parentElement.classList.add('none')"
            title="Hidden form" style="color: transparent;  
            text-shadow: 0 0 0 seagreen; float: right;font-size: x-small; margin: 0;height: min-content;">
        <astro-chartouttab></astro-chartouttab>
    </div>
`;
    static #templateCSS = `
    <style>
    #view {
        max-width: 100%;
        min-height: 100px;
        margin: 1px;

    }
        * {
            max-width: 600px;
        }

        .block {
            display: block;
            border-width: 1px;
            border-color: rgb(190, 190, 190);
            border-style: solid;
            height: 100%;
        }

        .flex {
            display: flex;
            border-width: 1px;
            border-color: rgb(190, 190, 190);
            border-style: solid;
        }

        .flex>* {
            flex: 1 1 auto;
            max-height: 250px;
        }

        .none {
            display: none;
            height: 0;
        }

        .chartin {
            width: max-content;
            min-width: 600px;
        }

        .panel {
            margin-bottom: 1px;
        }

        .buttonСhart {
            float: left;
        }

        .controlSelect {
            font-size: small;
            font-family: monospace;
            max-width: 130px;
        }

        select {
            font-size: small;
            border: 1px solid black;

        }
    </style>
    `;
    constructor() {
        super();
        this.#source = undefined;
        this.addEventListener("change", (e) => {
        })
    }
    #value = { value: { "0": { id: "0", "text": "/", "child": {}, "charts": [] } }, index: '0' };
    #shadow;
    #tempchart;
    #chart = {};
    get chart() {
        return this.#chart;
    };
    set chart(val) {
        this.#chart = val;
    };
    #source = {};
    get source() {
        return this.#source;
    };
    set source(val = undefined) {
        this.#source = val ||
        {
            'newChart': new Chart(),
            "getAstroData": Source.def.getAstroData,
            'searchCities': Source.def.searchCities,
            'findTZByLngLat': Source.def.findTZByLngLat,
            'sourceMap': Source.def.sourceMap,
            // 'viewChart': $ad.tableOutTableChart,
        };
        if (!this.#source.getAstroData) { this.#source.getAstroData = Source.def.getAstroData };
        if (!this.#source.searchCities) { this.#source.searchCities = Source.def.searchCities };
        if (!this.#source.findTZByLngLat) { this.#source.findTZByLngLat = Source.def.findTZByLngLat };
        if (!this.#source.sourceMap) { this.#source.sourceMap = Source.def.sourceMap };
        // if (!this.#source.viewChart) { this.#source.viewChart = Source.net.viewChart };
        if (!this.#source.newChart) { this.#source.newChart = new Chart() };
        this.#render();

    };

    get value() {
        return this.#value;
    };
    set value(val) {
        this.#value = val || this.#value;
        this.#render();
    };
    #render() {
        const getValuebyKey = ((obj, key, val = undefined) => {
            if (val) { return val }
            for (var k in obj) {
                if (val) { break }
                if (k == key) {
                    val = obj[k];
                    break;
                }
                else if (typeof obj[k] == "object") {
                    val = getValuebyKey(obj[k], key);
                }
            }
            return val;
        })
        if (this.#value.value) {
            this.#shadow.querySelector('astro-chartsdbreeview').value = this.#value.value;
            this.#shadow.querySelector('astro-chartsdbreeview').index = this.#value.index;
            const valObj = getValuebyKey(this.#value.value, this.#value.index);
            this.#shadow.querySelector('astro-charts').value = valObj.charts;
            this.#shadow.querySelector('astro-charts').currentValueIndex = -1;
            this.#shadow.querySelector('#controlFolders').value = '0';
            this.#shadow.querySelector('#controlFolders').selectedOptions[0].textContent = valObj.text;
        }
    };
    connectedCallback() {
        const getObjbyKey = ((obj, key, val = undefined) => {
            if (val) { return val }
            for (var k in obj) {
                if (val) { break }
                if (k == key) {
                    return obj;
                    break;
                }
                else if (typeof obj[k] == "object") {
                    val = getObjbyKey(obj[k], key);
                }
            }
            return val;
        });
        const addFolder = ((owner) => {
            const parent = getObjbyKey(this.#value.value, this.#value.index)[this.#value.index];
            if (!parent) {
                parent = getObjbyKey(this.#value.value, "0")['0'];
            }
            const dateId = new Date();
            const id = dateId.getTime();
            parent.child[id] = {};
            const newFolder = parent.child[id];
            newFolder.id = id;
            let name = prompt('Name folders?', dateId.toISOString());
            newFolder.text = (name) ? name : dateId.toISOString();
            newFolder.charts = [];
            newFolder.child = {};
            owner.value = { 'value': owner.#value.value, 'index': id };
        });
        function editFolder(owner) {
            if (owner.#value.index == '0') { return };
            let obj = getObjbyKey(owner.#value.value, owner.#value.index)[owner.#value.index];
            let text = obj.text;
            let name = prompt('Name folders?', text);
            obj.text = (name) ? name : text;
            owner.value = { 'value': owner.#value.value, 'index': owner.#value.index };
        };
        function delFolder(owner) {
            if (owner.#value.index == '0') { return };
            delete getObjbyKey(owner.#value.value, owner.#value.index)[owner.#value.index];
            owner.value = { 'value': owner.#value.value, 'index': "0" };
        };
        async function addCharts(owner = this) {
            const chart = new Chart();
            owner.#shadow.querySelector('div.chartin').classList.remove('none');
            owner.#shadow.querySelector('astro-chartin').value = chart.in;
            let asharts = owner.#shadow.querySelector('astro-charts');
            asharts.value.push(chart.in);
            asharts.value = asharts.value;
            asharts.currentValueIndex = asharts.value.length - 1;
        };
        function delCharts(owner = this) {
            let asharts = owner.#shadow.querySelector('astro-charts');
            let ci = asharts.currentValueIndex;
            if (ci == -1) { return; }
            asharts.value.splice(ci, 1);
            asharts.value = asharts.value;
            owner.#shadow.querySelector('div.chartin').classList.add('none');
        };
        function editCharts(owner = this) {
            let asharts = owner.#shadow.querySelector('astro-charts');
            if (asharts.currentValueIndex == -1) {
                return
            };
            owner.#shadow.querySelector('div.chartin').classList.remove('none');
            owner.#shadow.querySelector('astro-chartin').value = asharts.value[asharts.currentValueIndex];
        };
        function copyCharts(owner = this) {
            let asharts = owner.#shadow.querySelector('astro-charts');
            if (asharts.currentValueIndex == -1) {
                return
            };
            owner.#tempchart = asharts.value[asharts.currentValueIndex];
        };
        function pasteCharts(owner = this) {
            if (!owner.#tempchart) { return undefined }
            let asharts = owner.#shadow.querySelector('astro-charts');
            asharts.value.push({
                "dateToJSON": owner.#tempchart.dateToJSON,
                "name": owner.#tempchart.name,
                "sex": owner.#tempchart.sex,
                "city": owner.#tempchart.city,
                "timezone": owner.#tempchart.timezone,
                "tzMin": owner.#tempchart.tzMin,
                "country": owner.#tempchart.country,
                "latitude": owner.#tempchart.latitude,
                "longitude": owner.#tempchart.longitude,
                "date": owner.#tempchart.date,
            });
            asharts.value = asharts.value;
            asharts.currentValueIndex = asharts.value.length - 1;
            return true;
        };
        async function saveFile(owner = this) {
            const opts = { suggestedName: 'astrocalcdb', types: [{ description: "JSON", accept: { "application/json": [".json"] }, },], };
            async function save() {
                const newHandle = await window.showSaveFilePicker(opts);
                const writableStream = await newHandle.createWritable();
                await writableStream.write(JSON.stringify(owner.#value));
                await writableStream.close();
            };
            await save();
        };
        async function loadFile(owner = this) {
            const opts = { suggestedName: 'astrocalcdb', types: [{ description: "JSON", accept: { "application/json": [".json"] }, },], excludeAcceptAllOption: true, multiple: false, };
            async function getTheFile() {
                const [fileHandle] = await window.showOpenFilePicker(opts);
                const fileData = await fileHandle.getFile();
                const slice = fileData.slice(0, fileData.size);
                const text = await slice.text();
                owner.value = JSON.parse(text);
            }
            await getTheFile();
        };


        this.#shadow = this.attachShadow({ mode: 'closed' });
        this.#shadow.innerHTML = AstroChartsDBview.#templateCSS + AstroChartsDBview.#templateHTML;
        this.#shadow.querySelector('astro-chartsdbreeview').addEventListener('click', (e) => {
            const obj = e.target.value;
            const key = e.target.index;
            this.value = { index: key, value: obj };
            this.dispatchEvent(new CustomEvent('change', { detail: this.#value}));

        })
        this.#shadow.querySelector('#controlFolders').addEventListener('change', (e) => {
            if (e.target.value == '➕📁') {
                addFolder(this);
            }
            if (e.target.value == '📝📁') {
                editFolder(this);
            }
            if (e.target.value == '➖📁') {
                delFolder(this);
            }
            e.target.value = '0';
            this.dispatchEvent(new CustomEvent('change', { detail: this.#value }));
            this.#render();

        })
        const controlCharts = ((val) => {
            let res = true;
            switch (val) {
                case '📚': {
                    this.#shadow.querySelector('astro-chartsdbreeview').parentElement.classList.remove('none'); break
                };
                case '➕': { addCharts(this); break };
                case '📝': { editCharts(this);res=false; break };
                case '🗊': { copyCharts(this);res=false; break };
                case '📋': { res = pasteCharts(this); break };
                case '➖': { delCharts(this); break };
                case '💽': { saveFile(this); break };
                case '📀': { loadFile(this); break };
            }
            if (res) {
                this.dispatchEvent(new CustomEvent('change', { detail: this.#value }));
            };

        });
        this.source = undefined;
        this.#shadow.querySelector('astro-chartin').searchCity = this.source.searchCities;
        this.#shadow.querySelector('astro-chartin').searchTZ = this.source.findTZByLngLat;
        this.#shadow.querySelector('astro-chartin').sourceMap = this.source.sourceMap;
        this.#shadow.querySelector('astro-chartin').addEventListener('change', (e) => {
            let asharts = this.#shadow.querySelector('astro-charts');
            let ci = asharts.currentValueIndex;
            asharts.value[ci] = e.target.value;
            asharts.value = asharts.value;
            asharts.currentValueIndex = ci;
            let chart = { in: e.target.value, set: this.source.newChart.set };
            this.dispatchEvent(new CustomEvent('change', { detail: { 'chart': chart } }));
            //chart.out = this.source.getAstroData(chart);
            // this.#shadow.querySelector("div.chartouttab").classList.remove('none');
            // this.#shadow.querySelector("astro-chartouttab").value = viewChart(chart);
        })
        this.#shadow.querySelector('#controlCharts').addEventListener('change', (e) => {
            const val = e.target.value;
            controlCharts(val);
            e.target.value = '0';
        });

        this.#shadow.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.classList.contains('buttonСhart')) {
                controlCharts(e.target.value, this.#shadow);
            }
            if ((e.target.value) && (e.target.value.dateToJSON)) {
                this.#chart = e.target.value;
                this.dispatchEvent(new CustomEvent('change', { detail: { 'chart': { in: this.#chart } } }));
            }
        });

        this.#shadow.querySelector('astro-charts').addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.detail == 1) { return };
            if (e.detail.currentValueIndex == -1) { return };
            let chart = { in: e.detail.value[e.detail.currentValueIndex], set: this.source.newChart.set };
            chart.out = this.source.getAstroData(chart);
            this.dispatchEvent(new CustomEvent('change', { detail: { 'chart': chart } }));
            this.#shadow.querySelector('astro-chartin').value = chart.in;
            // this.#shadow.querySelector("div.chartouttab").classList.remove('none');
            this.chart = chart;
        })
        this.#render();
    }
}
customElements.define('astro-chartsdbview', AstroChartsDBview);
