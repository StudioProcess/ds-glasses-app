<template>
  <div class="glasses-picker-container">
    <div
      class="glasses"
      v-for="(glassesModel, index) in glasses"
      v-on:click="currentModelLoaded && clickedGlasses(index, glassesModel.name, glassesModel.model)"
      @mouseover="hoveringGlasses(index)"
      v-bind:class="[(isSelected && currentIndex === index || !isSelected && index === 0 ) && 'selected', !(index % 2 === 0) && 'even' ]"
    >
      <img :src="[glassesModel.url]" :alt="glassesModel.name" />

      <h4 class="text-product-description">{{ glassesModel.name }}</h4>
      <!-- <span class="text-product-description">{{ glassesModel.price }}</span> -->
      
    </div>
  </div>
</template>

<script>
//       //      <span class="glassesImage" :style="{backgroundImage: 'url('+glassesModel.url+')'}" :alt="glassesModel.name" />

import images from "../assets/glasses/*.png";
export default {
  name: "GlassesPicker",
  components: {},
  props: ["selectedModel", "hashModelNumber", "currentModelLoaded"],
  data: function() {
    return {
      isSelected: false,
      hoveredItem: 0,
      currentIndex: 0,
      glasses: [
        {
          url: images["glasses01"],
          urlHover: images["glassesSteg"],
          name: "N°1 - Moluptatum",
          price: "525€",
          model: 1,
        },
        {
          url: images["glasses02"],
          urlHover: images["glassesSteg"],
          name: "N°2 - Moluptatum",
          price: "525€",
          model: 2,
        },
        {
          url: images["glasses03"],
          name: "N°3 - Moluptatum",
          price: "525€",
          model: 3,
        },
        {
          url: images["glasses04"],
          urlHover: images["glassesSteg"],
          name: "N°4 - Moluptatum",
          price: "525€",
          model: 4,
        },
        {
          url: images["glasses02-sl"],
          urlHover: images["glassesSteg"],
          name: "N°2 - Schlüsselloch",
          price: "525€",
          model: 5,
        },
        {
          url: images["glasses03-sl"],
          urlHover: images["glassesSteg"],
          name: "N°3 - Schlüsselloch",
          price: "525€",
          model: 6,
        },
        {
          url: images["glasses04-sl"],
          urlHover: images["glassesSteg"],
          name: "N°4 - Schlüsselloch",
          price: "525€",
          model: 7,
        }
      ]
    };
  },
  watch: {
    modelHasLoaded: function(){
        console.log("modelhasloaded" + this.currentModelLoaded);
    },
    hashModelNumber: function(){
    if(this.hashModelNumber !== 0){
      this.isSelected = true;
      this.currentIndex = this.hashModelNumber;
      this.$emit("sendMessage", [this.glasses[this.hashModelNumber].name, this.glasses[this.hashModelNumber].model]);
    }},
  },
  methods: {
    clickedGlasses: function(index, name, model) {
      console.log("modelhasloaded" + this.currentModelLoaded);
      this.isSelected = true;
      this.currentIndex = index;
      this.$emit("sendMessage", [name, model]);
    },
    hoveringGlasses: function(index) {}
  }
};
</script>

