<template>
  <div
    ref="three"
    :class="[nightMode ? 'three-model-container nightmode' : 'three-model-container', fullscreenToggled && 'toggledFullscreen']"
    v-on:click="fullscreenClick()"
  >
    <ul :class="[nightMode ? 'three-navigation nightmode' :'three-navigation']">
      <li v-on:click="expand()">
        <span
          :class="[expanded ? 'active navigation-element expanded' : 'navigation-element expanded']"
        ></span>
        <p class="text-button">Schichten Aus-/Einklappen</p>
      </li>
      <li v-on:click="fullscreen()">
        <span
          v-bind:class="[fullscreenToggled ? 'active navigation-element fullscreen': 'navigation-element fullscreen']"
        ></span>
        <p class="text-button">Vollbild</p>
      </li>
      <!-- <li class="small" v-on:click="nightmode()">
        <span
          :class="[nightMode ? 'active navigation-element nightmode' : 'navigation-element nightmode']"
        ></span>
        <p class="text-button"></p>
      </li>-->
    </ul>

    <span
      :class="[(positionLocked && !this.$refs.posOne.classList.contains('active')) ? 'view-plus hide' : 'view-plus', fullscreenToggled ? 'view-plus hide' : 'view-plus']"
      ref="posOne"
      v-on:click="setCameraPosition($event, 0, 0, -70, 0, '+=0.9', '-=0.9')"
    ></span>
    <span
      :class="[(positionLocked && !this.$refs.posTwo.classList.contains('active')) ? 'view-plus hide' : 'view-plus', fullscreenToggled ? 'view-plus hide' : 'view-plus']"
      ref="posTwo"
      v-on:click="setCameraPosition($event, 0, -20, -220, 60, '-=0.9', '+=0.9')"
    ></span>
    <div id="three-model"></div>
    <span
      class="three-currentmaterial"
    >material:{{mat}} model: {{setModel}}{{allHashMaterialsModel}}</span>
  </div>
</template>
  <script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/109/three.js"></script>

<script>
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
import roughness_map_metal from "../assets/materials/maps/Metal_rgh.jpg";
import map_metal from "../assets/materials/maps/Metal_col.jpg";
import alpha_glass from "../assets/materials/maps/sunglasses-alpha.png";

import normal_map from "../assets/materials/maps/Wood24_nrm.jpg";
import shadow from "../assets/materials/maps/shadow.png";
import particle from "../assets/particle.png";
import { encode, decode } from "ds-glasses-code";

