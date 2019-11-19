<template>
  <div class="main">
     <!-- <div id="three-model"></div> -->
  <Threemodel :hoveredMaterial='hoveredMaterial' :setModel='model' :mat='passedMaterial'>{{passedMaterial}}</Threemodel>
  <div class="content-area">
    <Glasses v-on:sendMessage="model = $event"></Glasses>
      <div class="material-picker-container">
        <span class="random">Zufällig</span>
        <Materials index="1" v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper1'></Materials>
        <Materials index="2" v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper2'></Materials>
        <Materials index="3" v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper3'></Materials>
        <Materials index="4" v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper4'></Materials>
        <Materials index="5" v-on:setHoveredMaterial="setHoveredMaterial($event)" v-on:setMaterial="setMaterialName($event)" swiperClass='Swiper5'></Materials>

     <div class="payment-section">
        <h2>{{model[0]}}</h2> 
          <div class="material-display">{{materialOne}}{{materialTwo}}{{materialThree}}{{materialFour}}{{materialFive}}</div>
          <h3 class="price">{{price}}*</h3>

          <p class="info">
            * Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ei.
          </p>
          <span class="code"><strong>Dein Bestellcode:</strong><span>uxi-lkn-md-ad</span></span>

          <button class="buy-button">{{price}} jetzt kaufen</button>
    </div> 
    </div>
  
  </div>


</template>

<script>
import Glasses from './src/components/GlassesPicker'
import Materials from './src/components/MaterialPicker'
import Threemodel from './src/components/Threemodel'
export default {
  name: 'App',
  data: function() {
    return{
    model:["N°1 - Moluptatum", 0],
    price: "525,00€",
    passedMaterial: ["Ahorn", 0],
    materialOne: "",
    materialTwo: "",
    materialThree: "",
    materialFour: "",
    materialFive: "",
    hoveredMaterial: [0][false],
    updateHoverOnce: false,
    Swiper1: null,
    Swiper2: null,
    Swiper3: null,
    Swiper4: null,
    Swiper5: null,
    msg: "",
    }
    },
    methods: {
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
      setMaterialName(material) {
        this.passedMaterial[0] = material[1];
        this.passedMaterial[1] = material[2];

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

