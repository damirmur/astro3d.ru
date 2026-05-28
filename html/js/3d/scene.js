import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DObject, CSS3DSprite, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { STLLoader } from 'three/addons/loaders/STLLoader';
import Stats from 'three/addons/libs/stats.module';
export const setting3Ddef1 = {
    'direction': true,
    'rotateAll': 270 * Math.PI / 180,
    'rotateCharts': 0 * Math.PI / 180,
    'd3': false,
    'depth': 1.6,
    'zodiac': {
        'opacity': 0.3,
        'visible': true,
        'color': { 0: '#590000', 1: '#592800', 2: '#003535', 3: '#004700', 4: '#590000', 5: '#592800', 6: '#003535', 7: '#004700', 8: '#590000', 9: '#592800', 10: '#003535', 11: '#004700' },
        'size': { 'in': 0, 'out': 2, 'rSign': 1.5, 'segment': Math.PI / 6, 'symbol': 0.2 },
        'sign': { 0: '&#x2648;&#xfe0e;', 1: '&#x2649;&#xfe0e;', 2: '&#x264a;&#xfe0e;', 3: '&#x264b;&#xfe0e;', 4: '&#x264c;&#xfe0e;', 5: '&#x264d;&#xfe0e;', 6: '&#x264e;&#xfe0e;', 7: '&#x264f;&#xfe0e;', 8: '&#x2650;&#xfe0e;', 9: '&#x2651;&#xfe0e;', 10: '&#x2652;&#xfe0e;', 11: '&#x2653;&#xfe0e;' },
    },
    'charts': {
        'visible': true,
        'cusps': {
            'visible': true,
            'sign': { 0: 'Asc', 1: 'II', 2: 'III', 3: 'IC', 4: 'V', 5: 'VI', 6: 'Ds', 7: 'VIII', 8: 'IX', 9: 'Mc', 10: 'XI', 11: 'XII' },
            'size': {
                'in': 0.25,
                'out': 1.75,
                'step': 0.02,
                'depth': 0.001,
                'symbol': 0.15,
            },
            'color': '#bbbbbb',

        },
        'planets': {
            'colorTypes': ['Zodiac', 'Chacras', 'Color'],
            'colorType': 'Zodiac',
            'color': '#000000',
            'colorTypesFont': ['Zodiac', 'Chacras', 'Color'],
            'colorTypeFont': 'Chacras',
            'colorFont': '#000000',
            'visible': true,
            'size': { 'r': 1, 'D3': false, 'symbol': 0.15, 'font': 0.15, 'depth': 0.001 },
            'chPosPl': {
                '0': { pos: 10, color: 'aqua' },
                1: { pos: 1, color: 'red' },
                2: { pos: 2, color: 'orange' },
                3: { pos: 3, color: 'orange' },
                4: { pos: 4, color: 'gold' },
                5: { pos: 5, color: 'gold' },
                6: { pos: 6, color: 'gold' },
                7: { pos: 7, color: 'green' },
                8: { pos: 8, color: 'green' },
                9: { pos: 9, color: 'green' },
                11: { pos: 0, color: 'gray' },
                12: { pos: -1, color: 'black' },
            }
        },
        aspects: {
            'visible': true,
        },
    },
    yog: {
        'visible': true,
    },
    chacras: {
        'visible': true,
    },
    stats: {
        'visible': true,
    },
};
const PI = Math.PI;
Number.prototype.toRad = function () { return this * PI / 180 };
const segment = PI / 6;
let camera, light, glScene, cssScene, glRenderer, cssRenderer, controls;

function init() {
    camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.z = 10;
    light = new THREE.AmbientLight(0xffffff);
    //    light = new THREE.PointLight(0xffffff, 1,100);
    //    light.position.set(0, 0, 0);

    glScene = new THREE.Scene();
    glScene.background = new THREE.Color('white');
    glScene.add(light);
    //    glScene.add(new THREE.AxesHelper(3));
    cssScene = new THREE.Scene();
    glRenderer = new THREE.WebGLRenderer();
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(WIDTH, HEIGHT);
    document.querySelector('#scene3d').appendChild(glRenderer.domElement);
    cssRenderer = new CSS3DRenderer();
    cssRenderer.dispose = ((cssScene) => {
        const remove = (obj) => {
            if ((obj.children) && (obj.children.length > 0)) {
                while (obj.children.length > 0) {
                    let object = obj.children[0];
                    if ((object.children) && (object.children.length > 0)) {
                        remove(object.children[0])
                    } else {
                        object.parent.remove(object)
                    }
                }
            } else {
                if (obj.parent) { obj.parent.remove(obj) }
            }
        };
        remove(cssScene);
    })
    cssRenderer.setSize(WIDTH, HEIGHT);
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.top = "0";

    document.querySelector('#scene3d').appendChild(cssRenderer.domElement);
    controls = new OrbitControls(camera, cssRenderer.domElement);
    // controls.minAzimuthAngle = 0;
    // controls.maxAzimuthAngle = 0;
    controls.target.set(0, 0, 0);
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controls.update();
    window.addEventListener("resize", onWindowResize);
}
const loaderSTL = new STLLoader()

