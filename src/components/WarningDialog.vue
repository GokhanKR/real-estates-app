<template>
  <v-dialog max-width="500" v-model="value" @click:outside="close">
    <v-card>
      <v-card-title class="error white--text text-body-1">
        <v-icon color="white" size="20" left>mdi-alert</v-icon>
        Warning
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text-subtitle-2 secondary--text pt-5">
        <slot></slot>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot v-if="$scopedSlots.actions" name="actions" :close="close"> </slot>
        <v-btn v-else small color="error" @click="close">
          <v-icon left>mdi-check-circle</v-icon> OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "WarningDialog",
  props: {
    value: Boolean,
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
  },
};
</script>

<style></style>
