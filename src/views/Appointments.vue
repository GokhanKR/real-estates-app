<template>
  <div>
    <v-row>
      <v-col cols="12">
        <panel-title
          icon="mdi-clipboard-list"
          title="Appointments"
          desc="Review or update your appointments"
        />
      </v-col>
      <v-col cols="12" class="pt-0">
        <date-picker-horizontal @change="dateChanged" />
      </v-col>
      <v-col cols="12" class="pt-0 mb-4">
        <appointment-filters @change="filtersChanged" />
      </v-col>
      <v-col cols="12">
        <appointments-list :dateFilter="dateFilter" :filters="filters" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppointmentFilters from "../components/List/AppointmentFilters.vue";
import AppointmentsList from "../components/List/AppointmentsList.vue";
import PanelTitle from "../components/PanelTitle.vue";
import DatePickerHorizontal from "../components/List/DatePickerHorizontal.vue";
export default {
  components: {
    PanelTitle,
    DatePickerHorizontal,
    AppointmentsList,
    AppointmentFilters,
  },
  name: "Appointments",
  data: () => ({
    dateFilter: {},
    filters: {},
  }),
  methods: {
    dateChanged(data) {
      this.dateFilter = data;
    },
    filtersChanged(data) {
      this.filters = data;
    },
  },
};
</script>

<style>
.list-head::first-letter {
  font-weight: bold;
}
.list-head {
  font-size: 13px;
}
.text-appointment-list {
  font-size: 14px;
  font-weight: 400;
}
.list-item-link {
  text-decoration: none;
}
</style>
