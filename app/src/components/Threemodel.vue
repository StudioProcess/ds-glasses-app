<template>
  <div ref="three" class="three-model-container">
    <ul class="three-navigation">
      <li
        v-on:click="fullscreen()"
        v-bind:class="[fullscreenToggled ? 'active navigation-element fullscreen': 'navigation-element fullscreen']"
      ></li>
      <li
        v-on:click="zoom()"
        v-bind:class="[zoomed ? 'active navigation-element plus': 'navigation-element plus']"
      ></li>
      <li v-on:click="expand()" class="navigation-element expanded"></li>
    </ul>
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
import marble from "../assets/materials/wood/ahorn.png";
import roughness_map from "../assets/materials/wood/akazie_map.png";
export default {
  name: "Threemodel",
  components: {},
  props: ["mat", "matTwo", "matThree", "matFour", "matFive", "model"],

  data: function() {
    return {
      renderer: null,
      expanded: false,
      zoomed: false,
      fullscreenToggled: false,
      scene: null,
      camera: null,
      controls: null,
      lightReset: false,
      pointLight: new THREE.PointLight(0xffffff, 2.9, 160),
      spotLight: new THREE.SpotLight(0xfdefe5, 1.5, 50),
      ambientLight: new THREE.AmbientLight(0xfdefe5, 100.0), //fdefe5
      objtemp: new THREE.Group()
    };
  },

  mounted() {
    this.setup(); // set up scene
    this.loop(); // start game loop
  },

  updated() {
    let texture = new THREE.TextureLoader().load(this.mat[1]);
    let roughness_m = new THREE.TextureLoader().load(roughness_map);
    var loader = new THREE.TextureLoader();
    if (this.lightReset === false) {
      this.pointLight.intensity = 1.0;
      let mPointLight = new THREE.PointLight(0xffffff, 2.9, 160);
      mPointLight.copy(this.pointLight);
      mPointLight.intensity = 1.0;
      mPointLight.decay = 0.0;
      mPointLight.position.z = -110;
      this.scene.add(mPointLight);
      this.scene.fog.near = 200;
      this.lightReset = true;
    }
    let temp = eval(this.mat[2]) + 1;
    loader.load(
      this.mat[1],

      function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(15, 15);

        TweenMax.to(this.objtemp.children[0].children[temp].position, 1.2, {
          y: "30",
          ease: Power2.easeOut
        });

        this.objtemp.children[0].children[temp].material.map = texture;
        this.objtemp.children[0].children[temp].metalness = 0.0;
        this.objtemp.children[0].children[temp].roughness = 0.0;
        this.objtemp.children[0].children[temp].color = 0xffffff;
        this.objtemp.children[0].children[temp].material.emissive = 0x000;
        this.objtemp.children[0].children[temp].material.alphaMap = texture;
        this.objtemp.children[0].children[temp].material.needsUpdate = true;
      }.bind(this)
    );
    for (let i = 0; i < this.objtemp.children[0].children.length; i++) {
      if (this.objtemp.children[0].children[i].position.y === 30) {
        TweenMax.to(this.objtemp.children[0].children[i].position, 1.2, {
          y: "0",
          ease: Power2.easeOut
        });
      }
    }
  },
  methods: {
    fullscreen: function() {
      this.fullscreenToggled = !this.fullscreenToggled;
      if (this.fullscreenToggled) {
        this.$refs.three.classList.add("toggledFullscreen");
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        TweenMax.to(this.objtemp.children[0].rotation, 5600.0, {
          y: 360,
          repeat: -1,
        });
      } else {
        TweenMax.to(this.objtemp.children[0].rotation, 0.0, {
          y: 3.1,
        });
        this.$refs.three.classList.remove("toggledFullscreen");
        this.camera.aspect = window.innerWidth / 2 / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
      }
    },
    zoom: function() {
      this.zoomed = !this.zoomed;
      if (this.zoomed) {
        var camOldPosition = { x: 0, y: 0, z: 0 };
        var camNewPosition = { x: -90, y: -30, z: -10 };
        var targetNewPos = { x: -90, y: -90, z: 0 };
        TweenMax.to(this.controls.target, 1.5, { x: -30, y: 20, z: 30 });
   
        this.controls.update();
      } else {

        console.log(this.controls);
        // TweenMax.to(this.controls.target, 1.5, { z: -145, x: 0, y: -10 });
        this.controls.enabled = true;
      }
    },
    expand: function() {
      this.expanded = !this.expanded;
      var l = this.objtemp.children[0].children.length,
        stagger = 0.5,
        i;
      for (i = 0; i < l; i++) {
        if (this.expanded) {
          TweenMax.to(this.objtemp.children[0].children[i].position, 1, {
            z: 0,
            y: 0,
            ease: Quad.easeOut,
            delay: stagger * (i / 2)
          });
        } else {
          TweenMax.to(this.objtemp.children[0].children[i].position, 1, {
            y: 0,
            z: -80 * stagger,
            ease: Quad.easeOut,
            delay: stagger * (i / 2)
          });
          TweenMax.to(this.objtemp.children[0].position, 1, { z: -40 });
        }
      }
    },
    expandingLayers: function() {
      var l = this.objtemp.children[0].children.length,
        stagger = 0.5,
        i;
      for (i = 0; i < l; i++) {
        TweenMax.to(this.objtemp.children[0].children[i].position, 2, {
          y: 80 * stagger,
          yoyo: true,
          repeat: 1,
          // z: 10,
          ease: Quad.easeOut,
          delay: stagger * (i / 2)
        });
      }
    },
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

      const W = container.clientWidth;
      const H = container.clientHeight;

      this.renderer.setSize(W, H);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      document
        .getElementById("three-model")
        .appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, W / H, 10, 1000); //75
      this.scene.fog = new THREE.Fog("#faf6f4", 0.08, 400);

      this.lights();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 50;
      this.controls.maxDistance = 180;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

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

      let planeGeo = new THREE.PlaneGeometry(500, 500, 30, 30);
      let depthmat = new THREE.MeshStandardMaterial({
        color: 0xbdaea8,
        emissive: 0xbfbab8,
        roughness: 1,
        metalness: 1,
        transparent: false,
        wireframe: false
      });
      let bgPlane = new THREE.Mesh(planeGeo, depthmat);
      this.scene.add(bgPlane);

      bgPlane.position.set(0, -100, 0);
      bgPlane.rotation.x += 80;
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
        shininess: 0,
        color: "#1a1a1a",
        specular: 0xebebeb
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

          object.children[2].position.z -= 5;
          object.children[3].position.z -= 10;
          object.children[4].position.z -= 15;
          object.children[5].position.z -= 20;
          object.children[6].position.z -= 25;
          this.objtemp.add(object);
        }.bind(this),

        function(xhr) {}
      );
    },

    loop: function() {
      this.controls.update();
      requestAnimationFrame(this.loop);
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

