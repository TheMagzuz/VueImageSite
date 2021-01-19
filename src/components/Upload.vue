<template>
  <form role="form" onsubmit="return false;">
    <label for="file">File: </label>
    <input id="file" type="file" ref="file" />
    <br />
    <label for="tags">Tags: </label>
    <input id="tags" type="text" ref="tags" v-model="tags" />
    <br />
    <button id="upload" type="button" @click="uploadFile">Upload</button>
  </form>
  <div class="progressbar-outer">
    <div class="progressbar-inner" :style="{ width: progress * 100 + '%' }" />
    <span class="progressbar-text">{{ Math.round(progress * 100) }}%</span>
  </div>
  <div v-show="showDone">Done!</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      progress: 0,
      interval: 0,
      tags: "",
      uploading: false,
      showDone: false,
    };
  },

  methods: {
    uploadFile() {
      if (this.uploading) {
        alert("Upload already in progress!");
        return;
      }
      let fileElement = this.$refs.file as HTMLInputElement;
      if (fileElement == null) {
        console.error("Something went terribly wrong during file upload!");
        return;
      }
      let file = fileElement.files?.[0];
      if (file == null) {
        return;
      }
      this.uploading = true;

      let formData = new FormData();
      formData.append("photo", file);
      formData.append("tags", this.tags);

      axios
        .post(process.env.VUE_APP_CDN_IP, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: this.onUploadProgress,
          withCredentials: true,
        })
        .then(() => {
          this.uploading = false;
          this.progress = 0;
          this.showDone = true;
          setTimeout(() => (this.showDone = false), 2000);
          fileElement.value = "";
        });
    },
    onUploadProgress(e: ProgressEvent) {
      this.progress = e.loaded / e.total;
      if (this.progress >= 1) {
        this.progress = 1;
        clearInterval(this.interval);
      }
    },
  },
});
</script>

<style scoped>
.progressbar-outer {
  display: inline-flex;
  width: 50%;
  align-items: center;
  height: 20px;
  background-color: lightgrey;
}
.progressbar-inner {
  height: 100%;
  background-color: lime;
  transition: width 0.3s;
}
.progressbar-text {
  position: absolute;
  margin-left: 2px;
}
</style>
