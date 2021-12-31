<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    persistent
    width="290px"
    :eager="true"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        outlined
        :value="input | formatDate"
        label="Appointment Date"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        :loading="loading"
        :rules="inputRules"
        required
        :disabled="disabled"
      >
        <template #append>
          <v-btn
            v-if="appointmentsFound"
            class="text-capitalize"
            style="top: -2px"
            small
            color="primary"
            :loading="loading"
            @click="foundDialog = true"
          >
            <span>
              <v-chip small class="font-weight-bold px-2 mr-2" color="white">
                {{ appointmentsFound }}</v-chip
              >
              appointments found
            </span>
          </v-btn>
          <v-btn
            v-else-if="input && !appointmentsFound"
            class="text-capitalize"
            style="top: -2px"
            small
            color="primary"
            :loading="loading"
          >
            <v-icon left>mdi-calendar-remove</v-icon>
            <span> No Appointments </span>
          </v-btn>
        </template>
      </v-text-field>
    </template>
    <v-date-picker :min="min" v-model="date" scrollable>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="saveDate" :disabled="!date">
        OK
      </v-btn>
    </v-date-picker>
    <v-dialog scrollable v-model="foundDialog" max-width="400">
      <v-card>
        <v-card-title class="text-body-1 text-center primary white--text pb-0">
          <p>
            Those who have an appointment on
            <span class="d-inline-block">{{ date | formatDate }}</span>
          </p>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item :key="key" v-for="(item, key) in appointmentsList">
              <v-list-item-content>
                <v-list-item-title>
                  <v-chip color="primary" label>{{
                    getTime(item.appointment_date.toString())
                  }}</v-chip>
                </v-list-item-title>
                <v-list-item-action class="font-weight-medium">
                  {{ item.agent_name.toString() }}
                  {{ item.agent_surname.toString() }}
                </v-list-item-action>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="primary" @click="foundDialog = false">
            <v-icon left>mdi-close</v-icon>
            Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import AppointmentsService from "@/services/AppointmentService";
export default {
  name: "AppointmentDatePicker",
  props: {
    value: String,
    inputRules: Array,
    disabled: Boolean,
  },
  data: () => ({
    date: "",
    input: "",
    modal: false,
    loading: false,
    appointmentsList: [],
    foundDialog: false,
  }),
  filters: {
    formatDate(date) {
      if (date) {
        let d = date.split("-");
        return `${d[2]}/${d[1]}/${d[0]}`;
      } else {
        return null;
      }
    },
  },
  computed: {
    /**
     * @returns {Object}
     */
    refDialog() {
      return this.$refs.dialog;
    },
    /**
     * @returns {Number}
     */
    appointmentsFound() {
      return this.appointmentsList.length;
    },
    /**
     * @returns {String}
     */
    min() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
  },
  methods: {
    getTime(dateString) {
      let date = new Date(dateString);
      return `${date.getHours().toString().padStart(2, 0)}:${date
        .getMinutes()
        .toString()
        .padStart(2, 0)}`;
    },
    saveDate() {
      this.loading = true;
      AppointmentsService.appointmentsListOnDate(this.date).then((res) => {
        if (res.status === 200) {
          this.appointmentsList = res.data.list.map((o) => o.item);
        } else {
          this.appointmentsList = [];
        }
        this.loading = false;
        this.input = this.date;
        this.$emit("input", this.date);
      });
      this.refDialog.save(this.date);
    },
  },
  watch: {
    value() {
      this.date = this.value;
      this.saveDate();
    },
    modal() {
      this.$emit("modal", this.modal);
    },
  },
};
</script>
