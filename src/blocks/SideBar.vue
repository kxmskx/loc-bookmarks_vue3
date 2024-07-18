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
  width: 230px;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  border-left: 1px solid #e9ecef;
  min-height: 100vh;
  overflow-y: auto;

  /* scrollbar na Chrome */
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  /* scrollbar na firefoxie */
  scrollbar-width: thin;
  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
  /* scrollbar na Safari */
  /* ::-webkit-scrollbar-track {
    background-color: #ffffff00;
  } */
}
.parent-element {
  display: flex;
  flex-grow: 1;
}
</style>
