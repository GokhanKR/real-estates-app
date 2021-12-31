<template>
  <v-row>
    <v-col cols="12">
      <panel-title
        v-if="!isEdit"
        icon="mdi-clipboard-plus"
        title="Add Appointment"
        desc="Add a new appointment"
        class="mb-4"
      />
      <panel-title
        v-else
        icon="mdi-clipboard-edit"
        title="Edit Appointment"
        desc="You can rearrange the information about the appointment."
        class="mb-4"
      />
      <v-card class="px-3 py-3 pb-5" max-width="900">
        <v-form v-model="valid"
          ><div class="mb-5">
            <panel-subtitle icon="mdi-account-box" title="Contact Details" />
          </div>

          <!-- Contact Details Form -->
          <v-row class="mx-0">
            <v-col cols="12" class="pb-0" v-show="!isEdit">
              <!-- Contact Selector -->
              <div class="pb-3">
                <appointment-contact-selector
                  :set-contact-id="
                    isEdit ? editAppointmentData.contact_id.toString() : null
                  "
                  @change="contactSelected"
                />
              </div>
              <!-- ./Contact Selector -->
              <div
                v-show="!contactDetail"
                class="secondary--text text-subtitle-2"
              >
                <v-icon>mdi-minus</v-icon>
                or enter contact information
              </div>
            </v-col>
            <v-col cols="12" lg="6" class="pb-0">
              <v-text-field
                v-model="formData.nameSurname"
                prepend-inner-icon="mdi-account-circle"
                outlined
                dense
                persistent-hint
                label="Name Surname"
                hint="Contact name and surname"
                :rules="rules.nameRules"
                required
                :readonly="!!contactDetail"
              />
            </v-col>
            <v-col cols="12" lg="6" class="pb-0">
              <v-text-field
                v-model="formData.email"
                prepend-inner-icon="mdi-email-box"
                outlined
                dense
                persistent-hint
                label="E-mail"
                hint="Contact e-mail"
                :rules="rules.emailRules"
                required
                :readonly="!!contactDetail"
              />
            </v-col>
            <v-col cols="12" lg="6" class="pb-0">
              <v-text-field
                v-model="formData.phone"
                prepend-inner-icon="mdi-phone"
                outlined
                dense
                persistent-hint
                label="Phone"
                hint="Contact Phone Number"
                :rules="rules.phoneRules"
                required
                :readonly="!!contactDetail"
              />
            </v-col>
          </v-row>
          <!-- ./Contact Details Form -->

          <div class="mt-5 mb-5">
            <panel-subtitle
              icon="mdi-map-marker-radius"
              title="Location Details"
            />
          </div>

          <!-- Location Details Form -->
          <v-row class="mx-0">
            <v-col cols="12" class="pb-0">
              <appointment-map-marker
                :set-post-code="
                  isEdit ? editAppointmentData.appointment_postcode : null
                "
                :input-rules="rules.mapRules"
                @change="locationChanged"
              />
            </v-col>
          </v-row>
          <!-- ./Location Details Form -->

          <!-- Appointment & Agent Details Form -->
          <v-row>
            <v-col cols="12" class="pb-0">
              <div class="mt-2">
                <panel-subtitle
                  icon="mdi-clipboard-list"
                  title="Appointment & Agent Details"
                />
              </div>
            </v-col>
            <v-col cols="12" class="pb-0">
              <appointment-date-picker
                :disabled="!location"
                :input-rules="rules.dateRules"
                v-model="formData.date"
                @modal="dateModal = $event"
              />
            </v-col>
            <v-col cols="12" lg="5" class="pt-0">
              <appointment-time-picker
                :disabled="!formData.date"
                :input-rules="rules.timeRules"
                v-model="formData.time"
                @period="formData.ampm = $event"
              />
            </v-col>
            <v-col cols="12" lg="7" class="pt-0">
              <div
                v-if="!formData.time"
                class="d-flex justify-center align-center grey lighten-3 rounded-lg"
                style="width: 100%; height: 100%"
              >
                <v-sheet color="transparent" max-width="300">
                  <v-alert dark color="primary" class="text-center rounded-lg">
                    <v-icon left>mdi-clock-time-four</v-icon>
                    Please select location first then select date and time
                  </v-alert>
                </v-sheet>
              </div>
              <div
                v-else
                style="width: 100%; height: 100%"
                class="d-flex justify-center align-center flex-column rounded-lg grey lighten-3"
              >
                <div class="mb-5 title font-weight-medium secondary--text">
                  <span class="mx-10">Appointment Details</span>
                  <v-divider></v-divider>
                </div>
                <div class="d-flex justify-center align-center rounded-lg mb-6">
                  <div class="mr-7 text-center">
                    <v-card
                      color="primary"
                      rounded="xl"
                      class="px-3 py-2 d-inline-block mx-auto mb-3"
                      dark
                    >
                      <v-icon size="20">mdi-map-marker-check</v-icon>
                      Estimated Arrival
                    </v-card>
                    <p class="text-subtitle-1 font-weight-bold mb-2">
                      <v-icon size="22" color="primary" class="mr-1"
                        >mdi-timer</v-icon
                      >
                      {{ selectedAppointmentArrivalTime.time }}
                    </p>
                    <v-chip small class="primary--text">
                      <v-icon size="15" color="primary" class="mr-1">
                        mdi-calendar-range
                      </v-icon>
                      {{ selectedAppointmentArrivalTime.date }}
                    </v-chip>
                  </div>
                  <div class="ml-7 text-center">
                    <v-card
                      color="primary"
                      rounded="xl"
                      class="px-3 py-2 d-inline-block mx-auto mb-3"
                      dark
                    >
                      <v-icon size="20">mdi-map-marker-check-outline</v-icon>
                      Estimated Return
                    </v-card>
                    <p class="text-subtitle-1 font-weight-bold mb-2">
                      <v-icon size="22" color="primary" class="mr-1"
                        >mdi-timer</v-icon
                      >
                      {{ selectedAppointmentResponseTime.time }}
                    </p>
                    <v-chip small class="primary--text">
                      <v-icon size="15" color="primary" class="mr-1">
                        mdi-calendar-range
                      </v-icon>
                      {{ selectedAppointmentResponseTime.date }}
                    </v-chip>
                  </div>
                </div>
                <div class="mb-5 title font-weight-medium secondary--text">
                  <span class="mx-10">Agent Details</span>
                  <v-divider></v-divider>
                </div>
                <div style="min-width: 400px">
                  <appointment-agent-picker
                    :set-agent-id="
                      isEdit ? editAppointmentData.agent_id.toString() : null
                    "
                    :input-rules="rules.agentRules"
                    @change="formData.agent = $event"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- ./Appointment & Agent Details Form -->

          <v-divider class="my-7"></v-divider>

          <!-- Add Appointment Actions -->
          <v-row>
            <v-col cols="12" class="d-flex grey lighten-3">
              <v-spacer></v-spacer>
              <v-btn
                v-if="!isEdit"
                color="primary"
                :loading="loading"
                @click="addAppointment"
              >
                <v-icon left size="22">mdi-clipboard-plus</v-icon>
                Add Appointment
              </v-btn>
              <div v-else>
                <v-btn color="error" class="mr-3" @click="router.back()">
                  <v-icon left size="22">mdi-cancel</v-icon>
                  Cancel
                </v-btn>

                <v-btn
                  color="success"
                  :loading="loading"
                  @click="editAppointment"
                >
                  <v-icon left size="22">mdi-clipboard-edit</v-icon>
                  Edit Appointment
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <!-- ./Add Appointment Actions -->
        </v-form>
      </v-card>
    </v-col>

    <!-- Form error dialog -->
    <warning-dialog v-model="formError.modal">
      {{ formError.message }}
    </warning-dialog>
    <!-- ./Form error dialog -->

    <!-- Loading Overlay -->
    <v-overlay color="white" :opacity="0.7" v-model="editAppointmentStatus">
      <v-card
        color="white"
        class="d-flex align-center justify-center px-5 py-5"
        min-width="200"
      >
        <v-progress-circular
          :width="3"
          color="primary"
          class="mr-5"
          indeterminate
          size="20"
        >
        </v-progress-circular>
        <div class="primary--text text-body-2">Loading edit</div>
      </v-card>
    </v-overlay>
    <!-- ./Loading Overlay -->
  </v-row>
