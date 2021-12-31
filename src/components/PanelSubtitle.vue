<template>
  <div class="mb-1">
    <p class="text-subtitle-1 mb-0 d-flex align-center">
      <v-icon color="grey darken-4" size="18" left>{{ icon }}</v-icon>
      {{ title }}
    </p>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  name: "PanelSubtile",
  props: {
    icon: String,
    title: String,
  },
  computed: {
    /**
     * @returns {String}
     */
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary;
    },
    /**
     * @returns {String}
     */
    secondaryColor() {
      return this.$vuetify.theme.themes.light.secondary;
    },
  },
};
</script>

<style></style>
