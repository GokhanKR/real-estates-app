import Vue from "vue"
const mixin = Vue.mixin({
  computed: {
    /**
     * @returns {String}
     */
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary;
    },
  },
});
export default mixin;
