<template>
  <div
    @mouseover="setHovered(index, true)"
    @mouseleave="setHovered(index, false)"
    class="material-picker"
  >
    <span class="index text-medium">{{index}}</span>
    <ul class="overview">
      <li
        v-on:click="setSliderContent('woods')"
        v-bind:class="[activeElement === 'woods' ? 'active text-tab' : 'text-tab', selectedMaterial !== 'empty' && 'deactivated']"
      >Holz{{hashMaterial[0]}}</li>
      <li
        v-on:click="setSliderContent('papers')"
        v-bind:class="[activeElement === 'papers' ? 'active text-tab' : 'text-tab', selectedMaterial !== 'empty' && 'deactivated']"
      >Papier</li>
      <li
        v-on:click="setSliderContent('fabrics')"
        v-bind:class="[activeElement === 'fabrics' ? 'active text-tab' : 'text-tab', selectedMaterial !== 'empty' && 'deactivated']"
      >Stoff</li>
      <span :class="'swiper swiper-wood swiper-container swiper-container'+index">
        <strong
          v-if="selectedMaterial !== 'empty'"
          class="swiper-text-selected text-product-description"
        >{{activeMaterial}}</strong>
        <div
          :class="selectedMaterial !== 'empty' && index %2 === 0 ? 'swiper-wrapper selected' : 'swiper-wrapper'"
        >
          <span
            v-if="activeElement === 'woods'"
            v-for="wood in woods"
            v-on:click="setMaterial(wood.name, wood.texture, wood.index)"
            :class="[selectedMaterial === wood.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
          >
            <h3
              v-bind:style="{ backgroundImage: 'url(' + wood.texture + ')' }"
              :class="[selectedMaterial !== 'empty' ? 'bg selected' : 'bg']"
            ></h3>
            <span class="text-product-description swiper-description">{{wood.name}}</span>
          </span>
          <span
            v-if="activeElement === 'fabrics'"
            v-for="fabric in fabrics"
            v-on:click="setMaterial(fabric.name, fabric.texture, fabric.index)"
            :class="[selectedMaterial === fabric.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
          >
            <h3
              v-bind:style="{ backgroundImage: 'url(' + fabric.texture + ')' }"
              :class="selectedMaterial !== 'empty' ? 'bg selected ' : 'bg'"
            ></h3>
            <span class="text-product-description swiper-description">{{fabric.name}}</span>
          </span>
          <span
            v-if="activeElement === 'papers'"
            v-for="paper in papers"
            v-on:click="setMaterial(paper.name, paper.texture, paper.index)"
            :class="[selectedMaterial === paper.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
          >
            <h3
              v-bind:style="{ backgroundImage: 'url(' + paper.texture + ')' }"
              :class="selectedMaterial !== 'empty' ? 'bg selected ' : 'bg'"
            ></h3>
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
// import {encode, decode} from "../../index.js"
import images from "../assets/materials/*/*.jpg";

export default {
  name: "MaterialPicker",
  components: {},
  props: ["selectedModel", "index", "swiperClass", "hashMaterial"],
  data: function() {
    return {
      isSelected: false,
      activeElement: "woods",
      activeMaterial: "empty",
      selectedMaterial: "empty",
      mSwiperClass: this.swiperClass,
      images,
      isHovering: false,
      hoveredItem: 0,
      currentIndex: 0,
      woods: [
        {
          name: "Ahorn",
          texture: images["wood"]["ahorn"],
          index: 1
        },
        {
          name: "Akazie",
          texture: images["wood"]["akazie"],
          index: 2
        },
        {
          name: "Birne",
          texture: images["wood"]["birne"],
          index: 3
        },
        {
          name: "Buche",
          texture: images["wood"]["buche"],
          index: 4
        },
        {
          name: "Eiche",
          texture: images["wood"]["eiche"],
          index: 5
        },
        {
          name: "Nuss",
          texture: images["wood"]["nuss"],
          index: 6
        },
        {
          name: "Ulme",
          texture: images["wood"]["ulme"],
          index: 7
        }
      ],
      papers: [
        {
          name: "Buch",
          texture: images["paper"]["buch"],
          index: 8
        },
        {
          name: "Buch Seite 2",
          texture: images["paper"]["buch02"],
          index: 9
        },
        {
          name: "Flyer",
          texture: images["paper"]["flyer"],
          index: 10
        },
        {
          name: "Flyer 2",
          texture: images["paper"]["flyer02"],
          index: 11
        }
      ],
      fabrics: [
        {
          name: "Stoff Gelb",
          texture: images["fabric"]["gelberStoff"],
          index: 12
        },
        {
          name: "Stoff gestreift",
          texture: images["fabric"]["gestreifterStoff"],
          index: 13
        },
        {
          name: "Leinen grob",
          texture: images["fabric"]["groberLeinen"],
          index: 14
        },
        {
          name: "Stoff grün",
          texture: images["fabric"]["gruenerStoff02"],
          index: 15
        },
        {
          name: "Jeans blau",
          texture: images["fabric"]["jeansblau"],
          index: 16
        },
        {
          name: "Jeans hellblau",
          texture: images["fabric"]["jeanshellblau"],
          index: 17
        },
        {
          name: "Leinen bedruckt",
          texture: images["fabric"]["leinenbedruckt"],
          index: 18
        },
        {
          name: "Leinen grau",
          texture: images["fabric"]["leinengrau"],
          index: 19
        },
        {
          name: "Jeans schwarz",
          texture: images["fabric"]["schwarzeJeans"],
          index: 20
        }
      ]
    };
  },
  watch: {
    hashMaterial: function() {
      for (let i = 1; i < this.hashMaterial[0].length+1; i++) {
        if (Number(this.index) === i) {
          if (this.hashMaterial[0][i-1] <= this.woods.length) {//is wood
            this.selectedMaterial = this.woods[this.hashMaterial[0][i-1]-1].name;
            this.activeMaterial = this.woods[this.hashMaterial[0][i-1]-1].name;
            let tempArray = [this.woods[this.hashMaterial[0][i-1]-1].name, this.woods[this.hashMaterial[0][i-1]-1].texture, this.index, this.woods[this.hashMaterial[0][i-1]-1].index];
           this.$emit("setAllHashMaterials", tempArray);  
           

          } else if (//is paper
            this.hashMaterial[0][i-1] <=
            this.woods.length + this.papers.length
          ) {

          } else {//is fabric
          }
        }
      }
    }
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
    setHovered: function(index, hovered) {
      this.isHovering = hovered;
      this.$emit("setHoveredMaterial", [index, this.isHovering]);
      if (hovered === true) {
        this.selectedMaterial = "empty";
        this.deactivateSwiper(true);
      }
      if (hovered === false) {
        if (this.activeMaterial !== "empty") {
          this.deactivateSwiper();
        }
        this.selectedMaterial = this.activeMaterial;
      }
    },
    deactivateSwiper: function(reactivate) {
      this.mSwiperClass.allowSlideNext = reactivate ? true : false;
      this.mSwiperClass.allowSlidePrev = reactivate ? true : false;
      document.getElementsByClassName(
        "swiper-button-next" + this.index
      )[0].style.visibility = reactivate ? "visible" : "hidden";
      document.getElementsByClassName(
        "swiper-button-prev" + this.index
      )[0].style.visibility = reactivate ? "visible" : "hidden";
    },
    setMaterial: function(name, texture, index) {
      let array = [name, texture, this.index, index];
      this.$emit("setMaterial", array);
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

