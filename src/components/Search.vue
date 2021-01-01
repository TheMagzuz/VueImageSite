<template>
  <label for="searchBox">Tags:</label>
  <input type="text" v-model="search" @input="onChange" name="searchBox" />
  <div class="autocomplete">
    <ul class="autocomplete-results">
      <li
        class="autocomplete-result"
        v-for="(result, index) in results"
        :key="index"
        @click="onResultClick(result)"
      >
        {{ result.tag }} ({{ result.count }})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
//eslint-disable-next-line no-unused-vars
import { Image } from "../Image";

export default defineComponent({
  name: "search",
  data() {
    return {
      search: "",
      results: [] as SearchResult[],
      searchItems: [] as SearchResult[],
    };
  },

  beforeMount() {
    axios.get(process.env.VUE_APP_DB_IP + "/images").then((result) => {
      let tags: string[] = (result.data as Image[])
        .map((i) => i.tags.join(" "))
        .flatMap((t) => t.toLowerCase().split(" "));
      let tagCounts: { [key: string]: number } = {};
      for (let tag of tags) {
        if (tag in tagCounts) {
          tagCounts[tag]++;
        } else {
          tagCounts[tag] = 1;
        }
      }
      this.searchItems = Object.keys(tagCounts).map(
        (key) => new SearchResult(key, tagCounts[key])
      );
      this.filterResults();
    });
  },
  methods: {
    onChange() {
      this.filterResults();
      this.$emit("searchChanged", this.search);
    },
    filterResults() {
      let lastTag = this.search;
      if (lastTag.includes(" ")) {
        lastTag = lastTag.substring(lastTag.lastIndexOf(" "));
      }
      if (lastTag.startsWith("!")) {
        lastTag = lastTag.substring(1, lastTag.length - 1);
      }
      this.results = this.searchItems
        .filter((s) => s.tag.includes(lastTag.toLowerCase().trim()))
        .sort((a, b) => a.count - b.count)
        .reverse();
    },

    onResultClick(result: SearchResult) {
      this.search = this.search.substring(0, this.search.lastIndexOf(" ") + 1);
      this.search += result.tag;
      this.$emit("searchChanged", this.search);
    },
  },
});

class SearchResult {
  tag: string;
  count: number;

  constructor(tag: string, count: number) {
    this.tag = tag;
    this.count = count;
  }
}
</script>

<style scoped>
.autocomplete {
  position: relative;
  width: 130px;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>