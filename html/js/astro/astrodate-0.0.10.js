/**
* Copyright 2023, Muratov Damir.
*astro3d.ru
* https://github.com/damirmur/
* All rights reserved.
* Licensed under the MIT license
v 0.0.10
*/
((($ad) => {

    //Constants

    $ad.zod = {
        "0": { "name": "aries", "sign": "♈&#xfe0e;", "cross": "cardinal", "elements": "fire", "zones": "сreation", "quadrants": "childhood" },
        "1": { "name": "taurus", "sign": "♉&#xfe0e;", "cross": "fixed", "elements": "earth", "zones": "сreation", "quadrants": "childhood" },
        "2": { "name": "gemini", "sign": "♊&#xfe0e;", "cross": "mutable", "elements": "air", "zones": "сreation", "quadrants": "childhood" },
        "3": { "name": "cancer", "sign": "♋&#xfe0e;", "cross": "cardinal", "elements": "water", "zones": "сreation", "quadrants": "youth" },
        "4": { "name": "leo", "sign": "♌&#xfe0e;", "cross": "fixed", "elements": "fire", "zones": "stability", "quadrants": "youth" },
        "5": { "name": "virgo", "sign": "♍&#xfe0e;", "cross": "mutable", "elements": "earth", "zones": "stability", "quadrants": "youth" },
        "6": { "name": "libre", "sign": "♎&#xfe0e;", "cross": "cardinal", "elements": "air", "zones": "stability", "quadrants": "maturity" },
        "7": { "name": "scorpio", "sign": "♏&#xfe0e;", "cross": "fixed", "elements": "water", "zones": "stability", "quadrants": "maturity" },
        "8": { "name": "sagittarius", "sign": "♐&#xfe0e;", "cross": "mutable", "elements": "fire", "zones": "transformation", "quadrants": "maturity" },
        "9": { "name": "capricorn", "sign": "♑&#xfe0e;", "cross": "cardinal", "elements": "earth", "zones": "transformation", "quadrants": "oldness" },
        "10": { "name": "aquarius", "sign": "♒&#xfe0e;", "cross": "fixed", "elements": "air", "zones": "transformation", "quadrants": "oldness" },
        "11": { "name": "pisces", "sign": "♓&#xfe0e;", "cross": "mutable", "elements": "water", "zones": "transformation", "quadrants": "oldness" },
        get(num) { return $ad.zod[num] },
        color(num) { return $ad.zodСolor[num] },
        name(num) { return $ad.zod[num].name },
        sign(num) { return $ad.zod[num].sign },
        emoji(num) { return $ad.zodEmoji[num] },
    };
    $ad.zodСolor = { 0: '#590000', 1: '#592800', 2: '#003535', 3: '#004700', 4: '#590000', 5: '#592800', 6: '#003535', 7: '#004700', 8: '#590000', 9: '#592800', 10: '#003535', 11: '#004700' }
    $ad.zodName = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libre', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
    $ad.zodSign = ['♈&#xfe0e;', '♉&#xfe0e;', '♊&#xfe0e;', '♋&#xfe0e;', '♌&#xfe0e;', '♍&#xfe0e;', '♎&#xfe0e;', '♏&#xfe0e;', '♐&#xfe0e;', '♑&#xfe0e;', '♒&#xfe0e;', '♓&#xfe0e;'];
    $ad.zodEmoji = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
    $ad.zodStatistic = {};
    $ad.zodStatistic['quadrants'] = { 'childhood': [0, 1, 2], 'youth': [3, 4, 5], 'maturity': [6, 7, 8], 'oldness': [9, 10, 11] };
    $ad.zodStatistic['zones'] = { 'сreation': [0, 1, 2, 3], 'stability': [4, 5, 6, 7], 'transformation': [8, 9, 10, 11] };
    $ad.zodStatistic['elements'] = { 'fire': [0, 4, 8], 'earth': [1, 5, 9], 'air': [2, 6, 10], 'water': [3, 7, 11], };
    $ad.zodStatistic['cross'] = { 'cardinal': [0, 3, 6, 9], 'fixed': [1, 4, 7, 10], 'mutable': [2, 5, 8, 11] };
    $ad.zodiac = {
        sign: [],
        name: [],
        color: [],
        degree: [],
        emoji: [],
    };
    for (const [key, value] of Object.entries($ad.zod)) {
        $ad.zodiac.sign[key] = value.sign;
        $ad.zodiac.emoji[key] = $ad.zodEmoji[key];
        $ad.zodiac.name[key] = value.name;
        $ad.zodiac.color[key] = $ad.zod.color(key);
        $ad.zodiac.degree[key] = Number(key) * 30;
    };
    $ad.plName = {
        '0': 'Sun',
        '1': 'Moon',
        '2': 'Mercury',
        '3': 'Venus',
        '4': 'Mars',
        '5': 'Jupiter',
        '6': 'Saturn',
        '7': 'Uranus',
        '8': 'Neptune',
        '9': 'Pluto',
        '10': 'mean Node',
        '11': 'North Node',//'true Node'
        '12': "Lilith",//'mean Apogee',
        '13': 'osc. Apogee',
        '14': 'Earth',
        get(num) { return $ad.plName[num] }
    };
    $ad.plSign = {
        0: '☉', 1: '☽', 2: '☿', 3: '♀', 4: '♂', 5: '♃', 6: '♄', 7: '♅', 8: '♆', 9: '♇', 11: '☊', 12: '⚸', 14: '♁', 15: '⚷', 16: '&#11227;', 17: '⚳', 18: '⚴', 19: '⚵', 20: '⚶',
        get(num) { return $ad.plSign[num] },
        name(num) { return $ad.plName[num] }
    };
    $ad.plSignChort = {
        0: '☉', 1: '☽', 2: '☿', 3: '♀', 4: '♂', 5: '♃', 6: '♄', 7: '♅', 8: '♆', 9: '♇', 11: '☊', 12: '⚸', 14: '♁',
        get(num) { return $ad.plSign[num] },
        name(num) { return $ad.plName[num] }
    };
    $ad.aspSign = {
        0: '☌', 30: '⚺', 45: '∠', 60: '⚹', 72: '⬠', 90: '☐', 120: '∆', 135: '⚼', 150: '⚻', 180: '☍',
        get(num) { return $ad.aspSign[num] }
    };
    $ad.aspName = {
        0: 'Conjunction', 30: 'Semisextile', 45: 'Semisquare', 60: 'Sextile', 72: 'Quintile', 90: 'Square', 120: 'Trine', 135: 'Trioctile', 150: 'Quincunx', 180: 'Opposition',
        get(name) { return $ad.aspSign[name] }
    };
    $ad.colorAsp = { 0: "#0000FF", 60: "#00FF7F", 90: '#FF0000', 120: "#006400", 180: "#8B0000" };

    $ad.plType = {
        sun: [0], //Luminaries Sun
        moon: [1], //Luminaries Moon
        mvmjs: [2, 3, 4, 5, 6], // Mercury,Venus,Mars,Jupiter,Saturn 
        unp: [7, 8, 9], // Uranus,Neptune,Pluto
        get(num) {
            for (const [key, arrvalue] of Object.entries($ad.plType)) {
                if (!Array.isArray(arrvalue)) continue;
                if (arrvalue.includes(num)) return key;
            }
            return 'other';
        }
    };
    $ad.plOrb = { 0: 'sun', 1: 'moon', 2: 'mvmjs', 3: 'mvmjs', 4: 'mvmjs', 5: 'mvmjs', 6: 'mvmjs', 7: 'unp', 8: 'unp', 9: 'unp', 14: 'earth' };
    $ad.aspOrb = {};
    $ad.aspMaxOrb = 10;
    $ad.aspOrb.sun = { 0: 10, 60: 6, 90: 8, 120: 10, 180: 10, 30: 1, 72: 1, 135: 1, 150: 1, 45: 1 };
    $ad.aspOrb.moon = { 0: 10, 60: 6, 90: 8, 120: 10, 180: 10, 30: 1, 72: 1, 135: 1, 150: 1, 45: 1 };
    $ad.aspOrb.mvmjs = { 0: 5, 60: 5, 90: 5, 120: 5, 180: 5, 30: 1, 72: 1, 135: 1, 150: 1, 45: 1 };
    $ad.aspOrb.unp = { 0: 5, 60: 5, 90: 5, 120: 5, 180: 5, 30: 1, 72: 1, 135: 1, 150: 1, 45: 1 };
    $ad.aspOrb.earth = { 0: 10, 60: 6, 90: 8, 120: 10, 180: 10, 30: 1, 72: 1, 135: 1, 150: 1, 45: 1 };

//    $ad.aspOrb.earth = { 0: -1, 60: -1, 90: -1, 120: -1, 180: -1, 30: -1, 72: -1, 135: -1, 150: -1, 45: -1 };
    $ad.aspOrb.other = { 0: 1, 60: 1, 90: 1, 120: 1, 180: 1, 30: 1, 72: 1, 135: 1, 150: 1, 45: 1 };
    $ad.aspOrb.get = ((key) => { return $ad.aspOrb[key] });
    $ad.aspOrbT = {};
    $ad.aspOrbT.sun = { 0: 2, 60: 2, 90: 2, 120: 2, 180: 2, 30: 0.5, 72: 0.5, 135: 0.5, 150: 0.5, 45: 0.5 };
    $ad.aspOrbT.moon = { 0: 5, 60: 5, 90: 5, 120: 5, 180: 5, 30: 0.5, 72: 0.5, 135: 0.5, 150: 0.5, 45: 0.5 };
    $ad.aspOrbT.mvmjs = { 0: 1, 60: 1, 90: 1, 120: 1, 180: 1, 30: 0.5, 72: 0.5, 135: 0.5, 150: 0.5, 45: 0.5 };
    $ad.aspOrbT.unp = { 0: 1, 60: 1, 90: 1, 120: 1, 180: 1, 30: 0.5, 72: 0.5, 135: 0.5, 150: 0.5, 45: 0.5 };
//    $ad.aspOrbT.earth = { 0: -1, 60: -1, 90: -1, 120: -1, 180: -1, 30: -1, 72: -1, 135: -1, 150: -1, 45: -1 };
    $ad.aspOrbT.other = { 0: 1, 60: 1, 90: 1, 120: 1, 180: 1, 30: 0.5, 72: 0.5, 135: 0.5, 150: 0.5, 45: 0.5 };
    $ad.aspOrbT.get = ((key) => { return $ad.aspOrbT[key] });
    $ad.aspDivergent = 0.66;

    $ad.HouseName = ['Asc', 'II', 'III', 'IC', 'V', 'VI', 'Ds', 'VIII', 'IX', 'Mc', 'XI', 'XII'];
    $ad.nameHouseSystem = {
        "A": "equal",
        "B": "Alcabitius",
        "C": "Campanus",
        "G": "Gauquelin sectors",
        "H": "horizon/azimut",
        "K": "Koch",
        "M": "Morinus",
        "O": "Porphyry",
        "P": "Placidus",
        "R": "Regiomontanus",
        "T": "Polich/Page",
        "U": "Krusinski-Pisa-Goelzer",
        "W": "equal/ whole sign",
        "X": "axial rotation system/Meridian houses",
        "Y": "APC houses",
    };
    steward = {
        0: 4, 1: 3, 2: 2, 3: 1, 4: 0, 5: 2, 6: 3, 7: 9, 8: 5, 9: 6, 10: 7, 11: 8,
        get: (numZod => { return steward[numZod] })
    };
    //Function
    $ad.moonDay=(date) => {
        const [, d, m, y] = /(\d{2}).(\d{2}).(\d{4})/.exec(date);
        return (((Number(y)-2000)%19+6)*11-14+Number(m)+Number(d))%30
    };

    $ad.formatStringToDate = (date, f = 'dmy') => {
        let outDate = new Date();
        outDate = new Date(outDate).setUTCHours(0, 0, 0, 0);
        switch (f) {
            case 'dmy':
                {
                    const [, d, m, y] = /(\d{2}).(\d{2}).(\d{4})/.exec(date);
                    outDate = new Date().setUTCFullYear(Number(y), Number(m) - 1, Number(d));
                    outDate = new Date(outDate).setUTCHours(0, 0, 0, 0);
                    break;
                }
            case 'mdy':
                {
                    const [, m, d, y] = /(\d{2}).(\d{2}).(\d{4})/.exec(date);
                    outDate = new Date().setUTCFullYear(Number(y), Number(m) - 1, Number(d));
                    outDate = new Date(outDate).setUTCHours(0, 0, 0, 0);
                    break;
                }
            case 'ymd':
                {
                    const [, y, m, d] = /(\d{4}).(\d{2}).(\d{2})/.exec(date);
                    outDate = new Date().setUTCFullYear(Number(y), Number(m) - 1, Number(d));
                    outDate = new Date(outDate).setUTCHours(0, 0, 0, 0);
                    break;
                }
            case 'mdyhm':
                {
                    const [, m, d, y, h, min] = /(\d{2}).(\d{2}).(\d{4}).(\d{2}).(\d{2})/.exec(date);
                    outDate = new Date().setUTCFullYear(Number(y), Number(m) - 1, Number(d));
                    outDate = new Date(outDate).setUTCHours(h, min, 0, 0);
                    break;
                }
            case 'dmyhm':
                {
                    const [, d, m, y, h, min] = /(\d{2}).(\d{2}).(\d{4}).(\d{2}).(\d{2})/.exec(date);
                    outDate = new Date().setUTCFullYear(Number(y), Number(m) - 1, Number(d));
                    outDate = new Date(outDate).setUTCHours(h, min, 0, 0);
                    break;
                }
            case 'ymdhm':
                {
                    const [, y, m, d, h, min] = /(\d{4}).(\d{2}).(\d{2}).(\d{2}).(\d{2})/.exec(date);
                    outDate = new Date().setUTCFullYear(Number(y), Number(m) - 1, Number(d));
                    outDate = new Date(outDate).setUTCHours(h, min, 0, 0);
                    break;
                }
            default:
                break;
        };
        return new Date(outDate).toJSON();
    };
    $ad.toFirstUpperCase =(word)=>{
        return word.charAt(0).toUpperCase()+ word.slice(1)
    };
    $ad.textTZMinToHour = ((tzmin) => {
        let tzM = tzmin;
        let str = '';
        let zn = '';
        if (tzM <= 0) { zn = '+' };
        if (tzM > 0) { zn = '-' };
        tzM = Math.abs(tzM);
        let hh = parseInt(tzM / 60);
        let mm = parseInt(tzM % (hh * 60)) || 0;
        str = zn + str + hh.toString().padStart(2, "0") + ':' + mm.toString().padStart(2, "0");
        return str
    });
    $ad.mapHouseName = (async () => {
        let res = await net.postJSON('/mapHouseName');
        ad.housesNames = res;
        return res;
    })
    // text info
    $ad.zeroPadded = (val) => {
        return (val >= 10) ? String(val) : ('0' + String(val));
    };
    spacePadded = (val) => {
        return (val >= 10) ? String(val) : ('&nbsp' + String(val));
    };
    $ad.strZod = ([degree, speed = 100]) => {
        const result = {};
        let deg = ~~(degree % 30);
        let sign = ~~(degree / 30);
        let minFrac = degree % 1;
        let min = ~~(degree % 1 * 60);
        let sec = ~~(degree % 1 * 60 % 1 * 60);
        let retro = (speed < 0) ? 'R' : '';
        result.text = $ad.zeroPadded(deg) + ($ad.zod[sign].sign) + $ad.zeroPadded(min) + "'" + $ad.zeroPadded(sec) + '"' + retro;//
        result.textemoji = $ad.zeroPadded(deg) + ($ad.zodEmoji[sign]) + $ad.zeroPadded(min) + "'" + $ad.zeroPadded(sec) + '"' + retro;//
        result.textDegSignMin = $ad.zeroPadded(deg) + ($ad.zod[sign].sign) + $ad.zeroPadded(min) + "'";//
        result.textDegSignMinEmj = $ad.zeroPadded(deg) + ($ad.zodEmoji[sign]) + $ad.zeroPadded(min) + "'";//
        result.textSpeed =((speed<0)?'-':' ')+ $ad.zeroPadded(~~speed) + '°' + $ad.zeroPadded(Math.abs(~~(speed % 1 * 60))) + "'" + $ad.zeroPadded(Math.abs(~~(speed % 1 * 60 % 1 * 60))) + '"';//
        result.deg = deg;
        result.numSign = sign;
        result.sign = sign;
        result.min = min;
        result.sec = sec;
        result.retro = retro;
        return (result);
    };
    $ad.hourToTime=(h)=>{
        return $ad.zeroPadded(~~h) + ':' + $ad.zeroPadded(~~(h % 1 * 60)) + ":" + $ad.zeroPadded(~~(h % 1 * 60 % 1 * 60))
    };
    $ad.hexToRGB=(hex,alpha)=>{
        if(!hex){hex='#808080'};
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        if (alpha) {
            return `rgba(` + r + `,` + g + `,` + b + `,` + alpha + `)`;
        } else {
            return `rgb(` + r + `,` + g +`,` + b + `)`;
        }
    };
    //$ad.plsToHouses({[numPl,[longitude,longitudeSpeed]],[degH ...]}=>[[numH,numPl], ...])
    $ad.plsToHouses = ((astroResult) => {
        let arr = [];
        $ad.planetSortByDegree(astroResult.planets).forEach((pl) => {
            arr.push([$ad.plToHouse(pl[1][0], astroResult.cusps), pl[0]]);
        })
        arr.sort((a, b) => a[0] - b[0]);
        return arr;
    });
    //plsToElsCrs(plsArr=[numPl,[longitude,longitudeSpeed]])=>[[[numPl,numPl...], [], [], []], ...]
    $ad.plsToElsCrs = ((arrPls) => {
        const arrElsCrs = [[0, 9, 6, 3], [4, 1, 10, 7], [8, 5, 2, 11]];
        let arrStat = [[[], [], [], []], [[], [], [], []], [[], [], [], []]];;
        arrPls.forEach(pl => {
            if ($ad.plStatistic.includes(pl[0])) {
                let sign = ~~(pl[1][0] / 30);
                for (let i = 0; i < arrElsCrs.length; i++) {
                    for (let j = 0; j < arrElsCrs[i].length; j++) {
                        if (sign === arrElsCrs[i][j]) {
                            arrStat[i][j].push(pl[0]);
                        }
                    }
                }
            }
        })
        return arrStat;
    })
    // AstroStatistic
    $ad.plStatistic = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    $ad.plsToSign = ((arrPls) => {
        const arrPlsInSign = [[], [], [], [], [], [], [], [], [], [], [], []];
        for (const planet in arrPls) {
            const plNum = arrPls[planet][0];
            if ($ad.plStatistic.includes(plNum)) {
                let degree = arrPls[planet][1][0];
                let sign = ~~(degree / 30);
                arrPlsInSign[sign].push(plNum);
            }
        }
        return arrPlsInSign;
    });
    // $ad.zodiac = (() => {
    //     getProp = ((num, obj) => {
    //         for (const [key, arrvalue] of Object.entries(obj)) {
    //             if (!Array.isArray(arrvalue)) continue;
    //             if (arrvalue.includes(num)) { return key };
    //         }
    //     });
    //     objZod = {};
    //     for (let i = 0; i < 12; i++) {
    //         let sign = {};
    //         sign = { name: $ad.zodName[i], sign: $ad.zodSign[i] };
    //         sign.cross = getProp(i, $ad.zodStatistic['cross']);
    //         sign.elements = getProp(i, $ad.zodStatistic['elements']);
    //         sign.zones = getProp(i, $ad.zodStatistic['zones']);
    //         sign.quadrants = getProp(i, $ad.zodStatistic['quadrants']);
    //         objZod[i] = sign;
    //     }
    //     return objZod
    // });

    //Aspects plsAndOrbAspects
    $ad.OrbRadix = (planets = [], aspects = []) => {
        const orbAsp = {};
        planets.forEach((pl) => {
            pl = Number(pl);
            orbAsp[pl] = {};
            aspects.forEach((a) => {
                orbAsp[pl][a] = $ad.aspOrb[$ad.plType.get(pl)][a];
            });
        });
        return orbAsp;
    };
    $ad.OrbTpansit = (planets = [], aspects = []) => {
        const orbAsp = {};
        planets.forEach((pl) => {
            pl = Number(pl);
            orbAsp[pl] = {};
            aspects.forEach((a) => {
                orbAsp[pl][a] = $ad.aspOrbT[$ad.plType.get(pl)][a];
            });
        });
        return orbAsp;
    };


    //aspectRadix(plsArr=[numPl,[longitude,longitudeSpeed]])=>[...[pl0,pl1,asp]]
    $ad.aspectRadix = (chart, aspects) => {
        const plsArr = chart.out['planets'];
        const aspArr = Array.from(aspects||chart.set.aspects, (el) => Number(el)) ;
        let aspPlArr = [];
        plsArr.forEach((el, j) => {
            for (let i = j + 1; i < plsArr.length; i++) {
                let min = Math.min(el[1][0], plsArr[i][1][0]);
                let max =Math.max(el[1][0], plsArr[i][1][0]);
                let degree = max - min;
                degree = (degree > 191) ? (min-max+360) : (degree);
                const objOrbs = $ad.aspOrb[$ad.plType.get(Number(el[0]))];
                for (let [asp, value] of Object.entries(objOrbs)) {
                    if (!(typeof value === 'number')) continue;
                    asp=Number(asp);
                    if (!(aspArr.includes(asp))) continue;
                    if ((degree >= (asp - value)) && (degree <= (asp + value))) {
                        aspPlArr.push([el, plsArr[i], asp]);
                        break;
                    };
                }
            }
        })
        return aspPlArr;
    };
    //aspectRadix(planets=[numPl,[longitude,longitudeSpeed]],aspects=[0,60 ...])=>[...[pl0=[numPl,[longitude,longitudeSpeed]],pl1=[numPl,[longitude,longitudeSpeed]],{'asp':asp,'degree':degree}]]
    $ad.aspectRadixArr = (planets, aspects) => {
        const orb = $ad.OrbRadix(Array.from(planets, (el, i) => planets[i][0]), aspects);
        const aspPlsArr = [];
        planets.forEach((el, j) => {
            for (let i = j + 1; i < planets.length; i++) {
                let min = Math.min(el[1][0], planets[i][1][0]);
                let max =Math.max(el[1][0], planets[i][1][0]);
                let degree = max - min;
                degree = (degree > 191) ? (min-max+360) : (degree);
                for (let [asp, value] of Object.entries(orb[el[0]])) {
                    asp = Number(asp);
                    if ((degree >= (asp - value)) && (degree <= (asp + value))) {
                        aspPlsArr.push([el, planets[i], { 'asp': Number(asp), 'degree': degree }]);
                        break;
                    };
                }
            }
        })
        return aspPlsArr;
    };

    // data=[transit,natal];
    //data=[{set:{aspects:[]},out:{planets:[]}},{set:{aspects:[]},out:{planets:[]}}];
    $ad.aspectRadixTransitChart = (data) => {
        const aspArr = data[1].set.aspects;
        let arrNatal = data[1].out['planets'];
        let arrTransit = data[0].out['planets'];
        let aspPlArr = [];
        arrNatal.forEach((el, j) => {
            arrTransit.forEach((elT, i) => {
                let min = Math.min(el[1][0], elT[1][0]);
                let max =Math.max(el[1][0], elT[1][0]);
                let degree = max - min;
                degree = (degree > 191) ? (min-max+360) : (degree);
                const objOrbs = $ad.aspOrbT[$ad.plType.get(elT[0])];
                for (const [asp, value] of Object.entries(objOrbs)) {
                    if (!(typeof value === 'number')) continue;
                    if (!(aspArr.includes(Number(asp)))) continue;
                    if ((degree >= (Number(asp) - value)) && (degree <= (Number(asp)) + value)) {
                        aspPlArr.push([el, elT, asp]);
                        break;
                    };
                };
            });
        });
        return aspPlArr;
    };
    $ad.aspectRadixPeriod = (natalPls, transitPeriodAndPls, plsAndOrbAspects) => {
        let objPlChart = {};
        natalPls.forEach((el) => {//natal [pl,[deg,speed]]
            objPlChart[el[0]] = {};
            for (let [pl, orbAsp] of Object.entries(plsAndOrbAspects)) { //pl mum pl
                objPlChart[el[0]][pl] = [];
                transitPeriodAndPls.planets[pl].forEach((p) => {//p degree pl
                    let aspNT = undefined;
                    let min = Math.min(el[1][0], p);
                    let max =Math.max(el[1][0], p);
                    let degree = max - min;
                    degree = (degree > 191) ? (min-max+360) : (degree);
                    for (let [asp, value] of Object.entries(orbAsp)) {
                        asp = Number(asp);
                        if ((degree >= (asp - value)) && (degree <= (asp + value))) {
                            aspNT = asp;
                            break;
                        }
                    };
                    objPlChart[el[0]][pl].push(aspNT);
                });
            };
        });
        let traceDefined = { aspects: {} };
        for (const keyR in objPlChart) {
            traceDefined.aspects[keyR] = {};
            for (const keyT in objPlChart[keyR]) {
                let notEmply = (objPlChart[keyR][keyT]).find(el => (!(el == undefined)));
                notEmply = (notEmply >= (-360)) ? true : false;
                if (notEmply) {
                    traceDefined.aspects[keyR][keyT] = objPlChart[keyR][keyT];
                }
            }
        };
        traceDefined['date'] = transitPeriodAndPls['date'];
        return traceDefined;
    };
    $ad.aspectsPeriod = (data) => {
        const planets = Object.keys(data.out.planets);//[]
        const aspects = data.aspects;//[]
        const orbs = $ad.OrbRadix(planets, aspects);//{}
        const plsPeriod = data.out.planets;//{...{pl:[]}}
        let objPlChart = {};
        let pls0 = planets.toReversed();
        pls0.forEach((num, j) => {//num - planets numer
            objPlChart[num] = {};
            for (let i = 0; i < (planets.length - 1 - j); i++) {
                objPlChart[num][planets[i]] = [];
                for (let d = 0; d < plsPeriod[planets[0]].length; d++) {
                    let min = Math.min(plsPeriod[num][d], plsPeriod[planets[i]][d]);
                    let max = Math.max(plsPeriod[num][d], plsPeriod[planets[i]][d]);
                    let degree = max - min;
                    degree = (degree > 191) ? (min - max + 360) : (degree);
                    let aspPP = undefined;
                    for (let [asp, value] of Object.entries(orbs[num])) {
                        asp = Number(asp);
                        if ((degree >= (asp - value)) && (degree <= (asp + value))) {
                            aspPP = asp;
                            break;
                        };
                    };
                    objPlChart[num][planets[i]].push({asp:aspPP,deg:degree});
                }
            };
        });
        let traceDefined = { aspects: {} };
        for (const keyR in objPlChart) {
            traceDefined.aspects[keyR] = {};
            for (const keyT in objPlChart[keyR]) {
                let notEmply = (objPlChart[keyR][keyT]).find(el => ((el.asp != undefined)));
                // notEmply = (notEmply.asp >= (-360)) ? true : false;
                if (notEmply) {
                    traceDefined.aspects[keyR][keyT] = objPlChart[keyR][keyT];
                }
            }
        };
        traceDefined['date'] = data.out['date'];
        return new Promise((resolve, reject) => {
            resolve(traceDefined);
            reject(undefined);
        });
    };
    //Planets
    //planetSortByDegree([numPl,[longitude,longitudeSpeed]]=>sortByLongitude return [numPl,[longitude,longitudeSpeed]])
    $ad.planetSortByDegree = ((arrPls) => {
        const arr = [...arrPls];
        return arr.sort((a, b) => a[1][0] - b[1][0]);
    });
    //planetsSortByNum([numPl,[longitude,longitudeSpeed]]=>planetsSortByNum return [numPl,[longitude,longitudeSpeed]])
    $ad.planetsSortByNum = ((arrPls) => {
        const arr = [...arrPls];
        return arr.sort((a, b) => a[0] - b[0]);
    })

    //plsToObj([numPl,[longitude,longitudeSpeed]]=>[numPl:{name,sign,...etc.}])
    $ad.plsToObj = ((arrPl = []) => {
        let obj = {};
        arrPl.forEach(function (item) {
            obj[item[0]] = {
                sign: $ad.plSign[item[0]],
                name: $ad.plName.get(item[0]),
                degtext: $ad.strZod(item[1]),
                zod: $ad.zod[$ad.strZod(item[1]).numSign],
                loc: item[1],
                asp: $ad.aspOrb[$ad.plType.get(item[0])],
                aspT: $ad.aspOrbT[$ad.plType.get(item[0])],
                //              house: $ad.plToHouse(item[1][0], houses),
            };
        })
        return obj;
    })
    //plToHouse((degPl,[degH ...])=>numHouse)

    $ad.plToHouse = ((degPl, houses = []) => {
        let length = houses.length;
        for (let i = 0; i < length; i++) {
            let next = (i < (length - 1)) ? (i + 1) : 0;
            //norma
            let hn = houses[next];
            let dp = degPl;
            if (houses[i] > houses[next]) {
                hn = houses[next] + 360;
                dp = (degPl >= houses[i]) ? degPl : degPl + 360;
            }
            if (dp >= hn) {
                continue;
            }
            else if (dp >= houses[i]) {
                return i;
            }
        }
        return -1;
    });
    $ad.stringLatLng = ((lat, lng) => {
        let stringLat = Number(lat).toFixed(2).replace('.', ((Number(lat) > 0) ? 'N' : 'S'));
        let stringLng = Number(lng).toFixed(2).replace('.', ((Number(lng) > 0) ? 'E' : 'W'));
    return stringLat + ',' + stringLng
    });

    // table text HTNL info


    $ad.tooltipEl = ((val, tooltiptext, elType = 'div') => {
        const el = document.createElement(elType);
        el.innerHTML = val;
        el.classList.add("tooltip");
        const span = document.createElement("span");
        span.classList.add("tooltiptext");
        span.innerHTML = tooltiptext;
        el.appendChild(span);
        return el
    })

    $ad.tablePlanets = ((arrPls) => {
        const elTab = document.createElement('table');
        elTab.classList.add('tablePlanets');
        for (const planet in arrPls) {
            const elTr = document.createElement('tr');
            const elPl = document.createElement('td');
            const plNum = arrPls[planet][0];
            elPl.appendChild($ad.tooltipEl($ad.plSign.get(plNum), $ad.plSign.name(plNum)))
            elTr.appendChild(elPl);
            const eldegree = document.createElement('td');
            eldegree.innerHTML = $ad.strZod(arrPls[planet][1]).text;
            elTr.appendChild(eldegree);
            elTab.appendChild(elTr);
        }
        return elTab;
    });
    $ad.tableHouses = ((arrCusps) => {
        const elTab = document.createElement('table');
        elTab.classList.add('tableHouses');
        for (let i = 0; i < arrCusps.length; i++) {
            const elTr = document.createElement('tr');
            const elHouse = document.createElement('td');
            elHouse.innerHTML = $ad.HouseName[i];
            elTr.appendChild(elHouse);
            const eldegree = document.createElement('td');
            eldegree.innerHTML = $ad.strZod([arrCusps[i]]).text;
            elTr.appendChild(eldegree);
            elTab.appendChild(elTr);
        }
        return elTab;
    });
    $ad.tablePlsToHouses = ((astroResult) => {
        let arr = $ad.plsToHouses(astroResult);
        const elTab = document.createElement('table');
        elTab.classList.add('tablePlsToHouses');
        for (let i = 0; i < arr.length; i++) {
            const elTr = document.createElement('tr');
            const elHouse = document.createElement('td');
            elHouse.innerHTML = $ad.HouseName[arr[i][0]];
            elTr.appendChild(elHouse);
            const elPl = document.createElement('td');
            elPl.innerHTML = $ad.plSign[arr[i][1]]
            elTr.appendChild(elPl);
            elTab.appendChild(elTr);
        }
        return elTab;
    });
    $ad.tableHousesAndPls = ((astroResult) => {
        //$ad.plsToHouses({[numPl,[longitude,longitudeSpeed]],[degH ...]}=>[[numH,numPl], ...])
        const arrCusps = astroResult['cusps'];
        const arrInHsOfPls = $ad.plsToHouses(astroResult);
        const elTab = document.createElement('table');
        elTab.classList.add('tableHousesAndPls');
        for (let i = 0; i < arrCusps.length; i++) {
            const elTr = document.createElement('tr');
            const elHouse = document.createElement('td');
            elHouse.innerHTML = $ad.HouseName[i];
            elTr.appendChild(elHouse);
            const eldegree = document.createElement('td');
            eldegree.innerHTML = $ad.strZod([arrCusps[i]]).text;
            elTr.appendChild(eldegree);
            const elPls = document.createElement('td');
            elPls.classList.add('border1');
            const arrInHOfPls = arrInHsOfPls.filter(h => i == h[0]);
            if (arrInHOfPls.length > 0) {
                elPls.innerHTML = Array.from(arrInHOfPls, (pl) => $ad.plSign.get(pl[1]));
            }
            elTr.appendChild(elPls);
            elTab.appendChild(elTr);
        }
        return elTab;
    });

    //
    $ad.tablePlsToAsp = ((chart = {}) => {
        let arrAsp = $ad.aspectRadix(chart);
        const astroResult = chart.out;
        let arrPls = Array.from($ad.planetsSortByNum(astroResult['planets']), (pl) => pl[0]);
        let arrTableAsp = new Array(arrPls.length).fill(0).map(() => new Array());
        $ad.planetsSortByNum(astroResult['planets']).forEach((pl, i) => {
            for (let y = 0; y < arrAsp.length; y++) {
                const element = arrAsp[y];
                if (element[0][0] < pl[0]) { continue }
                if (element[0][0] > pl[0]) { break }
                if (element[0][0] == pl[0]) {
                    arrTableAsp[arrPls.indexOf(element[1][0])][i] = $ad.aspSign.get(element[2]);
                }
            }
            arrTableAsp[i][i] = $ad.plSign.get(pl[0]);
        })
        const elTab = document.createElement('table');
        elTab.classList.add('tabAsp');
        const width = ~~(100 / arrTableAsp.length);
        for (let x = 0; x < arrTableAsp.length; x++) {
            const arrStrAsp = arrTableAsp[x];
            let elTr = document.createElement('tr');
            for (let y = 0; y < arrStrAsp.length; y++) {
                const cellStrAsp = arrStrAsp[y];
                let elTd = document.createElement('td');
                elTd.style = 'border: 1px solid black;text-align: center; width:' + width + '%';
                elTd.innerHTML = (cellStrAsp !== undefined) ? cellStrAsp : '';
                elTr.appendChild(elTd);
            }
            elTab.appendChild(elTr);
        }
        return elTab;
    })

    //tablePlsToElsCrs(plsArr=[numPl,[longitude,longitudeSpeed]])=>tableHTML
    $ad.tablePlsToElsCrs = ((arrPls = []) => {
        color = { 0: '#590000', 1: '#592800', 2: '#003535', 3: '#004700' }
        const arrStat = $ad.plsToElsCrs(arrPls);
        const elTab = document.createElement('table');
        elTab.classList.add('tablePlsToElsCrs');
        let elTr = document.createElement('tr');
        elTr.innerHTML = `<th></th>`;
        //⚙🜁🜂🜃🜄
        elTh = document.createElement('th');
        elTh.style.color = color[0];
        elTh.appendChild($ad.tooltipEl('🜂', 'Fire'));
        elTr.appendChild(elTh);
        elTh = document.createElement('th');
        elTh.style.color = color[1];
        elTh.appendChild($ad.tooltipEl('🜃', 'Earth'));
        elTr.appendChild(elTh);
        elTh = document.createElement('th');
        elTh.style.color = color[2];
        elTh.appendChild($ad.tooltipEl('🜁', 'Air'));
        elTr.appendChild(elTh);
        elTh = document.createElement('th');
        elTh.style.color = color[3];
        elTh.appendChild($ad.tooltipEl('🜄', 'Water'));
        elTr.appendChild(elTh);
        elTab.appendChild(elTr);
        for (let i = 0; i < arrStat.length; i++) {
            elTr = document.createElement('tr');
            if (i == 0) {
                elTh = document.createElement('th');
                elTh.appendChild($ad.tooltipEl('➩', 'Card.'));
                elTr.appendChild(elTh);
            }
            if (i == 1) {
                elTh = document.createElement('th');
                elTh.appendChild($ad.tooltipEl('➨', 'Fix.'));
                elTr.appendChild(elTh);
            }
            if (i == 2) {
                elTh = document.createElement('th');
                elTh.appendChild($ad.tooltipEl('⇶', 'Mut.'));
                elTr.appendChild(elTh);
            }
            for (let y = 0; y < arrStat[i].length; y++) {
                let elTd = document.createElement('td');
                elTd.innerHTML = (arrStat[i][y].map($ad.plSign.get)).toString();
                elTr.appendChild(elTd);
            }
            elTab.appendChild(elTr);
        }
        return elTab;

    })


    $ad.divOutTableChart = ((chart) => {
        astroResult = chart.out;
        let div = document.createElement('div');
        div.classList.add('tableChart');
        //tablePlanets
        div.appendChild($ad.tablePlanets(astroResult['planets']));
        //tablePlsToAsp
        div.appendChild($ad.tablePlsToAsp(chart));
        //tableHousesAndPls
        if (chart.out['cusps'] != undefined) {
            div.appendChild($ad.tableHousesAndPls(astroResult));
        }
        //tablePlsToElsCrs
        div.appendChild($ad.tablePlsToElsCrs(astroResult['planets']));
        return div
    })
    $ad.tableOutTableChart = ((chart) => {
        const elTab = document.createElement('table');
        elTab.classList.add('tableChart');
        let elTr = document.createElement('tr');
        let elTd = document.createElement('td');
        //tablePlanets
        elTd.appendChild($ad.tablePlanets(chart.out['planets']));
        elTr.appendChild(elTd);
        elTd = document.createElement('td');
        //tablePlsToAsp
        elTd.appendChild($ad.tablePlsToAsp(chart));
        elTr.appendChild(elTd);
        elTab.appendChild(elTr);
        elTr = document.createElement('tr');
        elTd = document.createElement('td');
        //tableHousesAndPls
        if (chart.out['cusps'] != undefined) {
            elTd.appendChild($ad.tableHousesAndPls(chart.out));
        }
        elTr.appendChild(elTd);
        elTd = document.createElement('td');
        //tablePlsToElsCrs
        elTd.appendChild($ad.tablePlsToElsCrs(chart.out['planets']));
        elTr.appendChild(elTd);
        elTab.appendChild(elTr);
        return elTab
    })
})(window.$ad = window.$ad || {}));
