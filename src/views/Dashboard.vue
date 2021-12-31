<template>
  <v-row class="mt-5">
    <v-col cols="12">
      <div class="d-inline-block">
        <h1 class="text-h2 mb-2">
          <span class="primary--text">Icerberg</span>
          <span class="secondary--text">Estates</span>
        </h1>
        <p class="text-right text-h5 grey--text font-weight-light pr-5">
          Dashboard
        </p>
      </div>
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <p class="text text-h6 font-weight-light grey--text text--darken-4">
        Appointments expected to take place today
      </p>
      <div>
        <div class="d-flex align-center mb-5">
          <v-icon size="50" color="primary">mdi-chevron-right</v-icon>
          <span class="text-h4 font-weight-bold primary--text">{{ time }}</span>
        </div>
        <div v-if="appointmentsCount">
          <div class="d-flex flex-wrap align-center">
            <v-card
              :key="key"
              v-for="(item, key) in appointmentsList"
              outlined
              color="grey lighten-2"
              class="px-3 py-3 mr-3 mb-4"
              width="300"
              min-height="100"
            >
              <div class="d-flex justify-space-between align-top mb-6">
                <v-card
                  class="d-inline-block px-2 py-2 text-subtitle-2 text-center"
                  rounded="xl"
                  min-width="150"
                >
                  {{ item.contact_name.toString() }}
                  {{ item.contact_surname.toString() }}
                </v-card>
                <v-card
                  class="d-flex align-center px-2 py-1"
                  rounded="lg"
                  color="primary"
                  dark
                >
                  <v-icon size="18" left>mdi-clock</v-icon>
                  {{ getTime(item.appointment_date.toString()) }}
                </v-card>
              </div>
              <div class="d-flex flex-column align-end">
                <v-chip
                  x-small
                  color="grey lighten-1"
                  class="primary--text mb-2"
                >
                  Agent: {{ item.agent_name.toString() }}
                  {{ item.agent_surname.toString() }}
                </v-chip>
                <v-chip x-small color="grey lighten-1" class="primary--text">
                  Post Code: {{ item.appointment_postcode.toString() }}
                </v-chip>
              </div>
            </v-card>
          </div>
        </div>
        <div v-else class="px-5 py-5">
          <p class="title font-weight-light">
            <v-icon left>mdi-magnify-close</v-icon>
            No appointments to show
          </p>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import AppointmentService from "@/services/AppointmentService";
export default {
  name: "Dashboard",
  data: () => ({
    appointments: [],
  }),
  computed: {
    time() {
      let date = new Date();
      return this.getTime(date);
    },
    /**
     * @returns {Array}
     */
    appointmentsList() {
      return this.appointments.list;
    },
    /**
     * @returns {Number}
     */
    appointmentsCount() {
      return this.appointments.count;
    },
  },
  methods: {
    getTime(dateString) {
      let date = new Date(dateString);
      return (
        date.getHours().toString().padStart(2, 0) +
        ":" +
        date.getMinutes().toString().padStart(2, 0)
      );
    },
  },
  created() {
    let start = new Date(),
      end = new Date();
    end.setDate(start.getDate() + 1);
    end.setHours(0, 0, 0);

    AppointmentService.appointmentsList({
      date: { start: start.toString(), end: end.toString() },
    }).then((res) => {
      this.appointments = res.data;
    });
  },
};
</script>
