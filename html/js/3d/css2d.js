import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject  } from 'three/addons/renderers/CSS2DRenderer.js';

let camera, scene, renderer, htmlRenderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(10, 5, 20);
  scene = new THREE.Scene();

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 0, 1);
  scene.add(dirLight);

  const earthDiv2 = document.createElement("div");
  earthDiv2.className = "label";
  earthDiv2.innerHTML = "🎲&#8986;&#xfe0e;⌚";
  earthDiv2.style.marginTop = "-1em";
  const earthLabel2 = new CSS2DObject(earthDiv2);
  earthLabel2.position.set(0, 2, 5);
  scene.add(earthLabel2);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  htmlRenderer = new CSS2DRenderer();
  htmlRenderer.setSize(window.innerWidth, window.innerHeight);
  htmlRenderer.domElement.style.position = "absolute";
  htmlRenderer.domElement.style.top = "0px";
  document.body.appendChild(htmlRenderer.domElement);

  const controls = new OrbitControls(camera, htmlRenderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 100;
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  htmlRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  htmlRenderer.render(scene, camera);
}
