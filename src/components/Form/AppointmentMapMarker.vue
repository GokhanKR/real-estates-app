<template>
  <div>
    <v-text-field
      v-model="postCode"
      prepend-inner-icon="mdi-google-maps"
      outlined
      dense
      persistent-hint
      label="Post Code (e.g. M32 0JG)"
      hint="Find the contact location"
      class="mb-2"
      :readonly="readonlyStatus"
      :rules="inputRules"
      required
    >
      <template #append>
        <v-btn
          v-show="postCode.length > 0"
          icon
          small
          class="locate-button mr-2"
          @click="clearLocation($event)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-menu offset-y left>
          <template #activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              small
              color="grey lighten-2"
              depressed
              class="locate-button text-capitalize mr-2"
              :disabled="readonlyStatus"
            >
              <v-icon class="mr-1" size="16">mdi-toggle-switch</v-icon>
              Mode: {{ travelMode.text }}
            </v-btn>
          </template>
          <v-card
            :key="key"
            v-for="(mode, key) in travelModes"
            @click="travel = key"
            rounded="0"
            class="px-2 py-1"
          >
            <v-icon v-text="mode.icon" size="18" class="mr-2"></v-icon>
            <span
              v-text="mode.text"
              class="text-subtitle-2 font-weight-regular"
            ></span>
          </v-card>
        </v-menu>
        <v-btn
          small
          color="primary"
          class="locate-button"
          :loading="locate.loading"
          @click="getLocation($event)"
          :disabled="postCode.length < 1"
        >
          <v-icon class="mr-1" size="16">mdi-map-marker</v-icon>
          Locate
        </v-btn>
      </template>
    </v-text-field>
    <div id="map">
      <!-- Markers Information -->
      <div id="markerInfo" class="d-flex justify-space-between">
        <div>
          <v-card
            color="grey lighten-3"
            elevation="0"
            class="d-flex align-center px-2 py-1 mr-2"
          >
            <div class="d-flex align-center mr-7">
              <v-img :src="primaryMarkerIcon" width="24" class="mr-2" />
              <span class="text-subtitle-2 secondary--text"
                >Business Location</span
              >
            </div>
            <div class="d-flex align-center">
              <v-img :src="secondaryMarkerIcon" width="24" class="mr-2" />
              <span class="text-subtitle-2 secondary--text"
                >Appointment Location</span
              >
            </div>
          </v-card>
        </div>

        <div class="d-flex align-center">
          <v-tooltip top color="grey lighten-2 secondary--text">
            <template #activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs">mdi-information</v-icon>
            </template>
            <span>You can specify different locations using the marker.</span>
          </v-tooltip>
        </div>
      </div>
      <!-- ./Markers Information -->

      <div id="googleMap">
        <!-- Post Location Error Dialog -->
        <v-dialog v-model="postLocationErrDialog" max-width="400">
          <v-card>
            <v-card-text class="pt-4 pb-2 error--text text--darken-2">
              Postcode not found. Please enter a postal code or select a correct
              area on the map.
            </v-card-text>
            <v-card-actions class="py-2">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                small
                @click="postLocationErrDialog = false"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- ./Post Location Error Dialog -->

        <!-- Map Overlay -->
        <v-overlay
          z-index="2"
          :opacity="0.85"
          color="white"
          absolute
          :value="true"
          v-show="locate.loading || !location"
        >
          <div v-if="locate.loading">
            <v-progress-circular
              :size="60"
              :width="4"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-else-if="locate.locationErr">
            <div class="title text-center primary--text">
              <v-icon color="primary" size="70">mdi-alert</v-icon>
              <br />
              The location of the post code was not found
            </div>
          </div>
          <div v-else-if="!location">
            <div class="title primary--text">
              <v-icon color="primary" size="30">mdi-information-variant</v-icon>
              Please enter post code above
            </div>
          </div>
        </v-overlay>
        <!-- ./Map Overlay -->

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
          :center="markers[0].position"
        >
        </Gmap-Map>
        <!-- ./Google Map -->

        <!-- Adress Detail Bar -->
        <v-card
          v-if="location"
          id="addressBar"
          dense
          floating
          rounded="lg"
          class="px-3 py-1 pr-4 d-flex align-center"
          min-height="53"
          max-width="500"
        >
          <div class="primary--text d-flex align-center text-subtitle-2">
            <v-icon color="primary" class="mr-3">mdi-map-marker</v-icon>
            <div>
              <div>
                {{ location.end_address }}
              </div>
              <div class="font-weight-regular text-caption">
                {{ location.distance.text }}
                <span class="font-weight-bold mx-1">-</span>
                {{ location.duration.text }}
              </div>
            </div>
          </div>
        </v-card>
        <!-- ./Adress Detail Bar -->
      </div>

      <!-- Distance Information -->
      <v-card v-if="location" class="pb-3">
        <div class="primary white--text px-4 py-2 text-body-1">
          <!-- <panel-subtitle icon="mdi-account-supervisor-circle" title="Appointment Informations" /> -->
          <v-icon color="white" size="25" left
            >mdi-account-supervisor-circle</v-icon
          >
          Appointment Informations
        </div>
        <div class="px-4 py-3">
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col
                  :key="key"
                  v-for="(inf, key) in appointmentInformations"
                  cols="12"
                  lg="6"
                  class="pb-0"
                >
                  <strong class="primary--text font-weight-regular"
                    >{{ inf.text }}:</strong
                  >
                  <br />
                  <span class="text-body-2 secondary--text ml-1">{{
                    inf.value
                  }}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <!-- ./Distance Information -->
    </div>
  </div>
