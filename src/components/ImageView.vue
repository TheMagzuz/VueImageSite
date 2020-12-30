<template>
  <p>Image View</p>
  <div id="image-view-container" v-show="!$route.params.id">
    <router-link
      v-bind:to="'/images/' + image.id"
      v-for="(image, index) in images"
      :key="index"
    >
      <img :src="imagesPath + image.thumbnailPath" />
    </router-link>
  </div>
  <button v-on:click="extendImages(10)">Extend</button>
  <router-view></router-view>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import axios from "axios";
import { Image } from "../Image";

export default class ImageView extends Vue {
  allImages: Image[] = [];
  images: Image[] = [];
  imagesPath = process.env.VUE_APP_CDN_IP + "/image/";

  fetchImages() {
    return axios.get(process.env.VUE_APP_DB_IP + "/images").then((response) => {
      this.allImages = response.data.reverse().map((d: any) => new Image(d));
      console.log(this.allImages);
    });
  }

  extendImages(amount: 10) {
    console.log(this.images.length);
    let newLength = this.images.length + amount;
    console.log(newLength);
    this.images = this.allImages.slice(0, newLength);
    console.log(this.images);
  }

  beforeMount() {
    this.fetchImages().then(() => {
      this.images = this.allImages.slice(0, 10);
      console.log(this.images);
    });
  }
}
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
</style>
