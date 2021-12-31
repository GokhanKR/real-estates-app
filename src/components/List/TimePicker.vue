<template>
  <div>
    <v-dialog
      ref="dialog"
      v-model="dialog"
      :return-value="getTime"
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <chip
          border-size="1"
          v-on="on"
          v-bind="{ ...attrs, active: isTime }"
          small
          class="pl-2"
        >
          <strong class="d-inline-block mr-2">
            <v-icon color="primary" size="16">mdi-list-status</v-icon>
            Time:
          </strong>

          <div>
            <span v-if="isTime">{{ time1 }} - {{time2}}</span>
            <span v-else class="secondary--text">Select</span>
          </div>

          <span v-show="isTime" class="ml-1">
            <v-tooltip color="primary" bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-on="on"
                  v-bind="attrs"
                  right
                  size="15"
                  color="primary"
                  @click="clearTime($event)"
                  >mdi-close-circle</v-icon
                >
              </template>
              <span>Clear</span>
            </v-tooltip>
          </span>
        </chip>
      </template>
      <div>
        <div v-if="step == 1">
          <div
            class="time-head primary text-center text-subtitle-2 py-1 white--text rounded-tl-lg rounded-tr-lg"
          >
            Start Time
          </div>
          <v-time-picker v-if="dialog" v-model="time1" full-width>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="clearTime"> Cancel </v-btn>
            <v-btn text color="primary" @click="nextTime"> Next </v-btn>
          </v-time-picker>
        </div>
        <div v-else-if="step == 2">
          <transition name="slide-fade">
            <div>
              <div
                class="time-head primary text-center text-subtitle-2 py-1 white--text rounded-tl-lg rounded-tr-lg"
              >
                End Time
              </div>
              <v-time-picker v-if="dialog" v-model="time2" full-width>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="clearTime">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="setTime"> OK </v-btn>
              </v-time-picker>
            </div>
          </transition>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import Chip from "../Base/Chip.vue";
export default {
  components: { Chip },
  name: "TimePicker",
  data: () => ({
    dialog: false,
    time1: null,
    time2: null,
    step: 1,
  }),
  computed: {
    isTime() {
      return !!this.time1 && !!this.time2;
    },
    getTime() {
      return [this.time1, this.time2]
    }
  },
  methods: {
    nextTime() {
      this.step = 2;
    },
    setTime() {
      this.$refs.dialog.save(this.getTime);
      this.emitData();
    },
    clearTime(e) {
      this.time1 = null;
      this.time2 = null;
      this.step = 1;
      this.dialog = false
      this.emitData();
      e.stopPropagation();
    },
    emitData() {
      this.$emit("change", this.getTime);
    },
  },
};
</script>

<style>
.time-head {
  position: relative;
  top: 5px;
  z-index: 1;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
