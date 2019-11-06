<template>
  <div class="material-picker-container">
    <div class="material-picker">
      <span class="index text-medium">1</span>
      <ul class="overview">
        <li v-on:click="setSliderContent('woods')" v-bind:class="[activeElement === 'woods' ? 'active text-tab' : 'text-tab']">Holz</li>
        <li v-on:click="setSliderContent('papers')" v-bind:class="[activeElement === 'papers' ? 'active text-tab' : 'text-tab']">Papier</li>
        <li v-on:click="setSliderContent('fabrics')" v-bind:class="[activeElement === 'fabrics' ? 'active text-tab' : 'text-tab']">Stoff</li>
        <span class="swiper swiper-wood swiper-container">
          <div class="swiper-wrapper">
            <span
              v-if="activeElement === 'woods'"
              v-for="wood in woods"
              class="wood text-product-description swiper-slide"
            >
              <h3 v-bind:style="{ backgroundImage: 'url(' + wood.texture + ')' }" class="bg"></h3>
            </span>
            <span
              v-if="activeElement === 'fabrics'"
              v-for="fabric in fabrics"
              class="wood text-product-description swiper-slide"
            >
              <h3 v-bind:style="{ backgroundImage: 'url(' + fabric.texture + ')' }" class="bg"></h3>
            </span>
          </div>
        </span>
        <span class="swiper-button-prev"></span>
        <span class="swiper-button-next"></span>
      </ul>
    </div>
  </div>
</template>

<script>
// import Glasses from './components/GlassesPicker'
import images from "../assets/materials/*/*.png";

export default {
  name: "MaterialPicker",
  components: {},
  props: ["selectedModel"],
  data: function() {
    return {
      isSelected: false,
      activeElement: "woods",
      images,
      hoveredItem: 0,
      currentIndex: 0,
      fabrics: [
        {
          name: "Jeans",
          texture: images["fabric"]["jeans1"]
        },
        {
          name: "Jeans2",
          texture: images["fabric"]["jeans2"]
        },
        {
          name: "Jeans3",
          texture: images["fabric"]["jeans3"]
        },
        {
          name: "Jeans4",
          texture: images["fabric"]["jeans4"]
        },
        {
          name: "Jeans5",
          texture: images["fabric"]["jeans5"]
        }
      ],
      woods: [
        {
          name: "Ahorn",
          texture: images["wood"]["ahorn"]
        },
        {
          name: "Akazie",
          texture: images["wood"]["akazie"]
        },
        {
          name: "Birke",
          texture: images["wood"]["birke"]
        },
        {
          name: "Birne",
          texture: images["wood"]["birne"]
        },
        {
          name: "Buche",
          texture: images["wood"]["buche"]
        },
        {
          name: "Eiche",
          texture: images["wood"]["eiche"]
        },
        {
          name: "Esche",
          texture: images["wood"]["esche"]
        },
        {
          name: "Kirsche",
          texture: images["wood"]["kirsche"]
        },
        {
          name: "Lärche",
          texture: images["wood"]["lärche"]
        },
        {
          name: "Nuss",
          texture: images["wood"]["nuss"]
        },
        {
          name: "Ulme",
          texture: images["wood"]["ulme"]
        }
      ]
    };
  },
  mounted: function() {
    var mySwiper = new Swiper(".swiper-container", {
      slidesPerView: 7,
      spaceBetween: 6,
      slidesPerGroup: 7,
      loop: false,
      loopFillGroupWithBlank: true,

      // If we need pagination
      pagination: {
        el: ".swiper-pagination"
      },

      // Navigation arrows
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });
  },
  methods: {
    setSliderContent: function(material) {
      this.activeElement = material;
      console.log("setSlider:" + material);

      if (material === "woods") {
      }
    }
  }
};
</script>

