<template>
  <div ref="three" class="three-model-container">
    <div id="three-model"></div>
    <span class="three-currentmaterial">material:{{mat}}</span>
  </div>
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
      pointLight: new THREE.PointLight(0xffffff, 2.9, 160),
      spotLight: new THREE.SpotLight(0xfdefe5, 1.5, 50),
      ambientLight: new THREE.AmbientLight(0x404040),
      objtemp: new THREE.Group()
    };
  },

  mounted() {
    this.setup(); // set up scene
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
      this.pointLight.position.set(0, 0, -60);
      this.scene.add(this.pointLight);

      var sphereSize = 20;
      var pointLightHelper = new THREE.PointLightHelper(
        this.pointLight,
        sphereSize,
        "#ff0000"
      );
      // this.scene.add(pointLightHelper);

      this.spotLight.position.set(0, 0, 0);
      this.spotLight.target = this.objtemp;

      this.spotLight.castShadow = true;

      this.spotLight.shadow.mapSize.width = 1024;
      this.spotLight.shadow.mapSize.height = 1024;

      this.spotLight.shadow.camera.near = 500;
      this.spotLight.shadow.camera.far = 4000;
      this.spotLight.shadow.camera.fov = 30;

      // this.scene.add(this.spotLight);

      var spotLightHelper = new THREE.SpotLightHelper(
        this.spotLight,
        "#ff0000"
      );
      // this.scene.add(spotLightHelper);

      this.scene.add(this.ambientLight);
    },
    setup: function() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      const container = this.$refs.three;

      const W = container.offsetHeight;
      const H = container.offsetWidth;

      this.renderer.setSize(W, H);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      document
        .getElementById("three-model")
        .appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, W / H, 10, 1000); //75
      this.scene.fog = new THREE.Fog("#a1a1a1", 0.08, 800);

      this.lights();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 50;
      this.controls.maxDistance = 180;
      this.camera.position.z = -145;
      this.camera.position.y = -10;
      this.controls.update();
      let geo = new THREE.BoxGeometry(1, 1, 1);
      let mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x6b6b6b,
        roughness: 1,
        metalness: 1,
        transparent: false,
        wireframe: false
      });
      // let mat = new THREE.MeshDepthMaterial({});

      let mat2 = mat.clone();
      let mat3 = mat.clone();
      let mat4 = mat.clone();
      let mat5 = mat.clone();

      let glass = new THREE.MeshPhysicalMaterial({
        color: "#fff",
        metalness: 0,
        roughness: 0,
        alphaTest: 0.5,
        depthTest: false,
        transparency: 0.5,
        transparent: true
      });
      // let glass = new THREE.MeshDepthMaterial({transparent: true, opacity: 0.6});
      let metall = new THREE.MeshPhongMaterial({
        shininess: 80,
        color: 0xe20000,
        specular: 0xffffff
        // map: texture
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
            (object.rotation.y += 179);
          object.position.y += 10;
          object.children[0].material = metall;
          object.children[1].material = glass;
          object.children[2].material = mat;
          object.children[3].material = mat2;
          object.children[4].material = mat3;
          object.children[5].material = mat4;
          object.children[6].material = mat5;

          object.children[3].position.z -= 5;
          object.children[4].position.z -= 10;
          object.children[5].position.z -= 15;
          object.children[6].position.z -= 20;

          object.children[3].position.y += 5;
          object.children[4].position.y += 10;
          object.children[5].position.y += 15;
          object.children[6].position.y += 20;

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