const yog3d = new THREE.Group();
yog3d.name = 'yog3d';
const chacras3d = new THREE.Group();
chacras3d.name = 'chacras';
function addModelSTL(model, parent) {
    loaderSTL.load(model.file,
        function (geometry) {
            const material = new THREE.MeshPhysicalMaterial({
                color: model.color,
                metalness: 0.25,
                roughness: 0.1,
                opacity: model.opacity || 0.8,
                transparent: model.transparent || true,
                transmission: 0.99,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25
            })
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x += +model.rotation.x//-Math.PI/2;
            mesh.rotation.y += +model.rotation.y//-Math.PI/2;
            mesh.rotation.z += +model.rotation.z//-Math.PI/2;
            mesh.position.add(model.position)
            mesh.scale.setScalar(model.scalar);
            parent.add(mesh);
        },
        //        (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + '% loaded') },
        (xhr) => { },
        (error) => { console.log(error) }
    )
}
const yogChacras = () => {
    const yog = {
        file: 'models/yog.stl',
        color: 'white',
        scalar: 2.4,
        opacity: 0.8,
        transparent: false,
        rotation: { x: 0, y: 0, z: PI / 2 },
        position: { x: 0, y: 0, z: 0 },
    };
    const chakras = {
        muladhara: {
            file: 'models/muladhara.stl',
            color: 'red',
            scalar: 0.1,
            rotation: { x: PI / 2, y: PI / 2, z: -PI },
            position: { x: 0, y: 0, z: 0 },
        },
        svadhishthana: {
            file: 'models/svadhishthana.stl',
            color: 'orange',
            scalar: 0.1,
            rotation: { x: PI / 2, y: PI / 2, z: -PI },
            position: { x: 0, y: 0, z: 0.4 },
        },
        manipura: {
            file: 'models/manipura.stl',
            color: 'red',
            scalar: 0.1,
            rotation: { x: PI / 2, y: PI / 2, z: -PI },
            position: { x: 0, y: 0, z: 0.8 },
        },
        anahata: {
            file: 'models/anahata.stl',
            color: 'green',
            scalar: 0.1,
            rotation: { x: PI / 2, y: PI / 2, z: 0 },
            position: { x: 0, y: 0, z: 1.2 },
        },
        vishuddha: {
            file: 'models/vishuddha.stl',
            color: 'aqua',
            scalar: 0.1,
            rotation: { x: PI / 2, y: PI / 2, z: -PI },
            position: { x: 0, y: 0, z: 1.6 },
        },
        ajna: {
            file: 'models/ajna.stl',
            color: 'blue',
            scalar: 0.1,
            rotation: { x: PI / 2, y: PI / 2, z: -PI },
            position: { x: 0, y: 0, z: 2.2 },
        },
        sahasrara: {
            file: 'models/sahasrara.stl',
            color: 'purple',
            scalar: 0.1,
            rotation: { x: PI / 2, y: PI / 2, z: 0 },
            position: { x: 0, y: 0, z: 2.6 },
        }
    };
    addModelSTL(yog, yog3d);
    addModelSTL(chakras.muladhara, chacras3d);
    addModelSTL(chakras.svadhishthana, chacras3d);
    addModelSTL(chakras.manipura, chacras3d);
    addModelSTL(chakras.anahata, chacras3d);
    addModelSTL(chakras.vishuddha, chacras3d);
    addModelSTL(chakras.ajna, chacras3d);
    addModelSTL(chakras.sahasrara, chacras3d);
}

init();
yogChacras();

