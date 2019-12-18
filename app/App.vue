<template>
  <div class="main">
    <header>
       <a class="back-button" href="https://schwarztest.azurewebsites.net/">
        <img :src="[backButton]" />
      </a>
      <a class="logo" href="https://schwarztest.azurewebsites.net/">
        <img :src="[logo]" />
      </a>
      <p class="text text-description schichtler">Schichtler — die App zum Brillen gestalten</p>
      <!-- <a
        class="copyright-remark description text-medium"
        target="_blanc"
        href="https://process.studio"
      >A tool by Process Studio</a>-->
      <p class="text text-description description models">Modelle</p>
      <p class="text text-description description materials">Materialien</p>
      <span class="share-container">
      <a v-on:click="copyUrl()" class="text-small share">Teilen</a>
      <span class="code">
        <span
          :class="[copiedUrl ? (fullCode ? 'tooltip active valid text-small' : 'tooltip active invalid text-small') : 'tooltip text-small']"
        >{{fullCode ? 'Dein individueller Link wurde in die Zwischenablage kopiert!' : 'Definiere zuerst alle Materialien!'}}</span>

        <!-- Teile deine Schwarz Brille -->
      </span>
      </span>
    </header>
    <Threemodel
      :useAsSunglasses="useAsSunglasses"
      v-on:modelLoaded="modelHasLoaded = $event"
      :allHashMaterialsModel="allHashMaterialsModel"
      :hoveredMaterial="hoveredMaterial"
      :setModel="model"
      :mat="passedMaterial"
      :sunglassesFromHash="setSunglassesFromHash"
      :resetMaterialsTrigger="resetMaterialsTrigger"
      :randomMaterialsTrigger="randomMaterialsTrigger"
    >{{passedMaterial}}</Threemodel>
    <div class="content-area">
      <Glasses
        v-on:sendMessage="setCurrentModel($event)"
        :currentModelLoaded="modelHasLoaded"
        :hashModelNumber="setModelFromUrl"
      ></Glasses>
      <div class="material-picker-container">
        <div class="material-picker-stretch">
          <Materials
            index="1"
            v-on:passRandomMaterialBack="passRandomMaterials($event)"
            v-on:setAllHashMaterials="passRandomMaterials($event)"
            :hashMaterial="setMaterialFromUrl"
            v-on:setHoveredMaterial="setHoveredMaterial($event)"
            v-on:setMaterial="setMaterialName($event)"
            swiperClass="Swiper1"
            :resetMaterialsTrigger="resetMaterialsTrigger"
            :randomMaterialsTrigger="randomMaterialsTrigger"
          ></Materials>
          <Materials
            index="2"
            v-on:passRandomMaterialBack="passRandomMaterials($event)"
            v-on:setAllHashMaterials="collectHashMaterials($event)"
            :hashMaterial="setMaterialFromUrl"
            v-on:setHoveredMaterial="setHoveredMaterial($event)"
            v-on:setMaterial="setMaterialName($event)"
            swiperClass="Swiper2"
            :resetMaterialsTrigger="resetMaterialsTrigger"
            :randomMaterialsTrigger="randomMaterialsTrigger"
          ></Materials>
          <Materials
            index="3"
            v-on:passRandomMaterialBack="passRandomMaterials($event)"
            v-on:setAllHashMaterials="collectHashMaterials($event)"
            :hashMaterial="setMaterialFromUrl"
            v-on:setHoveredMaterial="setHoveredMaterial($event)"
            v-on:setMaterial="setMaterialName($event)"
            swiperClass="Swiper3"
            :resetMaterialsTrigger="resetMaterialsTrigger"
            :randomMaterialsTrigger="randomMaterialsTrigger"
          ></Materials>
          <Materials
            index="4"
            v-on:passRandomMaterialBack="passRandomMaterials($event)"
            v-on:setAllHashMaterials="collectHashMaterials($event)"
            :hashMaterial="setMaterialFromUrl"
            v-on:setHoveredMaterial="setHoveredMaterial($event)"
            v-on:setMaterial="setMaterialName($event)"
            swiperClass="Swiper4"
            :resetMaterialsTrigger="resetMaterialsTrigger"
            :randomMaterialsTrigger="randomMaterialsTrigger"
          ></Materials>
          <Materials
            index="5"
            v-on:passRandomMaterialBack="passRandomMaterials($event)"
            v-on:setAllHashMaterials="collectHashMaterials($event)"
            :hashMaterial="setMaterialFromUrl"
            v-on:setHoveredMaterial="setHoveredMaterial($event)"
            v-on:setMaterial="setMaterialName($event)"
            swiperClass="Swiper5"
            :resetMaterialsTrigger="resetMaterialsTrigger"
            :randomMaterialsTrigger="randomMaterialsTrigger"
          ></Materials>
          <div class="random-butons">
            <span v-on:click="randomMaterials()" class="random text-button">Zufällig</span>
            <span v-on:click="resetMaterials()" class="random reset text-button">Zurücksetzen</span>
          </div>
        </div>
        <div class="payment-section">
          <p class="text text-description description"></p>
          <h2>{{model[0]}}</h2>
          <div class="material-display">
            <!-- {{materialOne}}{{(materialOne && (materialTwo || materialThree || materialFour || materialFive) && ', ')}}
            {{materialTwo}}{{(materialTwo && ( materialThree || materialFour || materialFive) && ', ')}}
            {{materialThree}}{{(materialThree && ( materialFour || materialFive) && ', ')}}
            {{materialFour}}{{(materialFour && ( materialFive) && ', ')}}
            {{materialFive}}-->
          </div>
          <span class="sunglasses text-medium">
            Sonnenbrille ( + 40€):
            <input
              v-on:click="removeHashSunglasses($event)"
              v-model="useAsSunglasses"
              type="checkbox"
            />
            <div v-if="useAsSunglasses" class="dropdown">
              <button
                :class="[sunglasses === '' ? 'dropbtn alert' : 'dropbtn']"
                @mouseover="dropdownClicked = false"
              >{{sunglasses ? sunglasses : 'wähle ein Glas aus'}}</button>
              <div :class="[dropdownClicked ? 'dropdown-content clicked' : 'dropdown-content']">
                <a class="text-medium" v-on:click="setSunglasses('Schwarz', 1)">Schwarz</a>
                <a class="text-medium" v-on:click="setSunglasses('Braun', 2)">Braun</a>
                <a
                  class="text-medium"
                  v-on:click="setSunglasses('Schwarz verlaufend', 3)"
                >Schwarz verlaufend</a>
                <a
                  class="text-medium"
                  v-on:click="setSunglasses('Braun verlaufend', 4)"
                >Braun verlaufend</a>
              </div>
            </div>
            <!-- <span class="sunglasses-info text-small">UV400 / schwarz</span> -->
          </span>

          <!-- <p
            class="text-medium infoGlass"
          >
          Erfahre hier welche Informationen dein Optiker braucht um dir die richtigen Gläser für deine neue Schwarz-Brille einzsutellen!
          </p>-->

          <span
            :class="[fullCode && !useAsSunglasses || fullCode && (useAsSunglasses && sunglasses !== '') ? 'copy-buy active' : 'copy-buy']"
          >
            <h3 class="price">{{useAsSunglasses ? price + 40 +",00€" : price+",00€"}}</h3>

            <a
              :href="['mailto:office@schwarz.work?subject=Bestellung Schwarz Brille&body=Guten Tag,%0D%0A%0D%0Aich würde gerne folgende Brille bestellen:%0D%0A%0D%0A'+'Modell:%20'+
              model[0]+'%0D%0AMaterialien:%20'+materialOne+',%20' + materialTwo+ ',%20' + materialThree+ ',%20' +  materialFour+ ',%20' + materialFive +
              '%0D%0AGlas:%20' + (useAsSunglasses ? ('Sonnenbrille mit Gläsern: ' + sunglasses): 'optische Gläser (nicht enthalten)') + 
              '%0D%0A%0D%0APreis:%20EUR%20'+ (useAsSunglasses ? (price + 40) : (price))+', –'+ '%0D%0A%0D%0ABrillennummer:%20' + hashCode + '%0D%0ALink:%20'+currentUrl+'%0D%0A%0D%0A%0D%0AMeine Kontaktdaten: %0D%0A%0D%0A Name: %0D%0A Telefonnummer: %0D%0A Adresse: %0D%0A' 
              ]"
            >
              <!-- + (useAsSunglasses && Number(price + 40) +',00€') + (!useAsSunglasses &&  price+',00€') -->
              <button
                :class="[fullCode && !useAsSunglasses || fullCode && (useAsSunglasses && sunglasses !== '') ? 'buy-button text-button active' : 'buy-button text-button ']"
              >Bestellen</button>
            </a>
          </span>
        </div>
      </div>
    </div>
    <footer></footer>
  </div>
