<template>
  <p>Image View</p>  
  <div id="image-view-container" v-show="!$route.params.id">
    <router-link v-bind:to="'/images/' + item.message" v-for="(item, index) in items" :key="index">
      <img src="https://via.placeholder.com/1250x1750"/>
    </router-link>
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';



export default class ImageView extends Vue {
  data() {
    return {
      items: [{ message: 'Foo' }, { message: 'Bar' }, {message: 'asd'}]
    }
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
