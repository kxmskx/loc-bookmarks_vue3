<template>
  <aside class="sidebar">
    <HardcodedPreviewPlaces />
  </aside>
</template>
<script>
import HardcodedPreviewPlaces from "./HardcodedPreviewPlaces.vue";

export default {
  components: {
    HardcodedPreviewPlaces,
  },
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  align-items: center;
  padding: 15px;
  background-color: #f4f4f4;
  border-left: 1px solid #ddd;
  min-height: 100vh;
  overflow-y: auto;
}
.parent-element {
  display: flex;
  flex-grow: 1;
}
</style>
