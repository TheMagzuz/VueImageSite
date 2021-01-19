<template>
  <search @searchChanged="searchChanged"></search>
  <template v-if="ready">
    <video controls loop v-if="image.isVideo">
      <source :src="imagePath + image.path" />
    </video>
    <template v-else-if="image.isAlbum">
      <template v-for="(imageName, index) in albumImages" :key="index">
        <video
          controls
          loop
          v-if="videoExtensions.includes(getExtension(imageName))"
        >
          <source :src="imagePath + image.id + '/' + imageName" />
        </video>
        <img :src="imagePath + image.id + '/' + imageName" v-else />
        <br />
      </template>
    </template>
    <img :src="imagePath + image.path" v-else /><br />
    <div class="footer">
      <button @click="$router.push('/images/' + image.id)">Image</button><br />
      <button @click="showNextImage()">Get image</button>
    </div>
  </template>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Search from "./Search.vue";
import { Image } from "../Image";
import axios from "axios";

const preloadSize = 5;
export default defineComponent({
  components: { Search },
  data() {
    return {
      ready: false,
      imagePath: process.env.VUE_APP_CDN_IP + "/image/",
      search: "",
      image: new Image(),
      nextImages: [] as Image[],
      prefetches: [] as Node[],
      albumImages: [] as string[],
      videoExtensions: [".mp4", ".mov", ".webm", ".gif"],
    };
  },
  async beforeMount() {
    document.addEventListener("keypress", (e) => {
      if (e.key == "Enter") {
        this.showNextImage();
      }
    });
    await this.showNextImage();
    this.ready = true;
  },
  methods: {
    async getImages() {
      for (let el of this.prefetches) {
        el.parentElement?.removeChild(el);
      }
      this.prefetches = [];
      this.nextImages = (
        await axios.get(
          process.env.VUE_APP_CDN_IP +
            "/db/randomImages?count=" +
            preloadSize +
            "&q=" +
            this.search,
          { withCredentials: true }
        )
      ).data as Image[];
      for (let i of this.nextImages) {
        this.createPrefetch(process.env.VUE_APP_CDN_IP + "/image/" + i.path);
      }
    },
    async showNextImage() {
      let img = this.nextImages.pop();
      if (img == undefined) {
        await this.getImages();
        img = this.nextImages.pop();
      }
      this.image = img!;
      if (this.image.isAlbum) {
        const result = await axios.get(
          process.env.VUE_APP_CDN_IP + "/db/album/" + this.image.id,
          { withCredentials: true }
        );
        this.albumImages = result.data.images;
      } else {
        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
      }
      if (this.nextImages.length <= 1) {
        this.getImages();
      }
    },
    searchChanged(newSearch: string) {
      this.search = newSearch;
      this.getImages();
    },
    createPrefetch(imageUrl: string) {
      const link = document.createElement("link");
      link.setAttribute("rel", "preload");
      link.setAttribute("href", imageUrl);
      link.setAttribute("data-random-prefetch", "true");
      this.prefetches.push(document.head.appendChild(link));
    },
    getExtension(path: string): string {
      return path.substring(path.lastIndexOf("."), path.length);
    },
  },
});
</script>

<style scoped>
img,
video {
  max-height: 90vh;
  max-width: 90vw;
}

.footer {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: gray;
}
</style>
