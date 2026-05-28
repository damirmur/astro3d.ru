const horoscopGraph = (id, radix2D) => {
    // Безопасное получение настроек из radix2D или глобального defA3D
    const direction = radix2D.direction || (typeof defA3D !== 'undefined' ? defA3D.direction : "counterclockwise");
    const rotate = Number(radix2D.rotate || (typeof defA3D !== 'undefined' ? defA3D.rotate : 0)) || 0;

    const start = ((direction == "clockwise") ? (radix2D.chart.out.cusps[0]) : (-radix2D.chart.out.cusps[0])) + rotate;
    const rImagesX = .27;
    const rImagesY = rImagesX * 1.7;
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
            domain: {
                x: [0, 1],
                y: [0, 1]
            },
            font: {
                family: 'monospace',
                size: 15,
            },
            angularaxis: {
                direction: direction,//'clockwise'||'counterclockwise'
                rotation: start,
                tickmode: 'array',
                ticktext: $ad.HouseName,
                tickvals: radix2D.chart.out.cusps,
            },
            radialaxis: {
                visible: false,
                range: [0, 1],
            }
        },
    };
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
            fillcolor: $ad.zodiac.color[i], //'white'||config.zodiac.color[i],
            showlegend: false,
            line: {
                color: $ad.zodiac.color[i], //'black'||config.zodiac.color[i],
                size: 0, //1||0,
            },
            opacity: .15,
            subplot: "polar"//zodiac
        }
    );
    const zodiacHole = {
        name: 'hole',
        type: "scatterpolargl",
        mode: "lines",
        textinfo: 'none',
        hoverinfo: 'none',
        theta: Array.from(Array(361), (el, i) => i),
        r: Array.from(Array(361), (el) => el = 0.7),
        fill: "toself",
        fillcolor: 'white',
        showlegend: false,
        line: {
            color: "#888888"
        },
        opacity: 1,
        subplot: "polar"
    };
    const posRadixPltoArr = (planets, sizePosdeg = 3) => {//radix2D.chart.out.planets
        const objPos={};
        let arrSort = $ad.planetSortByDegree(planets) || [];
        let currentPos = -1;
        arrSort.forEach((el, i) => {
            let pos = ~~(el[1][0] / sizePosdeg);
            pos = (currentPos >= pos) ? (currentPos + 1) : pos;
            objPos[el[0]]=pos*sizePosdeg+sizePosdeg/2;
            currentPos = pos;
        })
        const arrPos = Array.from(planets,(el)=>[el[0],el[1],objPos[el[0]]]);
        return arrPos;
    };
    const radixPls = {
        name: "radix planet",
        mode: 'text',
        type: "scatterpolar",
        r: Array.from(radix2D.chart.out.planets, el => 0.8),
        theta: Array.from(posRadixPltoArr(radix2D.chart.out.planets,4), el => el = el[2]),
        text: Array.from(radix2D.chart.out.planets, el => el = $ad.plSign[el[0]]),
        texttemplate: '%{text}',
        textfont: {
            family: 'monospace',
            size: 14,
        },
        customdata: Array.from(radix2D.chart.out.planets, (el, i) => ($ad.plSign[el[0][0]] + ': ' + $ad.strZod([el[1][0], el[1][1]]).text)),
        hovertemplate: `<b>%{customdata}</b><extra></extra>`,
        showlegend: false,
        subplot: "polar"
    };
    const hoverAsp = (el) => {
        const text = $ad.plSign[el[0][0]] + ` ` + $ad.aspName[el[2].asp] + ` ` + $ad.plSign[el[1][0]] + ` ` + Math.abs(el[2].asp - el[2].degree).toFixed(2) + ` ` + `<br>` +
            $ad.plSign[el[0][0]] + ` ` + $ad.strZod([el[0][1][0], el[0][1][1]]).text + ` ` + el[0][1][1].toFixed(2) + `<br>` +
            $ad.plSign[el[1][0]] + ` ` + $ad.strZod([el[1][1][0], el[1][1][1]]).text + ` ` + el[1][1][1].toFixed(2)
        return text;
    };
    const radixAsp = $ad.aspectRadixArr(radix2D.chart.out.planets, radix2D.chart.set.aspects);
    const traceRadixAsp = [];
    const signRadixAsp = [];
    radixAsp.forEach((aspects, i) => {
        let colors = ($ad.colorAsp[aspects[2].asp]) ? $ad.colorAsp[aspects[2].asp] : 'black';
        const min = Math.min(aspects[0][1][0], aspects[1][1][0]);
        const max = Math.max(aspects[0][1][0], aspects[1][1][0]);
        const aspStart = ((max - min) < 180) ? min : max;
        const theta = aspStart + aspects[2].asp / 2;
        const aspRad = aspects[2].degree * (Math.PI / 360);
        const rRadixAsp = 0.7;//Math.abs(Math.cos(aspRad)) * 0.8;
        const rSignRadixAsp = Math.abs(Math.cos(aspRad)) * rRadixAsp;
        const customdata = hoverAsp(aspects);
        const name = $ad.plSign[aspects[0][0]] + ` ` + aspects[2].asp + ` ` + $ad.plSign[aspects[1][0]];
        if (aspects[2].asp > 0) {
            signRadixAsp.push({
                name: name,
                type: "scatterpolargl",
                mode: "text+markers",
                r: [rSignRadixAsp],
                theta: [theta],
                text: [$ad.aspSign[aspects[2].asp]],
                customdata: [customdata],
                textfont: {
                    color: [colors],
                    family: 'monospace',
                },
                marker: {
                    color: 'white',//colors
                    size: 15
                },
                hoverlabel: {
                    font: {
                        family: 'monospace',
                    },
                },
                subplot: "polar",
                showlegend: false,
                hovertemplate: "<b>%{customdata}</b><extra></extra>",
                textposition: '"middle center"',
                legendgrouptitle: { text: "Aspects" },
            });
        };
        traceRadixAsp.push({
            customdata: [customdata, customdata],
            name: name,
            type: "scatterpolargl",
            mode: "lines",
            r: Array.from(Array(2), (el) => el = rRadixAsp),
            theta: [aspects[0][1][0], aspects[1][1][0]],
            text: Array.from(Array(2), (el) => el = name),
            marker: {
                color: colors,
                size: 5
            },
            line: {
                width: 2,
            },
            hoverlabel: {
                font: {
                    family: 'monospace',
                },
            },
            textinfo: 'none',
            subplot: "polar",
            showlegend: false,
            hovertemplate: "<b>%{customdata}</b><extra></extra>",
            legendgrouptitle: { text: "Aspects" },
        });
    });

    const data = [...zodiacSector, zodiacHole,  radixPls, ...traceRadixAsp, ...signRadixAsp];
    const HTML = document.getElementById(id);
    HTML.textContent = ``;
    Plotly.newPlot(HTML, data, layout, { modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'] });
    HTML.on('plotly_relayout', (e) => {
        if (Object.keys(e).length < 3) {
            layout.polar.radialaxis.range = [0, 1];
            layout.polar.angularaxis.rotation = 0;
            Plotly.relayout(HTML, layout);
        }
    });

}