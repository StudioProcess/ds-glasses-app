<template>
  <div class="main">
     <!-- <div id="three-model"></div> -->
  <Threemodel :mat='materialOne' :matTwo='materialTwo'></Threemodel>
  <div class="content-area">
    <Glasses v-on:sendMessage="model = $event"></Glasses>
      <div class="material-picker-container">
        <Materials index="1" v-on:setMaterial="materialOne = $event" swiperClass='Swiper1'></Materials>
        <Materials index="2" v-on:setMaterial="materialOne = $event" swiperClass='Swiper2'></Materials>
        <Materials index="3" v-on:setMaterial="materialOne = $event" swiperClass='Swiper3'></Materials>
        <Materials index="4" v-on:setMaterial="materialOne = $event" swiperClass='Swiper4'></Materials>
        <Materials index="5" v-on:setMaterial="materialOne = $event" swiperClass='Swiper5'></Materials>

     <div class="payment-section">
        <h2>{{model}}</h2>
          <div id="">{{materialOne}}, {{materialTwo}},  {{materialThree}},  {{materialFour}},  {{materialFive}}</div>
          <h3 class="price">{{price}}*</h3>

          <p>
            * Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ei.
          </p>
          <span><strong>Dein Bestellcode:</strong>uxi-lkn-md-ad</span>

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
    model:"N°1 - Moluptatum",
    price: "525,00€",
    materialOne: "Ahorn",
    materialTwo: "Ahorn",
    materialThree: "Ahorn",
    materialFour: "Ahorn",
    materialFive: "Ahorn",
    Swiper1: null,
    Swiper2: null,
    Swiper3: null,
    Swiper4: null,
    Swiper5: null,
    msg: "",
    }
    },
    methods: {
   setMessage(msg) {
     console.log("hello?")
     console.log(msg)
                // this.model = msg;
            }
    },
  components: {
      Glasses,
     Materials,
     Threemodel
    }
}
</script>

