<script>
import HardcodedPreviewPlaces from "./HardcodedPreviewPlaces.vue";
export default {
  name: "SideBar",
  emits: ["place-choice"],
  components: {
    HardcodedPreviewPlaces,
  },
  methods: {
    choosePlace(place) {
      this.$emit("place-choice", place);
    },
  },
};
</script>

<template>
  <aside class="sidebar">
    <HardcodedPreviewPlaces @place-choice="choosePlace" />
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 230px;
  align-items: center;
  padding: 15px;
  background-color: var(--side-background-color);
  border-left: 1px solid var(--border-color);
  min-height: 100vh;
  overflow-y: auto;
}
.parent-element {
  display: flex;
  flex-grow: 1;
}
</style>
