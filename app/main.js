import * as util from './util.js';
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { OBJLoader } from '../node_modules/three/examples/js/loaders/OBJLoader.js';

import Vue from '../node_modules/vue/dist/vue.esm.browser.js';
import VueRouter from 'vue-router'
import App from './App.vue'
// import model from "./src/assets/models/model3.obj";


new Vue({ render: createElement => createElement(App) }).$mount('#app');
Vue.use(VueRouter)

document.addEventListener('keydown', e => {
  // console.log(e.key, e.keyCode, e);

  if (e.key == 'f') { // f .. fullscreen
    util.toggleFullscreen();
  }

  else if (e.key == 's') { // s .. save frame
    util.saveCanvas();
  }
});

// window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);

}