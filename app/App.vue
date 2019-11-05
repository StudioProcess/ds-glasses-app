<template>
  <div class="main">
  <div id="three-model">{{model}}</div>
  <div class="content-area">
    <Glasses v-on:sendMessage="model = $event"></Glasses>
  </div>


</template>

<script>
import Glasses from './src/components/GlassesPicker.vue'
// import Material from './components/MaterialPicker'
export default {
  name: 'App',
  data: function() {
    return{
    model:"model1",
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
    //  Materials
    }
}
</script>

