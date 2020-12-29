<template>
  <h1>Welcome to Image Site</h1>
  <ImageView/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImageView from './components/ImageView.vue';

@Options({
  components: {
    ImageView,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
