<template>
  <div class="glasses-picker-container">
    <div class="glasses" v-for="(todo, index) in todos" v-on:click="clickedGlasses(index, todo.name)" v-bind:class="{selected: (isSelected && currentIndex === index || !isSelected && index === 0 )}">
    <h3>{{ todo.name }}</h3>
    <img :src="todo.url">
    <h3>{{ todo.price }}</h3>
    </div>
  </div>
</template>

<script>
// import Glasses from './components/GlassesPicker'
export default {
  name: "GlassesPicker",
  components: {},
  props: ['selectedModel'],
  data: function() {
    return {
      isSelected: false,
      currentIndex: 0,
      todos: [
        { url: "asdasd", name: "N°1 - Moluptatum", price: "525€" },
        { url: "asdsd", name: "N°2 - Moluptatum", price: "525€" },
        { url: "asdsad", name: "N°3 - Moluptatum", price: "525€" },
        { url: "asdsad", name: "N°4 - Moluptatum", price: "525€" },
        { url: "asdsad", name: "N°5 - Moluptatum", price: "525€" }
      ]
    };
  },
  methods: {
    clickedGlasses: function(index, name) {
      this.isSelected= true;
      this.currentIndex = index;
      // console.log(name);
       this.$emit("sendMessage", name);
    }
  }
};
</script>

