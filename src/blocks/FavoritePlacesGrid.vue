<script>
import MiniMap from "./MiniMap.vue";
export default {
  name: "FavoritePlacesGrid",
  props: {
    places: {
      type: Array,
      required: true,
    },
  },
  emits: ["place-choice", "place-remove"],
  components: {
    MiniMap,
  },
};
</script>

<template>
  <div class="fav__wrapper">
    <h4 v-if="places.length > 0" class="header">Twoje miejsca</h4>
    <h4 v-else class="header">Brak polubionych miejsc.</h4>
    <div
      class="places-grid"
      v-animateonscroll="{
        enterClass: 'animate-zoomin',
        leaveClass: 'animate-fadeout',
      }"
    >
      <div
        v-for="place in places"
        :key="place.id"
        class="place-card"
        @click="$emit('place-choice', { lat: place.lat, lng: place.lng })"
      >
        <MiniMap :lat="place.lat" :lng="place.lng" />
        <div class="place-info">
          <h3>{{ place.name }}</h3>
          <p>{{ place.address }}</p>
          <p>Lat: {{ place.lat }},</p>
          <p>Lng: {{ place.lng }}</p>
        </div>
        <button
          class="delete-button"
          @click.stop.prevent="$emit('place-remove', place.id)"
        >
          <div class="pi pi-trash" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fav__wrapper {
  width: auto;
  height: auto;
  background-color: #fff;
  border: 1px solid #ddd;
  margin: 14px;
  margin-bottom: 94px;
  padding: 10px 0px;
  border-radius: 14px;
}
.header {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 15px;
}
.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.place-card {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.place-card:hover {
  transform: scale(1.05);
}

.place-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.place-info {
  padding: 10px;
}

.place-info h3 {
  font-size: 20px;
}

.place-info p {
  font-size: 10px;
}

.place-info h3 {
  margin: 0 0 10px;
}

.place-info p {
  margin: 5px 0;
}

.recomendations__header {
  margin-left: 10px;
  margin-top: 14px;
}

.delete-button {
  position: absolute;
  top: 150px;
  right: 5px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.3s;
}
.delete-button:hover {
  color: #000;
}
</style>
