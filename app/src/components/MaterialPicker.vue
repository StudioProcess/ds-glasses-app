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
      <span :class="'swiper swiper-wood swiper-container swiper-container'+index">
        <div class="swiper-wrapper">
          <span
            v-if="activeElement === 'woods'"
            v-for="wood in woods"
            class="text-product-description swiper-slide"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + wood.texture + ')' }" class="bg"></h3>
          </span>
          <span
            v-if="activeElement === 'fabrics'"
            v-for="fabric in fabrics"
            class="text-product-description swiper-slide"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + fabric.texture + ')' }" class="bg"></h3>
          </span>
          <span
            v-if="activeElement === 'papers'"
            v-for="paper in papers"
            class="wood text-product-description swiper-slide"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + paper.texture + ')' }" class="bg"></h3>
          </span>
        </div>
      </span>
      <span :class="'swiper-button-prev swiper-button-prev'+(index) "></span>
      <span :class="'swiper-button-next swiper-button-next'+(index) "></span>
    </ul>
  </div>
</template>

<script>
// import Glasses from './components/GlassesPicker'
import images from "../assets/materials/*/*.png";

export default {
  name: "MaterialPicker",
  components: {},
  props: ["selectedModel", "index", "swiperClass"],
  data: function() {
    return {
      isSelected: false,
      activeElement: "woods",
      mSwiperClass: this.swiperClass,
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
      papers: [
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
          texture: images["wood"]["laerche"]
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
      this.mSwiperClass = new Swiper(".swiper-container" + this.index, {
        slidesPerView: 7,
        spaceBetween: 6,
        slidesPerGroup: 7,
        loop: false,
        loopFillGroupWithBlank: false,
        watchOverflow: true,
        navigation: {
          nextEl: ".swiper-button-next" + this.index,
          prevEl: ".swiper-button-prev" + this.index
        }
      });
    }, 100);
    setTimeout(() => {
      this.mSwiperClass.update();
    }, 300);
  },
  methods: {
    setSliderContent: function(material) {
      this.activeElement = material;
      setTimeout(() => {
        if (material === "fabrics" || material === "papers") {
          this.mSwiperClass.allowSlideNext = false;
          this.mSwiperClass.allowSlidePrev = false;
          this.mSwiperClass.paginationHide = true;
          this.mSwiperClass.slidesPerView = 5;
          document.getElementsByClassName(
            "swiper-button-next"
          )[0].style.visibility = "hidden";
          document.getElementsByClassName(
            "swiper-button-prev"
          )[0].style.visibility = "hidden";
          this.mSwiperClass.update();
        }
        if (material === "woods") {
          this.mSwiperClass.allowSlideNext = true;
          this.mSwiperClass.allowSlidePrev = true;
          this.mSwiperClass.paginationHide = false;
          document.getElementsByClassName(
            "swiper-button-next" + this.index
          )[0].style.visibility = "visible";
          document.getElementsByClassName(
            "swiper-button-prev" + this.index
          )[0].style.visibility = "visible";
          this.mSwiperClass.update();
        }
      }, 10);
    }
  }
};
</script>