const createCylinder3D = (r = 1, height = 1, position = new THREE.Vector3(), rotation = new THREE.Vector3(), color = 0xffffff) => {
    const geometry = new THREE.CylinderGeometry(r, r, height, 32, 1, true);
    const material = new THREE.MeshPhongMaterial({ 'color': color, 'side': THREE.DoubleSide, 'opacity': 0.2, 'transparent': true });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.x = PI / 2;
    cylinder.rotation.x += rotation.x;
    cylinder.rotation.y += rotation.y;
    cylinder.rotation.z += rotation.z;
    cylinder.position.add(position);
    return cylinder;
}
const createSphereD = (r = 0.1, position = new THREE.Vector3(), color = 0xffffff) => {
    const geometry = new THREE.SphereGeometry(r, 32, 16);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.add(position);
    return sphere;
}
const createSector2D = ((pos = { 'in': 0, 'out': 1, 'segment': segment }, color = 0x00ffff, ext = { frontOpacity: 0.3, faceOpacity: 0.1 }) => {
    const arcShape = new THREE.Shape();
    arcShape.moveTo(pos.in, 0);
    arcShape.lineTo(pos.out, 0);
    arcShape.absarc(0, 0, pos.out, 0, pos.segment, false);
    arcShape.lineTo(Math.cos(pos.segment) * pos.in, Math.sin(pos.segment) * pos.in);
    arcShape.absarc(0, 0, pos.in, 0, pos.segment, false);
    const extrudeSettings = {
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 1,
        curveSegments: 12,
        depth: 0.01,
        material: 0,
        extrudeMaterial: 1,
    };
    const geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
    const matFront = new THREE.MeshLambertMaterial({
        'color': color || 0xffffff,
        'opacity': ext.frontOpacity || 0.3,
        'transparent': true,
    });
    const matFace = new THREE.MeshLambertMaterial({
        'color': color,
        'opacity': ext.faceOpacity || 1,
        'transparent': true,
    });
    const mesh = new THREE.Mesh(geometry, [matFront, matFace]);
    // mesh.position.z += -pos.depth / 2;
    return mesh;
})
const createSector3D = ((pos = { 'in': 0, 'out': 1, 'depth': 1, 'segment': segment }, color = 0x00ffff, ext = { frontOpacity: 0.3, faceOpacity: 0.1 }) => {
    const arcShape = new THREE.Shape();
    arcShape.moveTo(pos.in, 0);
    arcShape.lineTo(pos.out, 0);
    arcShape.absarc(0, 0, pos.out, 0, pos.segment, false);
    arcShape.lineTo(Math.cos(pos.segment) * pos.in, Math.sin(pos.segment) * pos.in);
    arcShape.absarc(0, 0, pos.in, 0, pos.segment, false);
    const extrudeSettings = {
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 1,
        curveSegments: 12,
        depth: pos.depth,
        material: 0,
        extrudeMaterial: 1,
    };
    const geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
    const matFront = new THREE.MeshPhongMaterial({
        'color': color,
        'opacity': ext.frontOpacity || 0.1,
        'transparent': true,
    });
    const matFace = new THREE.MeshPhongMaterial({
        'color': color,
        'opacity': ext.faceOpacity || 0.2,
        'transparent': true,
    });
    const mesh = new THREE.Mesh(geometry, [matFront, matFace]);
    return mesh;
})
const createCSS3D = (innerHTML = ``, fontSize = 0.1, color = 'black') => {
    const div = document.createElement("div");
    div.className = "div";
    div.innerHTML = innerHTML;
    div.style.fontSize = String(fontSize) + 'px';
    div.style.color = (color) ? color : 'black';
    return new CSS3DObject(div);
};
const draw3DZodiac = ((setting = setting3D, rotate = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, ext = { frontOpacity: 0.3, faceOpacity: 0.1 }) => {
    const depth = setting.depth;
    const set = Object.assign(setting.zodiac);
    set.size.depth = depth;
    const sizeSymbol = setting.zodiac.size.symbol;
    set.direction = setting.direction;
    const glGroup = new THREE.Group();
    const cssGroup = new THREE.Group();
    let mesh;
    for (let i = 0; i < 12; i++) {
        if (setting.d3) {
            mesh = createSector3D(set.size, (set.color[i]) ? set.color[i] : 0x888888, ext);
        } else {
            mesh = createSector2D(set.size, (set.color[i]) ? set.color[i] : 0x888888, ext);
        }
        if (set.direction) {
            mesh.rotation.z = 2 * PI - (1 + i) * segment;
        } else {
            mesh.rotation.z = i * segment;
        }
        glGroup.add(mesh);
    }
    const r = set.size.rSign;
    for (let i = 0; i < 12; i++) {
        const objCSS3D = createCSS3D(set.sign[i], sizeSymbol, set.color[i]);
        if (set.direction) {
            objCSS3D.rotation.z = PI - segment * (i + 0.5 - 3);
            objCSS3D.position.set(Math.cos(2 * PI - segment * (i + 0.5)) * r, Math.sin(2 * PI - segment * (i + 0.5)) * r, 0);
        } else {
            objCSS3D.rotation.z = segment * (i + 0.5 - 3);
            objCSS3D.position.set(Math.cos(segment * (i + 0.5)) * r, Math.sin(segment * (i + 0.5)) * r, 0);
        }
        cssGroup.add(objCSS3D);
    }
    glGroup.rotation.z += rotate.z;
    cssGroup.rotation.z += rotate.z;
    cssGroup.name = 'zodiac';
    glGroup.name = 'zodiac';
    glGroup.position.add(position);
    cssGroup.position.add(position);
    return { 'glGroup': glGroup, 'cssGroup': cssGroup };
})
const draw3DPlanets = (set = {}, planets = [], rotate = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, ext = { frontOpacity: 0.3, faceOpacity: 0.1 }, posPlanet) => {
    const z = 0;
    const r = set.charts.planets.size.r;
    const sizeSymbol = set.charts.planets.size.font;
    const sizePlanet = set.charts.planets.size.symbol / 2;
    const direction = set.direction;
    const glGroup = new THREE.Group();
    const cssGroup = new THREE.Group();
    const planets3D = set.charts.planets.size.D3;
    planets.forEach((pl, i) => {
        const angle = pl[1][0];
        const rad = (direction) ? (2 * PI - Number(angle).toRad()) : Number(angle).toRad();
        const pos = new THREE.Vector3();
        pos.x = Math.cos(rad) * r;
        pos.y = Math.sin(rad) * r;
        if (planets3D) {
            pos.z = (sizePlanet * 2) * set.charts.planets.chPosPl[pl[0]].pos;
        } else {
            pos.z = z + 0.03;
        };
        posPlanet[pl[0]] = { x: pos.x, y: pos.y, z: pos.z };
        const sign = ~~(angle / 30);
        let color = set.charts.planets.color;
        if (set.charts.planets.colorType == 'Zodiac') {
            color = set.zodiac.color[sign];
        }
        if (set.charts.planets.colorType == 'Chacras') {
            color = set.charts.planets.chPosPl[pl[0]].color
        }
        glGroup.add(createSphereD(sizePlanet, pos, color));
        const strZod = $ad.strZod(pl[1]);
        const text = $ad.plSign[pl[0]] + strZod.retro + strZod.deg;//+$ad.zod[strZod.sign].sign
        color = set.charts.planets.colorFont;
        if (set.charts.planets.colorTypeFont == 'Zodiac') {
            color = set.zodiac.color[sign];
        }
        if (set.charts.planets.colorTypeFont == 'Chacras') {
            color = set.charts.planets.chPosPl[pl[0]].color
        }

        const objCSS3D = createCSS3D(text, sizeSymbol, color)//
        objCSS3D.position.set(pos.x + sizeSymbol, pos.y, pos.z);
        cssGroup.add(objCSS3D);
    })
    glGroup.rotation.z += rotate.z;
    cssGroup.rotation.z += rotate.z;
    glGroup.position.add(position);
    cssGroup.position.add(position);
    cssGroup.name = 'planets';
    glGroup.name = 'planets';
    return { 'glGroup': glGroup, 'cssGroup': cssGroup }
}
const draw3DAspects = (set = {}, chart, rotate = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, posPlanet3D, ext = { frontOpacity: 0.3, faceOpacity: 0.1 }) => {
    const glGroup = new THREE.Group();
    const cssGroup = new THREE.Group();
    $ad.aspectRadix(chart).forEach((el, j) => {
        const material = new THREE.LineBasicMaterial({ color: $ad.colorAsp[el[2]] || 'black' });
        const tubeGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(posPlanet3D[el[0][0]], posPlanet3D[el[1][0]]), 64, 0.005, 12, true);
        const line = new THREE.Line(tubeGeometry, material);
        glGroup.add(line);
    });
    glGroup.rotation.z += rotate.z;
    cssGroup.rotation.z += rotate.z;
    glGroup.position.add(position);
    cssGroup.position.add(position);
    cssGroup.name = 'aspects';
    glGroup.name = 'aspects';

    return { 'glGroup': glGroup, 'cssGroup': cssGroup };
}
const draw3DCusps = (set = {}, cusps = [], rotate = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, ext = { frontOpacity: 0.3, faceOpacity: 0.1 }) => {
    const glGroup = new THREE.Group();
    const cssGroup = new THREE.Group();
    let sizeSymbol = set.charts.cusps.size.symbol;
    const r = set.charts.cusps.size.out - sizeSymbol;
    const cuspsLength = cusps.length;
    const direction = set.direction;
    const colorSector = 0xdddddd;
    let colorLine = set.charts.cusps.color;
    for (let i = 0; i < cuspsLength; i++) {
        colorLine = set.charts.cusps.color;
        const cusp = cusps[i];
        let startRad = Number(cusp).toRad();
        let cuspNext = ((i + 1) == cuspsLength) ? cusps[0] : cusps[i + 1];
        cuspNext = (cuspNext > cusps[i]) ? cuspNext : cuspNext + 360;
        let sector;
        let segment = Number(cuspNext).toRad() - startRad;
        if (set.d3) {
            sector = createSector3D({ 'in': set.charts.cusps.size.in, 'out': set.charts.cusps.size.out, 'depth': set.depth + 0.002, 'segment': segment }, colorSector, ext);
            sector.rotation.z = (direction) ? (-startRad - segment) : startRad;
            glGroup.add(sector);
        }
        if (cuspsLength == 12) {
            if ((i == 3) || (i == 9)) { colorLine = 'blue'; };
            if ((i == 0) || (i == 6)) { colorLine = 'red'; }
            let pos0, pos1;
            if (direction) {
                pos0 = {
                    x: Math.cos(2 * PI - startRad) * set.charts.cusps.size.in,
                    y: -Math.sin(startRad) * set.charts.cusps.size.in,
                    z: 0.0,
                };
                pos1 = {
                    x: Math.cos(2 * PI - startRad) * set.charts.cusps.size.out,
                    y: -Math.sin(startRad) * set.charts.cusps.size.out,
                    z: 0.0,
                };
            } else {
                pos0 = {
                    x: Math.cos(startRad) * set.charts.cusps.size.in,
                    y: Math.sin(startRad) * set.charts.cusps.size.in,
                    z: 0.0,
                };
                pos1 = {
                    z: 0,
                    x: Math.cos(startRad) * set.charts.cusps.size.out,
                    y: Math.sin(startRad) * set.charts.cusps.size.out,
                    z: 0.0,
                };
            };
            const material = new THREE.LineBasicMaterial({ color: colorLine });
            const tubeGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(pos0, pos1), 64, 0.01, 12, true);
            const line = new THREE.Line(tubeGeometry, material);
            glGroup.add(line);

        }
        const objCSS3D2 = createCSS3D(String(set.charts.cusps.sign[i]) + '^' + String($ad.strZod([~~cusp, 1]).deg), sizeSymbol, colorLine);
        if (direction) {
            objCSS3D2.rotation.z = 1.5 * PI - startRad;
            objCSS3D2.position.set(Math.cos(2 * PI - startRad) * (r + sizeSymbol), -Math.sin(startRad) * (r + sizeSymbol), + 0.02);
        } else {
            objCSS3D2.rotation.z = (startRad) - PI / 2;
            objCSS3D2.position.set(Math.cos(startRad) * (r + sizeSymbol), Math.sin(startRad) * (r + sizeSymbol), +0.02);
        }
        cssGroup.add(objCSS3D2);
    };
    colorLine = set.charts.cusps.color;
    const material = new THREE.MeshBasicMaterial({ color: colorLine, side: THREE.DoubleSide });
    const geometryRing0 = new THREE.RingGeometry(set.charts.cusps.size.in - 0.01, set.charts.cusps.size.in + 0.01, 36);
    const ringIn = new THREE.Mesh(geometryRing0, material);
    glGroup.add(ringIn);
    const geometryRing1 = new THREE.RingGeometry(set.charts.cusps.size.out - 0.01, set.charts.cusps.size.out + 0.01, 36);
    const ringOut = new THREE.Mesh(geometryRing1, material);
    glGroup.add(ringOut);
    glGroup.rotation.z += rotate.z;
    cssGroup.rotation.z += rotate.z;
    glGroup.position.add(position);
    cssGroup.position.add(position);
    cssGroup.name = 'cusps';
    glGroup.name = 'cusps';
    return { 'glGroup': glGroup, 'cssGroup': cssGroup };
}
const draw3DChart = (set = {}, data = {}, rotate = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, ext = { frontOpacity: 0.3, faceOpacity: 0.1 }) => {
    const glGroup = new THREE.Group();
    const cssGroup = new THREE.Group();
    glGroup.position.add(position);
    cssGroup.position.add(position);
    cssGroup.name = 'chart';
    glGroup.name = 'chart';

    if (!chart.out.planets) { return { 'glGroup': glGroup, 'cssGroup': cssGroup } }
    if (set.charts.planets.visible) {
        const posPlanet3D = {};
        const planets = draw3DPlanets(set, chart.out.planets, rotate, position, ext, posPlanet3D);
        glGroup.add(planets.glGroup);
        cssGroup.add(planets.cssGroup);
        if (set.charts.aspects.visible) {
            const aspects = draw3DAspects(set, chart, rotate, position, posPlanet3D);
            glGroup.add(aspects.glGroup);
            cssGroup.add(aspects.cssGroup);
        }
    }
    if (!chart.out.cusps) { return { 'glGroup': glGroup, 'cssGroup': cssGroup } };
    if (set.charts.cusps.visible) {
        const cusps = draw3DCusps(set, chart.out.cusps, rotate, position, ext);
        glGroup.add(cusps.glGroup);
        cssGroup.add(cusps.cssGroup);
    }
    return { 'glGroup': glGroup, 'cssGroup': cssGroup };
}
const draw3DCharts = (data = [chart], set = setting3Ddef, rotate = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }) => {
    const rotateDraw = new THREE.Vector3().add({ x: 0, y: 0, z: set.rotateAll });
    if (set.yog.visible) {
        yog3d.rotation.z = rotateDraw.z;
        glScene.add(yog3d);
    }
    if (set.chacras.visible) {
        chacras3d.rotation.z = rotateDraw.z;
        const posX = 0.3;
        chacras3d.position.x = (set.yog.visible) ? Math.cos(rotateDraw.z) * posX : 0;
        chacras3d.position.y = (set.yog.visible) ? Math.sin(rotateDraw.z) * posX : 0;
        glScene.add(chacras3d);
    };
    if (chart.out.cusps[0])
        if (set.direction) {
            rotateDraw.z += Number(chart.out.cusps[0]).toRad() + set.rotateCharts;
        } else {
            rotateDraw.z += -Number(chart.out.cusps[0]).toRad() + set.rotateCharts;
        }
    else {
        rotateDraw.z = +set.rotateCharts
    };
    const positionDraw = new THREE.Vector3().add({ x: (position.x || 0), y: (position.y || 0), z: (position.z || 0) });
    let extrudeZodiac;
    let extrudeCusps;
    if (set.d3) {
        extrudeZodiac = { frontOpacity: 0.3, faceOpacity: 0.1 };
        extrudeCusps = { frontOpacity: 0.3, faceOpacity: 0.3 };
    } else {
        extrudeZodiac = { frontOpacity: set.zodiac.opacity, faceOpacity: 0.95 };
        extrudeCusps = { frontOpacity: 0.1, faceOpacity: 1, fontColor: 'white' };
    }
    if (set.zodiac.visible) {
        const zodiacScene = draw3DZodiac(set, rotateDraw, positionDraw, extrudeZodiac);
        glScene.add(zodiacScene.glGroup);
        cssScene.add(zodiacScene.cssGroup);
    }
    positionDraw.z += +0.02;
    const chartScene = draw3DChart(set, chart[0], rotateDraw, positionDraw, extrudeCusps);
    glScene.add(chartScene.glGroup);
    cssScene.add(chartScene.cssGroup);


}

draw3DCharts(chart, setting3D);

function onWindowResize() {
    WIDTH = window.innerWidth / 2;
    HEIGHT = window.innerHeight / 2;
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    glRenderer.setSize(WIDTH, HEIGHT);
    cssRenderer.setSize(WIDTH, HEIGHT);
}
function onReset() {
    controls.reset();
}
const stats = new Stats();
document.querySelector('#stats').appendChild(stats.dom);
document.querySelector('#stats').style.display = (setting3D.stats.visible) ? 'flex' : 'none';

function animate() {
    if (update3D) {
        while (glScene.children.length > 0) {
            glScene.remove(glScene.children[0]);
        }
        glRenderer.dispose();
        cssRenderer.dispose(cssScene);
        glScene.add(light);
        draw3DCharts(chart, setting3D);
        update3D = false;
        requestAnimationFrame(animate);

    } else {
        requestAnimationFrame(animate);
        controls.update();
        glRenderer.render(glScene, camera);
        cssRenderer.render(cssScene, camera);
        stats.update();
    }
}

animate();
window.controls3d = controls;