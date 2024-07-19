<script>
import zamczyskoImg from "@/img/zamczysko.jpg";
import moloImg from "@/img/molo.jpg";
import misImg from "@/img/mis.jpg";
import killiImg from "@/img/killi.jpg";
export default {
  name: "HardcodedFavoritePlacesGrid",
  emits: ["place-choice"],
  setup() {
    const hardcodedPlaces = [
      {
        name: "Zamek królewski w Warszawie",
        address: "Plac Zamkowy 4, Warszawa",
        lat: 52.247,
        lng: 21.014,
        picture: zamczyskoImg,
        alt: "Zamek królewski",
      },
      {
        name: "Molo w Sopocie, Gate 1",
        address: "Plac Zdrojowy 2",
        lat: 54.446,
        lng: 18.569,
        picture: moloImg,
      },
      {
        name: "Miś na Krupówkach w Zakopanem",
        address: "Krupówki, Zakopanem",
        lat: 49.293,
        lng: 19.951,
        picture: misImg,
      },
      {
        name: "Góra Killimanjaro w Tanzanii",
        address: "Szczyt Uhuru na wulkanie Kibo",
        lat: -3.067,
        lng: 37.355,
        picture: killiImg,
      },
    ];
    return { hardcodedPlaces };
  },
};
</script>

<template>
  <h3 class="recomendations__header">Polecane lokalizacje</h3>
  <div class="places-grid--hardcoded">
    <div
      v-for="place in hardcodedPlaces"
      :key="place.name"
      class="place-card"
      @click="$emit('place-choice', { lat: place.lat, lng: place.lng })"
    >
      <img :src="place.picture" alt="place.alt" class="place-image" />
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
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
}

.place-card {
  min-height: 220px;
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