</template>

<script>
/* global google */
import axios from "axios";
import { gmapApi } from "vue2-google-maps";

export default {
  name: "AppointmentMapMarker",
  props: {
    value: String,
    inputRules: Array,
    setPostCode: String,
  },
  data: () => ({
    mapKey: 1,
    postCodeExp:
      /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/g,
    postCode: "", //"M32 0JG",
    travel: "DRIVING",
    locate: {
      postLocation: null,
      location: null,
      locationErr: false,
      postLocationErr: false,
      loading: false,
    },
    postLocationErrDialog: false,
    travelModes: {
      DRIVING: {
        text: "Driving",
        icon: "mdi-car",
      },
      WALKING: {
        text: "Walking",
        icon: "mdi-walk",
      },
      BICYCLING: {
        text: "Bicycling",
        icon: "mdi-bike",
      },
      TRANSIT: {
        text: "Transit",
        icon: "mdi-subway-variant",
      },
    },
    primaryMarkerIcon:
      "data:image/png;base64,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",
    secondaryMarkerIcon:
      "data:image/png;base64,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",
    markers: [
      {
        position: { lat: 51.729157, lng: 0.478027 },
        clickable: true,
      },
      {
        position: { lat: 51.6562, lng: -1.069876 },
        clickable: false,
      },
    ],
    primaryMarker: null,
    secondaryMarker: null,
    directionsRenderer: null,
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
    /**
     * @returns {Object}
     */
    travelMode() {
      return this.travelModes[this.travel];
    },
    /**
     * @returns {Object}
     */
    location() {
      return this.locate.location;
    },
    /**
     * @return {Boolean}
     */
    readonlyStatus() {
      return !!this.locate.location && !this.locate.postLocationErr;
    },
    /**
     * @returns {Array}
     */
    appointmentInformations() {
      return [
        {
          text: "Address",
          value: this.location.end_address,
        },
        {
          text: "Distance",
          value: this.location.distance.text,
        },
        {
          text: "Duration",
          value: this.location.duration.text,
        },
        {
          text: "Post Code",
          value: this.postCode,
        },
        {
          text: "Transport",
          value: this.travelMode.text,
        },
      ];
    },
  },
  methods: {
    setLocation(postCode) {
      this.locationFn(postCode);
    },
    getLocation(e) {
      e.stopPropagation();

      // Get latLng from postcodes.io
      return this.locationFn(this.postCode);
    },
    locationFn(postCode) {
      // Get latLng from postcodes.io
      return this.getAddress(postCode)
        .then((response) => {
          this.locate.postLocation = response.data.result;
        })
        .catch(() => {
          this.locate.locationErr = true;
          this.locate.loading = false;
        });
    },
    clearLocation(e) {
      e.stopPropagation();
      this.postCode = "";
      this.clear();
    },
    resetMap() {
      this.mapKey = this.mapKey + 1;
      this.locate.loading = true;
      this.clear();
    },
    clear() {
      this.locate.locationErr = false;
      this.locate.postLocationErr = false;
      this.locate.postLocation = null;
      this.locate.location = null;
    },
    showPostCodeError() {
      // Set postcode to blank
      this.postCode = "";
      // Open error dialog
      this.postLocationErrDialog = true;
      // Set post code error
      this.locate.postLocationErr = true;
    },
    getAddress(postCode) {
      return axios
        .get("https://api.postcodes.io/postcodes/" + postCode)
        .catch((err) => {
          console.error(err);
        });
    },
    setSecondaryMarker(latlng) {
      // Reset map
      this.resetMap();
      // Set secondary marker
      this.markers[1].position = latlng;

      // Set directions and get location details
      this.$nextTick(() => {
        this.gMap.$mapPromise.then((map) => {
          this.initMap(map);
        });
      });
    },
    initMap(map) {
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });

      var icons = {
        start: new google.maps.MarkerImage(
          // URL
          this.primaryMarkerIcon,
          // (width,height)
          new google.maps.Size(44, 44),
          // The origin point (x,y)
          new google.maps.Point(0, 0),
          // The anchor point (x,y)
          new google.maps.Point(22, 44)
        ),
        end: new google.maps.MarkerImage(
          // URL
          this.secondaryMarkerIcon,
          // (width,height)
          new google.maps.Size(44, 44),
          // The origin point (x,y)
          new google.maps.Point(0, 0),
          // The anchor point (x,y)
          new google.maps.Point(22, 44)
        ),
      };

      this.directionsRenderer.setMap(map);
      let directionsService = new google.maps.DirectionsService(),
        request = {
          origin: this.markers[0].position,
          destination: this.markers[1].position,
          travelMode: this.travel,
        };

      directionsService.route(request, (result, status) => {
        if (status == "OK") {
          this.directionsRenderer.setDirections(result);
          let leg = result.routes[0].legs[0],
            geocoder = new google.maps.Geocoder();

          // Get address details from geocode api and set origin post code
          geocoder.geocode({ address: leg.end_address }).then((res) => {
            let addressComponents = res.results[0].address_components,
              longNames = addressComponents.map((o) => o.long_name),
              postCode = longNames.filter((o) => o.match(this.postCodeExp));

            if (postCode.length) {
              this.postCode = postCode.toString();
            } else {
              this.showPostCodeError();
            }
          });

          // Geocode location details
          this.locate.location = leg;

          // Set Primary Marker
          this.primaryMarker = makeMarker({
            position: leg.start_location,
            map: map,
            icon: icons.start,
            title: "Main Location",
          });

          // Set Secondary Marker
          this.secondaryMarker = makeMarker({
            position: leg.end_location,
            map: map,
            icon: icons.end,
            title: "Appointment Location",
            clickable: true,
            draggable: true,
          });

          // Listen secondaryMarker changes and update the map when event handling
          this.secondaryMarker.addListener("dragend", (e) => {
            return (this.locate.postLocation = {
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
            });
          });
        }
      });

      function makeMarker(settings) {
        return new google.maps.Marker(settings);
      }
    },
    emitValue() {
      this.$emit("change", {
        postCode: this.postCode,
        travelMode: this.travelMode,
        location: this.locate.location,
      });
    },
  },
  watch: {
    "locate.postLocation"(val) {
      if (val) {
        this.setSecondaryMarker(
          new google.maps.LatLng(val.latitude, val.longitude)
        );
      }
    },
    "locate.location"(val) {
      if (val) {
        this.locate.loading = false;
        this.emitValue();
      }
    },
    value(val) {
      this.postCode = val;
    },
    postCode() {
      this.emitValue();
    },
    setPostCode() {
      this.setLocation(this.setPostCode);
    },
  },
};
</script>

<style>
.locate-button {
  top: -2px;
}
#googleMap {
  position: relative;
  margin-bottom: 0.5rem;
}
#addressBar {
  position: absolute;
  left: 1rem;
  bottom: 1.8rem;
}
</style>
