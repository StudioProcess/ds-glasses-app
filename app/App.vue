<template>
  <div class="main">
  <div id="three-model">{{model}}</div>
  <div class="content-area">
    <Glasses v-on:sendMessage="model = $event"></Glasses>
    <Materials></Materials>
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

