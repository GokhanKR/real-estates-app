<template>
  <v-card class="d-flex">
    <div v-if="step == 1">
      <transition name="fade">
        <div>
          <div
            class="date-head primary text-center text-subtitle-2 py-1 white--text rounded-tl-lg rounded-tr-lg"
          >
            Start Date
          </div>
          <v-date-picker v-model="date[0]" min="1950-01-01"></v-date-picker>
          <br />
          <div class="d-flex justify-end pb-3 px-3">
            <v-btn small class="mr-2" color="error" @click="cancel">
              Cancel
            </v-btn>
            <v-btn small :disabled="!date1" color="primary" @click="step = 2">
              Next
            </v-btn>
          </div>
        </div>
      </transition>
    </div>
    <div v-else>
      <transition name="fade">
        <div>
          <div
            class="date-head primary text-center text-subtitle-2 py-1 white--text rounded-tl-lg rounded-tr-lg"
          >
            End Date
          </div>
          <v-date-picker v-model="date[1]" :min="date1"></v-date-picker>
          <br />
          <div class="d-flex justify-end pb-3 px-3">
            <v-btn small class="mr-2" color="error" @click="cancel">
              Cancel
            </v-btn>
            <v-btn small :disabled="!date2" color="primary" @click="emitValue">
              OK
            </v-btn>
          </div>
        </div>
      </transition>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    value: Array,
  },
  data: () => ({
    date: ["", ""],
    step: 1,
  }),
  computed: {
    /**
     * @returns {String}
     */
    date1() {
      return this.date[0];
    },
    /**
     * @returns {String}
     */
    date2() {
      return this.date[1];
    },
    /**
     * @returns {Boolean}
     */
    isSelected() {
      return this.date1 && this.date2;
    },
  },
  methods: {
    emitValue() {
      this.$emit("input", [this.date1, this.date2]);
      this.$emit("close");
    },
    cancel() {
      this.date = ["", ""];
      this.step = 1;
      this.$emit("cancel", ["", ""]);
    },
  },
  watch: {
    value(value) {
      let [date1, date2] = value;
      this.date = [date1, date2];
      if (!this.isSelected) {
        this.step = 1;
      }
    },
  },
};
</script>

<style>
.slide-fade-enter-active {
  transition: all 1.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.date-head {
  position: relative;
  top: 5px;
  z-index: 1;
}
</style>
