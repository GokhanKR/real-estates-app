<template>
  <v-app id="inspire">
    <v-app-bar app :color="primaryColor" dark flat>
      <v-container class="py-0 fill-height">
        <a id="home" href="/" class="d-flex">
          <v-icon class="mr-4" size="32">mdi-office-building-marker</v-icon>
          <h1 class="title mr-2">Iceberg Estates</h1>
          <sup>
            <v-chip x-small color="white" light>Appointment Manager</v-chip>
          </sup>
        </a>
        <v-spacer></v-spacer>
        <v-responsive max-width="260" class="d-none d-lg-block">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            dense
            flat
            hide-details
            rounded
            solo-inverted
            label="Search in panel"
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" lg="3" xl="2">
            <v-sheet rounded="lg" elevation="1">
              <main-navigation />
            </v-sheet>
          </v-col>

          <v-col cols="12" lg="9" xl="10" class="px-6 py-6">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- Snackbar  -->
    <v-snackbar
      v-model="snackbar.value"
      :timeout="snackbar.timeout"
      :color="snackbar.status ? 'success' : 'error'"
    >
      {{ snackbar.message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar.value = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- ./Snackbar  -->
  </v-app>
</template>

<script>
import MainNavigation from "./components/MainNavigation.vue";
export default {
  components: {
    MainNavigation,
  },
  name: "App",
  computed: {
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary;
    },
    snackbar() {
      return this.$store.state.notify;
    },
  },
  created() {
    this.$store.dispatch("Settings/getSettings");
  },
};
</script>

<style>
a#home {
  color: #fff;
  text-decoration: none;
}
#main {
  background-color: #dddddd !important;
}
</style>
