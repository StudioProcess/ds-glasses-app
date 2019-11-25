<template>
  <div class="main">
  <Threemodel :useAsSunglasses='useAsSunglasses' v-on:modelLoaded="modelHasLoaded = $event" :allHashMaterialsModel='allHashMaterialsModel' :hoveredMaterial='hoveredMaterial' :setModel='model' :mat='passedMaterial'>{{passedMaterial}}</Threemodel>
  <div class="content-area">
    <Glasses v-on:sendMessage="setCurrentModel($event)" :hashModelNumber="setModelFromUrl"></Glasses>
      <div class="material-picker-container">
        <span class="random">Zufällig</span>
        <Materials index="1" v-on:setAllHashMaterials="collectHashMaterials($event)" :hashMaterial='setMaterialFromUrl' v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper1'></Materials>
        <Materials index="2" v-on:setAllHashMaterials="collectHashMaterials($event)" :hashMaterial='setMaterialFromUrl' v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper2'></Materials>
        <Materials index="3" v-on:setAllHashMaterials="collectHashMaterials($event)" :hashMaterial='setMaterialFromUrl' v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper3'></Materials>
        <Materials index="4" v-on:setAllHashMaterials="collectHashMaterials($event)" :hashMaterial='setMaterialFromUrl' v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper4'></Materials>
        <Materials index="5" v-on:setAllHashMaterials="collectHashMaterials($event)" :hashMaterial='setMaterialFromUrl' v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper5'></Materials>

     <div class="payment-section">
        <h2>{{model[0]}}</h2> 
          <div class="material-display">{{materialOne}}{{materialTwo}}{{materialThree}}{{materialFour}}{{materialFive}}</div>
          <h3 class="price">{{price}}*</h3>
          <span class="sunglasses">Sonnenbrille:   <input v-model="useAsSunglasses" type="checkbox"> 
          <span class="info">UV400 / schwarz</span>
          </span>

          <p class="info infoGlass">
           Erfahre hier welche Informationen dein Optiker braucht um dir die richtigen Gläser für deine neue Schwarz-Brille einzsutellen!
          </p>

          <span class="code"><strong>Dein Bestellcode:</strong><span>{{hashCode}}</span></span>

          <button :class="[fullCode ? 'buy-button active' : 'buy-button']">{{price}} jetzt kaufen</button>
    </div> 
    </div>
  
  </div>
</template>

<script>
import Glasses from './src/components/GlassesPicker'
import Materials from './src/components/MaterialPicker'
import Threemodel from './src/components/Threemodel'
import { encode, decode } from "./index.js";


export default {
  name: 'App',
  data: function() {
    return{
    model:[],
    price: "525,00€",
    passedMaterial: ["Ahorn", 0],
    materialOne: "",
    materialTwo: "",
    materialThree: "",
    materialFour: "",
    materialFive: "",
    hoveredMaterial: [0][false],
    updateHoverOnce: false,
    encodedArray: [],
    ignoreHashChange: false,
    setModelFromUrl: 0,
    setMaterialFromUrl: [],
    allHashMaterials: [{},{},{},{},{},{}],
    allHashMaterialsModel: [],
    modelHasLoaded: false,
    fullCode: false,
    hashCode: "",
    hashModelChange: false,
    Swiper1: null,
    Swiper2: null,
    Swiper3: null,
    Swiper4: null,
    Swiper5: null,
    msg: "",
    useAsSunglasses: false,
    }
    },
    watch: {
      modelHasLoaded: function(){
        if(this.modelHasLoaded){
          this.allHashMaterialsModel.push(this.allHashMaterials);
        }

      }
    },
    methods: {
      collectHashMaterials(material){
          this.allHashMaterials[material[2]][0] = material[1];
          this.allHashMaterials[material[2]][1] = material[2];
      },
      setHoveredMaterial(info){
        if(this.updateHoverOnce === false){
          this.isHovered = info[1];
          this.hoveredMaterial = info;
          
        }
        if(info[1] === false){
          this.hoveredMaterial = info;
          this.updateHoverOnce = false;
        }else{
          this.updateHoverOnce = true;
        }
      },
      setCurrentModel(model){
        this.model = model;
        this.encodedArray[0] = (Number(model[1]));
        this.sentToEncode();
      },
      setMaterialName(material) {
        this.passedMaterial[0] = material[1];
        this.passedMaterial[1] = material[2]; // chosen layer
        console.log(this.passedMaterial)
        this.encodedArray[material[2]] = (Number(material[3]));
      setTimeout(() => {
        this.sentToEncode();
      }, 100);


        if(material[2] === "1"){
          this.materialOne = material[0];
        }else if (material[2] === "2"){
          this.materialTwo = ", "+material[0];
        }else if (material[2] === "3"){
          this.materialThree = ", "+material[0];
        }else if (material[2] === "4"){
          this.materialFour = ", "+material[0];
        }else if (material[2] === "5"){
          this.materialFive = ", "+material[0];
        }
      },
       sentToEncode: function() {
      let incomplete = this.encodedArray.length < 6;
      if (incomplete) {
        console.log(this.encodedArray)
        console.log("layers incomplete");
        return;
      }
      let arr = this.encodedArray.map(i => parseInt(i));
      setTimeout(() => {
        let id = encode(arr);
        if (id === false) {
          console.log("Encode Error");
        } else {
          console.log(id)
          this.hashCode = id;
          location.hash = id;
          this.fullCode = true;
          this.ignoreHashChange = true; 
          console.log("Encode OK");
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
          this.encodedArray[i] = (Number(layers[i]));  
          }, 300);
          
          tempArray[i-1] = layers[i];
          console.log(this.setMaterialFromUrl)
        }
        this.fullCode = true;
        this.setMaterialFromUrl.push(tempArray);
        this.hashModelChange = true;
        console.log('Decode (from URL) OK');
      }
    }else {
        console.log("ignore changes")
        this.model = ["N°1 - Moluptatum", 1];
        // this.encodedArray[0] = 1;
    }
  }
    },
    mounted(){
      document.addEventListener('DOMContentLoaded', this.loadFromHash);
      window.addEventListener('hashchange', this.loadFromHash);
    },
    upated() {
    },
  components: {
      Glasses,
     Materials,
     Threemodel
    }
}
</script>

