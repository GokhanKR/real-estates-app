<template>
  <v-row class="pl-10 pt-5">
    <v-col cols="12" lg="6">
      <p class="text-h1 font-weight-medium">
        <span class="primary--text">404</span> Not Found
      </p>
      <v-divider class="mb-5"></v-divider>
      <v-btn class="text-capitalize" color="secondary" to="/" small>
        <v-icon>mdi-chevron-left</v-icon>
        Go back to dashboard
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "404",
};
</script>

<style></style>
