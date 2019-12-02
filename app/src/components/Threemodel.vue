<template>
  <div ref="three" :class="[nightMode ? 'three-model-container nightmode' : 'three-model-container']">
    <ul class="three-navigation">
      <li
        v-on:click="fullscreen()"
        v-bind:class="[fullscreenToggled ? 'active navigation-element fullscreen': 'navigation-element fullscreen']"
      ></li>
      <li
        v-on:click="zoom()"
        v-bind:class="[zoomed ? 'active navigation-element plus': 'navigation-element plus']"
      ></li>
      <li
        v-on:click="expand()"
        :class="[expanded ? 'active navigation-element expanded' : 'navigation-element expanded']"
      ></li>
      <li v-on:click="nightmode()" class="nightmode">Nightmode</li>
    </ul>
    <div id="three-model"></div>
    <span
      class="three-currentmaterial"
    >material:{{mat}} model: {{setModel}}{{allHashMaterialsModel}}</span>
  </div>
</template>
  <script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/109/three.js"></script>

<script>
// import * as THREE from '../../../node_modules/three/build/three.module.js';
import model from "../assets/models/new_models/model1.obj";
import model2 from "../assets/models/new_models/model2.obj";
import model3 from "../assets/models/new_models/model3.obj";
import model4 from "../assets/models/new_models/model4.obj";
import model5 from "../assets/models/new_models/model2sl.obj";
import model6 from "../assets/models/new_models/model3sl.obj";
import model7 from "../assets/models/new_models/model4sl.obj";
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "../../../node_modules/three/examples/js/loaders/OBJLoader.js";
import roughness_map from "../assets/materials/maps/Wood24_rgh.jpg";
import normal_map from "../assets/materials/maps/Wood24_nrm.jpg";
import displacement_map from "../assets/materials/maps/Wood24_disp.jpg";
import shadow from "../assets/shadow.png";
import { encode, decode } from "../../index.js";

import {
  GodRaysShader,
  GodRaysEffect,
  RenderPass,
  EffectPass,
  EffectComposer
} from "postprocessing";

