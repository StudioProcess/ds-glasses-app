<template>
  <div class="main">
    <header>
      <a href="https://schwarztest.azurewebsites.net/">
        <img :src="[logo]" />
      </a>
      <p class="text text-description">Schichtler — die App zum Brillen gestalten</p>
      <a
        class="copyright-remark description text-medium"
        target="_blanc"
        href="https://process.studio"
      >A tool by Process Studio</a>
      <p class="text text-description description models">Modelle</p>
      <p class="text text-description description materials">Materialien</p>
    </header>
    <Threemodel
      :useAsSunglasses="useAsSunglasses"
      v-on:modelLoaded="modelHasLoaded = $event"
      :allHashMaterialsModel="allHashMaterialsModel"
      :hoveredMaterial="hoveredMaterial"
      :setModel="model"
      :mat="passedMaterial"
      :resetMaterialsTrigger="resetMaterialsTrigger"
      :randomMaterialsTrigger="randomMaterialsTrigger"
    >{{passedMaterial}}</Threemodel>
    <div class="content-area">
      <Glasses v-on:sendMessage="modelHasLoaded && setCurrentModel($event)" :hashModelNumber="setModelFromUrl"></Glasses>
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
          <p class="text text-description description">Produktinformation</p>
          <h2>{{model[0]}}</h2>
          <div class="material-display">
            {{materialOne}}{{(materialOne && (materialTwo || materialThree || materialFour || materialFive) && ', ')}}
            {{materialTwo}}{{(materialTwo && ( materialThree || materialFour || materialFive) && ', ')}}
            {{materialThree}}{{(materialThree && ( materialFour || materialFive) && ', ')}}
            {{materialFour}}{{(materialFour && ( materialFive) && ', ')}}
            {{materialFive}}
          </div>
          <span class="sunglasses text-medium">
            Sonnenbrille:
            <input v-model="useAsSunglasses" type="checkbox" />
            <div v-if="useAsSunglasses" class="dropdown">
              <button class="dropbtn">{{sunglasses ? sunglasses : 'wähle ein Glas aus'}}</button>
              <div class="dropdown-content">
                <a v-on:click="sunglasses = 'Schwarz'">Schwarz</a>
                <a v-on:click="sunglasses = 'Braun'">Braun</a>
                <a v-on:click="sunglasses = 'Schwarz verlaufend'">Schwarz verlaufend</a>
                <a v-on:click="sunglasses = 'Braun verlaufend'">Braun verlaufend</a>
              </div>
            </div>
            <!-- <span class="sunglasses-info text-small">UV400 / schwarz</span> -->
          </span>

          <p
            class="text-medium infoGlass"
          >Erfahre hier welche Informationen dein Optiker braucht um dir die richtigen Gläser für deine neue Schwarz-Brille einzsutellen!</p>
          <h3 class="price">{{price}}</h3>

          <span class="copy-buy">
            <a
              :href="['mailto:example@hi?subject=Bestellung Schwarz Brille&body=Details deiner Bestellung:%0D%0A'+model[0]+'%0D%0AMaterialien:'+materialOne + materialTwo + materialThree +  materialFour + materialFive + '%0D%0A%0D%0A' + (useAsSunglasses && 'Sonnenbrille' + sunglasses) + '%0D%0A%0D%0ABestellcode: ' + hashCode]"
            >
              <button
                :class="[fullCode ? 'buy-button  text-button active' : 'buy-button text-button ']"
              >jetzt bestellen</button>
            </a>
            <span class="code">
              <span
                :class="[copiedUrl ? (this.validHash ? 'tooltip active valid text-small' : 'tooltip active invalid text-small') : 'tooltip text-small']"
              >{{this.validHash ? 'Dein individueller Link wurde in die Zwischenablage kopiert!' : 'Definiere zuerst alle Materialien!'}}</span>
              <a v-on:click="copyUrl()" class="text-small">Teile deine Schwarz Brille</a>
            </span>
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

