<template>
  <v-list color="transparent" class="mt-5">
    <v-list-item
      :color="primaryColor"
      v-for="(n, i) in navigation"
      :key="i"
      link
      :to="n.href"
    >
      <v-list-item-content>
        <v-list-item-title class="text-subtitle-2">
          <v-icon v-text="n.icon" size="20" class="mr-2"></v-icon>
          {{ n.text }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "MainNavigation",
  data: () => ({
    navigation: [
      {
        text: "Dashboard",
        href: "/",
        icon: "mdi-home",
      },
      {
        text: "Add New Appointment",
        href: "/add-appointment",
        icon: "mdi-clipboard-plus",
      },
      {
        text: "Appointments",
        href: "/appointments",
        icon: "mdi-clipboard-list",
      },
      {
        text: "Settings",
        href: "/settings",
        icon: "mdi-office-building-cog",
      },
    ],
  }),
  computed: {
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary;
    },
  },
};
</script>