export default {
  name: "Threemodel",
  components: {},
  props: [
    "mat",
    "setModel",
    "hoveredMaterial",
    "allHashMaterialsModel",
    "useAsSunglasses"
  ],

  data: function() {
    return {
      renderer: null,
      expanded: false,
      zoomed: false,
      currentModelIndex: null,
      currentMaterialName: "Ahorn",
      currentMaterialIndex: 0,
      currentModel: model,
      fullscreenToggled: false,
      mHoveredMaterial: [0][false],
      scene: null,
      camera: null,
      controls: null,
      lightReset: false,
      modelHasLoaded: false,
      currentMaterials: [],
      nightMode: false,
      pointLight: new THREE.PointLight(0xffffff, 13.9, 360), //4.9 360
      pointLightBack: new THREE.PointLight(0xffffff, 1.0, 0),
      spotLight: new THREE.SpotLight(0xfdefe5, 1.5, 50),
      pointLightLeft: new THREE.PointLight(0xffffff, 3.9, 310),
      pointLightRight: new THREE.PointLight(0xffffff, 3.9, 310),
      ambientLight: new THREE.AmbientLight(0xfdefe5, 1.0), //fdefe5
      objtemp: new THREE.Group(),
      roughness_m: new THREE.TextureLoader().load(roughness_map),
      normal_m: new THREE.TextureLoader().load(normal_map),

      nightModeLightsGroup: new THREE.Group(),
      occlusionRenderTarget: null,
      occlusionComposer: null,
      composer: null
    };
  },

  mounted() {
    this.setup(); // set up scene
    this.loop(); // start game loop
  },
  watch: {
    useAsSunglasses: function() {
      this.updateSunglasses();
    },
    allHashMaterialsModel: function() {
      for (let i = 0; i < this.allHashMaterialsModel[0].length; i++) {
        var loader = new THREE.TextureLoader();
        loader.load(
          this.allHashMaterialsModel[0][i][0],
          function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 1);
            if (this.allHashMaterialsModel[0][i][1] === "1") {
              this.assignMaterial(texture, "Layer_1");
              this.assignMaterial(texture, "Layer_1 Layer_1B");
              this.assignMaterial(texture, "Layer_1 Layer_1N");
            } else if (this.allHashMaterialsModel[0][i][1] === "2") {
              this.assignMaterial(texture, "Layer_2");
              this.assignMaterial(texture, "Layer_2 Layer_2B");
              this.assignMaterial(texture, "Layer_2 Layer_2N");
            } else if (this.allHashMaterialsModel[0][i][1] === "3") {
              this.assignMaterial(texture, "Layer_3");
              this.assignMaterial(texture, "Layer_3 Layer_3B");
              this.assignMaterial(texture, "Layer_3 Layer_3N");
            } else if (this.allHashMaterialsModel[0][i][1] === "4") {
              this.assignMaterial(texture, "Layer_4");
              this.assignMaterial(texture, "Layer_4 Layer_4B");
              this.assignMaterial(texture, "Layer_4 Layer_4N");
            } else if (this.allHashMaterialsModel[0][i][1] === "5") {
              this.assignMaterial(texture, "Layer_5");
              this.assignMaterial(texture, "Layer_5 Layer_5B");
              this.assignMaterial(texture, "Layer_5 Layer_5N");
            }
          }.bind(this)
        );
      }
    }
  },
  updated() {
    if (this.setModel[1] !== this.currentModelIndex) {
      console.log("update model");
      this.$emit("modelLoaded", false);
      this.modelHasLoaded = false;
      setTimeout(() => {
        if (this.setModel[1] === 1) {
          this.loadModel(model);
        } else if (this.setModel[1] === 2) {
          console.log("2");
          this.loadModel(model2);
        } else if (this.setModel[1] === 3) {
          console.log("3");
          this.loadModel(model3);
        } else if (this.setModel[1] === 4) {
          console.log("4");
          this.loadModel(model4);
        } else if (this.setModel[1] === 5) {
          this.loadModel(model5);
        } else if (this.setModel[1] === 6) {
          this.loadModel(model6);
        } else if (this.setModel[1] === 7) {
          this.loadModel(model7);
        }
        this.objtemp.remove(this.objtemp.children[0]);
      }, 30);
    } else if (this.hoveredMaterial) {
      if (this.hoveredMaterial[1] === true) {
        if (this.hoveredMaterial[0] === "1") {
          this.hoverMaterial("Layer_1", true);
          this.hoverMaterial("Layer_1 Layer_1B", true);
        } else if (this.hoveredMaterial[0] === "2") {
          this.hoverMaterial("Layer_2", true);
          this.hoverMaterial("Layer_2 Layer_2B", true);
        } else if (this.hoveredMaterial[0] === "3") {
          this.hoverMaterial("Layer_3", true);
          this.hoverMaterial("Layer_3 Layer_3B", true);
        } else if (this.hoveredMaterial[0] === "4") {
          this.hoverMaterial("Layer_4", true);
          this.hoverMaterial("Layer_4 Layer_4B", true);
        } else if (this.hoveredMaterial[0] === "5") {
          this.hoverMaterial("Layer_5", true);
          this.hoverMaterial("Layer_5 Layer_5B", true);
        }
      }
      if (this.hoveredMaterial[1] === false) {
        if (this.hoveredMaterial[0] === "1") {
          this.hoverMaterial("Layer_1");
          this.hoverMaterial("Layer_1 Layer_1B");
        } else if (this.hoveredMaterial[0] === "2") {
          this.hoverMaterial("Layer_2");
          this.hoverMaterial("Layer_2 Layer_2B");
        } else if (this.hoveredMaterial[0] === "3") {
          this.hoverMaterial("Layer_3");
          this.hoverMaterial("Layer_3 Layer_3B");
        } else if (this.hoveredMaterial[0] === "4") {
          this.hoverMaterial("Layer_4");
          this.hoverMaterial("Layer_4 Layer_4B");
        } else if (this.hoveredMaterial[0] === "5") {
          this.hoverMaterial("Layer_5");
          this.hoverMaterial("Layer_5 Layer_5B");
        }
      }
    }
    if (
      (this.currentMaterialName !== this.mat[0] &&
        this.objtemp.children[0] &&
        this.modelHasLoaded) ||
      (this.currentMaterialName === this.mat[0] &&
        this.mat[1] !== this.currentMaterialIndex &&
        this.objtemp.children[0] &&
        this.modelHasLoaded)
    ) {
      console.log("update materials");
      let texture = new THREE.TextureLoader().load(this.mat[0]);
      var loader = new THREE.TextureLoader();

      let temp = eval(this.mat[1]) + 1;
      let tempTexture;
      loader.load(
        this.mat[0],

        function(texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.offset.set(0, 0);
          texture.repeat.set(1, 1);
          tempTexture = texture;
          if (this.mat[1] % 2 === 0) {
            // texture.rotation = 1.5;
            // roughness_m.rotation = 1.5;
            // normal_m.rotation = 1.5;
            // displacement_m.rotation = 1.5;
          }
          if (this.mat[1] === "1") {
            this.assignMaterial(texture, "Layer_1");
            this.assignMaterial(texture, "Layer_1 Layer_1B");
          } else if (this.mat[1] === "2") {
            this.assignMaterial(texture, "Layer_2");
            this.assignMaterial(texture, "Layer_2 Layer_2B");
          } else if (this.mat[1] === "3") {
            this.assignMaterial(texture, "Layer_3");
            this.assignMaterial(texture, "Layer_3 Layer_3B");
          } else if (this.mat[1] === "4") {
            this.assignMaterial(texture, "Layer_4");
            this.assignMaterial(texture, "Layer_4 Layer_4B");
          } else if (this.mat[1] === "5") {
            this.assignMaterial(texture, "Layer_5");
            this.assignMaterial(texture, "Layer_5 Layer_5B");
          }

          this.$set(this.currentMaterials, Number(this.mat[1]), tempTexture);
        }.bind(this)
      );
    }
    this.currentModelIndex = this.setModel[1];
    this.currentMaterialName = this.mat[0];
    this.currentMaterialIndex = this.mat[1];
  },
  methods: {
    setupPostprocessing: function() {
      let geometry = new THREE.SphereBufferGeometry(1.9, 16, 16);
      let material = new THREE.MeshBasicMaterial({ color: 0xeeffff });
      let rotationSphereGeo = new THREE.SphereBufferGeometry(100, 16, 16);
      let lightSphere = new THREE.Mesh(geometry, material);
      let rotationSphere = new THREE.Mesh(rotationSphereGeo, material);
      
      rotationSphere.layers.set(1);
      lightSphere.position.z = 70;
      rotationSphere.position.z = 70;
      lightSphere.layers.set(1);


      this.nightModeLightsGroup.add(lightSphere);
      this.scene.add(this.nightModeLightsGroup);

      let pointLightStart = new THREE.PointLight(0xffffff, 13.0, 220);
      pointLightStart.position.z = 70;
      pointLightStart.layers.set(1); 
      this.nightModeLightsGroup.add(pointLightStart);
      // if(this.nightMode){
      TweenMax.to(this.nightModeLightsGroup.rotation, 4000.0, {
          y: 360,
          z: 180,
          repeat: -1,
        });
        
        // }else{

        // }

this.nightModeLightsGroup.layers.set(1);
      let godraysEffect = new GodRaysEffect(this.camera, lightSphere, {
        resolutionScale: 1,
        density: 0.8,
        decay: 0.95,
        weight: 0.9,
        samples: 100,
        resolution: 240
      });
      let renderPass = new RenderPass(this.scene, this.camera);
      let effectPass = new EffectPass(this.camera, godraysEffect);
      effectPass.renderToScreen = true;

      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderPass);
      this.composer.addPass(effectPass);
    },
    nightmode: function() {
      this.nightMode = !this.nightMode;
      if (this.nightMode) {
        this.lights(true);
      } else {
        this.lights();
      }
    },
    hoverMaterial: function(name, expand) {
      TweenMax.to(
        this.objtemp.children[0].getObjectByName(name).position,
        1.2,
        {
          y: expand === true ? 30 : 0,
          ease: Power2.easeOut
        }
      );
    },
    assignMaterial: function(
      texture,
      name
      // this.roughness_map,
      // this.normal_map,
      // displacement_map
    ) {
      this.objtemp.children[0].getObjectByName(name).material.map = texture;
      this.objtemp.children[0].getObjectByName(name).material.metalness = 0.0;

      this.objtemp.children[0].getObjectByName(name).material.roughness = 3.0;
      this.objtemp.children[0].getObjectByName(name).color = 0xa1a1a1;
      this.objtemp.children[0].getObjectByName(name).material.emissive = false;

      this.objtemp.children[0].getObjectByName(
        name
      ).material.roughnessMap = this.roughness_m;
      this.objtemp.children[0].getObjectByName(
        name
      ).material.normalMap = this.normal_m;
      this.objtemp.children[0].getObjectByName(name).fog = false;
      this.objtemp.children[0].getObjectByName(
        name
      ).material.needsUpdate = true;
      this.objtemp.children[0].getObjectByName(name).layers.set(1);
      console.log(
        this.objtemp.children[0].getObjectByName(name).material.roughnessMap
      );
    },
    fullscreen: function() {
      this.fullscreenToggled = !this.fullscreenToggled;
      if (this.fullscreenToggled) {
        this.$refs.three.classList.add("toggledFullscreen");
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        TweenMax.to(this.objtemp.children[0].rotation, 5600.0, {
          y: 360,
          repeat: -1
        });
      } else {
        TweenMax.to(this.objtemp.children[0].rotation, 0.0, {
          y: 3.1
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
        this.controls.enabled = true;
      }
    },
    expand: function() {
      var tl = new TimelineMax({ paused: false });
      var tlTwo = new TimelineMax({ paused: false });

      let child = this.objtemp.children[0].children.slice(0).reverse().map(o => {
        let positions = [];
        if (
          o.name !== "Glas" &&
          o.name !== "Scharnier" &&
          o.name !== "Layer_1 Layer_1B" &&
          o.name !== "Layer_2 Layer_2B" &&
          o.name !== "Layer_3 Layer_3B" &&
          o.name !== "Layer_4 Layer_4B" &&
          o.name !== "Layer_5 Layer_5B" &&
          o.name !== "Layer_1 Layer_1N" &&
          o.name !== "Layer_2 Layer_2N" &&
          o.name !== "Layer_3 Layer_3N" &&
          o.name !== "Layer_4 Layer_4N" &&
          o.name !== "Layer_5 Layer_5N"
        ) {
          positions = o.position;
        }
        return positions;
      });
      let extras = this.objtemp.children[0].children.map(o => {
        let positions = [];
        if (
          o.name !== "Layer_1" &&
          o.name !== "Layer_2" &&
          o.name !== "Layer_3" &&
          o.name !== "Layer_4" &&
          o.name !== "Layer_5" &&
          o.name !== "Layer_1 Layer_1B" &&
          o.name !== "Layer_2 Layer_2B" &&
          o.name !== "Layer_3 Layer_3B" &&
          o.name !== "Layer_4 Layer_4B" &&
          o.name !== "Layer_5 Layer_5B" &&
          o.name !== "Layer_1 Layer_1N" &&
          o.name !== "Layer_2 Layer_2N" &&
          o.name !== "Layer_3 Layer_3N" &&
          o.name !== "Layer_4 Layer_4N" &&
          o.name !== "Layer_5 Layer_5N"
        ) {
          positions = o.position;
        }
        return positions;
      });

      tl.staggerTo(
        child,
        0.5,
        {
          cycle: {
            z: this.expanded
              ? [0, 0]
              : function(j) {
                  return 3 * j;
                },
            delay: function(j) {
              return Math.abs(Math.floor(5 / 2) - j) * 0.25;
            }
          }
        },
        0
      );
      // tlTwo.staggerTo(
      //   //GLAS AND SCHARNIER
      //   extras,
      //   0.3,
      //   {
      //     cycle: {
      //       z: this.expanded
      //         ? [0, 0]
      //         : function(j) {
      //             return 6 * j + 0.3;
      //           },
      //       delay: function(j) {
      //         return Math.abs(Math.floor(5 / 2) - j) * 0.25;
      //       }
      //     }
      //   },
      //   0
      // );

      // tlTwo.staggerTo(
      //   extras,
      //   0.3,
      //   {
      //     cycle: {
      //       z: this.expanded
      //         ? [0, 0]
      //         : function(j) {
      //             return (6 * j)+0.3;
      //           },
      //       delay: function(j) {
      //        return Math.abs(Math.floor(5 / 2) - j) * 0.25;
      //       }
      //     }
      //   },
      //   0
      // );
      this.expanded = !this.expanded;
    },

    lights: function(deactivate) {
      this.pointLight.position.set(0, 20, -300);

      let pointLightBg = new THREE.PointLight(0xffffff, 1.0);
      pointLightBg.copy(this.pointLight);
      pointLightBg.intensity = 1.9;

      this.scene.add(pointLightBg);
      pointLightBg.layers.set(4); //backgroundLayer

      let pointLightStart = new THREE.PointLight(0xffffff, 2.0, 220);
      pointLightStart.position.z = -160;
      pointLightStart.layers.set(0); //backgroundLayer

      this.pointLightBack.position.set(0, -10, 90);

      this.pointLightLeft.position.set(160, 20, 30);
      this.pointLightLeft.layers.set(1);

      this.pointLightRight.position.set(-220, 20, 30);
      this.pointLightRight.layers.set(1);

      let directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(30, -10, -20);
      var helper = new THREE.DirectionalLightHelper(
        directionalLight,
        5,
        "#00ff00"
      );
      var pointLightHelper = new THREE.PointLightHelper(
        this.pointLight,
        20,
        "#ff0000"
      );
      this.pointLight.layers.set(1);
      this.pointLightBack.layers.set(1);
      directionalLight.layers.set(2);

      if (deactivate) {
        this.scene.remove(directionalLight);
        this.scene.remove(this.pointLightLeft);
        this.scene.remove(this.pointLight);
        this.scene.remove(pointLightBg);
        this.scene.remove(pointLightStart);
        this.scene.remove(this.pointLightBack);
      } else {
        this.scene.add(directionalLight);
        this.scene.add(this.pointLightLeft);
        this.scene.add(this.pointLight);
        this.scene.add(pointLightBg);
        this.scene.add(pointLightStart);
        this.scene.add(this.pointLightBack);
      }
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
      this.scene.fog = new THREE.Fog("#faf6f4", 100, 400);

      this.lights();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 50;
      this.controls.maxDistance = 180;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

      this.camera.position.z = -145;
      this.camera.position.y = -10;
      this.controls.update();

      this.setupPostprocessing();

      let planeGeo = new THREE.PlaneGeometry(200, 100, 10, 10);
      let planeTexLoader = new THREE.TextureLoader();
      planeTexLoader.load(
        shadow,
        function(texture) {
          texture.rotation;
          let depthmat = new THREE.MeshStandardMaterial({
            color: 0xfff,
            emissive: 0xbfbab8,
            transparent: true,
            wireframe: false,
            opacity: 0.2,
            map: texture
          });
          console.log(texture);
          let bgPlane = new THREE.Mesh(planeGeo, depthmat);
          this.scene.add(bgPlane);
          bgPlane.layers.set(4);
          bgPlane.position.set(0, -80, 50);
          bgPlane.rotation.x += 80;
        }.bind(this)
      );

      this.scene.add(this.objtemp);
    },
    loadModel: function(model) {
      let mat = new THREE.MeshStandardMaterial({
        color: 0x473d34,
        emissive: 0xded7d2, //6b6b6b
        roughness: 1,
        metalness: 1,
        transparent: true,
        opacity: 1.0,
        wireframe: false,
        normalMap: new THREE.TextureLoader().load(normal_map),

        fog: true
      });
      let matStart = mat.clone();
      let mat2 = mat.clone();
      let mat3 = mat.clone();
      let mat4 = mat.clone();
      let mat5 = mat.clone();

      let glass = new THREE.MeshPhysicalMaterial({
        color: "#D2DDDE",
        metalness: 0.0,
        roughness: 0.0,
        alphaTest: 0.5,
        depthTest: false,
        transparent: true,
        transparency: 0.8
      });
      // let glass = new THREE.MeshDepthMaterial({transparent: true, opacity: 0.6});
      let metall = new THREE.MeshPhongMaterial({
        shininess: 0,
        color: "#1a1a1a",
        specular: 0xebebeb
      });

      const loader = new THREE.OBJLoader();

      loader.load(
        model,
        function(object) {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material = matStart;
              child.layers.set(0);
            }
          }),
            (object.rotation.y += 179);
          object.position.y += 10;

          object.getObjectByName("Glas").material = glass;
          object.getObjectByName("Scharnier").material = metall;
          object.getObjectByName("Glas").layers.set(2);
          object.getObjectByName("Layer_1").material = mat;
          object.getObjectByName("Layer_1 Layer_1B").material = mat;
          object.getObjectByName("Layer_1 Layer_1N").material = mat;
          object.getObjectByName("Layer_2").material = mat2;
          object.getObjectByName("Layer_2 Layer_2B").material = mat2;
          object.getObjectByName("Layer_2 Layer_2N").material = mat2;
          object.getObjectByName("Layer_3").material = mat3;
          object.getObjectByName("Layer_3 Layer_3B").material = mat3;
          object.getObjectByName("Layer_3 Layer_3N").material = mat3;
          object.getObjectByName("Layer_4").material = mat4;
          object.getObjectByName("Layer_4 Layer_4B").material = mat4;
          object.getObjectByName("Layer_4 Layer_4N").material = mat4;
          object.getObjectByName("Layer_5").material = mat5;
          object.getObjectByName("Layer_5 Layer_5B").material = mat5;
          object.getObjectByName("Layer_5 Layer_5N").material = mat5;
          this.objtemp.add(object);
          this.modelHasLoaded = true;
          this.expanded = false;
          this.$emit("modelLoaded", true);

          if (this.currentMaterials.length > 0) {
            if (this.currentMaterials[1] !== undefined) {
              this.assignMaterial(this.currentMaterials[1], "Layer_1");
              this.assignMaterial(this.currentMaterials[1], "Layer_1 Layer_1B");
              this.assignMaterial(this.currentMaterials[1], "Layer_1 Layer_1N");
            }
            if (this.currentMaterials[2] !== undefined) {
              this.assignMaterial(this.currentMaterials[2], "Layer_2");
              this.assignMaterial(this.currentMaterials[2], "Layer_2 Layer_2B");
              this.assignMaterial(this.currentMaterials[1], "Layer_2 Layer_2N");
            }
            if (this.currentMaterials[3] !== undefined) {
              this.assignMaterial(this.currentMaterials[3], "Layer_3");
              this.assignMaterial(this.currentMaterials[3], "Layer_3 Layer_3B");
              this.assignMaterial(this.currentMaterials[1], "Layer_3 Layer_3N");
            }
            if (this.currentMaterials[4] !== undefined) {
              this.assignMaterial(this.currentMaterials[4], "Layer_4");
              this.assignMaterial(this.currentMaterials[4], "Layer_4 Layer_4B");
              this.assignMaterial(this.currentMaterials[1], "Layer_4 Layer_4N");
            }
            if (this.currentMaterials[5] !== undefined) {
              this.assignMaterial(this.currentMaterials[5], "Layer_5");
              this.assignMaterial(this.currentMaterials[5], "Layer_5 Layer_5B");
              this.assignMaterial(this.currentMaterials[1], "Layer_5 Layer_5N");
            }
            if (this.useAsSunglasses) {
              this.updateSunglasses();
            }
          }
        }.bind(this),

        function(xhr) {}
      );
    },
    updateSunglasses: function() {
      let glass = new THREE.MeshPhysicalMaterial({
        color: "#D2DDDE",
        metalness: 0.0,
        roughness: 0.0,
        alphaTest: 0.5,
        depthTest: false,
        transparent: true,
        transparency: 0.8
      });
      let sunglassesGlass = new THREE.MeshPhysicalMaterial({
        color: "#000000",
        metalness: 1.0,
        roughness: 0.0,
        alphaTest: 0.1,
        depthTest: false,
        transparent: true,
        transparency: 0.2
      });
      if (this.useAsSunglasses) {
        this.objtemp.children[0].getObjectByName(
          "Glas"
        ).material = sunglassesGlass;
      } else {
        this.objtemp.children[0].getObjectByName("Glas").material = glass;
      }
    },
    loop: function() {
      requestAnimationFrame(this.loop);
      this.controls.update();
      // this.renderer.setClearColor( 0xa1a1a1 );

      this.renderer.autoClear = true;
      this.camera.layers.set(0);
      this.renderer.render(this.scene, this.camera);
      if (!this.nightMode) {
        this.renderer.autoClear = false;
        this.camera.layers.set(1);
        this.renderer.render(this.scene, this.camera);
      }
      this.renderer.autoClear = false;
      this.camera.layers.set(2);
      this.renderer.render(this.scene, this.camera);

      this.renderer.autoClear = false;
      this.camera.layers.set(4);
      this.renderer.render(this.scene, this.camera);

      if (this.nightMode) {
        this.camera.layers.set(1);
        this.composer.render(this.scene, this.camera);
      }
    }
  }
};
</script>