export default {
  name: "App",
  data: function() {
    return {
      model: [],
      price: "280,00€",
      passedMaterial: ["Ahorn", 0],
      logo: logoPath,
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
      sunglasses: '',
    };
  },
  watch: {
    modelHasLoaded: function() {
      console.log(this.modelHasLoaded)
      if (this.modelHasLoaded) {
        if (this.encodedArray[0] === undefined) {
          this.setCurrentModel(this.model);
        }
        this.allHashMaterialsModel.push(this.allHashMaterials);
      }
    }
  },
  methods: {
    resetMaterials() {
      this.resetMaterialsTrigger = true;
      setTimeout(() => {
        this.resetMaterialsTrigger = false;
      }, 10);
      this.encodedArray.splice(1, 5);
      setTimeout(() => {
        this.sentToEncode(); // reset if less than 5 materials are set
        // window.location.href.split('#')[0];
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
      console.log("hashUpdate" + this.ignoreHashChange);
    },
    passRandomMaterials(material) {
      console.log(material);
      this.allHashMaterials[material[2]][0] = material[1];
      this.allHashMaterials[material[2]][1] = material[2];
      this.setMaterialName(material);

      console.log(this.allHashMaterials);
      this.allHashMaterialsModel.push(this.allHashMaterials);
    },
    collectHashMaterials(material) {
      console.log(material);
      this.allHashMaterials[material[2]][0] = material[1];
      this.allHashMaterials[material[2]][1] = material[2];
      this.setMaterialName(material);

      console.log(this.allHashMaterials);
      // this.allHashMaterialsModel.push(this.allHashMaterials);
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
      this.model = model;
      this.encodedArray[0] = Number(model[1]);
      this.sentToEncode();
      this.currentUrl = window.location.href;
    },

    setMaterialName(material) {
      this.passedMaterial[0] = material[1];
      this.passedMaterial[1] = material[2]; // chosen layer
      this.encodedArray[material[2]] = Number(material[3]);

      setTimeout(() => {
        this.sentToEncode();
      }, 100);

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
      let incomplete = this.encodedArray.length < 6;
      if (incomplete) {
        console.log(this.encodedArray);
        console.log("layers incomplete");
        return;
      }
      let arr = this.encodedArray.map(i => parseInt(i));
      setTimeout(() => {
        let id = encode(arr);
        if (id === false) {
          console.log("Encode Error");
          this.validHash = false;
        } else {
          console.log(id);
          this.hashCode = id;
          location.hash = id;
          this.fullCode = true;
          this.ignoreHashChange = true;
          console.log("Encode OK");
          this.validHash = true;
          this.currentUrl = window.location.href;
        }
      }, 200);
    },
    loadFromHash: function(e) {
      if (this.ignoreHashChange) {
        this.ignoreHashChange = false;
        return;
      }

      let code = location.hash.slice(1);
      if (code) {
        let layers = decode(code);
        if (layers === false) {
          console.log("Decode (from URL) Error");
        } else {
          this.setModelFromUrl = layers[0];
          let tempArray = [];
          for (let i = 1; i < 6; i++) {
            setTimeout(() => {
              this.encodedArray[i] = Number(layers[i]);
            }, 300);

            tempArray[i - 1] = layers[i];
            // console.log(this.setMaterialFromUrl);
          }
          this.fullCode = true;
          this.setMaterialFromUrl.push(tempArray);
          console.log("temparray:");
          console.log(tempArray);
          this.hashModelChange = true;
          this.validHash = true;
          console.log("Decode (from URL) OK");
        }
      } else {
        console.log("ignore changes");
        this.model = ["N°1 - Moluptatum", 1];
        // this.encodedArray[0] = 1;
      }
    }
  },
  mounted() {
    document.addEventListener("DOMContentLoaded", this.loadFromHash);
    window.addEventListener("hashchange", this.loadFromHash);
  },
  upated() {},
  components: {
    Glasses,
    Materials,
    Threemodel
  }
};
</script>