</template>

<script>
import Glasses from "./src/components/GlassesPicker";
import Materials from "./src/components/MaterialPicker";
import Threemodel from "./src/components/Threemodel";
import { encode, decode } from "./index.js";

import logoPath from "./src/assets/logo.svg";
import backButtonPath from "./src/assets/back-button.svg";

export default {
  name: "App",
  data: function() {
    return {
      model: [],
      price: 280.0,
      passedMaterial: ["Ahorn", 0],
      logo: logoPath,
      backButton: backButtonPath,
      materialOne: "",
      materialTwo: "",
      materialThree: "",
      materialFour: "",
      materialFive: "",
      copiedUrl: false,
      currentUrl: window.location.href,
      hoveredMaterial: [0][false],
      updateHoverOnce: false,
      encodedArray: [],
      ignoreHashChange: false,
      validHash: false,
      setModelFromUrl: 0,
      setMaterialFromUrl: [],
      allHashMaterials: [{}, {}, {}, {}, {}, {}],
      allHashMaterialsModel: [],
      modelHasLoaded: true,
      fullCode: false,
      hashCode: "",
      hashModelChange: false,
      resetMaterialsTrigger: false,
      randomMaterialsTrigger: false,
      Swiper1: null,
      Swiper2: null,
      Swiper3: null,
      Swiper4: null,
      Swiper5: null,
      msg: "",
      useAsSunglasses: false,
      sunglasses: "",
      setSunglassesFromHash: false,
      currentSunglasses: [],
      dropdownClicked: false,
      materialsLoadedFromHash: false
    };
  },
  watch: {
    modelHasLoaded: function() {
      if (this.modelHasLoaded) {
        if (
          this.encodedArray[0] === undefined &&
          !this.materialsLoadedFromHash
        ) {
          this.setCurrentModel(this.model);
        }
        if (this.allHashMaterials[1][0]) {
          this.allHashMaterialsModel.push(this.allHashMaterials);
        }
        if (this.setSunglassesFromHash) {
          this.useAsSunglasses = true;
        }
      }
    }
  },
  methods: {
    setSunglasses(glasses, index) {
      this.sunglasses = glasses;
      this.dropdownClicked = true;
      this.encodedArray[6] = index;
      this.currentSunglasses[0] = index;
      this.sentToEncode();
    },
    removeHashSunglasses(event) {

      console.log(this.encodedArray[6]);
      // if (this.useAsSunglasses) {
        // if (this.encodedArray.length > 5) {
          console.log(this.currentSunglasses[0] )
          if(this.useAsSunglasses){
            console.log("set to 0")
          this.encodedArray[6] = 0;
          }else if(this.currentSunglasses[0] !== undefined) {
            this.encodedArray[6] = this.currentSunglasses[0];
          }
          console.log("sent to encode");
          this.sentToEncode();
        // }

    },
    resetMaterials() {
      this.resetMaterialsTrigger = true;
      setTimeout(() => {
        this.resetMaterialsTrigger = false;
      }, 10);
      this.encodedArray.splice(1, 5);
      this.allHashMaterials = [{}, {}, {}, {}, {}, {}];
      this.allHashMaterialsModel = [];
      setTimeout(() => {
        this.sentToEncode(); // reset if less than 5 materials are set
        location.hash = "";
        this.fullCode = false;
      }, 100);
    },
    randomMaterials() {
      this.randomMaterialsTrigger = true;
      setTimeout(() => {
        this.randomMaterialsTrigger = false;
      }, 10);
    },
    copyUrl() {
      let dummy = document.createElement("input");
      this.currentUrl = window.location.href;

      document.body.appendChild(dummy);
      dummy.value = this.currentUrl;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.copiedUrl = true;
      setTimeout(() => {
        this.copiedUrl = false;
      }, 2000);
    },
    passRandomMaterials(material) {
      this.allHashMaterials[material[2]][0] = material[1];
      this.allHashMaterials[material[2]][1] = material[2];
      this.setMaterialName(material);
      this.allHashMaterialsModel.push(this.allHashMaterials);
    },
    collectHashMaterials(material) {
      this.allHashMaterials[material[2]][0] = material[1];
      this.allHashMaterials[material[2]][1] = material[2];
      this.setMaterialName(material);
    },
    setHoveredMaterial(info) {
      if (this.updateHoverOnce === false) {
        this.isHovered = info[1];
        this.hoveredMaterial = info;
      }
      if (info[1] === false) {
        this.hoveredMaterial = info;
        this.updateHoverOnce = false;
      } else {
        this.updateHoverOnce = true;
      }
    },
    setCurrentModel(model) {
      console.log(model);
      this.model = model;
      this.encodedArray[0] = Number(model[1]);
      console.log("encode:")
      console.log(this.encodedArray[0] )
      this.sentToEncode(false, true);
      this.currentUrl = window.location.href;
    },

    setMaterialName(material) {
      this.passedMaterial[0] = material[1];
      this.passedMaterial[1] = material[2]; // chosen layer
      this.encodedArray[material[2]] = Number(material[3]);
      console.log(this.encodedArray)
      this.sentToEncode(true, false);

      if (material[2] === "1") {
        this.materialOne = material[0];
      } else if (material[2] === "2") {
        this.materialTwo = material[0];
      } else if (material[2] === "3") {
        this.materialThree = material[0];
      } else if (material[2] === "4") {
        this.materialFour = material[0];
      } else if (material[2] === "5") {
        this.materialFive = material[0];
      }
    },
    sentToEncode: function() {
      console.log("send to encode?");
      console.log(this.encodedArray);
      if (!this.materialsLoadedFromHash && this.encodedArray[5] !== undefined) {
        let incomplete = this.encodedArray.length < 6;
        if (incomplete) {
          console.log(this.encodedArray);
          console.log("layers incomplete");
          return;
        }
        let arr = this.encodedArray.map(i => parseInt(i));

        let id = encode(arr);
        if (id === false) {
          console.log("Encode Error");
          this.validHash = false;
        } else {
          this.hashCode = id;
          location.hash = id;
          this.fullCode = true;
          this.ignoreHashChange = true;
          console.log("Encode OK");
          this.validHash = true;
          this.currentUrl = window.location.href;
        }
      }
    },
    loadFromHash: function(e) {
      if (this.ignoreHashChange) {
        this.materialsLoadedFromHash = false;
        this.ignoreHashChange = false;
        return;
      }

      let code = location.hash.slice(1);
      if (code) {
        this.materialsLoadedFromHash = true;
        let layers = decode(code);
        if (layers === false) {
          console.log("Decode (from URL) Error");
        } else {
          this.setModelFromUrl = layers[0];
          let tempArray = [];
          for (let i = 1; i < 6; i++) {
            this.encodedArray[i] = Number(layers[i]);
            tempArray[i - 1] = layers[i];
          }
          console.log("USE AS SUNGLASSES");

          this.fullCode = true;
          this.setMaterialFromUrl.push(tempArray);
          console.log(this.setMaterialFromUrl);
          this.hashModelChange = true;
          this.validHash = true;
          console.log("Decode (from URL) OK");
          setTimeout(() => {
            this.materialsLoadedFromHash = false;

            console.log("LAYERS");
            console.log(layers);
            if (layers[6]) {
              this.setSunglassesFromHash = true;
              this.currentSunglasses[0] = layers[6];
              if (layers[6] === 1) {
                this.sunglasses = "Schwarz";
              }
              if (layers[6] === 2) {
                this.sunglasses = "Braun";
              }
              if (layers[6] === 3) {
                this.sunglasses = "Schwarz verlaufend";
              }
              if (layers[6] === 4) {
                this.sunglasses = "Braun verlaufend";
              }

              console.log("USE AS SUNGLASSES");
              console.log(this.useAsSunglasses);
            }
          }, 800);
        }
      }
    }
  },
  mounted() {
    document.addEventListener("DOMContentLoaded", this.loadFromHash);
    window.addEventListener("hashchange", this.loadFromHash);
    if (!this.useAsSunglasses) {
      this.encodedArray[6] = 0;
    }
    setTimeout(() => {
      if (!this.hashModelChange && this.model.length === 0) {
        this.model = ["Modell N°1", 1];
      }
    }, 50);
  },
  upated() {},
  components: {
    Glasses,
    Materials,
    Threemodel
  }
};
</script>

