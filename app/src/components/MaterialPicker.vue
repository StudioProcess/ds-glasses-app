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
      >Holz</li>
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
        <div :class="selectedMaterial !== 'empty' && index %2 === 0 ? 'swiper-wrapper selected' : 'swiper-wrapper'">
          <span
            v-if="activeElement === 'woods'"
            v-for="wood in woods"
            v-on:click="setMaterial(wood.name, wood.texture)"
            :class="[selectedMaterial === wood.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + wood.texture + ')' }" :class="[selectedMaterial !== 'empty' ? 'bg selected' : 'bg']"></h3>
            <span class="text-product-description swiper-description">{{wood.name}}</span>
          </span>
          <span
            v-if="activeElement === 'fabrics'"
            v-for="fabric in fabrics"
            v-on:click="setMaterial(fabric.name, fabric.texture)"
            :class="[selectedMaterial === fabric.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + fabric.texture + ')' }" :class="selectedMaterial !== 'empty' ? 'bg selected ' : 'bg'"></h3>
            <span class="text-product-description swiper-description">{{fabric.name}}</span>
          </span>
          <span
            v-if="activeElement === 'papers'"
            v-for="paper in papers"
            v-on:click="setMaterial(paper.name, paper.texture)"
            :class="[selectedMaterial === paper.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
          >
            <h3 v-bind:style="{ backgroundImage: 'url(' + paper.texture + ')' }" :class="selectedMaterial !== 'empty' ? 'bg selected ' : 'bg'"></h3>
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
import images from "../assets/materials/*/*.jpg";

export default {
  name: "MaterialPicker",
  components: {},
  props: ["selectedModel", "index", "swiperClass"],
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
      fabrics: [
        {
          name: "Stoff Gelb",
          texture: images["fabric"]["gelberStoff"]
        },
        {
          name: "Stoff gestreift",
          texture: images["fabric"]["gestreifterStoff"]
        },
        {
          name: "Leinen grob",
          texture: images["fabric"]["groberLeinen"]
        },
        {
          name: "Stoff grün",
          texture: images["fabric"]["gruenerStoff02"]
        },
        {
          name: "Jeans blau",
          texture: images["fabric"]["jeansblau"]
        },
        {
          name: "Jeans hellblau",
          texture: images["fabric"]["jeanshellblau"]
        },
        {
          name: "Leinen bedruckt",
          texture: images["fabric"]["leinenbedruckt"]
        },
        {
          name: "Leinen grau",
          texture: images["fabric"]["leinengrau"]
        },
        {
          name: "Jeans schwarz",
          texture: images["fabric"]["schwarzeJeans"]
        }
      ],
      papers: [
        {
          name: "Buch",
          texture: images["paper"]["buch"]
        },
        {
          name: "Buch Seite 2",
          texture: images["paper"]["buch02"]
        },
        {
          name: "Flyer",
          texture: images["paper"]["flyer"]
        },
        {
          name: "Flyer 2",
          texture: images["paper"]["flyer02"]
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
        // {
        //   name: "Birke",
        //   texture: images["wood"]["birke"]
        // },
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
        // {
        //   name: "Esche",
        //   texture: images["wood"]["esche"]
        // },
        // {
        //   name: "Kirsche",
        //   texture: images["wood"]["kirsche"]
        // },
        // {
        //   name: "Lärche",
        //   texture: images["wood"]["laerche"]
        // },
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
    setHovered: function(index, hovered) {
      this.isHovering = hovered;
      this.$emit("setHoveredMaterial", [index, this.isHovering]);
      console.log(hovered);
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
    setMaterial: function(name, texture) {
      let array = [name, texture, this.index];
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

