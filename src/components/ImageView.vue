<template>
  <div v-show="!$route.params.id">
    <search @searchChanged="onSearchChanged"></search>
    <div id="image-view-container">
      <router-link
        v-bind:to="'/images/' + image.id"
        v-for="(image, index) in images"
        :key="index"
      >
        <img
          :src="imagesPath + image.thumbnailPath"
          :class="image.getImageType()"
        />
      </router-link>
      <button v-on:click="extendImages(pageSize)">Extend</button>
    </div>
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { Image } from "../Image";
import Search from "./Search.vue";

const pageSize = 10;

export default defineComponent({
  data() {
    return {
      images: [] as Image[],
      filteredImages: [] as Image[],
      allImages: [] as Image[],
      imagesPath: process.env.VUE_APP_CDN_IP + "/image/",
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
      let newLength = this.filteredImages.length + amount;
      this.images = this.filteredImages.slice(0, newLength);
    },
    onSearchChanged(tags: string) {
      this.filteredImages = this.allImages.filter((i) => i.matchesTags(tags));
      this.images = this.filteredImages.slice(0, pageSize);
    },
  },

  beforeMount() {
    this.fetchImages().then(() => {
      this.images = this.allImages.slice(0, pageSize);
    });
  },
  components: {
    Search,
  },
});
</script>

<style scoped>
#image-view-container {
  width: 100vw;
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
