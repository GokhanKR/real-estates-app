<template>
  <div>
    <v-dialog max-width="700" v-model="modal" :eager="true">
      <v-card>
        <v-card-title class="primary">
          <div class="text-subtitle-2 white--text">Location Details</div>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="modal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!-- Google Map -->
          <Gmap-Map
            :key="mapKey"
            :ref="`gMap${mapKey}`"
            style="width: 100%; height: 400px"
            :zoom="7"
            :options="{
              rotateControl: true,
              streetViewControl: true,
            }"
            :center="position"
          >
          </Gmap-Map>
          <!-- ./Google Map -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* global google */
import axios from "axios";
import { gmapApi } from "vue2-google-maps";

export default {
  name: "Location",
  props: {
    postCode: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    mapKey: 1,
    modal: false,
    position: { lat: 51.729157, lng: 0.478027 },
  }),
  computed: {
    /**
     * @returns {Object}
     */
    google() {
      return gmapApi();
    },
    /**
     * @returns {Object}
     */
    gMap() {
      return this.$refs[`gMap${this.mapKey}`];
    },
  },
  methods: {
    getAddress(postCode) {
      return axios
        .get("https://api.postcodes.io/postcodes/" + postCode)
        .catch((err) => {
          console.error(err);
        });
    },
    getLocation(postCode) {
      // Get latLng from postcodes.io
      return this.getAddress(postCode)
        .then((response) => {
          let postLocation = response.data.result,
            options = {
              zoom: 15,
              center: new google.maps.LatLng(
                postLocation.latitude,
                postLocation.longitude
              ),
            };

          this.position = new google.maps.LatLng(
            postLocation.latitude,
            postLocation.longitude
          );

          this.$nextTick(() => {
            this.gMap.$mapPromise.then((map) => {
              map.setOptions(options);
              new google.maps.Marker({
                position: map.getCenter(),
                map: map,
              });
              this.modal = true;
              this.$emit("update");
            });
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  watch: {
    postCode(postCode) {
      if (postCode) {
        this.mapKey = this.mapKey + 1;

        this.getLocation(postCode);
      }
    },
  },
};
</script>

<style></style>
