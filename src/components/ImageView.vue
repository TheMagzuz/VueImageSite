<template>
  <div v-show="!$route.params.id">
    <search
      @searchChanged="onSearchChanged"
      :requestedSearch="requestedSearch"
    ></search>
    <div id="image-view-container">
      <router-link
        v-bind:to="'/images/' + image.id"
        v-for="(image, index) in images"
        :key="index"
      >
        <img
          :src="imagesPath + image.thumbnailPath"
          :class="image.getImageType()"
          :srcset="generateSrcSet(thumbnailsPath + image.thumbnailPath)"
        />
      </router-link>
    </div>
  </div>
  <router-view @requestSearch="requestSearch"></router-view>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { defineComponent, Ref } from "vue";
import axios from "axios";
import { Image } from "../Image";
import Search from "./Search.vue";

const pageSize = 10;
const imageSizes = [126, 132, 234, 420, 512, 660];

export default defineComponent({
  data() {
    return {
      images: [] as Image[],
      filteredImages: [] as Image[],
      allImages: [] as Image[],
      imagesPath: process.env.VUE_APP_CDN_IP + "/image/",
      thumbnailsPath: process.env.VUE_APP_CDN_IP + "/thumbnail/",
      requestedSearch: "",
    };
  },
  methods: {
    fetchImages() {
      return axios
        .get(process.env.VUE_APP_DB_IP + "/images")
        .then((response) => {
          this.allImages = response.data
            .reverse()
            .map((d: any) => new Image(d));
          this.filteredImages = this.allImages;
        });
    },

    extendImages(amount = pageSize) {
      let newLength = this.images.length + amount;
      this.images = this.filteredImages.slice(0, newLength);
    },
    onSearchChanged(tags: string) {
      this.filteredImages = this.allImages.filter((i) => i.matchesTags(tags));
      this.images = this.filteredImages.slice(0, pageSize);
    },

    onScroll() {
      let atBottom =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - 30;

      if (atBottom) {
        this.extendImages();
      }
    },
    requestSearch(search: string) {
      this.requestedSearch = search;
    },
    generateSrcSet(imagePath: string): string {
      var s = "";
      for (let width of imageSizes) {
        s += imagePath + "?w=" + width + " " + width + "w,";
      }
      return s;
    },
  },

  beforeMount() {
    this.fetchImages().then(() => {
      this.images = this.allImages.slice(0, pageSize);
    });
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  components: {
    Search,
  },
});
</script>

<style scoped>
#image-view-container {
  width: 99vw;
}
#image-view-container img {
  max-width: 35vw;
  max-height: 90vh;
  margin: 10px;
  width: auto;
  height: auto;
}

.album {
  border: solid blue;
}

.video {
  border: solid red;
}
</style>
