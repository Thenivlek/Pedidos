<template id="app">
  <nav>
    <router-view> </router-view>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      id: sessionStorage.id,
    };
  },
};
</script>

<style>
@import url("./app.css");
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
