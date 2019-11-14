<template>
  <div class="glasses-picker-container">
    <div
      class="glasses"
      v-for="(todo, index) in todos"
      v-on:click="clickedGlasses(index, todo.name, todo.model)"
      @mouseover="hoveringGlasses(index)"
      v-bind:class="{selected: (isSelected && currentIndex === index || !isSelected && index === 0 )}"
    >
      <img :src="getUrl(todo.url)" :alt="todo.name" />
      <h4 class="text-product-description">{{ todo.name }}</h4>
      <span class="text-product-description">{{ todo.price }}</span>
    </div>
  </div>
</template>

<script>
// import Glasses from './components/GlassesPicker'
export default {
  name: "GlassesPicker",
  components: {},
  props: ["selectedModel"],
  data: function() {
    return {
      isSelected: false,
      hoveredItem: 0,
      currentIndex: 0,
      todos: [
        {
          url: "../assets/glasses-dummy.png",
          name: "N°1 - Moluptatum",
          price: "525€",
          model: 1,
        },
        {
          url: "../assets/glasses-dummy.png",
          name: "N°2 - Moluptatum",
          price: "525€",
          model: 2,
        },
        {
          url: "../assets/glasses-dummy.png",
          name: "N°3 - Moluptatum",
          price: "525€",
          model: 3,
        },
        {
          url: "../assets/glasses-dummy.png",
          name: "N°4 - Moluptatum",
          price: "525€",
          model: 4,
        },
        {
          url: "../assets/glasses-dummy.png",
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
    hoveringGlasses: function(index) {},
    getUrl: function(url) {

      let temp = "../assets/" + url.toString();
      console.log(url);
      return require("../assets/glasses-dummy.png");
    }
  }
};
</script>

