<template>
  <div ref="three" id="three-model">material:{{mat}}material:{{matTwo}}</div>
</template>
  <script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/109/three.js"></script>

<script>
// import * as THREE from '../../../node_modules/three/build/three.module.js';
import model from "../assets/models/model3.obj";
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "../../../node_modules/three/examples/js/loaders/OBJLoader.js";

export default {
  name: "Threemodel",
  components: {},
  props: ["mat", "matTwo", "matThree", "matFour", "matFive", "model"],

  data: function() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      light: new THREE.PointLight(0xffffff, 2.0, 0),
      objtemp: new THREE.Group()
    };
  },
  mounted() {
    const container = this.$refs.three;
    const W = container.clientHeight;
    const H = container.clientWidth;

    this.setup(W, H); // set up scene
    this.loop(); // start game loop
  },
  updated() {
    let texture = new THREE.TextureLoader().load(this.mat[1]);
    var loader = new THREE.TextureLoader();

    loader.load(
      this.mat[1],

      function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(15, 15);

        let temp = eval(this.mat[2]) + 1;
        this.objtemp.children[0].children[temp].material.map = texture;
        this.objtemp.children[0].children[temp].material.roughnessMap = texture;
        this.objtemp.children[0].children[temp].material.needsUpdate = true;
      }.bind(this)
    );
  },
  methods: {
    lights: function() {
      this.light.position.set(50, 50, -200);
      this.scene.add(this.light);

      var sphereSize = 20;
      var pointLightHelper = new THREE.PointLightHelper(this.light, sphereSize, "#ff0000");
      this.scene.add(pointLightHelper);
    },
    setup: function(W, H) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      this.renderer.setSize(W, H);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      document
        .getElementById("three-model")
        .appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, W / H, 0.01, 1000); //75
      this.scene.fog = new THREE.Fog("#a1a1a1", 0.08, 800);

      this.lights();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.camera.position.z = -200; //2
      this.controls.update();
      let geo = new THREE.BoxGeometry(1, 1, 1);
      let mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0.1,
        wireframe: false
      });
      let mat2 = mat.clone();
      let mat3 = mat.clone();
      let mat4 = mat.clone();
      let mat5 = mat.clone();

      let glass = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: false
      });
      let metall = new THREE.MeshStandardMaterial({
        color: 0xfffff,
        wireframe: false
      });

      this.scene.add(this.objtemp);
      const loader = new THREE.OBJLoader();

      loader.load(
        model,
        function(object) {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material = mat;
            }
          }),
            (object.rotation.y = 90);
          object.children[0].material = glass;
          object.children[1].material = metall;
          object.children[2].material = mat;
          object.children[3].material = mat2;
          object.children[4].material = mat3;
          object.children[5].material = mat4;
          object.children[6].material = mat5;

          object.children[3].position.z -= 10;
          object.children[4].position.z -= 20;
          object.children[5].position.z -= 30;
          object.children[6].position.z -= 40;

          object.children[3].position.y += 10;
          object.children[4].position.y += 20;
          object.children[5].position.y += 30;
          object.children[6].position.y += 40;

          this.objtemp.add(object);

          console.log(object);
        }.bind(this),

        function(xhr) {}
      );

      setTimeout(() => {
        // objtemp.children[0].children[3].position.x += 80;
        console.log(this.objtemp);
      }, 500);
    },

    loop: function() {
      requestAnimationFrame(this.loop);
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

