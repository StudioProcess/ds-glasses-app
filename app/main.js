import * as util from './util.js';
// import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from '../node_modules/three/examples/js/loaders/OBJLoader.js';

import Vue from '../node_modules/vue/dist/vue.esm.browser.js';
import VueRouter from 'vue-router'
import App from './App.vue'
import model from "./src/assets/models/model3.obj";


new Vue({render: createElement => createElement(App)}).$mount('#app');
Vue.use(VueRouter)

const container = document.getElementById("three-model");
const W = container.offsetWidth;
const H = container.offsetHeight;

let renderer, scene, camera;
let controls;

(function main() {  

  setup(); // set up scene
  loop(); // start game loop

})();


function setup() {
  
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize( W, H );
  renderer.setPixelRatio( window.devicePixelRatio );
  document.getElementById("three-model").appendChild( renderer.domElement );
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, W / H, 0.01, 1000 );
  controls = new OrbitControls( camera, renderer.domElement );
  camera.position.z = 2;
  
  let geo = new THREE.BoxGeometry( 1, 1, 1 );
  let mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
  let mesh = new THREE.Mesh( geo, mat );
  scene.add( mesh );
  

  // let mtlLoader = new MTLLoader();
  // this.THREE = THREE;
  const loader = new THREE.OBJLoader();

  // load a resource
  loader.load(
    // resource URL
    model,
    // called when resource is loaded
    function ( object ) {
  
      scene.add( object );
  
    },
    // called when loading is in progresses
    function ( xhr ) {
  
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
    },
    // called when loading has errors
    function ( error ) {
  
      console.log( 'An error happened' );
  
    }
  );






}


function loop(time) {
  
  requestAnimationFrame( loop );
  renderer.render( scene, camera );
  
}


document.addEventListener('keydown', e => {
  // console.log(e.key, e.keyCode, e);
  
  if (e.key == 'f') { // f .. fullscreen
    util.toggleFullscreen();
  }
  
  else if (e.key == 's') { // s .. save frame
    util.saveCanvas();
  }  
});

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );

}