<template>
  <div class="glasses-picker-container">
    <div
      class="glasses"
      v-for="todo in todos"
      v-on:click="clickedGlasses"
      v-on:hover="hoveringGlasses"
      v-bind:class="{selected: isSelected}"
    >
      <h3>{{ todo.name }}</h3>
      <img :src="todo.url" />
      <h3>{{ todo.price }}</h3>
    </div>
  </div>
</template>

<script>
// import Glasses from './components/GlassesPicker'
export default {
  name: "Glasses",
  components: {},
  data: function() {
    return {
      isSelected: false,
      todos: [
        { url: "asdasd", name: "N°4 - Moluptatum", price: "525€" },
        { url: "asdsd", name: "N°4 - Moluptatum", price: "525€" },
        { url: "asdsad", name: "N°4 - Moluptatum", price: "525€" },
        { url: "asdsad", name: "N°4 - Moluptatum", price: "525€" },
        { url: "asdsad", name: "N°4 - Moluptatum", price: "525€" }
      ]
    };
  },
  methods: {
    clickedGlasses: function() {
      this.isSelected = !this.isSelected;
    },
    hoveringGlasses: function() {
      this.isSelected = !this.isSelected;
    }
  }
};
</script>

