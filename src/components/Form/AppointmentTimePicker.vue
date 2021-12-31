<template>
  <div>
    <div
      class="primary mx-5 text-center text-subtitle-2 py-1 white--text rounded-tl-lg rounded-tr-lg"
    >
      Choose time for appointment
    </div>
    <v-time-picker
      :value="value"
      @change="emitValue"
      @input="emitValue"
      full-width
      @update:period="period"
      ref="timePicker"
      :disabled="disabled"
    >
    </v-time-picker>
    <v-text-field
      type="hidden"
      class="d-none"
      :value="value"
      :rules="inputRules"
      required
    ></v-text-field>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    inputRules: Array,
    disabled: Boolean
  },
  name: "AppointmentTimePicker",
  data: () => ({
    time: null,
  }),
  methods: {
    emitValue(value) {
      this.$emit("input", value);
      this.value;
    },
    period(data) {
      this.$emit("period", data);
    },
  },
};
</script>

<style></style>
