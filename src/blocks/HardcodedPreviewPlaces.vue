<script>
import zamczyskoImg from '@/img/zamczysko.jpg';
import moloImg from '@/img/molo.jpg';
import misImg from '@/img/mis.jpg';
import killiImg from '@/img/killi.jpg';
export default {
  name: "HardcodedFavoritePlacesGrid",
  emits: ['place-choice'],
  setup() {
    const hardcodedPlaces = [
      {
        name: "Zamek królewski w Warszawie",
        address: "Plac Zamkowy 4, Warszawa",
        lat: 52.247,
        lng: 21.014,
        picture: zamczyskoImg
      },
      {
        name: "Molo w Sopocie",
        address: "Plac Zamkowy 4, Warszawa",
        lat: 52.247,
        lng: 21.014,
        picture: moloImg
      },
      {
        name: "Miś na Krupówkach w Zakopanem",
        address: "Plac Zamkowy 4, Warszawa",
        lat: 52.247,
        lng: 21.014,
        picture: misImg
      },
      {
        name: "Góra Killimanjaro",
        address: "Plac Zamkowy 4, Warszawa",
        lat: 52.247,
        lng: 21.014,
        picture: killiImg
      }
    ];
    return { hardcodedPlaces };
  }
};
</script>

<template>
  <h3 class="recomendations__header">Polecane lokalizacje</h3>
  <div class="places-grid--hardcoded">
    <div v-for="place in hardcodedPlaces" :key="place.name" class="place-card" @click="$emit('place-choice', {lat: place.lat, lng: place.lng})">
      <img
        :src="place.picture"
        alt="Zdjęcie"
        class="place-image"
      />
      <div class="place-info">
        <h3>{{ place.name }}</h3>
        <p>{{ place.address }}</p>
        <p>Lat: {{ place.lat }}, Lng: {{ place.lng }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.places-grid--hardcoded {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
}

.place-card {
  max-width: 200px;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  margin-bottom: 15px;
}

.place-card:hover {
  transform: scale(1.05);
}

.place-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.place-info {
  padding: 10px;
}

.place-info h3 {
  margin: 0 0 10px;
  font-size: 20px;
}

.place-info p {
  margin: 5px 0;
  font-size: 10px;
}

.recomendations__header {
  font-size: 22px;
  margin-left: 0px;
  margin-bottom: 25px;
  margin-top: 14px;
}
</style>