import {
  BloomEffect,
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
    "useAsSunglasses",
    "sunglasses",
    "sunglassesFromHash",
    "resetMaterialsTrigger"
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
      fullscreenRotationPaused: false,
      mHoveredMaterial: [0][false],
      scene: null,
      camera: null,
      controls: null,
      lightReset: false,
      positionLocked: false,
      modelHasLoaded: false,
      currentMaterials: [],
      currentSunglasses: "",
      nightMode: false,
      pointLight: new THREE.PointLight(0xffffff, 1.2), //4.9 360
      pointLightBack: new THREE.PointLight(0xffffff, 1.0, 0),
      pointLightLeft: new THREE.PointLight(0xffffff, 1.0),
      pointLightRight: new THREE.PointLight(0xffffff, 1.0),
      ambientLight: new THREE.AmbientLight(0x6a7c91, 6.0),
      objtemp: new THREE.Group(),
      roughness_m: new THREE.TextureLoader().load(roughness_map),
      roughness_metall: new THREE.TextureLoader().load(roughness_map_metal),
      normal_m: new THREE.TextureLoader().load(normal_map),
      sunglasses_alpha_m: new THREE.TextureLoader().load(alpha_glass),
      finishedLoadingAllHashMaterials: false,
      isLoading: false,
      pos1: null,
      pos2: null,
      nightModeLightsGroup: new THREE.Group(),
      pivot: new THREE.Group(),
      occlusionRenderTarget: null,
      occlusionComposer: null,
      composer: null,
      lightSphere: null,
      nMPoint1: null,
      nMPoint2: null,
      nMPoint3: null,
      time: 0.0
    };
  },

  mounted() {
    this.setup(); // set up scene
    this.loop(); // start game loop

    window.addEventListener("resize", this.onWindowResize);
    window.addEventListener("onmousemove", this.onMouseMove);
      this.$emit("loadedAllHashMaterials", true);
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("onmousemove", this.onMouseMove, false);
  },
  watch: {
    resetMaterialsTrigger: function() {
      this.currentMaterials = [];
      this.currentSunglasses = "";
      for (let i = 0; i < this.objtemp.children[0].children.length; i++) {
        if (
          this.objtemp.children[0].children[i].name !== "Glas" &&
          this.objtemp.children[0].children[i].name !== "Scharnier"
        ) {
          this.objtemp.children[0].children[i].material.map = null;
          this.objtemp.children[0].children[i].material.roughnessMap = null;
          this.objtemp.children[0].children[i].material.normalMap = null;
          if (!this.nightMode) {
            this.objtemp.children[0].children[
              i
            ].material.color = new THREE.Color(0x473d34);
          } else {
            this.objtemp.children[0].children[
              i
            ].material.color = new THREE.Color(0x262626);
          }
          this.objtemp.children[0].children[
            i
          ].material.emissive = new THREE.Color(0xded7d2);
          this.objtemp.children[0].children[i].material.roughness = 1;
          this.objtemp.children[0].children[i].material.metalness = 1;
          if (!this.nightMode) {
            this.objtemp.children[0].children[i].layers.set(0);
          } else {
            this.objtemp.children[0].children[i].layers.set(1);
          }
          this.objtemp.children[0].children[i].material.needsUpdate = true;
        }
      }
    },
    sunglasses: function() {
      this.updateSunglasses();
    },
    useAsSunglasses: function() {
      this.updateSunglasses();
    },
    sunglassesFromHash: function() {
      if (this.sunglassesFromHash) {
        this.updateSunglasses();
      }
    },
    allHashMaterialsModel: function() {
      this.finishedLoadingAllHashMaterials = false;
      this.$emit("loadedAllHashMaterials", false);

      if (this.allHashMaterialsModel[0]) {
        for (let i = 0; i < this.allHashMaterialsModel[0].length; i++) {
          var loader = new THREE.TextureLoader();
          loader.load(
            this.allHashMaterialsModel[0][i][0],
            function(texture) {
              texture.wrapT = THREE.MirroredRepeatWrapping;
              texture.wrapS = THREE.MirroredRepeatWrapping;
              texture.center.set(0.5, 0.5);

              texture.offset.set(10, 0);
              texture.repeat.set(1, 1);
              texture.rotation = 1.57;
              if ((i + 1) % 2 === 0) {
                texture.rotation = 0;
              }
              if (this.allHashMaterialsModel[0][i][1] === "1" && i === 1) {
                this.assignMaterial(texture, "Layer_1");
                this.assignMaterial(texture, "Layer_1 Layer_1B");
                this.assignMaterial(texture, "Layer_1 Layer_1N");
              } else if (
                this.allHashMaterialsModel[0][i][1] === "2" &&
                i === 2
              ) {
                this.assignMaterial(texture, "Layer_2");
                this.assignMaterial(texture, "Layer_2 Layer_2B");
                this.assignMaterial(texture, "Layer_2 Layer_2N");
              } else if (
                this.allHashMaterialsModel[0][i][1] === "3" &&
                i === 3
              ) {
                this.assignMaterial(texture, "Layer_3");
                this.assignMaterial(texture, "Layer_3 Layer_3B");
                this.assignMaterial(texture, "Layer_3 Layer_3N");
              } else if (
                this.allHashMaterialsModel[0][i][1] === "4" &&
                i === 4
              ) {
                this.assignMaterial(texture, "Layer_4");
                this.assignMaterial(texture, "Layer_4 Layer_4B");
                this.assignMaterial(texture, "Layer_4 Layer_4N");
              } else if (
                this.allHashMaterialsModel[0][i][1] === "5" &&
                i === 5
              ) {
                this.assignMaterial(texture, "Layer_5");
                this.assignMaterial(texture, "Layer_5 Layer_5B");
                this.assignMaterial(texture, "Layer_5 Layer_5N");
                this.finishedLoadingAllHashMaterials = true;
                this.$emit("loadedAllHashMaterials", true);
              }
            }.bind(this)
          );
        }
      }
    }
  },

  updated() {
    if (this.setModel[1] !== this.currentModelIndex) {
      this.$emit("modelLoaded", false);
      this.modelHasLoaded = false;
      // setTimeout(() => {
      if (!this.isLoading) {
        if (this.setModel[1] === 1) {
          this.loadModel(model);
        } else if (this.setModel[1] === 2) {
          this.loadModel(model2);
        } else if (this.setModel[1] === 3) {
          this.loadModel(model3);
        } else if (this.setModel[1] === 4) {
          this.loadModel(model4);
        } else if (this.setModel[1] === 5) {
          this.loadModel(model5);
        } else if (this.setModel[1] === 6) {
          this.loadModel(model6);
        } else if (this.setModel[1] === 7) {
          this.loadModel(model7);
        }
        this.objtemp.remove(this.objtemp.children[0]);
      }
      // }, 30);
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
      var loader = new THREE.TextureLoader();

      let temp = eval(this.mat[1]) + 1;
      let tempTexture;
      loader.load(
        this.mat[0],

        function(texture) {
          texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
          texture.offset.set(0, 0);
          texture.repeat.set(1.2, 1.2);
          texture.repeat.set(1.2, 1.2);
          texture.offset.set(2.9, 0.2);
          texture.rotation = 0;
          if (this.mat[1] % 2 === 0) {
            texture.rotation = 1.57;
          }

          tempTexture = texture;
          if (this.mat[1] === "1" && this.finishedLoadingAllHashMaterials) {
            texture.offset.set(0, 0); //texture.offset.set(1.5, 0);2.9
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
    fullscreenClick: function() {
      this.fullscreenRotationPaused = !this.fullscreenRotationPaused;
      console.log(this.fullscreenRotationPaused);
    },
    setupPostprocessing: function() {
      var geometry = new THREE.Geometry();
      var v1 = new THREE.Vector3(0, 10, 30);
      var v2 = new THREE.Vector3(-30, -10, -30);
      var v3 = new THREE.Vector3(30, 0, -30);

      geometry.vertices.push(v1);
      geometry.vertices.push(v2);
      geometry.vertices.push(v3);

      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.computeFaceNormals();

      let material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 15,
        transparency: true,
        alphaTest: 0.9,
        map: new THREE.TextureLoader().load(particle)
      });

      let materialTwo = new THREE.MeshNormalMaterial({
        color: 0xeeff00,
        wireframe: true
      });
      let rotationSphereGeo = new THREE.SphereBufferGeometry(100, 16, 16);
      this.lightSphere = new THREE.Points(geometry, material);
      this.lightSphere.position.z = 20;
      this.lightSphere.layers.set(1);

      let pointLightTwo = new THREE.PointLight(0xffffff, 4.0, 0);
      pointLightTwo.position.set(20, -10, -80);
      pointLightTwo.layers.set(1);

      let box = new THREE.Box3().setFromObject(this.lightSphere);
      box.center(this.lightSphere.position); // this re-sets the mesh position
      this.lightSphere.position.multiplyScalar(0);

      this.pivot = new THREE.Group();
      this.pivot.add(this.lightSphere);

      this.nMPoint1 = new THREE.SpotLight(0xffffff, 3); //0x0000ff     30, 60, 2
      this.nMPoint1.layers.set(1);
      this.nMPoint2 = new THREE.SpotLight(0xffffff, 3); //0xff0000     30, 80, 2
      this.nMPoint2.layers.set(1);
      this.nMPoint3 = new THREE.SpotLight(0xffffff, 3); //0xffff00     30, 80, 2
      this.nMPoint3.layers.set(1);
      this.nMPoint1.penumbra = 0.5;
      this.nMPoint2.penumbra = 0.5;
      this.nMPoint3.penumbra = 0.5;
      this.nightModeLightsGroup.add(this.nMPoint1);
      this.nightModeLightsGroup.add(this.nMPoint2);
      this.nightModeLightsGroup.add(this.nMPoint3);

      this.nightModeLightsGroup.layers.set(1);
      let renderPass = new RenderPass(this.scene, this.camera);
      let effectPass = new EffectPass(
        this.camera,
        new BloomEffect(this.camera, this.lightSphere, {
          kernelSize: 5,
          scale: 0.1,
          threshold: 3,
          screenMode: "DIFFERENCE",
          smoothing: 0,
          opacity: 4
        })
      );

      effectPass.renderToScreen = true;
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderPass);
      this.composer.addPass(effectPass);
    },
    nightmode: function() {
      this.nightMode = !this.nightMode;
      if (this.nightMode) {
        this.scene.fog.near = 300;
        this.scene.fog.color = new THREE.Color(0x0f0f0f);
        for (let i = 1; i < this.objtemp.children[0].children.length - 1; i++) {
          this.objtemp.children[0].children[i].material.emissiveIntensity = 0;
          if (this.objtemp.children[0].children[i].material) {
            this.objtemp.children[0].children[
              i
            ].material.color = new THREE.Color(0x262626);
          }
          this.objtemp.children[0].children[i].material.needsUpdate = true;
          this.objtemp.children[0].children[i].layers.set(1);
        }
        this.scene.add(this.nightModeLightsGroup);
        this.scene.add(this.pivot);
        this.lights(true);
        TweenMax.to(this.pivot.rotation, 5600.0, {
          y: -360,
          z: 180,
          repeat: -1,
          yoyo: true
        });

        let R = 20;
        let R2 = 20;
        let R3 = 30;
        let mult = 2;
        TweenMax.to(this.lightSphere.geometry.vertices[0], 23, {
          bezier: {
            curviness: 1.5,
            values: [
              { x: 0 * mult, z: R * mult },
              { x: (R / 2) * mult, z: (R / 2) * mult },
              { x: 0 * mult, z: -40 * mult },
              { x: (-R / 2) * mult, z: (R / 2) * mult },
              { x: 0 * mult - 2.1, z: R * mult - 2.1 }
            ],
            autoRotate: 90
          },
          ease: Linear.easeNone,
          repeat: -1
        });
      } else {
        this.scene.fog.near = 100;
        this.scene.fog.color = new THREE.Color(0xfaf6f4);
        for (let i = 1; i < this.objtemp.children[0].children.length - 1; i++) {
          this.objtemp.children[0].children[i].material.emissiveIntensity = 0.9;
          if (this.objtemp.children[0].children[i].material) {
            this.objtemp.children[0].children[
              i
            ].material.color = new THREE.Color(0x473d34);
          }
          this.objtemp.children[0].children[i].material.needsUpdate = true;
          this.objtemp.children[0].children[i].layers.set(1);
        }
        this.scene.remove(this.nightModeLightsGroup);
        this.scene.remove(this.pivot);
        this.lights();
      }
    },
    hoverMaterial: function(name, expand) {
      if (this.modelHasLoaded) {
        let expandingValue = 4.0;
        if (this.currentModelIndex === 1) {
          expandingValue = 4.0;
        }
        if (this.currentModelIndex === 2 || this.currentModelIndex === 5) {
          expandingValue = 4.8;
        }
        if (this.currentModelIndex === 3 || this.currentModelIndex === 6) {
          expandingValue = 3.82;
        }
        if (this.currentModelIndex === 4 || this.currentModelIndex === 7) {
          expandingValue = 3.62;
        }
        if (this.expanded) {
          TweenMax.to(
            this.objtemp.children[0].getObjectByName(name).position,
            1.2,
            {
              y: expand === true ? 30 : 0,
              ease: Power2.easeOut
            }
          );
        } else {
          TweenMax.to(
            this.objtemp.children[0].getObjectByName(name).position,
            1.2,
            {
              y: expand === true ? 30 : 0,
              z: expand === true ? expandingValue : 0, //3.8
              ease: Power2.easeOut
            }
          );
        }
        TweenMax.to(
          this.objtemp.children[0].getObjectByName(name).rotation,
          1.2,
          {
            x: expand === true ? -0.03 : 0
          }
        );
      }
    },
    assignMaterial: function(texture, name) {
      if (this.modelHasLoaded) {
        this.objtemp.children[0].getObjectByName(name).material.map = texture;
        this.objtemp.children[0].getObjectByName(name).material.metalness = 0.0;

        this.objtemp.children[0].getObjectByName(name).material.roughness = 3.0;
        this.objtemp.children[0].getObjectByName(name).color = 0xa1a1a1;
        this.objtemp.children[0].getObjectByName(
          name
        ).material.emissive = 0x000000;

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
      }
    },
    fullscreen: function() {
      this.fullscreenToggled = !this.fullscreenToggled;
      if (this.fullscreenToggled) {
        this.positionLocked = false;
        this.resetCameraPosition();
        this.$refs.three.classList.add("toggledFullscreen");
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        console.log(this.fullscreenRotationPaused);

        let tween = TweenMax.to(this.objtemp.children[0].rotation, 5600.0, {
          y: 360,
          repeat: -1
        });
        //  rotateModel.resume();
        if (this.fullscreenRotationPaused) {
          console.log("??????");
          tween.paused();
        }
      } else {
        TweenMax.to(this.objtemp.children[0].rotation, 0.0, {
          y: 3.1
        });
        this.$refs.three.classList.remove("toggledFullscreen");
        this.camera.aspect = window.innerWidth / 2 / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
      }
      this.onWindowResize();
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

      if (!this.expanded) {
        this.objtemp.children[0].getObjectByName("Glas").visible = false;
        this.objtemp.children[0].getObjectByName("Scharnier").visible = false;
        let child = this.objtemp.children[0].children.slice(0).map(o => {
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
        let distance = 0.75;
        if (this.currentModelIndex === 1) {
          distance = 0.2;
        }
        if (this.currentModelIndex === 3 || this.currentModelIndex === 6) {
          distance = 1.3;
        }
        if (this.currentModelIndex === 4 || this.currentModelIndex === 7) {
          distance = -4;
        }
        tl.staggerTo(
          child,
          0.4,
          {
            cycle: {
              z:
                this.currentModelIndex !== 2 && this.currentModelIndex !== 5
                  ? function(j) {
                      return 40 - (j - distance) * 3;
                    }
                  : function(j) {
                      return 40 - (j + 1.4) * 6;
                    },
              delay: function(j) {
                return Math.sin(0.003) * j;
              }
            }
          },
          0
        );
      } else {
        // INFLATE
        this.objtemp.children[0].getObjectByName("Glas").visible = true;
        this.objtemp.children[0].getObjectByName("Scharnier").visible = true;
        let child = this.objtemp.children[0].children
          .slice(0)
          .reverse()
          .map(o => {
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
        tl.staggerTo(
          child,
          0.5,
          {
            cycle: {
              z: this.expanded
                ? [0, 0]
                : function(j) {
                    return 0;
                  },
              delay: function(j) {
                return 0.005 * j;
              }
            }
          },
          0
        );
      }
      this.expanded = !this.expanded;
    },

    lights: function(deactivate) {
      this.pointLight.position.set(0, 20, -300);

      let pointLightBg = new THREE.PointLight(0xffffff, 1.0);
      pointLightBg.copy(this.pointLight);
      pointLightBg.intensity = 1.9;

      pointLightBg.layers.set(4); //backgroundLayer

      let pointLightStart = new THREE.PointLight(0xffffff, 0.5);
      pointLightStart.position.z = -160;
      pointLightStart.layers.set(0); //backgroundLayer

      this.pointLightBack.position.set(0, -10, 90);

      this.pointLightLeft.position.set(160, 20, 30);
      this.pointLightLeft.layers.set(1);

      this.ambientLight.layers.set(1);

      this.pointLightRight.position.set(-180, 20, 30);
      this.pointLightRight.layers.set(1);

      let directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      let directionalLightBack = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(0, -10, -20); //30
      directionalLightBack.position.set(0, -10, 20); //30
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
      directionalLightBack.layers.set(2);

      if (deactivate) {
        this.scene.remove(directionalLight);
        this.scene.remove(this.pointLightLeft);
        this.scene.remove(this.pointLight);
        this.scene.remove(pointLightBg);
        this.scene.remove(pointLightStart);
        this.scene.remove(this.pointLightBack);
        this.scene.remove(this.ambientLight);
      } else {
        this.scene.add(pointLightBg);
        this.scene.add(directionalLight);
        this.scene.add(directionalLightBack);
        this.scene.add(this.pointLightLeft);
        this.scene.add(this.pointLight);
        this.scene.add(pointLightBg);
        this.scene.add(pointLightStart);
        this.scene.add(this.pointLightBack);
        this.scene.add(this.ambientLight);
        this.scene.add(this.pointLightRight);
      }
    },
    setup: function() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      const container = this.$refs.three;
      container.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
      };

      const W = container.clientWidth;
      const H = container.clientHeight;

      this.renderer.setSize(W, H);
      this.renderer.setPixelRatio(window.devicePixelRatio); // / 4
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
      this.controls.enablePan = false;

      this.camera.position.z = -145;
      this.camera.position.y = -10;
      this.controls.update();

      // this.setupPostprocessing();

      // SETUP SPHERES FOR ZOOM VIEW
      let posGeo = new THREE.SphereBufferGeometry(0.5, 2, 2);
      let posMat = new THREE.MeshBasicMaterial({ color: 0xff001e });
      this.pos1 = new THREE.Mesh(posGeo, posMat);
      this.pos2 = new THREE.Mesh(posGeo, posMat);
      this.pos1.position.set(20, -10, 10);
      this.pos2.position.set(-80, 0, 0);
      this.pos1.visible = false;
      this.pos2.visible = false;
      this.scene.add(this.pos1);
      this.scene.add(this.pos2);

      let planeGeo = new THREE.PlaneGeometry(200, 100, 10, 10);
      let planeTexLoader = new THREE.TextureLoader();
      planeTexLoader.load(
        shadow,
        function(texture) {
          texture.rotation;
          let depthmat = new THREE.MeshStandardMaterial({
            color: 0x3d3d3d,
            emissive: 0xbfbab8,
            transparent: true,
            wireframe: false,
            opacity: 0.2,
            map: texture
          });
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
      let glass;
      glass = new THREE.MeshPhysicalMaterial({
        color: "#D2DDDE",
        metalness: 0.0,
        roughness: 0.0,
        alphaTest: 0.5,
        depthTest: true,
        transparent: true,
        transparency: 0.8
      });
      if (!this.useAsSunglasses) {
      } else {
        // this.updateSunglasses();
        // glass = new THREE.MeshPhysicalMaterial({
        //   color: "#000000",
        //   metalness: 1.0,
        //   roughness: 0.0,
        //   alphaTest: 0.1,
        //   depthTest: true,
        //   transparent: true,
        //   transparency: 0.2
        // }
        // );
      }
      let metall = new THREE.MeshStandardMaterial({
        emissive: 0x9e9e9e, //6b6b6b
        emissiveIntensity: 0.4,
        roughness: 4.8,
        metalness: 0.1,
        color: "#404040",
        roughnessMap: new THREE.TextureLoader().load(roughness_map_metal),
        map: new THREE.TextureLoader().load(map_metal)
      });
      const loader = new THREE.OBJLoader();
      if (!this.isLoading) {
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
            this.assignBasicMaterials(object, glass, metall, mat, matStart);
            this.objtemp.add(object);
            this.modelHasLoaded = true;
            this.$emit("modelLoaded", true);

            if (model === model3 || model === model6) {
              object.getObjectByName("Layer_2 Layer_2B").position.x += 0.03;
            }
            if (this.currentSunglasses !== "") {
              this.updateSunglasses();
            }
            if (this.currentMaterials.length > 0) {
              if (this.currentMaterials[1] !== undefined) {
                this.assignMaterial(this.currentMaterials[1], "Layer_1");
                this.assignMaterial(
                  this.currentMaterials[1],
                  "Layer_1 Layer_1B"
                );
                this.assignMaterial(
                  this.currentMaterials[1],
                  "Layer_1 Layer_1N"
                );
              }
              if (this.currentMaterials[2] !== undefined) {
                this.assignMaterial(this.currentMaterials[2], "Layer_2");
                this.assignMaterial(
                  this.currentMaterials[2],
                  "Layer_2 Layer_2B"
                );
                this.assignMaterial(
                  this.currentMaterials[2],
                  "Layer_2 Layer_2N"
                );
              }
              if (this.currentMaterials[3] !== undefined) {
                this.assignMaterial(this.currentMaterials[3], "Layer_3");
                this.assignMaterial(
                  this.currentMaterials[3],
                  "Layer_3 Layer_3B"
                );
                this.assignMaterial(
                  this.currentMaterials[3],
                  "Layer_3 Layer_3N"
                );
              }
              if (this.currentMaterials[4] !== undefined) {
                this.assignMaterial(this.currentMaterials[4], "Layer_4");
                this.assignMaterial(
                  this.currentMaterials[4],
                  "Layer_4 Layer_4B"
                );
                this.assignMaterial(
                  this.currentMaterials[4],
                  "Layer_4 Layer_4N"
                );
              }
              if (this.currentMaterials[5] !== undefined) {
                this.assignMaterial(this.currentMaterials[5], "Layer_5");
                this.assignMaterial(
                  this.currentMaterials[5],
                  "Layer_5 Layer_5B"
                );
                this.assignMaterial(
                  this.currentMaterials[5],
                  "Layer_5 Layer_5N"
                );
              }
              if (this.useAsSunglasses) {
                this.updateSunglasses();
              }
            }
            this.updateSunglasses();

            if (this.expanded) {
              this.expanded = false;
              setTimeout(() => {
                this.expand();
              }, 100);
            }
            if (
              this.positionLocked &&
              this.$refs.posOne.classList.contains("active")
            ) {
              TweenMax.to(object.rotation, 0, {
                y: "+=0.9" //rotateY
              });
              TweenMax.to(this.camera.position, 0, {
                x: 0, //cameraX
                y: 0, //cameraY
                z: -20 //cameraZ
              });
              TweenMax.to(object.position, 0, {
                x: 0 //moveX
                // z: -20 //moveX
              });
            }
            if (
              this.positionLocked &&
              this.$refs.posTwo.classList.contains("active")
            ) {
              TweenMax.to(object.rotation, 0, {
                y: "-=0.9" //rotateY
              });
              TweenMax.to(this.camera.position, 0, {
                x: 0, //cameraX
                y: -20, //cameraY
                z: -220 //cameraZ
              });
              TweenMax.to(object.position, 0, {
                x: 60 //moveX
              });
            }
            this.isLoading = false;
          }.bind(this),

          function(xhr) {
            this.isLoading = true;
          }
        );
      }
    },
    assignBasicMaterials: function(object, glass, metall, mat, matStart) {
      let mat2 = mat.clone();
      let mat3 = mat.clone();
      let mat4 = mat.clone();
      let mat5 = mat.clone();

      if (glass) {
        object.getObjectByName("Glas").material = glass;
      }
      if (metall) {
        object.getObjectByName("Scharnier").material = metall;
      }
      object.getObjectByName("Glas").layers.set(2);
      object.getObjectByName("Scharnier").layers.set(2);
      object.getObjectByName("Layer_1").material = mat;
      object.getObjectByName("Layer_1 Layer_1B").material = mat;
      this.assignMaterial(this.roughness_metall, "Layer_1");
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
    },

    updateSunglasses: function() {
      console.log("sunglasses:");
      console.log(this.sunglasses);
      let glass = new THREE.MeshPhysicalMaterial({
        color: "#D2DDDE",
        metalness: 0.0,
        roughness: 0.0,
        alphaTest: 0.5,
        depthTest: true,
        transparent: true,
        transparency: 0.8
      });
      this.sunglasses_alpha_m.wrapT = THREE.MirroredRepeatWrapping;
      this.sunglasses_alpha_m.wrapS = THREE.MirroredRepeatWrapping;
      this.sunglasses_alpha_m.center.set(0, -40);
      if (this.currentModelIndex === 2 || this.currentModelIndex === 5) {
        this.sunglasses_alpha_m.repeat.set(5, 5); // 2 2sl 5 / 5
      }
      if (this.currentModelIndex === 1) {
        this.sunglasses_alpha_m.repeat.set(4.5, 4.5); // 2 2sl 5 / 5
        this.sunglasses_alpha_m.center.set(0, -10);
      }
      if (this.currentModelIndex === 3 || this.currentModelIndex === 6) {
        this.sunglasses_alpha_m.repeat.set(3, 3); // 2 2sl 5 / 5
        this.sunglasses_alpha_m.center.set(0, -185);
      }
      if (this.currentModelIndex === 4 || this.currentModelIndex === 7) {
        this.sunglasses_alpha_m.repeat.set(3, 3); // 2 2sl 5 / 5
        this.sunglasses_alpha_m.center.set(0, 60);
      }
      this.sunglasses_alpha_m.rotation = 1.57;

      let sunglassesGlass = new THREE.MeshPhysicalMaterial({
        color:
          (this.sunglasses || this.currentSunglasses) === "Schwarz" ||
          (this.sunglasses || this.currentSunglasses) === "Schwarz verlaufend"
            ? "#000000"
            : "#331a11",
        metalness: 0.0,
        roughness: 0.0,
        // alphaTest: 0.1,
        // depthTest: true,
        transparent: true,
        transparency:
          (this.sunglasses || this.currentSunglasses) === "Braun verlaufend" ||
          (this.sunglasses || this.currentSunglasses) === "Schwarz verlaufend"
            ? 0.1
            : 0.4,
        alphaMap:
          (this.sunglasses || this.currentSunglasses) === "Braun verlaufend" ||
          (this.sunglasses || this.currentSunglasses) === "Schwarz verlaufend"
            ? this.sunglasses_alpha_m
            : undefined
      });
      if (this.modelHasLoaded) {
        if (this.useAsSunglasses) {
          this.objtemp.children[0].getObjectByName(
            "Glas"
          ).material = sunglassesGlass;
        } else if (this.objtemp.children[0]) {
          this.objtemp.children[0].getObjectByName("Glas").material = glass;
        }
      }
    },
    loop: function() {
      requestAnimationFrame(this.loop);

      this.controls.update();

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
        this.lightSphere.geometry.verticesNeedUpdate = true;

        let vector = this.lightSphere.geometry.vertices[0].clone();
        let vectorTwo = this.lightSphere.geometry.vertices[1].clone();
        let vectorThree = this.lightSphere.geometry.vertices[2].clone();
        vector.applyMatrix4(this.lightSphere.matrixWorld);
        vectorTwo.applyMatrix4(this.lightSphere.matrixWorld);
        vectorThree.applyMatrix4(this.lightSphere.matrixWorld);

        this.nMPoint1.position.set(vector.x, vector.y, vector.z);
        this.nMPoint2.position.set(vectorTwo.x, vectorTwo.y, vectorTwo.z);
        this.nMPoint3.position.set(vectorThree.x, vectorThree.y, vectorThree.z);

        this.renderer.autoClear = false;
        this.camera.layers.set(1);
        this.composer.render(this.scene, this.camera);
      }

      if (this.modelHasLoaded && this.$refs.three !== undefined) {
        this.mapViewPlus(this.pos1, this.$refs.posOne);
        this.mapViewPlus(this.pos2, this.$refs.posTwo);
      }
    },

    mapViewPlus: function(positionSphere, viewPlus) {
      const tempV = new THREE.Vector3();
      positionSphere.updateWorldMatrix(true, false);
      positionSphere.getWorldPosition(tempV);
      tempV.project(this.camera);
      let tempX = (tempV.x * 0.5 + 0.5) * this.$refs.three.clientWidth;
      let tempY = (tempV.y * -0.5 + 0.5) * this.$refs.three.clientHeight - 16;
      let style =
        "translate(-50%, -50%) translate(" + tempX + "px," + tempY + "px)";
      viewPlus.style.transform = style;
    },
    resetCameraPosition: function() {
      this.controls.enabled = true;
      this.controls.update();
      TweenMax.to(this.camera.position, 1.0, {
        x: 0,
        y: -10,
        z: -145
      });
      let currentRotation = this.objtemp.children[0].rotation;
      TweenMax.to(this.objtemp.children[0].rotation, 1.0, {
        y: "=" + currentRotation
      });
      TweenMax.to(this.objtemp.children[0].position, 0.0, {
        x: 0
      });
    },
    setCameraPosition: function(
      event,
      cameraX,
      cameraY,
      cameraZ,
      moveX,
      rotateY,
      rotateYReset
    ) {
      let xTarget,
        yTarget,
        zTarget,
        camNewPosition,
        targetNewPos,
        tweenDuration;
      if (!this.positionLocked) {
        TweenMax.to(this.objtemp.children[0].rotation, 1.0, {
          y: rotateY //rotateY
        });
        TweenMax.to(this.camera.position, 1.0, {
          x: cameraX, //cameraX
          y: cameraY, //cameraY
          z: cameraZ //cameraZ
        });
        TweenMax.to(this.objtemp.children[0].position, 1.0, {
          x: moveX //moveX
          // z: -20 //moveX
        });

        this.controls.enabled = false;
        this.controls.update();

        event.currentTarget.classList.add("active");
      } else {
        //RESET
        this.controls.enabled = true;
        this.controls.update();
        TweenMax.to(this.camera.position, 1.0, {
          x: 0,
          y: -10,
          z: -145
        });
        event.currentTarget.classList.remove("active");
        TweenMax.to(this.objtemp.children[0].rotation, 1.0, {
          y: rotateYReset
        });
        TweenMax.to(this.objtemp.children[0].position, 0.0, {
          x: 0
        });
      }
      this.positionLocked = !this.positionLocked;
      this.controls.update();
    },
    onMouseMove: function() {
      this.$refs.pos1.style.backgroundColor = "green";
    },
    onWindowResize: function() {
      const container = this.$refs.three;
      const W = container.clientWidth;
      const H = container.clientHeight;
      this.camera.aspect = container.offsetWidth / container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
      if (this.composer) {
        this.composer.setSize(container.offsetWidth, container.offsetHeight);
      }
    }
  }
};
</script>

