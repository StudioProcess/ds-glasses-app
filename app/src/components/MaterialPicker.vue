<template>
  <div
    @mouseover="setHovered(index, true)"
    @mouseleave="setHovered(index, false)"
    class="material-picker"
  >
    <ul :class="[!(index % 2 === 0) ?  'overview even' : 'overview']">
      <span
        :class="[selectedMaterial !== 'empty' ? 'text-description material-index active' : 'text-description material-index']"
      >{{index}}</span>

      <ul class="tab-overview">
        <li
          v-on:click="setSliderContent('woods')"
          v-bind:class="[activeTab === 'woods' ? 'active text-tab' : 'text-tab', selectedMaterial !== 'empty' && 'deactivated']"
        >Holz</li>
        <!-- v-on:click="setSliderContent('papers')" -->
        <li
          v-bind:class="[activeTab === 'papers' ? 'active text-tab' : 'text-tab forbidden', selectedMaterial !== 'empty' && 'deactivated']"
        >Papier
        </li>
        <!-- v-on:click="setSliderContent('fabrics')" -->
        <li
          v-bind:class="[activeTab === 'fabrics' ? 'active text-tab' : 'text-tab forbidden', selectedMaterial !== 'empty' && 'deactivated']"
        
        >Textil</li>
      </ul>
      <span ref="detectorLeft" class="detector detector-left"></span>
      <span ref="detectorRight" class="detector detector-right"></span>
      <span :class="'swiper swiper-wood swiper-container swiper-container'+index">
        <strong
          v-if="selectedMaterial !== 'empty'"
          class="swiper-text-selected text-product-description"
        >{{activeMaterial}}</strong>
        <div
          :class="selectedMaterial !== 'empty' && index %2 === 0 ? 'swiper-wrapper selected' : 'swiper-wrapper'"
        >
          <span
            v-if="activeTab === 'woods'"
            v-for="wood in woods"
            v-on:click="setMaterial(wood.name, wood.texture, wood.index, 'woods')"
            :class="[selectedMaterial === wood.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
            :id="[wood.index]"
            @mouseover="detectFirstChild(true, $event)"
            @mouseleave="detectFirstChild(false, $event)"
          >
            <!--    @mouseover="detectFirstChild(true, $event)"
            @mouseleave="detectFirstChild(false, $event)"-->
            <h3
              v-bind:style="{ backgroundImage: 'url(' + (selectedMaterial === wood.name ? wood.thumb : wood.thumb)  + ')' }"
              :class="[selectedMaterial !== 'empty' ? 'bg selected' : 'bg']"
            ></h3>
            <span class="tooltip-material-box hovering-next">
              <span
                class="text-product-description swiper-description tooltip-material"
              >{{wood.name}}</span>
            </span>
          </span>

          <span
            v-if="activeTab === 'fabrics'"
            v-for="fabric in fabrics"
            v-on:click="setMaterial(fabric.name, fabric.texture, fabric.index, 'fabrics')"
            :class="[selectedMaterial === fabric.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
            :id="['slideFabric'+fabric.index]"
            @mouseover="detectFirstChild(true, $event)"
            @mouseleave="detectFirstChild(false, $event)"
          >
            <h3
              v-bind:style="{ backgroundImage: 'url(' + (selectedMaterial === fabric.name ? fabric.texture : fabric.thumb) + ')' }"
              :class="selectedMaterial !== 'empty' ? 'bg selected ' : 'bg'"
            ></h3>
            <span class="tooltip-material-box hovering-next">
              <span
                class="text-product-description swiper-description tooltip-material"
              >{{fabric.name}}</span>
            </span>
          </span>
          <span
            v-if="activeTab === 'papers'"
            v-for="paper in papers"
            v-on:click="setMaterial(paper.name, paper.texture, paper.index, 'papers')"
            :class="[selectedMaterial === paper.name ? 'text-product-description swiper-slide swiper-slide-selected' : 'text-product-description swiper-slide', index %2 === 0 && 'even']"
            :id="['slidePaper'+paper.index]"
            @mouseover="detectFirstChild(true, $event)"
            @mouseleave="detectFirstChild(false, $event)"
          >
            <h3
              v-bind:style="{ backgroundImage: 'url(' + (selectedMaterial === paper.name ? paper.texture : paper.thumb) + ')' }"
              :class="selectedMaterial !== 'empty' ? 'bg selected ' : 'bg'"
            ></h3>
            <span class="tooltip-material-box hovering-next">
              <span
                class="text-product-description swiper-description tooltip-material"
              >{{paper.name}}</span>
            </span>
          </span>
        </div>
        <div :class="'swiper-scrollbar swiper-scrollbar'+(index)"></div>
      </span>
      <span ref="buttonPrev" :class="'swiper-button-prev swiper-button-prev'+(index) "></span>
      <span ref="buttonNext" :class="'swiper-button-next swiper-button-next'+(index) "></span>
    </ul>
  </div>
