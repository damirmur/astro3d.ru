import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import Stats from 'three/addons/libs/stats.module';

const light = new THREE.AmbientLight(0xffffff);
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))
scene.background = new THREE.Color('white');
scene.add(light);

const camera = new THREE.PerspectiveCamera(
    120,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth , window.innerHeight)
document.querySelector('#yog3d').appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const loaderGLTF = new GLTFLoader()

const objects = new THREE.Group();
function addModelGLTF(model) {
    loaderGLTF.load(model.file,
        function (gltf) {
            const material = new THREE.MeshPhysicalMaterial({
                color: model.color,
                metalness: 0.25,
                roughness: 0.1,
                opacity: model.opacity || 0.8,
                transparent: true,
                transmission: 0.99,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25
            })
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });
            const mesh = gltf.scene;
            mesh.rotation.x = model.rotation.x;
            mesh.rotation.y = model.rotation.y;
            mesh.rotation.z = model.rotation.z;
            mesh.position.add(model.position)
            mesh.scale.setScalar(model.scalar);
            objects.add(mesh);
        },
        (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + '% loaded') },
        (error) => { console.log(error) }
    )
}
const yogChacras = () => {
    const yog = {
        file: 'model3d/yog.glb',
        color: 'white',
        scalar: 2.4,
        opacity: 0.3,
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        position: { x: 0, y: 0, z: 0 },
    };
    const chakras = {
        muladhara: {
            file: 'model3d/muladhara.glb',
            color: 'red',
            scalar: 0.2,
            rotation: { x: 0, y: 0, z: -Math.PI },
            position: { x: 0, y: 0, z: 0 },
        },
        svadhishthana: {
            file: 'model3d/svadhishthana.glb',
            color: 'orange',
            scalar: 0.2,
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 0.4, z: 0 },
        },
        manipura: {
            file: 'model3d/manipura.glb',
            color: 'red',
            scalar: 0.2,
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 0.8, z: 0 },
        },
        anahata: {
            file: 'model3d/anahata.glb',
            color: 'green',
            scalar: 0.2,
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 1.2, z: 0 },
        },
        vishuddha: {
            file: 'model3d/vishuddha.glb',
            color: 'aqua',
            scalar: 0.2,
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 1.6, z: 0 },
        },
        ajna: {
            file: 'model3d/ajna.glb',
            color: 'blue',
            scalar: 0.2,
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 2, z: 0 },
        },
        sahasrara: {
            file: 'model3d/sahasrara.glb',
            color: 'purple',
            scalar: 0.2,
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 2.4, z: 0 },
        }
    };
    addModelGLTF(yog);
    addModelGLTF(chakras.muladhara);
    addModelGLTF(chakras.svadhishthana);
    addModelGLTF(chakras.manipura);
    addModelGLTF(chakras.anahata);
    addModelGLTF(chakras.vishuddha);
    addModelGLTF(chakras.ajna);
    addModelGLTF(chakras.sahasrara);
}
yogChacras();
scene.add(objects);

// window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth , window.innerHeight )
    render()
}
const stats = new Stats()
document.body.appendChild(stats.dom)
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
    stats.update()
}
const exporter = new GLTFExporter();
exporter.parse(
	scene,
	// called when the gltf has been generated
	function ( gltf ) {
		console.log( gltf );
		downloadJSON( gltf );
	},
	// called when there is an error in the generation
	function ( error ) {
		console.log( 'An error happened' );
	},
//	options
);
function render() {
    renderer.render(scene, camera)
}

animate()