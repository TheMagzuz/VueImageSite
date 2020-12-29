<template>
  <p>Image View</p>  
  <div id="image-view-container">
    
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class ImageView extends Vue {}
</script>

<style scoped>
  #image-view-container {
    display: flex;
    flex-wrap: wrap;
  }
</style>
