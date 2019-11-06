<template>
  <div class="main">
  <div id="three-model">{{model}}</div>
  <div class="content-area">
    <Glasses v-on:sendMessage="model = $event"></Glasses>
      <div class="material-picker-container">

    <Materials index="1" swiperClass='Swiper1'></Materials>
    <Materials index="2" swiperClass='Swiper2'></Materials>
    <Materials index="3" swiperClass='Swiper3'></Materials>
    <Materials index="4" swiperClass='Swiper4'></Materials>
    <Materials index="5" swiperClass='Swiper5'></Materials>
    </div>
  </div>


</template>

<script>
import Glasses from './src/components/GlassesPicker'
import Materials from './src/components/MaterialPicker'
export default {
  name: 'App',
  data: function() {
    return{
    model:"N°1 - Moluptatum",
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
                this.model = msg;
            }
    },
  components: {
      Glasses,
     Materials
    }
}
</script>

