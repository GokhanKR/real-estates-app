<template>
  <div style="max-width: 850px">
    <panel-title
      icon="mdi-office-building-cog"
      title="Settings"
      desc="System settings"
      class="mb-4"
    />
    <div>
      <div class="my-6">
        <p class="mb-3 primary--text">
          <v-icon size="18" class="mr-2" color="primary">mdi-cogs</v-icon
          >Working days
        </p>
        <div class="d-flex flex-wrap">
          <v-chip-group v-model="formSettings.workingDays" multiple>
            <chip
              :active="formSettings.workingDays.includes(n)"
              :key="n"
              v-for="n in 7"
              :value="n"
              class="mr-3"
            >
              {{ days[n] }}
            </chip>
          </v-chip-group>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="my-6">
        <p class="mb-3 primary--text d-flex align-center">
          <span class="mr-2"
            ><v-icon size="18" class="mr-2" color="primary"
              >mdi-cogs</v-icon
            >Working hours</span
          >
          <v-btn-toggle v-model="ampm" color="primary">
            <v-btn x-small :value="true">AM</v-btn>
            <v-btn x-small :value="false">PM</v-btn>
          </v-btn-toggle>
        </p>
        <div class="d-flex flex-wrap">
          <v-chip-group v-model="formSettings.workingHours" multiple>
            <chip
              :active="formSettings.workingHours.includes(n)"
              :key="n"
              v-for="n in 12"
              :value="n"
              class="mr-3"
            >
              {{ n.toString().padStart(2, "0") + ":00" }}
            </chip>
          </v-chip-group>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="my-6">
        <p class="my-0 primary--text">
          <v-icon size="18" class="mr-2" color="primary">mdi-cogs</v-icon
          >Appointment Time
        </p>
        <div class="mt-5">
          <v-card class="px-2 pt-4">
            <v-text-field
              v-model="formSettings.defaultAppointmentTime"
              label="Default Appointment Time"
              prepend-inner-icon="mdi-timer"
              persistent-hint
              outlined
              dense
              hint="Specify in minutes"
            ></v-text-field>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PanelTitle from "../components/PanelTitle.vue";
import { mapState } from "vuex";
import Chip from "../components/Base/Chip.vue";
export default {
  components: { PanelTitle, Chip },
  data: () => ({
    formSettings: {
      workingDays: [],
      workingHours: [],
      defaultAppointmentTime: "",
    },
    days: {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    },
    ampm: true,
  }),
  computed: {
    ...mapState({
      settings: (state) => state.Settings.settings,
    }),
  },
  created() {
    // this.$store.dispatch("Settings/getSettings").then(() => {
      this.formSettings = { ...this.settings };
    // })
  },
};
</script>

<style></style>
