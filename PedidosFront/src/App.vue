<template id="app">
  <HomeView />
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import HomeView from "./views/HomeView";
export default {
  data() {
    return {};
  },
  components: {
    HomeView,
  },
};
</script>

<style scoped>
#app {
  background: black;
}
</style>