</template>

<script>
import PanelSubtitle from "../components/PanelSubtitle.vue";
import PanelTitle from "../components/PanelTitle.vue";
import AppointmentDatePicker from "../components/Form/AppointmentDatePicker.vue";
import AppointmentTimePicker from "../components/Form/AppointmentTimePicker.vue";
import AppointmentMapMarker from "../components/Form/AppointmentMapMarker.vue";
import AppointmentAgentPicker from "../components/Form/AppointmentAgentSelector.vue";
import ContactService from "@/services/ContactService.js";
import AppointmentService from "@/services/AppointmentService.js";
import AppointmentContactSelector from "../components/Form/AppointmentContactSelector.vue";
import WarningDialog from "../components/WarningDialog.vue";

export default {
  name: "AddAppointments",
  components: {
    PanelTitle,
    PanelSubtitle,
    AppointmentDatePicker,
    AppointmentTimePicker,
    AppointmentMapMarker,
    AppointmentAgentPicker,
    AppointmentContactSelector,
    WarningDialog,
  },
  data: () => ({
    valid: false,
    loading: false,
    formError: {
      modal: false,
      message: "Please fill in the required fields in the form.",
    },
    dateModal: false,
    contactDetail: null,
    editAppointmentData: null,
    editAppointmentStatus: false,
    messages: {
      successAdd: "The appointment has been successfully added.",
      errorAdd: "Adding an appointment failed.",
    },
    formData: {
      nameSurname: "",
      email: "",
      phone: "",
      postCode: "",
      travelMode: "",
      date: "",
      time: "",
      ampm: "am",
      agent: null,
    },
    rules: {
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 25 || "Name must be less than 25 characters",
      ],
      emailRules: [
        (v) => !!v || "Email is required",
        (v) =>
          !!String(v)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ) || "Please enter a valid email address",
      ],
      phoneRules: [(v) => !!v || "Phone is required"],
      dateRules: [(v) => !!v || "Date is required"],
      mapRules: [(v) => !!v || "Map is required"],
      timeRules: [(v) => !!v || "Time is required"],
      agentRules: [(v) => !!v || "Agent is required"],
    },
    location: null,
    appointmentDate: null,
    selectedAppointmentArrivalTime: null,
    selectedAppointmentResponseTime: null,
  }),
  computed: {
    /**
     * @returns {Boolean}
     */
    isEdit() {
      return !!this.editAppointmentData;
    },
    /**
     * @returns {Object}
     */
    settings() {
      return this.$store.state.Settings.settings;
    },
    /**
     * @returns {Array}
     */
    agentsList() {
      return this.$store.state.Agents.agentsList;
    },
    /**
     * Returns default appointment time as string
     *
     * @returns {String}
     */
    appointmentTime() {
      return this.convertTime(this.defaultAppointmentTime);
    },
    /**
     * Returns arrival time as string
     *
     * @returns {String}
     */
    estimatedArrival() {
      let time = this.arrivalTimeStamp;
      return this.convertTime(time);
    },
    /**
     * Default appointment time as unix timestamp
     *
     * @returns {Number}
     */
    defaultAppointmentTime() {
      return (this.settings.defaultAppointmentTime / 60) * 3600;
    },
    /**
     * Tahmini gidiş timestamp
     */
    arrivalTimeStamp() {
      return this.location.duration.value;
    },
    /**
     * Tahmini dönüş timestamp
     */
    responseTimeStamp() {
      return this.arrivalTimeStamp + this.defaultAppointmentTime;
    },
    /**
     * Returns selected date as date format
     *
     * @returns {Object}
     */
    selectedDate() {
      let time = this.formData.time;
      return `${this.formData.date} ${time ? time : "00:00"}`;
    },
    /**
     * Returns selected date as date format
     *
     * @returns {Object}
     */
    router() {
      return this.$router;
    },
  },
  methods: {
    /**
     * Location changed event on map marker
     *
     * @returns {Void}
     */
    locationChanged(locationData) {
      this.formData.postCode = locationData.postCode;
      this.formData.travelMode = locationData.travelMode;
      this.location = locationData.location;

      this.setEditDateAndTime();
    },
    setEditDateAndTime() {
      if (this.isEdit) {
        let date = new Date(this.editAppointmentData.appointment_date);
        if (!this.formData.date) {
          this.formData.date = date.toISOString().substr(0, 10);
        }
        if (!this.formData.time) {
          this.formData.time =
            date.getHours().toString().padStart(2, 0) +
            ":" +
            date.getMinutes().toString().padStart(2, 0);
        }
        this.editAppointmentStatus = false;
      }
    },
    convertTime(timeStamp) {
      let [hours, min] = this.getTime(timeStamp),
        hoursText = hours > 1 ? "hours" : "hour",
        minsText = min > 1 ? "mins" : "min",
        text = "";
      if (hours) {
        text += `${hours} ${hoursText} `;
      }
      if (min) {
        text += ` ${min} ${minsText}`;
      }
      return text;
    },
    formControl() {
      if (!this.valid) {
        this.formError.modal = true;
        return false;
      }
      return true;
    },
    getTime(timeStamp) {
      let hours = Math.floor(timeStamp / 3600),
        min = Math.floor(timeStamp % 60);

      return [hours, min];
    },
    formatDate(date) {
      let d = date.split("-");
      return `${d[2]}/${d[1]}/${d[0]}`;
    },
    contactSelected(contactDetail) {
      this.contactDetail = contactDetail;
      if (contactDetail) {
        this.formData.nameSurname =
          contactDetail.contact_name + " " + contactDetail.contact_surname;
        this.formData.email = contactDetail.contact_email;
        this.formData.phone = contactDetail.contact_phone;
      } else {
        this.formData.nameSurname = "";
        this.formData.email = "";
        this.formData.phone = "";
      }
    },
    /**
     * Adds new appointment
     *
     * @returns {Object}
     */
    addAppointment() {
      if (this.formControl()) {
        this.loading = true;
        return this.formDataAction().then((data) => {
          const form = this.formData;
          let appointment_date = this.appointmentDate,
            appointment_postcode = form.postCode,
            contact_id = [data.contact.id],
            agent_id = [form.agent.id];

          // Add appointment
          return AppointmentService.addAppointment({
            appointment_date,
            appointment_postcode,
            contact_id,
            agent_id,
          })
            .then((res) => {
              if (res.status === 200) {
                this.$router.push("/appointments");
                this.$notify(true, this.messages.successAdd);
              } else {
                this.$notify(false, this.messages.errorAdd);
              }
              this.loading = false;
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
    },
    /**
     * Edits appointments
     *
     * @returns {Void}
     */
    editAppointment() {
      if (this.formControl()) {
        this.loading = true;
        return this.formDataAction().then(() => {
          const form = this.formData;
          let appointment_date = this.appointmentDate,
            appointment_postcode = form.postCode,
            agent_id = [form.agent.id],
            id = this.editAppointmentData.id;

          // Add appointment
          return AppointmentService.editAppointment({
            appointment_date,
            appointment_postcode,
            agent_id,
            id,
          })
            .then((res) => {
              if (res.status === 200) {
                this.$router.push("/appointments");
                this.$notify(true, this.messages.successAdd);
              } else {
                this.$notify(false, this.messages.errorAdd);
              }
              this.loading = false;
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
    },
    /**
     * Adds or corrects according to the action.
     *
     * @returns {Object}
     */
    formDataAction() {
      return new Promise((resolve) => {
        if (!this.contactDetail) {
          resolve(this.addContact().then((res) => res.data)).catch((err) => {
            console.error(err);
          });
        }
        resolve(this.contactDetail);
      }).then((contact) => {
        return { contact };
      });
    },
    /**
     * Adds new contact
     *
     * @returns {Object}
     */
    addContact() {
      let nameSurname = this.formData.nameSurname.split(" ");

      const form = this.formData,
        contact_name = nameSurname.slice(0, nameSurname.length - 1).join(" "),
        contact_surname = nameSurname[nameSurname.length - 1],
        contact_email = form.email,
        contact_phone = form.phone,
        Appointments = [];

      return ContactService.addContact({
        contact_name,
        contact_surname,
        contact_email,
        contact_phone,
        Appointments,
      });
    },
  },
  created() {
    /**
     * Load agents list
     */
    if (!this.agentsList.length) {
      this.$store.dispatch("Agents/getAgents");
    }

    // Is edit
    let appointmentId = this.$route.params.appointmentId;
    if (appointmentId) {
      this.editAppointmentStatus = true;
      // Get appointment detail from id
      AppointmentService.getAppointment(appointmentId)
        .then((res) => {
          if (res.status === 200) {
            this.editAppointmentData = res.data;
          }
        })
        .catch(() => {
          this.$notify(false, "Appointment not found.");
          this.$router.push("/appointments");
        });
    }
  },
  watch: {
    selectedDate(dateString) {
      // Set appointment date
      this.appointmentDate = new Date(dateString).toString();

      // set estimated departure time
      let date = new Date(this.appointmentDate);
      let [hours, min] = this.getTime(this.arrivalTimeStamp);
      date.setHours(date.getHours() + hours, date.getMinutes() + min);
      this.selectedAppointmentArrivalTime = {
        date: this.formatDate(date.toISOString().substr(0, 10)),
        time:
          date.getHours().toString().padStart(2, 0) +
          ":" +
          date.getMinutes().toString().padStart(2, 0),
      };

      // set estimated return time
      let [hours2, min2] = this.getTime(this.responseTimeStamp);
      date.setHours(date.getHours() + hours2, date.getMinutes() + min2);
      this.selectedAppointmentResponseTime = {
        date: this.formatDate(date.toISOString().substr(0, 10)),
        time:
          date.getHours().toString().padStart(2, 0) +
          ":" +
          date.getMinutes().toString().padStart(2, 0),
      };

      date = null;
    },
    "$route.path"(val) {
      this.$router.go(val);
    },
  },
};
</script>
