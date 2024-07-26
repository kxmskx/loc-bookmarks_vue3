<script>
/* eslint-disable no-undef */
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useGeolocation } from "./script/useGeolocation";
import { Loader } from "@googlemaps/js-api-loader";
import FavoritePlaceModal from "./blocks/FavoritePlaceModal.vue";
import NavBar from "./blocks/NavBar.vue";
import FavoritePlacesGrid from "./blocks/FavoritePlacesGrid.vue";
import SideBar from "./blocks/SideBar.vue";
import FooterContainer from "./blocks/FooterContainer.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

const GOOGLE_MAPS_API_KEY = "AIzaSyBWFrtGpCOH1FuMS4TtzhOdLAqQWiOFR5Q";
const styleForSelection = {
  visible: true,
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.03,
};
const styleForHighlight = {
  visible: true,
  strokeColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#0000FF",
  fillOpacity: 0.03,
};
const styleForHiding = {
  visible: false,
};

export default {
  name: "App",
  components: {
    FavoritePlaceModal,
    Button,
    Dialog,
    NavBar,
    FavoritePlacesGrid,
    SideBar,
    FooterContainer,
    InputText,
  },
  setup() {
    const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
    const { coords } = useGeolocation();

    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    }));
    const otherPos = ref(null);

    const mapContainer = ref(null);
    const map = ref(null);

    const address = ref("");
    const showModal = ref(false);

    const link = ref("");
    const showLinkModal = ref(false);

    const places = ref([]);

    let geocoder = null;
    let marker = null;
    let clickListener = null;
    let geoClickListener = null;
    let moveListener = null;

    const clearWojewodztwa = () =>
      map.value.data.setStyle((feature) => {
        feature.setProperty("selected", false);
        return ["Polygon", "MultiPolygon"].includes(
          feature.getGeometry().getType()
        )
          ? styleForHiding
          : {};
      });
    const checkWojewodztwa = (latLng) =>
      map.value.data.setStyle((feature) => {
        feature.setProperty("selected", false);
        switch (feature.getGeometry().getType()) {
          case "Polygon": {
            if (
              !google.maps.geometry.poly.containsLocation(
                latLng,
                new google.maps.Polygon({
                  paths: feature.getGeometry().getAt(0).getArray(),
                })
              )
            )
              return styleForHiding;

            feature.setProperty("selected", true);
            return styleForSelection;
          }
          case "MultiPolygon": {
            let contained = false;
            feature
              .getGeometry()
              .getArray()
              .forEach((polygon) =>
                google.maps.geometry.poly.containsLocation(
                  latLng,
                  new google.maps.Polygon({
                    paths: polygon.getAt(0).getArray(),
                  })
                )
                  ? (contained = true)
                  : null
              );
            if (!contained) return styleForHiding;
            feature.setProperty("selected", true);
            return styleForSelection;
          }
          default:
            return {};
        }
      });

    onMounted(async () => {
      await loader.load();
      map.value = new google.maps.Map(mapContainer.value, {
        center: { lat: 52.0693, lng: 19.4803 },
        zoom: 7,
      });
      map.value.data.loadGeoJson("wojewodztwa.json", null, () => {
        clearWojewodztwa();
      });
      geocoder = new google.maps.Geocoder();
      JSON.parse(localStorage.getItem("places") ?? "[]").forEach((place) => {
        places.value.push(place);
      });

      clickListener = map.value.addListener("click", ({ latLng }) => {
        otherPos.value = { lat: latLng.lat(), lng: latLng.lng() };
        clearWojewodztwa();
      });

      geoClickListener = map.value.data.addListener("click", ({ latLng }) => {
        otherPos.value = { lat: latLng.lat(), lng: latLng.lng() };
        checkWojewodztwa(latLng);
      });

      moveListener = map.value.addListener("mousemove", ({ latLng }) =>
        map.value.data.setStyle((feature) => {
          if (feature.getProperty("selected") === true)
            return styleForSelection;

          switch (feature.getGeometry().getType()) {
            case "Polygon": {
              return google.maps.geometry.poly.containsLocation(
                latLng,
                new google.maps.Polygon({
                  paths: feature.getGeometry().getAt(0).getArray(),
                })
              )
                ? styleForHighlight
                : styleForHiding;
            }
            case "MultiPolygon": {
              let contained = false;
              feature
                .getGeometry()
                .getArray()
                .forEach((polygon) =>
                  google.maps.geometry.poly.containsLocation(
                    latLng,
                    new google.maps.Polygon({
                      paths: polygon.getAt(0).getArray(),
                    })
                  )
                    ? (contained = true)
                    : null
                );
              return contained ? styleForHighlight : styleForHiding;
            }
            default:
              return {};
          }
        })
      );
    });

    onUnmounted(async () => {
      if (clickListener) clickListener.remove();
      if (geoClickListener) geoClickListener.remove();
      if (moveListener) moveListener.remove();
    });

    watch(otherPos, () => {
      if (marker) marker.setMap(null);
      if (map.value && otherPos.value != null) {
        marker = new google.maps.Marker({
          position: otherPos.value,
          map: map.value,
        });
        geocoder.geocode({ location: otherPos.value }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              address.value = results[0].formatted_address;
            } else {
              console.warn("Brak wyników dla podanych współrzędnych.");
            }
          } else {
            console.warn(
              "Geocoder zatrzymał się ze względu na błąd: " + status
            );
          }
        });
      } else {
        marker = null;
      }
    });

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

    const handleLinkSubmit = () => {
      const match = link.value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        otherPos.value = {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
        };
        checkWojewodztwa(
          new google.maps.LatLng(otherPos.value.lat, otherPos.value.lng)
        );
        map.value.setCenter(otherPos.value);
        map.value.setZoom(15);
        showLinkModal.value = false;
      } else {
        alert("Niepoprawny link do Google Maps");
      }
    };

    const addPlace = (place) => {
      places.value.push({ id: places.value.length + 1, ...place });
      showModal.value = false;
      localStorage.setItem("places", JSON.stringify(places.value));
      moveMapToPlace({ lat: place.lat, lng: place.lng });
    };

    const moveMapToPlace = ({ lat, lng }) => {
      if (map.value) {
        map.value.setCenter(new google.maps.LatLng(lat, lng));
        map.value.setZoom(14);
      }
    };

    const choosePlace = (latlng) => {
      otherPos.value = latlng;
      checkWojewodztwa(new google.maps.LatLng(latlng.lat, latlng.lng));
      moveMapToPlace(latlng);
    };

    const removePlace = (placeId) => {
      places.value = places.value.filter((place) => place.id !== placeId);
      localStorage.setItem("places", JSON.stringify(places.value));
    };

    return {
      currPos,
      otherPos,
      mapContainer,
      address,
      openModal,
      showModal,
      link,
      openLinkModal,
      showLinkModal,
      handleLinkSubmit,
      places,
      addPlace,
      choosePlace,
      removePlace,
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
          <div class="m-auto header__text__field">
            <h4>Twoja pozycja</h4>
            Współrzędne geograficzne: <br />
            {{ currPos.lat.toFixed(5) }}, {{ currPos.lng.toFixed(5) }}.
          </div>
          <div class="m-auto header__text__field">
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
            ref="mapContainer"
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
          <FavoritePlaceModal
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
          @place-remove="removePlace"
        />
      </main>
      <SideBar @place-choice="choosePlace" />
    </div>
    <FooterContainer />
  </div>
</template>

<style scoped>
.wrapper {
  background-color: var(--background-color);
}

.header__text__field {
  color: var(--text-color);
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
  color: var(--text-color);
  background-color: var(--brand-color);
  border-color: var(--text-color);
  min-width: 262px;
}
.button.search__button:hover {
  background-color: var(--brand-color);
  border-color: rgb(106, 208, 157);
  color: rgb(106, 208, 157);
}
.button.use__button:hover {
  color: rgb(106, 208, 157);
  background-color: var(--brand-color);
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
