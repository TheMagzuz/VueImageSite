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
import _ from "lodash";

const imageSizes = [126, 132, 234, 420, 512, 660];

export default defineComponent({
  data() {
    return {
      images: [] as Image[],
      currentPage: -1,
      nextPageImages: [] as Image[],
      filteredImages: [] as Image[],
      allImages: [] as Image[],
      imagesPath: process.env.VUE_APP_CDN_IP + "/image/",
      thumbnailsPath: process.env.VUE_APP_CDN_IP + "/thumbnail/",
      requestedSearch: "",
      search: "",
    };
  },
  methods: {
    fetchNextPage() {
      return axios
        .get(
          process.env.VUE_APP_CDN_IP +
            "/db/page/" +
            (this.currentPage + 1) +
            "?search=" +
            encodeURIComponent(this.search),
          { withCredentials: true }
        )
        .then((response) => {
          this.nextPageImages = response.data.map((d: any) => new Image(d));
        });
    },

    extendImages: _.throttle(function (this: any) {
      console.log("extend");
      this.currentPage++;
      this.images = this.images.concat(this.nextPageImages);
      this.fetchNextPage();
    }, 1000),
    onSearchChanged(tags: string) {
      this.images = [];
      this.search = tags;
      this.currentPage = -1;
      this.fetchNextPage().then(() => this.extendImages());
    },

    onScroll() {
      if (this.$route.params.id) {
        return;
      }
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
    this.fetchNextPage().then(() => {
      this.extendImages();
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
