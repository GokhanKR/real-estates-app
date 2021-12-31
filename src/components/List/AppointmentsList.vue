<template>
  <v-row>
    <v-col cols="12" class="pb-1">
      <v-row class="px-4">
        <v-col class="py-0">
          <div class="list-head" :style="{ color: primaryColor }">
            Contact Name / Phone
          </div>
        </v-col>
        <v-col class="py-0">
          <div class="list-head" :style="{ color: primaryColor }">
            Post Code
          </div>
        </v-col>
        <v-col class="py-0">
          <div class="list-head" :style="{ color: primaryColor }">Agent</div>
        </v-col>
        <v-col class="py-0 d-flex">
          <div class="list-head mr-2" :style="{ color: primaryColor }">
            Date
          </div>
          <span class="list-head">/</span>
          <div class="list-head ml-2" :style="{ color: primaryColor }">
            Status
          </div>
        </v-col>
        <v-col lg="2" class="py-0">
          <div class="list-head" :style="{ color: primaryColor }">Actions</div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="py-0">
      <v-divider class="my-2"></v-divider>
      <v-progress-linear
        v-show="loading"
        indeterminate
        color="primary"
      ></v-progress-linear>
    </v-col>
    <v-col cols="12" v-show="!loading && !appointmentsCount">
      <p class="text-center font-weight-medium grey--text">
        No appointment found to list
      </p>
    </v-col>
    <v-col
      cols="12"
      :key="key"
      v-for="(item, key) in appointmentsList"
      class="mb-2"
    >
      <v-card class="pl-4 px-3" elevation="1">
        <v-row class="d-flex align-center text-appointment-list">
          <v-col class="pt-2 pb-2">
            <div class="primary--text font-weight-medium">
              {{ item.contact_name.toString() }}
              {{ item.contact_surname.toString() }}
            </div>
            <div class="text-caption">
              <a
                :href="`tel:${item.contact_phone.toString()}`"
                class="list-item-link"
                >{{ item.contact_phone.toString() }}
                <v-icon size="13">mdi-open-in-new</v-icon>
              </a>
            </div>
          </v-col>
          <v-col class="py-2">
            <div class="list-item-postcode d-flex align-center">
              <v-chip
                small
                class="px-2 primary--text mr-2"
                color="grey lighten-2"
                >{{ item.appointment_postcode.toString() }}</v-chip
              >

              <v-tooltip top color="primary">
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    small
                    depressed
                    color="primary"
                    @click="openOnMap(item.appointment_postcode.toString())"
                  >
                    <v-icon size="18">mdi-map-marker</v-icon>
                  </v-btn>
                </template>
                <span>Show on map</span>
              </v-tooltip>
            </div>
          </v-col>
          <v-col class="py-2">
            <div class="list-item-agent secondary--text">
              {{ item.agent_name.toString() }}
              {{ item.agent_surname.toString() }}
            </div>
          </v-col>
          <v-col class="py-2 d-flex">
            <div class="mr-2">
              <v-chip small color="primary" class="font-weight-medium">
                {{ getDate(item.appointment_date) }}
              </v-chip>
            </div>
            <div>
              <v-chip
                v-if="isActive(item.appointment_date)"
                color="success"
                small
                class="font-weight-medium"
              >
                Active
              </v-chip>
              <v-chip v-else color="error" small class="font-weight-medium">
                Deactive
              </v-chip>
            </div>
          </v-col>
          <v-col lg="2" class="py-2">
            <div>
              <v-btn
                fab
                x-small
                depressed
                color="blue lighten-5"
                class="mr-2"
                :to="`edit-appointment/${item.id}`"
              >
                <v-icon color="blue darken-1">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                fab
                x-small
                depressed
                color="red lighten-5"
                @click="deleteAppointmentDialog(item.id)"
              >
                <v-icon color="red darken-1">mdi-delete-outline</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-pagination
        :color="primaryColor"
        v-model="page"
        :length="pageLength"
        @input="pageClick"
      ></v-pagination>
    </v-col>
    <!-- Delete Item Dialog -->
    <warning-dialog v-model="deleteItem.modal">
      {{ deleteItem.message }}
      <template #actions="{ close }">
        <v-btn small color="error" @click="close">
          <v-icon left>mdi-close-circle</v-icon>
          Cancel
        </v-btn>
        <v-btn
          small
          color="error"
          :loading="deleteItem.loading"
          @click="deleteAppointment"
        >
          <v-icon left>mdi-check-circle</v-icon>
          Yes
        </v-btn>
      </template>
    </warning-dialog>
    <!-- ./Delete Item Dialog -->

    <!-- Location -->
    <location :post-code.sync="postCode" @update="updatedMap" />
    <!-- ./Location -->
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import WarningDialog from "../WarningDialog.vue";
import Location from "./Location.vue";
export default {
  components: { WarningDialog, Location },
  name: "AppointmentsList",
  props: {
    dateFilter: {
      type: Object,
      default: () => {
        return {};
      },
    },
    filters: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data: () => ({
    page: 1,
    lastPage: 0,
    start: 0,
    limit: 10,
    loading: true,
    pageLength: 0,
    deleteItem: {
      modal: false,
      loading: false,
      message: "Are you sure you want to delete the appointment?",
      id: null,
    },
    postCode: "",
  }),
  computed: {
    ...mapState({
      /**
       * @returns {Array}
       */
      appointmentsList: (state) => state.Appointments.appointmentsList,
      /**
       * @returns {Number}
       */
      appointmentsCount: (state) => state.Appointments.appointmentsCount,
    }),
    /**
     * @returns {String}
     */
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary;
    },
    /**
     * @returns {Object}
     */
    pagination() {
      return {
        start: this.$store.state.Appointments.start,
        limit: this.$store.state.Appointments.limit,
      };
    },
    /**
     * @returns {Object}
     */
    dateNow() {
      return new Date();
    },
  },
  methods: {
    getDate(date) {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "numeric",
        year: "2-digit",
        month: "numeric",
        day: "numeric",
      }).format(new Date(date));
    },
    isActive(date) {
      return new Date(date) > this.dateNow;
    },
    openOnMap(postCode) {
      this.postCode = postCode;
    },
    updatedMap() {
      this.postCode = "";
    },
    /**
     * Brings the whole list
     *
     * @returns {Void}
     */
    getAppointments() {
      this.loading = true;
      const { start, limit } = this.pagination,
        filters = this.getFilters();

      this.$store
        .dispatch("Appointments/getAppointments", { start, limit, ...filters })
        .then(() => {
          this.loading = false;
          this.pageLength = Math.ceil(this.appointmentsCount / this.limit);
        });
    },
    /**
     * Returns all filters
     *
     * @returns {Object}
     */
    getFilters() {
      let filters = {};
      if (Object.keys(this.dateFilter).length) {
        filters.date = this.dateFilter.range;
      }
      if (Object.keys(this.filters).length) {
        filters = Object.assign(this.filters, filters);
      }
      return filters;
    },
    deleteAppointmentDialog(id) {
      this.deleteItem.id = id;
      this.deleteItem.modal = true;
    },
    deleteAppointment() {
      this.deleteItem.loading = true;
      return this.$store
        .dispatch("Appointments/deleteAppointment", this.deleteItem.id)
        .then((res) => {
          if (res.status === 200) {
            this.$notify(
              true,
              "The appointment has been deleted successfully."
            );
            this.deleteItem.id = null;
            this.deleteItem.modal = false;
          } else {
            this.$notify(false, "Appointment deletion failed.");
          }
          this.deleteItem.loading = false;
        });
    },
    pageClick(page) {
      if (page !== this.lastPage) {
        /**
         * Set initial value by pagination
         */
        this.start = this.page * this.limit - this.limit;

        /**
         * Get Appointments
         */
        this.getAppointments();
      }
    },
  },
  watch: {
    page: {
      handler(page) {
        this.lastPage = page;
      },
      immediate: true,
    },
    dateFilter() {
      this.getAppointments();
    },
    filters: {
      handler() {
        this.getAppointments();
      },
      deep: true,
    },
    start(val) {
      this.$store.commit("Appointments/setStart", val);
    },
    limit(val) {
      this.$store.commit("Appointments/setLimit", val);
    },
  },
};
</script>

<style>
.list-item-postcode {
  position: relative;
  margin: 0 0 2px -2px !important;
}
.list-item-agent {
  font-size: 13px;
}
</style>
