<script>
/* eslint-disable no-undef */
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useGeolocation } from "./script/useGeolocation";
import { Loader } from "@googlemaps/js-api-loader";
import FavPlacePopout from "./blocks/FavPlacePopout.vue";
import NavBar from "./blocks/NavBar.vue";
import FavoritePlacesGrid from "./blocks/FavoritePlacesGrid.vue";
import SideBar from "./blocks/SideBar.vue";
import FooterDiv from "./blocks/FooterDiv.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

const GOOGLE_MAPS_API_KEY = "AIzaSyBWFrtGpCOH1FuMS4TtzhOdLAqQWiOFR5Q";

export default {
  name: "App",
  components: {
    FavPlacePopout,
    Button,
    Dialog,
    NavBar,
    FavoritePlacesGrid,
    SideBar,
    FooterDiv,
    InputText,
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
    let geoClickListener = null;
    let moveListener = null;
    const showModal = ref(false);
    const showLinkModal = ref(false);
    const places = ref([]);
    const address = ref("");
    const link = ref("");
    let geocoder = null;
    let marker = null;
    let geojsonObjects = null;

    const styleForSelection = {
      visible: true,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.15,
    };
    const styleForHighlight = {
      visible: true,
      strokeColor: "#FF00FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF00FF",
      fillOpacity: 0.15,
    };
    const styleForHiding = {
      visible: false,
    };
    const checkWojewodztwa = (latLng) => {
      map.value.data.setStyle(function (feature) {
        feature.setProperty("selected", false);
        const geometry = feature.getGeometry();
        const geometryType = geometry.getType();
        if (geometryType === "Polygon") {
          if (
            !google.maps.geometry.poly.containsLocation(
              latLng,
              new google.maps.Polygon({ paths: geometry.getAt(0).getArray() })
            )
          )
            return styleForHiding;
          feature.setProperty("selected", true);
          return styleForSelection;
        } else if (geometryType === "MultiPolygon") {
          let contained = false;
          geometry.getArray().forEach(function (polygon) {
            if (
              google.maps.geometry.poly.containsLocation(
                latLng,
                new google.maps.Polygon({
                  paths: polygon.getAt(0).getArray(),
                })
              )
            )
              contained = true;
          });
          if (!contained) return styleForHiding;
          feature.setProperty("selected", true);
          return styleForSelection;
        }
        return {};
      });
    };

    onMounted(async () => {
      const jsonFile = await fetch("wojewodztwa.json");
      geojsonObjects = await jsonFile.json();
      await loader.load();
      JSON.parse(localStorage.getItem("places") ?? "[]").forEach((place) => {
        places.value.push(place);
      });

      const defaultCenter = { lat: 52.0693, lng: 19.4803 };

      map.value = new google.maps.Map(mapDiv.value, {
        center: defaultCenter,
        zoom: 7,
      });
      map.value.data.addGeoJson(geojsonObjects);
      map.value.data.setStyle(function (feature) {
        var geometryType = feature.getGeometry().getType();
        if (geometryType === "Polygon" || geometryType === "MultiPolygon") {
          return styleForHiding;
        }
        return {};
      });

      geocoder = new google.maps.Geocoder();
      clickListener = map.value.addListener("click", ({ latLng }) => {
        otherPos.value = { lat: latLng.lat(), lng: latLng.lng() };
        geocodeLatLng(otherPos.value);
        map.value.data.setStyle(function (feature) {
          var geometryType = feature.getGeometry().getType();
          if (geometryType === "Polygon" || geometryType === "MultiPolygon") {
            return styleForHiding;
          }
          return {};
        });
      });

      geoClickListener = map.value.data.addListener("click", ({ latLng }) => {
        otherPos.value = { lat: latLng.lat(), lng: latLng.lng() };
        geocodeLatLng(otherPos.value);
        checkWojewodztwa(latLng);
      });

      moveListener = map.value.addListener("mousemove", ({ latLng }) => {
        map.value.data.setStyle(function (feature) {
          if (feature.getProperty("selected") === true)
            return styleForSelection;

          const geometry = feature.getGeometry();
          const geometryType = geometry.getType();
          if (geometryType === "Polygon") {
            if (
              google.maps.geometry.poly.containsLocation(
                latLng,
                new google.maps.Polygon({ paths: geometry.getAt(0).getArray() })
              )
            )
              return styleForHighlight;
            return styleForHiding;
          } else if (geometryType === "MultiPolygon") {
            let contained = false;
            geometry.getArray().forEach(function (polygon) {
              if (
                google.maps.geometry.poly.containsLocation(
                  latLng,
                  new google.maps.Polygon({
                    paths: polygon.getAt(0).getArray(),
                  })
                )
              )
                contained = true;
            });
            if (contained) return styleForHighlight;
            return styleForHiding;
          }
          return {};
        });
      });
    });

    onUnmounted(async () => {
      if (clickListener) {
        clickListener.remove();
      }
      if (geoClickListener) {
        geoClickListener.remove();
      }
      if (moveListener) {
        moveListener.remove();
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

    const geocodeLatLng = (latlng) => {
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
      if (!otherPos.value) {
        alert("Proszę wybrać pozycję na mapie");
      } else {
        showModal.value = true;
      }
    };

    const openLinkModal = () => {
      showLinkModal.value = true;
    };

    const addPlace = (place) => {
      places.value.push({ id: places.value.length + 1, ...place });
      showModal.value = false;
      localStorage.setItem("places", JSON.stringify(places.value));
    };

    const choosePlace = (place) => {
      otherPos.value = { lat: place.lat, lng: place.lng };
      geocodeLatLng(place.lat, place.lng);
      checkWojewodztwa(new google.maps.LatLng(place.lat, place.lng));
    };

    const handleLinkSubmit = () => {
      const coords = parseGoogleMapsLink(link.value);
      if (coords) {
        otherPos.value = coords;
        map.value.setCenter(coords);
        map.value.setZoom(15);
        geocodeLatLng(coords.lat, coords.lng);
        checkWojewodztwa(new google.maps.LatLng(place.lat, place.lng));
        showLinkModal.value = false;
      } else {
        alert("Niepoprawny link do Google Maps");
      }
    };

    const parseGoogleMapsLink = (url) => {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = url.match(regex);
      if (match) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
      }
      return null;
    };

    const deletePlace = (placeId) => {
      places.value = places.value.filter((place) => place.id !== placeId);
    };

    return {
      currPos,
      otherPos,
      mapDiv,
      showModal,
      showLinkModal,
      addPlace,
      deletePlace,
      choosePlace,
      places,
      address,
      link,
      openModal,
      openLinkModal,
      handleLinkSubmit,
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
            Współrzędne geograficzne: <br />
            {{ currPos.lat.toFixed(5) }}, {{ currPos.lng.toFixed(5) }}.
          </div>
          <div class="m-auto">
            <h4>Wybrana pozycja</h4>
            <span v-if="otherPos">
              Współrzędne geograficzne: <br />
              {{ otherPos.lat.toFixed(5) }}, {{ otherPos.lng.toFixed(5) }}.
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
            class="button add__button"
            label="Dodaj miejsce do ulubionych"
            icon="pi pi-map-marker"
            @click="showModal = true"
          />
          <Button
            class="button search__button"
            label="Wyszukaj na mapie"
            icon="pi pi-search"
          />
          <Button
            class="button use__button"
            label="Użyj linku"
            icon="pi pi-link"
            @click="openLinkModal"
          />
        </div>

        <Dialog header="Dodaj miejsce" v-model:visible="showModal">
          <FavPlacePopout
            @add-place="addPlace"
            :lat="otherPos?.lat"
            :lng="otherPos?.lng"
            :address="address"
          />
        </Dialog>
        <Dialog
          header="Użyj linku z Google Maps"
          v-model:visible="showLinkModal"
        >
          <div class="link__modal">
            <InputText
              v-model="link"
              placeholder="Wprowadź link z Google Maps"
            />
            <Button
              class="link__modal--button"
              label="Zatwierdź"
              @click="handleLinkSubmit"
            />
          </div>
        </Dialog>
        <!-- <HardcodedPreviewPlaces /> -->
        <FavoritePlacesGrid
          :places="places"
          @place-choice="choosePlace"
          @delete-place="deletePlace"
        />
      </main>
      <SideBar />
    </div>
    <FooterDiv />
  </div>
</template>

<style scoped>
.wrapper {
  background-color: #fbf9fe;
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
.button.search__button:hover {
  background-color: #fefefe;
  border-color: rgb(106, 208, 157);
  color: rgb(106, 208, 157);
}
.button.use__button:hover {
  color: rgb(106, 208, 157);
  background-color: #fefefe;
  border-color: rgb(106, 208, 157);
}
@media screen and (max-width: 991px) {
  .button-section {
    flex-direction: column;
    gap: 15px;
  }
}
.content {
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 57px;
}
.link__modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 400px;
}
.link__modal--button {
  margin-top: 14px;
  width: 33%;
  align-self: flex-end;
}
.main {
  flex-grow: 2;
}
</style>
