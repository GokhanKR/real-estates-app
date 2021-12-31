<template>
  <div>
    <h2 class="title mb-1 primary--text">
      <v-icon :color="primaryColor" size="25" class="mr-1">{{ icon }}</v-icon>
      {{ title }}
    </h2>
    <v-divider class="mb-1"></v-divider>
    <p
      v-show="desc"
      class="pl-1 subtitle-2 font-weight-medium mb-1 secondary--text"
    >
      {{ desc }}
    </p>
  </div>
</template>

<script>
export default {
  name: "PanelTitle",
  props: {
    icon: String,
    title: String,
    desc: String,
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