</template>

<script>
import images from "../assets/materials/*/*.jpg";
import thumbs from "../assets/materials/*/*/*.jpg";

export default {
  name: "MaterialPicker",
  components: {},
  props: [
    "selectedModel",
    "index",
    "swiperClass",
    "hashMaterial",
    "resetMaterialsTrigger",
    "randomMaterialsTrigger",
    "materialNameSet",
    "randomArray"
  ],
  data: function() {
    return {
      isSelected: false,
      activeTab: "woods",
      activeMaterialTab: "empty",
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
          thumb: thumbs["wood"]["thumbnails"]["ahorn"],
          index: 1
        },
        {
          name: "Akazie",
          texture: images["wood"]["akazie"],
          thumb: thumbs["wood"]["thumbnails"]["akazie"],
          index: 2
        },
        {
          name: "Apfel",
          texture: images["wood"]["apfel"],
          thumb: thumbs["wood"]["thumbnails"]["apfel"],
          index: 3
        },
        {
          name: "Birke",
          texture: images["wood"]["birke"],
          thumb: thumbs["wood"]["thumbnails"]["birke"],
          index: 4
        },
        {
          name: "Birne",
          texture: images["wood"]["birne"],
          thumb: thumbs["wood"]["thumbnails"]["birne"],
          index: 5
        },
        {
          name: "Birne Wurzelholz",
          texture: images["wood"]["birneWurzelholz"],
          thumb: thumbs["wood"]["thumbnails"]["birneWurzelholz"],
          index: 6
        },
        {
          name: "Buche",
          texture: images["wood"]["buche"],
          thumb: thumbs["wood"]["thumbnails"]["buche"],
          index: 7
        },
        {
          name: "Eiche",
          texture: images["wood"]["eiche"],
          thumb: thumbs["wood"]["thumbnails"]["eiche"],
          index: 8
        },
        {
          name: "Esche",
          texture: images["wood"]["esche"],
          thumb: thumbs["wood"]["thumbnails"]["esche"],
          index: 9
        },
        {
          name: "Kirsche",
          texture: images["wood"]["kirsche"],
          thumb: thumbs["wood"]["thumbnails"]["kirsche"],
          index: 10
        },
        {
          name: "Kirsche mit Verlauf",
          texture: images["wood"]["kirscheMitVerlauf"],
          thumb: thumbs["wood"]["thumbnails"]["kirscheMitVerlauf"],
          index: 11
        },
        {
          name: "Lärche",
          texture: images["wood"]["laerche"],
          thumb: thumbs["wood"]["thumbnails"]["laerche"],
          index: 12
        },
        {
          name: "Mooreiche",
          texture: images["wood"]["mooreiche"],
          thumb: thumbs["wood"]["thumbnails"]["mooreiche"],
          index: 13
        },
        {
          name: "Nuss",
          texture: images["wood"]["nuss"],
          thumb: thumbs["wood"]["thumbnails"]["nuss"],
          index: 14
        },
        {
          name: "Nuss mit Verlauf",
          texture: images["wood"]["nussMitVerlauf"],
          thumb: thumbs["wood"]["thumbnails"]["nussMitVerlauf"],
          index: 15
        },
        {
          name: "Nuss Wurzelholz",
          texture: images["wood"]["nussWurzelholz"],
          thumb: thumbs["wood"]["thumbnails"]["nussWurzelholz"],
          index: 16
        },
        {
          name: "Ulme",
          texture: images["wood"]["ruesterUlme"],
          thumb: thumbs["wood"]["thumbnails"]["ruesterUlme"],
          index: 17
        }
      ],
      papers: [
        {
          name: "Zeitung weiß",
          texture: images["paper"]["auszugFalter"],
          thumb: thumbs["paper"]["thumbnails"]["auszugFalter"],
          index: 18
        },
        {
          name: "Zeitung vergilbt",
          texture: images["paper"]["auszugStandard"],
          thumb: thumbs["paper"]["thumbnails"]["auszugStandard"],
          index: 19
        },
        {
          name: "Buch",
          texture: images["paper"]["buch"],
          thumb: thumbs["paper"]["thumbnails"]["buch"],
          index: 20
        },
        {
          name: "Flyer",
          texture: images["paper"]["flyer"],
          thumb: thumbs["paper"]["thumbnails"]["flyer"],
          index: 21
        },
        {
          name: "Kariertes Papier",
          texture: images["paper"]["kariertesBlatt"],
          thumb: thumbs["paper"]["thumbnails"]["kariertesBlatt"],
          index: 22
        },
        {
          name: "Kopie/Print - Bild",
          texture: images["paper"]["kopie"],
          thumb: thumbs["paper"]["thumbnails"]["kopie"],
          index: 23
        },
        {
          name: "Kopie/Print - Text",
          texture: images["paper"]["kopierpapierProbedruck"],
          thumb: thumbs["paper"]["thumbnails"]["kopierpapierProbedruck"],
          index: 24
        },
        {
          name: "Packpapier",
          texture: images["paper"]["verpackungsmaterial"],
          thumb: thumbs["paper"]["thumbnails"]["verpackungsmaterial"],
          index: 25
        }
      ],
      fabrics: [
        {
          name: "Jeans Blau",
          texture: images["fabric"]["jeansblau"],
          thumb: thumbs["fabric"]["thumbnails"]["jeansblau"],
          index: 26
        },
        {
          name: "Jeans Hellblau",
          texture: images["fabric"]["jeanshellblau"],
          thumb: thumbs["fabric"]["thumbnails"]["jeanshellblau"],
          index: 27
        },
        {
          name: "Jeans Schwarz",
          texture: images["fabric"]["jeansSchwarz"],
          thumb: thumbs["fabric"]["thumbnails"]["jeansSchwarz"],
          index: 28
        },
        {
          name: "Leinen",
          texture: images["fabric"]["leinen"],
          thumb: thumbs["fabric"]["thumbnails"]["leinen"],
          index: 29
        },
        {
          name: "T-Shirt Blau",
          texture: images["fabric"]["tshirtBlau"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtBlau"],
          index: 30
        },
        {
          name: "T-Shirt Gelb",
          texture: images["fabric"]["tshirtGelb"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtGelb"],
          index: 31
        },
        {
          name: "T-Shirt Grau",
          texture: images["fabric"]["tshirtGrau"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtGrau"],
          index: 32
        },
        {
          name: "T-Shirt Grün",
          texture: images["fabric"]["tshirtGruen"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtGruen"],
          index: 33
        },
        {
          name: "T-Shirt Weiß",
          texture: images["fabric"]["tshirtOffWhite"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtOffWhite"],
          index: 34
        },
        {
          name: "T-Shirt Orange",
          texture: images["fabric"]["tshirtOrange"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtOrange"],
          index: 35
        },
        {
          name: "T-Shirt Rosa",
          texture: images["fabric"]["tshirtRosa"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtRosa"],
          index: 36
        },
        {
          name: "T-Shirt Rot",
          texture: images["fabric"]["tshirtRot"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtRot"],
          index: 37
        },
        {
          name: "T-Shirt Schwarz",
          texture: images["fabric"]["tshirtSchwarz"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtSchwarz"],
          index: 38
        },
        {
          name: "T-Shirt Türkis",
          texture: images["fabric"]["tshirtTuerkis"],
          thumb: thumbs["fabric"]["thumbnails"]["tshirtTuerkis"],
          index: 39
        },
        {
          name: "Leintuch Weiß",
          texture: images["fabric"]["weisserStoffLeintuch"],
          thumb: thumbs["fabric"]["thumbnails"]["weisserStoffLeintuch"],
          index: 40
        }
      ]
    };
  },
  watch: {
    randomMaterialsTrigger: function() {
      // set random materials
      if (this.randomMaterialsTrigger === true) {
        let item = this.woods[
          Math.floor(this.randomArray[this.index] * this.woods.length)
        ];
        let randomNmbr = Math.floor(Math.random() * 3) + 1;

        // if (randomNmbr === 2) {
        //   this.setSliderContent("papers");
        //   this.activeMaterialTab = "papers";
        //   item = this.papers[Math.floor(Math.random() * this.papers.length)];
        // } else if (randomNmbr === 3) {
        //   this.setSliderContent("fabrics");
        //   this.activeMaterialTab = "fabrics";
        //   item = this.fabrics[Math.floor(Math.random() * this.fabrics.length)];
        // } else {
        this.setSliderContent("woods");
        this.activeMaterialTab = "woods";
        // }
        this.mSwiperClass.slideTo(0, 0.0);
        this.mSwiperClass.update();
        let array = [item.name, item.texture, this.index, item.index];
        this.$emit("passRandomMaterialBack", array);
        this.activeMaterial = item.name;
        this.selectedMaterial = item.name;
      }
    },

    resetMaterialsTrigger: function() {
      // reset material hover and selection
      if (this.resetMaterialsTrigger) {
        this.activeMaterial = "empty";
        this.selectedMaterial = "empty";
        this.deactivateSwiper(true);
        this.setSliderContent("woods");
      }
    },
    hashMaterial: function() {
      // set materials from hash
      if (this.randomMaterialsTrigger === false) {
        for (let i = 1; i < this.hashMaterial[0].length + 1; i++) {
          if (Number(this.index) === i) {
            if (this.hashMaterial[0][i - 1] <= this.woods.length) {
              this.setHashMaterial(
                this.woods,
                i,
                this.hashMaterial[0][i - 1],
                "woods"
              );
            } else if (
              //is paper
              this.hashMaterial[0][i - 1] <=
              this.woods.length + this.papers.length
            ) {
              this.setHashMaterial(
                this.papers,
                i,
                this.hashMaterial[0][i - 1],
                "papers"
              );
            } else {
              //is fabric
              this.setHashMaterial(
                this.fabrics,
                i,
                this.hashMaterial[0][i - 1],
                "fabrics"
              );
            }
          }
        }
      }
    }
  },
  mounted: function() {
    setTimeout(() => {
      this.mSwiperClass = new Swiper(".swiper-container" + this.index, {
        spaceBetween: 4,
        // slidesPerGroup: 7,
        loop: false,
        loopFillGroupWithBlank: false,
        watchOverflow: true,
        slidesPerView: "auto",
        noSwipingClass: "swiper-no-swiping",
        navigation: {
          nextEl: ".swiper-button-next" + this.index,
          prevEl: ".swiper-button-prev" + this.index
        },
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: false
        }
      });
    }, 100);
    setTimeout(() => {
      this.mSwiperClass.update();
    }, 300);
  },
  methods: {
    setHashMaterial: function(materialArr, i, hashIndex, arrayName) {
      let tempArray = [];
      for (let j = 0; j < materialArr.length; j++) {
        if (materialArr[j].index === hashIndex) {
          this.selectedMaterial = materialArr[j].name;
          tempArray = [
            materialArr[j].name,
            materialArr[j].texture,
            this.index,
            materialArr[j].index
          ];
          this.activeMaterial = materialArr[j].name;
        }
      }
      this.activeTab = arrayName;
      this.activeMaterialTab = arrayName;
      this.$emit("setAllHashMaterials", tempArray);
    },
    setHovered: function(index, hovered) {
      this.isHovering = hovered;
      this.$emit("setHoveredMaterial", [index, this.isHovering]);
      if (hovered === true) {
        this.selectedMaterial = "empty";
        this.setSliderContent(this.activeTab);
      }
      if (hovered === false) {
        if (this.activeMaterial !== "empty") {
          this.mSwiperClass.slideTo(0, 0.0);
        this.mSwiperClass.update();
          this.deactivateSwiper();
          if (this.activeMaterialTab !== this.activeTab) {
            this.activeTab = this.activeMaterialTab;
          }
        }
        this.selectedMaterial = this.activeMaterial;
      }
    },
    detectFirstChild: function(hovered, event) {
      let currentElement = event.currentTarget.children[1].children[0].getBoundingClientRect();
      let detectorLeft = this.$refs.detectorLeft.getBoundingClientRect();
      let detectorRight = this.$refs.detectorRight.getBoundingClientRect();
      let buttonPrev = this.$refs.buttonPrev.getBoundingClientRect();
      let buttonNext = this.$refs.buttonNext.getBoundingClientRect();

      let overlapPrev = !(
        detectorLeft.right < currentElement.left ||
        detectorLeft.left > currentElement.right ||
        detectorLeft.bottom < currentElement.top ||
        detectorLeft.top > currentElement.bottom
      );

      let overlapNext = !(
        detectorRight.right < currentElement.left ||
        detectorRight.left > currentElement.right ||
        detectorRight.bottom < currentElement.top ||
        detectorRight.top > currentElement.bottom
      );

      if (overlapPrev) {
        event.currentTarget.children[1].classList.add("hovering-prev");
      }
      if (!overlapNext) {
        event.currentTarget.children[1].classList.remove("hovering-next");
      }
      if (overlapNext) {
        event.currentTarget.children[1].classList.add("hovering-next");
      }
      if (!overlapPrev) {
        event.currentTarget.children[1].classList.remove("hovering-prev");
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

    setMaterial: function(name, texture, index, tab) {
      let array = [name, texture, this.index, index];
      this.$emit("setMaterial", array);
      // this.mSwiperClass.slideTo(1, 0.0);
      // this.mSwiperClass.update();
      this.activeMaterial = name;
      this.activeMaterialTab = tab;
      this.deactivateSwiper();
    },
    setSliderContent: function(material) {
      this.activeTab = material;
      setTimeout(() => {
        if (material === "papers") {
          this.deactivateSwiper();
          document.getElementsByClassName(
            "swiper-button-next"
          )[0].style.visibility = "hidden";
          document.getElementsByClassName(
            "swiper-button-prev"
          )[0].style.visibility = "hidden";
          this.mSwiperClass.update();
          document.getElementsByClassName(
            "swiper-scrollbar"
          )[0].style.visibility = "hidden";
          this.mSwiperClass.update();
        }
        if (material === "woods" || material === "fabrics") {
          this.mSwiperClass.allowSlideNext = true;
          this.mSwiperClass.allowSlidePrev = true;

          document.getElementsByClassName(
            "swiper-button-next" + this.index
          )[0].style.visibility = "visible";
          document.getElementsByClassName(
            "swiper-button-prev" + this.index
          )[0].style.visibility = "visible";
          this.mSwiperClass.update();
          document.getElementsByClassName(
            "swiper-scrollbar" + this.index
          )[0].style.visibility = "visible";
          this.mSwiperClass.update();
        }
      }, 10);
    }
  }
};
</script>

