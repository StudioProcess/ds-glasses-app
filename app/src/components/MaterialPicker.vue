<template>
  <div class="material-picker">
    <span class="index text-medium">{{index}}</span>
    <ul class="overview">
      <li
        v-on:click="setSliderContent('woods')"
        v-bind:class="[activeElement === 'woods' ? 'active text-tab' : 'text-tab']"
      >Holz</li>
      <li
        v-on:click="setSliderContent('papers')"
        v-bind:class="[activeElement === 'papers' ? 'active text-tab' : 'text-tab']"
      >Papier</li>
      <li
        v-on:click="setSliderContent('fabrics')"
        v-bind:class="[activeElement === 'fabrics' ? 'active text-tab' : 'text-tab']"
      >Stoff</li>
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
</template>

<script>
// import Glasses from './components/GlassesPicker'
import images from "../assets/materials/*/*.png";

var mySwiper;

export default {
  name: "MaterialPicker",
  components: {},
  props: ["selectedModel", "index"],
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
    setTimeout(() => {
    mySwiper = new Swiper(".swiper-container", {
      slidesPerView: 7,
      spaceBetween: 6,
      slidesPerGroup: 7,
      loop: false,
      loopFillGroupWithBlank: false,
      watchOverflow: true,
      // Navigation arrows
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });
    },20);
  },
  methods: {
    setSliderContent: function(material) {
      this.activeElement = material;
      console.log("setSlider:" + material);
    setTimeout(() => {
       if (material === "fabrics") {
        mySwiper.allowSlideNext = false;
        mySwiper.allowSlidePrev = false;
        mySwiper.paginationHide = true;
        mySwiper.slidesPerView = 5;
        document.getElementsByClassName(
          "swiper-button-next"
        )[0].style.visibility = "hidden";
        document.getElementsByClassName(
          "swiper-button-prev"
        )[0].style.visibility = "hidden";
        console.log(mySwiper[0]);
        mySwiper[this.index-1].update();
      }
      if (material === "woods") {
        mySwiper.allowSlideNext = true;
        mySwiper.allowSlidePrev = true;
        mySwiper.paginationHide = false;
        document.getElementsByClassName(
          "swiper-button-next"
        )[0].style.visibility = "visible";
        document.getElementsByClassName(
          "swiper-button-prev"
        )[0].style.visibility = "visible";
        mySwiper[this.index-1].update();
      }
    }, 10);
     
    }
  }
};
</script>

