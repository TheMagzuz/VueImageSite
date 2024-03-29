<template>
  <div v-show="!$route.params.id">
    <search
      @searchChanged="onSearchChanged"
      :requestedSearch="requestedSearch"
    ></search>
    <label for="searchSort">Sort by: </label>
    <select
      name="searchSort"
      v-model="searchSort"
      @change="onSearchChanged(search)"
    >
      <option value="default">Default</option>
      <option value="upvotes">Upvotes</option>
    </select>
    <label for="searchReverse">Reverse: </label>
    <input
      type="checkbox"
      name="searchReverse"
      v-model="searchReverse"
      @change="onSearchChanged(search)"
    />
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
  <router-view
    @requestSearch="requestSearch"
    @imageDelete="onSearchChanged(search)"
  ></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
      searchSort: "default",
      searchReverse: false,
      hasNextImages: true,
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
            encodeURIComponent(this.search) +
            "&sortBy=" +
            this.searchSort +
            "&reverseSort=" +
            this.searchReverse,
          { withCredentials: true }
        )
        .then((response) => {
          this.nextPageImages = response.data.map((d: any) => new Image(d));
          this.hasNextImages = true;
        })
        .catch(() => {
          this.hasNextImages = false;
        });
    },

    extendImages: _.throttle(function (this: any) {
      if (!this.hasNextImages) {
        return;
      }
      this.currentPage++;
      this.images = this.images.concat(this.nextPageImages);
      this.fetchNextPage();
    }, 1000),
    onSearchChanged(tags: string) {
      this.hasNextImages = true;
      this.images = [];
      this.search = tags;
      this.currentPage = -1;
      this.fetchNextPage().then(() => this.extendImages());
    },

    onScroll() {
      if (this.$route.name != "Images") {
        return;
      }
      let atBottom =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - 30;

      if (atBottom && this.hasNextImages) {
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
