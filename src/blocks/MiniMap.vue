<script>
export default {
  name: "MiniMap",
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    /* eslint-disable no-undef */
    const map = new google.maps.Map(this.$refs.miniMap, {
      center: { lat: this.lat, lng: this.lng },
      zoom: 8,
      disableDefaultUI: true,
    });

    new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map,
    });
    /* eslint-enable no-undef */
  },
};
</script>

<template>
  <div ref="miniMap" class="mini-map"></div>
</template>

<style scoped>
.mini-map {
  width: 100%;
  height: 150px;
}
</style>
