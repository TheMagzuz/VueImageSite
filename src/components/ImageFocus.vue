<template>
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
    Upvotes: {{ image.upvotes }}
    <button @click="upvoteImage()">Upvote</button>
    <button @click="downvoteImage()">Downvote</button>
    Tags: <button @click="editing = true">Edit</button> <br />
    <template v-if="!editing">
      <div class="taglist">
        <a
          v-for="(tag, index) in image.tags"
          :key="index"
          @click="onTagClick(tag)"
          href="javascript:void(0)"
          class="tag"
          >{{ tag }}</a
        >
      </div>
    </template>
    <template v-else>
      <textarea v-model="tagsField" /><br />
      <button @click="saveTags()">Save</button>
      <button @click="cancelTags()">Cancel</button><br />
      <button @click="deleteImage()">Delete Image</button>
    </template>
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
  emits = ["requestSearch"];
  editing = false;
  originalTags!: string[];
  tagsField = "";
  videoExtensions = [".mp4", ".mov", ".webm", ".gif"];

  async beforeMount() {
    const imageResult = await axios.get(
      process.env.VUE_APP_CDN_IP + "/db/image/" + this.$route.params.id,
      { withCredentials: true }
    );
    this.image = new Image(imageResult.data);
    this.originalTags = this.image.tags;
    this.tagsField = this.image.tags.join(" ");
    if (this.image.isAlbum) {
      const result = await axios.get(
        process.env.VUE_APP_CDN_IP + "/db/album/" + this.$route.params.id,
        { withCredentials: true }
      );
      this.albumImages = result.data.images;
      this.ready = true;
    } else {
      this.ready = true;
    }
  }

  onTagClick(tag: string) {
    this.$emit("requestSearch", tag);
    history.back();
  }

  upvoteImage() {
    this.image.upvote();
  }

  downvoteImage() {
    this.image.downvote();
  }

  saveTags() {
    this.image.tags = this.tagsField.split(" ");
    this.editing = false;
    this.originalTags = this.image.tags;
    this.image.put();
  }
  cancelTags() {
    this.image.tags = this.originalTags;
    this.editing = false;
  }

  async deleteImage() {
    if (confirm("Are you sure you want to delete this image?")) {
      await axios.delete(
        process.env.VUE_APP_CDN_IP + "/db/image/" + this.image.id,
        {
          withCredentials: true,
        }
      );
      this.$router.push("/");
      this.$emit("imageDelete");
    }
  }

  getExtension(path: string): string {
    return path.substring(path.lastIndexOf("."), path.length);
  }
}
</script>

<style scoped>
img,
video {
  max-height: 90vh;
  max-width: 100vw;
}
.tag {
  padding: 5px;
  margin: auto;
}
.taglist {
  width: 90vw;
  display: flex;
  justify-items: center;
  flex-wrap: wrap;
}

a:link {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
a:visited {
  text-decoration: underline;
}

textarea {
  width: 50em;
}
</style>
