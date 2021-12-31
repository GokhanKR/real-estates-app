<template>
  <v-chip
    v-bind="$attrs"
    v-on="$listeners"
    label
    :style="{
      border: borderSize + 'px solid ' + (active ? primaryColor : 'white'),
      color: primaryColor,
      background: 'white',
    }"
    class="i-chip elevation-1"
  >
    <slot></slot>
  </v-chip>
</template>

<script>
export default {
  props: {
    active: {
      default: false,
      type: Boolean,
      required: false,
    },
    borderSize: {
      default: "2",
      type: String,
      required: false,
    },
  },
  name: "Chip",
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

<style>
.i-chip::before {
  display: none;
}
</style>
