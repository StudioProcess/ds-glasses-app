<template>
  <div class="material-picker">
    <span class="index text-medium">{{index}}</span>
    <ul class="overview">
      <li
        v-on:click="setSliderContent('woods')"
        v-bind:class="[activeElement === 'woods' ? 'active text-tab' : 'text-tab', activeMaterial !== 'empty' && 'deactivated']"
      >Holz</li>
      <li
        v-on:click="setSliderContent('papers')"
        v-bind:class="[activeElement === 'papers' ? 'active text-tab' : 'text-tab', activeMaterial !== 'empty' && 'deactivated']"
      >Papier</li>
      <li
        v-on:click="setSliderContent('fabrics')"
        v-bind:class="[activeElement === 'fabrics' ? 'active text-tab' : 'text-tab', activeMaterial !== 'empty' && 'deactivated']"
      >Stoff</li>
      <span :class="'swiper swiper-wood swiper-container swiper-container'+index">
        <strong
          v-if="activeMaterial !== 'empty'"
          class="swiper-text-selected text-product-description"
        >{{activeMaterial}}</strong>
        <div class="swiper-wrapper">
          <span
            v-if="activeElement === 'woods'"
            v-for="wood in woods"
            v-on:click="setMaterial(wood.name)"
            :class="activeMaterial === wood.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide'"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + wood.texture + ')' }" class="bg"></h3>
            <span class="text-product-description swiper-description">{{wood.name}}</span>
          </span>
          <span
            v-if="activeElement === 'fabrics'"
            v-for="fabric in fabrics"
            v-on:click="setMaterial(fabric.name)"
            :class="activeMaterial === fabric.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide'"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + fabric.texture + ')' }" class="bg"></h3>
            <span class="text-product-description swiper-description">{{fabric.name}}</span>
          </span>
          <span
            v-if="activeElement === 'papers'"
            v-for="paper in papers"
            v-on:click="setMaterial(paper.name)"
            :class="activeMaterial === paper.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide'"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + paper.texture + ')' }" class="bg"></h3>
            <span class="text-product-description swiper-description">{{paper.name}}</span>
          </span>
        </div>
      </span>
      <span :class="'swiper-button-prev swiper-button-prev'+(index) "></span>
      <span :class="'swiper-button-next swiper-button-next'+(index) "></span>
    </ul>
  </div>
</template>

<script>
import images from "../assets/materials/*/*.png";

export default {
  name: "MaterialPicker",
  components: {},
  props: ["selectedModel", "index", "swiperClass"],
  data: function() {
    return {
      isSelected: false,
      activeElement: "woods",
      activeMaterial: "empty",
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
    deactivateSwiper: function() {
      this.mSwiperClass.allowSlideNext = false;
      this.mSwiperClass.allowSlidePrev = false;
      document.getElementsByClassName(
        "swiper-button-next" + this.index
      )[0].style.visibility = "hidden";
      document.getElementsByClassName(
        "swiper-button-prev" + this.index
      )[0].style.visibility = "hidden";
    },
    setMaterial: function(name) {
      this.$emit("setMaterial", name);
      this.activeMaterial = name;
      this.deactivateSwiper();
    },
    setSliderContent: function(material) {
      this.activeElement = material;
      setTimeout(() => {
        if (material === "fabrics" || material === "papers") {
          this.deactivateSwiper();
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

