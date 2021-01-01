<template>
  <template v-if="ready">
    <video controls loop v-if="image.isVideo">
      <source :src="imagePath + image.path" />
    </video>
    <template v-else-if="image.isAlbum">
      <img
        :src="imagePath + image.id + '/' + imageName"
        v-for="(imageName, index) in albumImages"
        :key="index"
      />
    </template>
    <img :src="imagePath + image.path" v-else /><br />
    Upvotes: {{ image.upvotes }}
    <button v-on:click="upvoteImage()">Upvote</button>
    <button v-on:click="downvoteImage()">Downvote</button>
  </template>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// eslint-disable-next-line no-unused-vars
import { Image } from "../Image";
import axios from "axios";

export default class ImageView extends Vue {
  image: Image = new Image();
  albumImages: string[] = [];
  ready = false;
  imagePath = process.env.VUE_APP_CDN_IP + "/image/";

  beforeMount() {
    axios
      .get(process.env.VUE_APP_DB_IP + "/images/" + this.$route.params.id)
      .then((result) => {
        this.image = new Image(result.data);
        if (this.image.isAlbum) {
          axios
            .get(process.env.VUE_APP_DB_IP + "/albums/" + this.$route.params.id)
            .then((result) => {
              this.albumImages = result.data.images;
              this.ready = true;
            });
        } else {
          this.ready = true;
        }
      });
  }

  upvoteImage() {
    this.image.upvotes++;
  }

  downvoteImage() {
    this.image.upvotes--;
  }
}
</script>

<style scoped>
img {
  max-height: 90vh;
  max-width: 100vw;
}
</style>
