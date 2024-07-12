<template>
  <form @submit.prevent="submitForm" class="p-fluid">
    <div class="p-field">
      <label for="name" class="input__header">Nazwa miejsca</label>
      <InputText class="input__input" id="name" v-model="name" />
    </div>
    <div class="p-field">
      <label for="address" class="input__header">Adres</label>
      <InputText
        class="input__input"
        id="address"
        v-model="formattedAddress"
        readonly
      />
    </div>
    <div class="p-field">
      <Button type="submit" label="Zapisz" icon="pi pi-check" />
    </div>
  </form>
</template>

<script>
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import "primeicons/primeicons.css";

export default {
  components: {
    InputText,
    Button,
  },
  props: {
    lat: Number,
    lng: Number,
    address: String,
  },
  setup(props, { emit }) {
    const name = ref("");
    const formattedAddress = ref(props.address);

    watch(
      () => props.address,
      (newAddress) => {
        formattedAddress.value = newAddress;
      }
    );

    const submitForm = () => {
      emit("add-place", {
        name: name.value,
        lat: props.lat,
        lng: props.lng,
        address: formattedAddress.value,
      });
      name.value = "";
    };

    return { name, formattedAddress, submitForm };
  },
};
</script>

<style scoped>
.input__header {
  font-size: 15px;
  width: 100%;
}
.input__input {
  width: 100%;
}
.p-field {
  margin-bottom: 20px;
}
</style>
