<script>
/* eslint-disable no-undef */
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useGeolocation } from "./script/useGeolocation";
import { Loader } from "@googlemaps/js-api-loader";
import FavPlacePopout from "./blocks/FavPlacePopout.vue";
import NavBar from "./blocks/NavBar.vue";
import FavoritePlacesGrid from "./blocks/FavoritePlacesGrid.vue";
import SideBar from "./blocks/SideBar.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

import { parse as parseWKT } from "terraformer-wkt-parser";

const GOOGLE_MAPS_API_KEY = "";

export default {
  name: "App",
  components: {
    FavPlacePopout,
    Button,
    Dialog,
    NavBar,
    FavoritePlacesGrid,
    SideBar,
  },
  setup() {
    const { coords } = useGeolocation();
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    }));
    const otherPos = ref(null);
    const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
    const mapDiv = ref(null);
    let map = ref(null);
    let clickListener = null;
    const showModal = ref(false);
    const places = ref([]);
    const address = ref("");
    let geocoder = null;

    let marker = null;
    let geojsonLayer = null;

    onMounted(async () => {
      await loader.load();
      map.value = new google.maps.Map(mapDiv.value, {
        center: currPos.value,
        zoom: 7,
      });
      geocoder = new google.maps.Geocoder();
      clickListener = map.value.addListener(
        "click",
        ({ latLng: { lat, lng } }) => {
          otherPos.value = { lat: lat(), lng: lng() };
          geocodeLatLng(lat(), lng());
        }
      );
      addGeoJsonLayer();
    });

    onUnmounted(async () => {
      if (clickListener) {
        clickListener.remove();
      }
      if (geojsonLayer) {
        geojsonLayer.setMap(null);
      }
    });

    watch(otherPos, () => {
      if (marker) marker.setMap(null);
      if (map.value && otherPos.value != null) {
        marker = new google.maps.Marker({
          position: otherPos.value,
          map: map.value,
        });
      }
    });

    const geocodeLatLng = (lat, lng) => {
      const latlng = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            address.value = results[0].formatted_address;
          } else {
            console.warn("Brak wyników dla podanych współrzędnych.");
          }
        } else {
          console.warn("Geocoder zatrzymał się ze względu na błąd: " + status);
        }
      });
    };

    const openModal = () => {
      if (otherPos.value) {
        showModal.value = true;
      } else {
        alert("Proszę wybrać pozycję na mapie");
      }
    };

    const addPlace = (place) => {
      places.value.push({ id: places.value.length + 1, ...place });
      showModal.value = false;
    };
    //elo
    // Dodanie warstwy GeoJSON z województwami
    const addGeoJsonLayer = async () => {
      try {
        const response = await fetch("./wojewodztwa-max.geojson");
        const geojson = await response.json();

        geojsonLayer = new google.maps.Data({ map: map.value });
        geojsonLayer.addGeoJson(geojson);

        geojsonLayer.setStyle({
          fillColor: "#FF0000",
          strokeWeight: 1,
        });

        geojsonLayer.addListener("click", (event) => {
          const wktString = event.feature.getProperty("wkt");

          // Parsowanie WKT do GeoJSON za pomocą terraformer-wkt-parser
          const polygonGeoJSON = parseWKT(wktString);

          const polygonCoords = polygonGeoJSON.coordinates[0].map((coord) => {
            return { lat: coord[1], lng: coord[0] };
          });

          const polygon = new google.maps.Polygon({
            paths: polygonCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          });
          polygon.setMap(map.value);

          if (marker) {
            marker.setMap(null);
          }
          marker = polygon;
        });
      } catch (error) {
        console.error("Błąd podczas ładowania danych GeoJSON:", error);
      }
    };

    return {
      currPos,
      otherPos,
      mapDiv,
      showModal,
      addPlace,
      places,
      address,
      openModal,
    };
  },
};
</script>

<template>
  <div class="wrapper">
    <NavBar />
    <div class="content">
      <main class="main">
        <div class="d-flex text-center" style="height: 20vh">
          <div class="m-auto">
            <h4>Twoja pozycja</h4>
            Współrzędne geograficzne: {{ currPos.lat.toFixed(5) }},
            {{ currPos.lng.toFixed(5) }}.
          </div>
          <div class="m-auto">
            <h4>Wybrana pozycja</h4>
            <span v-if="otherPos">
              Współrzędne geograficzne: {{ otherPos.lat.toFixed(5) }},
              {{ otherPos.lng.toFixed(5) }}.
            </span>
            <span v-else>Naciśnij na mapę, aby wybrać pozycję.</span>
          </div>
        </div>
        <div class="d-flex">
          <div
            ref="mapDiv"
            style="width: 100%; height: 62vh; border-radius: 14px; margin: 15px"
          />
        </div>
        <div class="d-flex button-section">
          <Button
            class="button"
            label="Dodaj miejsce do ulubionych"
            icon="pi pi-map-marker"
            @click="showModal = true"
          />
          <Button
            class="button"
            label="Wyszukaj na mapie"
            icon="pi pi-search"
          />
          <Button class="button" label="Użyj linku" icon="pi pi-link" />
        </div>

        <Dialog header="Dodaj miejsce" v-model:visible="showModal">
          <FavPlacePopout
            @add-place="addPlace"
            :lat="otherPos?.lat"
            :lng="otherPos?.lng"
            :address="address"
          />
        </Dialog>
        <!-- <HardcodedPreviewPlaces /> -->
        <FavoritePlacesGrid :places="places" />
      </main>
      <SideBar />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background-color: #faf5ff;
}
.place {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.button-section {
  justify-content: space-between;
  margin: 0px 5px;
}
.button {
  margin-left: 10px;
  margin-right: 10px;
  color: #4f4f4f;
  background-color: #fefefe;
  border-color: #4f4f4f;
  min-width: 262px;
}
@media screen and (max-width: 991px) {
  .button-section {
    flex-direction: column;
    gap: 15px;
  }
}
.content {
  display: flex;
  /* justify-content: flex-end; */
  margin-right: 250px; /* Leave space for the sidebar */
  width: 100%;
  height: 100%;
}
.main {
  flex-grow: 2;
}
</style>
