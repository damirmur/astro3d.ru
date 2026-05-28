const monthGraph = (id, calendar2D) => {
    const HTML = document.getElementById(id);
    let plsPeriod = calendar2D.out.planets;
    let speedPeriod = calendar2D.out.speed;
    const data0 = calendar2D.dateStart - (calendar2D.dateEnd - calendar2D.dateStart) * 1 //;config.hole;//0
    const periodEnd = calendar2D.out.date.length - 1;
    const start = Number(defA3D.rotate);
    const rImagesX = .2;
    const rImagesY = rImagesX * 0.9;
    const zodiacImages = Array.from(Array(12), (el, i) =>
        el = {
            "source": '/img/zodiac/' + String(i) + '.png',
            "x": .3 + rImagesX * Math.cos(((defA3D.direction == "clockwise") ? -start : start) * Math.PI / 180 + Math.PI / 6 * i + Math.PI / 12),
            "y": .755 + ((defA3D.direction == "clockwise") ? (- (rImagesY * Math.sin((-start) * Math.PI / 180 + Math.PI / 6 * i + Math.PI / 12))) : ((rImagesY * Math.sin(start * Math.PI / 180 + Math.PI / 6 * i + Math.PI / 12)))),
            "sizex": .04,
            "sizey": .04,
            "xanchor": "center",
            "yanchor": "middle",
            opacity: 0.6,
        }
    );
    const layout = {
        height: 700,
        width: 700,
        images: zodiacImages,
        margin: { t: 20, b: 30, l: 0, r: 0 },
        polar: {
            domain: {
                x: [0, 0.6],
                y: [0.51, 1]
            },
            font: {
                family: 'monospace',
                size: 15,
            },
            radialaxis: {
                autorange: false,
                range: [data0, calendar2D.dateEnd],
                tickfont: {
                    size: 12
                },
                showticklabels: false,
                layer: 'below traces',
                angle: 90,
            },
            angularaxis: {
                autorange: false,
                visible: false,
                direction: defA3D.direction,//"clockwise",
                rotation: (defA3D.direction == "clockwise") ? (((defA3D.rotate == '90') || (defA3D.rotate == '270')) ? (Number(defA3D.rotate) + 90) : defA3D.rotate) : defA3D.rotate,
            },
        },
        yaxis: {
            domain: [0, 0.5],
            anchor: 'free',
            position: 1,
            autoshift: true,
            showgrid: true,
            zeroline: false,
            autorange: false,
            gridwidth: 1,
            gridcolor: '#000',
            layer: "below traces",
            ticklabelposition: "outside",//"outside" | "inside" | "outside top" | "inside top" | "outside left" | "inside left" | "outside right" | "inside right" | "outside bottom" | "inside bottom"
            tickfont: {
                color: 'rgb(0, 0, 0)',
                size: 14,
                family: 'monospace',
            },
            side: 'right',
        },
        yaxis2: {
            domain: [0, 0.5],
            anchor: 'free',
            position: .94,
            autorange: false,
            autoshift: true,
            showgrid: true,
            zeroline: false,
            ticklabelposition: "inside",
            tickfont: {
                color: 'rgb(0, 0, 0)',
                size: 14,
                family: 'monospace',
            },
            side: 'right',
        },
        xaxis: {//aspects
            domain: [0, 1],
            autoshift: true,
            autorange: true,
            showline: false,
            zeroline: false,
        },
        yaxis3: {//legend
            domain: [0.51, 1],
            anchor: 'free',
            autoshift: true,
            showgrid: false,
            visible: false,
            fixedrange: true,
            autorange: "reversed",

            tickfont: {
                color: 'rgb(0, 0, 0)',
                size: 14,
                family: 'monospace',
            },
            side: 'right',
        },
        xaxis2: {//legend
            visible: false,
            domain: [0.5, 1],
            autoshift: true,
            autorange: true,
            side: 'left',
        },

    };
    let plotly = Plotly.react(HTML, [], layout, { modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'] });
    const degZS = 31;
    const zodiacSector = Array.from(Array(12), (elz, i) =>
        elz = {
            type: "scatterpolargl",
            mode: "lines",
            name: 'zodiacSector',
            textinfo: 'none',
            hoverinfo: 'skip',
            theta: [30 * i, ...Array.from(Array(degZS), (el, y) => el = 30 * i + y), ...Array.from(Array(degZS), (el, y) => el = 30 * (i + 1) - y)],
            r: [new Date(calendar2D.dateStart).toJSON(), ...Array.from(Array(degZS), (el) => el = new Date(calendar2D.dateEnd).toJSON()), new Date(calendar2D.dateStart).toJSON()],
            fill: "toself",
            fillcolor: $ad.zodiac.color[i], //'white'||config.zodiac.color[i],
            showlegend: false,
            line: {
                color: $ad.zodiac.color[i], //'black'||config.zodiac.color[i],
                size: 0, //1||0,
            },
            opacity: .3,
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
        r: Array.from(Array(361), (el) => el = new Date(calendar2D.dateStart).toJSON()),
        fill: "toself",
        fillcolor: 'white',
        showlegend: false,
        line: {
            color: "#888888"
        },
        opacity: 1,
        subplot: "polar"
    };
    const chartName = {
        type: "scatterpolargl",
        name: 'chartName',
        mode: 'markers+text',//'markers+text'|'text'
        marker: {
            color: 'white',
            size: 15
        },
        textfont: {
            family: 'monospace',
            size: 14
        },
        theta: [0],
        r: [data0],
        text: [new Date(calendar2D.year, calendar2D.month - 1, 2).toLocaleDateString(defA3D.locale, { year: "numeric", month: "long" })],
        textposition: "middle center",
        texttemplate: `%{text}`,
        showlegend: false,
        hoverinfo: 'none',
        subplot: "polar",
    };
    const periodsPl = [];
    for (const key in plsPeriod) {
        const trace = {
            type: "scatterpolargl",
            mode: "markers+lines",//"markers+lines"
            name: $ad.plSign[key],
            theta: plsPeriod[key],
            r: calendar2D.out.date,
            hoverlabel: {
                font: {
                    family: 'monospace',
                }
            },
            line: {
                width: 2,
            },
            marker: {
                size: 1
            },
            hoverinfo: 'none',
            showlegend: false,
            subplot: "polar"
        };
        periodsPl.push(trace);
    };
    const posRadixPltoArr = (planets, sizePosdeg = 3) => {
        const objPos = {};
        let currentPos = -1;
        $ad.planetSortByDegree(planets).forEach((el, i) => {
            let pos = ~~(el[1][0] / sizePosdeg);
            pos = (currentPos >= pos) ? (currentPos + 1) : pos;
            objPos[el[0]] = pos * sizePosdeg + sizePosdeg / 2;
            currentPos = pos;
        })
        const arrPos = Array.from(planets, (el) => objPos[el[0]]);
        return arrPos;
    };
    const radixPls = {
        type: "scatterpolargl",
        name: new Date(calendar2D.out.date[0]).toJSON().slice(0, 16),
        mode: 'markers+text',//'markers+text'|'text'
        marker: {
            color: 'white',
            size: 15
        },
        textfont: {
            family: 'monospace',
            size: 14
        },
        theta: posRadixPltoArr(Array.from(calendar2D.planets, (el, i) => [el, [plsPeriod[el][periodEnd], speedPeriod[el][periodEnd]]]), 6),
        r: Array.from(calendar2D.planets, (el) => (calendar2D.dateStart - data0) * 1.9 + data0),
        text: Array.from(calendar2D.planets, (el) => $ad.plSign[el]),
        textposition: "middle center",
        // texttemplate: `<b>%{text}</b>`,//type: "scatterpolargl"
        texttemplate: `%{text}`,
        showlegend: false,
        hoverinfo: 'none',
        subplot: "polar",
    };
    const piePromiss = new Promise((resolve, reject) => {
        resolve([...zodiacSector, zodiacHole, ...periodsPl, chartName, radixPls]);
        reject(undefined);
    });
    const aspectsPromiss = (calendar2D) => {
        const exactAspects = (traceAspectsPls) => {

        }
        const data = [];
        return $ad.aspectsPeriod(calendar2D)
            .then((traceAspectsPls) => {
                const tickvals1 = [];
                const ticktext1 = [];
                const tickvals2 = [];
                const ticktext2 = [];
                let y = 1;
                let r = 1;
                let traces = {};
                const traceAspects = traceAspectsPls['aspects'];
                for (const keyR in traceAspects) {
                    for (const keyT in traceAspects[keyR]) {
                        tickvals1.push(r);
                        tickvals2.push(r);
                        if (y == 1) {
                            ticktext1.push($ad.plSign[keyR] + '.' + $ad.plSign[keyT]); //
                            ticktext2.push(''); //
                        } else {
                            ticktext1.push(''); //
                            ticktext2.push($ad.plSign[keyR] + '.' + $ad.plSign[keyT]); //
                        };
                        const arr = traceAspects[keyR][keyT];
                        const pos = arr.map((x) => (x.asp > -360) ? r : x);
                        const color = arr.map((x) => (x.asp > -360) ? $ad.colorAsp[x.asp] : x);
                        traces[r] = { 'pos': pos, 'colors': color };
                        data.push(
                            {
                                type: "scattergl",
                                mode: 'markers',
                                name: 'aspects',
                                showlegend: false,
                                x: traceAspectsPls.date,
                                y: pos,
                                hoverinfo: 'none',
                                marker: {
                                    color: color,
                                    size: 3,
                                },
                                xaxis: 'x',
                                yaxis: 'y' + String(y),
                            });
                        for (let i = 1; i < arr.length - 1; i++) {
                            if ((!arr[i].asp)&&(arr[i].asp<0)) { continue };
                            const current = Math.abs(arr[i].deg - arr[i].asp);
                            let previous = (arr[i - 1].asp) ? (Math.abs(arr[i - 1].deg - arr[i - 1].asp)) : 20;
                            let next = (arr[i + 1].asp) ? (Math.abs(arr[i + 1].deg - arr[i + 1].asp)) : 20;
                            if ((current < previous) && (current < next)) {
                                if (current < 0.5) {
                                    data.push(
                                        {
                                            type: "scattergl",
                                            mode: 'markers',
                                            name: 'aspects',
                                            showlegend: false,
                                            x: [traceAspectsPls.date[i]],
                                            y: [r],
                                            hoverinfo: 'none',
                                            marker: {
                                                color: $ad.colorAsp[arr[i].asp],
                                                size: 6,
                                            },
                                            xaxis: 'x',
                                            yaxis: 'y' + String(y),
                                        });
                                };
                            }
                        };
                        r = r + 1;
                        y = (y == 1) ? 2 : 1;
                    };
                };
                HTML.layout.yaxis.tickvals = tickvals1;
                HTML.layout.yaxis.ticktext = ticktext1;
                HTML.layout.yaxis2.tickvals = tickvals2;
                HTML.layout.yaxis2.ticktext = ticktext2;
                HTML.layout.yaxis.range = [r, 0];
                HTML.layout.yaxis2.range = [r, 0];
                Plotly.relayout(HTML, HTML.layout);
                return data;
            });
    };
    const fontsize = (layout.width < 700) ? 11 : 14;
    let legendSize = 2 + calendar2D.planets.length + calendar2D.aspects.length;
    let legendText = Array.from(calendar2D.planets, (el, i) => ($ad.plSign[el] + ` - ` + defA3D.i18n.planets[el]));
    legendText.unshift('');
    legendText.unshift('Astro3D.ru');
    legendText = legendText.concat(Array.from(calendar2D.aspects, (el, i) => ($ad.aspSign[el] + ` - ` + defA3D.i18n.aspects[el] + `(` + el + `)`)));
    let legendX = Array.from(Array(legendSize), (el) => el = 0.1);
    let legendY = Array.from(Array(legendSize), (el, i) => el = i);
    let legendColor = ['#8900FF', '#000', ...Array.from(calendar2D.planets, (el) => '#000'), ...Array.from(calendar2D.aspects, (el) => $ad.colorAsp[el])];

    const legendTableTrace = {
        text: legendText,
        x: legendX,
        y: legendY,
        texttemplate: `<b>%{text}</b>`,
        textposition: 'middle right',
        type: 'scatter',
        mode: "text",//"lines+markers+text"
        hoverinfo: 'none',
        xaxis: 'x2',
        yaxis: 'y3',
        showlegend: false,
        textfont: {
            family: 'monospace',
            color: legendColor,
            size: fontsize,
        },
    };
    const legendPromiss = new Promise((resolve, reject) => {
        resolve([legendTableTrace]);
        reject(undefined);
    });

    Promise.all([piePromiss, aspectsPromiss(calendar2D), legendPromiss]).then((res) => {
        const dataPlotly = [...res[0], ...res[1], ...res[2]];
        Plotly.addTraces(HTML, dataPlotly);
    });
    // let img = document.querySelector('#jpg-export');
    // plotly.then(
    //     (gd) => {
    //         //            Plotly.toImage(gd, { format: 'jpeg' })
    //         Plotly.toImage(gd, { format: 'svg' })
    //             .then(
    //                 (url) => {
    //                     img.setAttribute("src", url);
    //                 }
    //             )
    //     });
    HTML.on('plotly_relayout', (e) => {
        if (Object.keys(e).length < 3) {
            layout.polar.radialaxis.range = [data0, calendar2D.dateEnd];
            layout.polar.angularaxis.rotation = (defA3D.direction == "clockwise") ? (((defA3D.rotate == '90') || (defA3D.rotate == '270')) ? (Number(defA3D.rotate) + 90) : defA3D.rotate) : defA3D.rotate;
            Plotly.relayout(HTML, layout);
        }
    });

}