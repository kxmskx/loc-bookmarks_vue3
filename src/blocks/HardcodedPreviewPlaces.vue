<template>
  <h3 class="recomendations__header">Polecane lokalizacje</h3>
  <div class="places-grid--hardcoded">
    <div class="place-card">
      <img
        src="../img/zamczysko.jpg"
        alt="Zdjęcie zamku Królewskiego w Warszawie"
        class="place-image"
      />
      <div class="place-info">
        <h3>Zamek królewski w Warszawie</h3>
        <p>Plac Zamkowy 4, Warszawa</p>
        <!-- <p>Lat: 52.247, Lng: 21.014</p> -->
      </div>
    </div>

    <div class="place-card">
      <img
        src="../img/molo.jpg"
        alt="Zdjęcie molo w sopocie"
        class="place-image"
      />
      <div class="place-info">
        <h3>Molo w Sopocie</h3>
        <p>Plac Zamkowy 4, Warszawa</p>
        <!-- <p>Lat: 52.247, Lng: 21.014</p> -->
      </div>
    </div>

    <div class="place-card">
      <img
        src="../img/mis.jpg"
        alt="Zdjęcie misia na Krupówkach"
        class="place-image"
      />
      <div class="place-info">
        <h3>Miś na Krupówkach</h3>
        <p>Plac Zamkowy 4, Warszawa</p>
        <!-- <p>Lat: 52.247, Lng: 21.014</p> -->
      </div>
    </div>

    <div class="place-card">
      <img
        src="../img/killi.jpg"
        alt="Zdjęcie Kilimandzaro"
        class="place-image"
      />
      <div class="place-info">
        <h3>Góra Killimanjaro</h3>
        <p>Tanzania</p>
        <!-- <p>Lat: 52.247, Lng: 21.014</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FavoritePlacesGrid",
  props: {
    places: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.places-grid--hardcoded {
  display: flex;
  flex-direction: column;
  /* margin-left: 5px; */
  height: 100vh;
  justify-content: center;
}

.place-card {
  max-width: 200px;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  /* justify-content: center; */
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
  margin-top: 5px;
}
</style>
