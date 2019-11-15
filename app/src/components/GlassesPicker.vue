<template>
  <div class="glasses-picker-container">
    <div
      class="glasses"
      v-for="(glassesModel, index) in glasses"
      v-on:click="clickedGlasses(index, glassesModel.name, glassesModel.model)"
      @mouseover="hoveringGlasses(index)"
      v-bind:class="{selected: (isSelected && currentIndex === index || !isSelected && index === 0 )}"
    >
      <img :src="glassesModel.url" :alt="glassesModel.name" />
      <h4 class="text-product-description">{{ glassesModel.name }}</h4>
      <span class="text-product-description">{{ glassesModel.price }}</span>
    </div>
  </div>
</template>

<script>

import images from "../assets/glasses/*.png";
export default {
  name: "GlassesPicker",
  components: {},
  props: ["selectedModel"],
  data: function() {
    return {
      isSelected: false,
      hoveredItem: 0,
      currentIndex: 0,
      glasses: [
        {
          url: images["glasses01"],
          name: "N°1 - Moluptatum",
          price: "525€",
          model: 1,
        },
        {
          url: images["glasses02"],
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
          name: "N°4 - Moluptatum",
          price: "525€",
          model: 4,
        },
        {
          url: images["glasses02"],
          name: "N°5 - Moluptatum",
          price: "525€",
          model: 5,
        }
      ]
    };
  },
  methods: {
    clickedGlasses: function(index, name, model) {
      this.isSelected = true;
      this.currentIndex = index;
      this.$emit("sendMessage", [name, model]);
    },
    hoveringGlasses: function(index) {}
  }
};
</script>

