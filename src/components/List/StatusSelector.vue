<template>
  <div>
    <v-menu offset-y left>
      <template #activator="{ on, attrs }">
        <chip
          border-size="1"
          v-on="on"
          v-bind="{ ...attrs, active: isStatus }"
          small
          class="pl-2"
        >
          <strong class="d-inline-block mr-2">
            <v-icon color="primary" size="16">mdi-list-status</v-icon>
            Status:
          </strong>

          <v-sheet
            v-if="status === null"
            color="primary"
            dark
            x-small
            class="status-text px-2"
            rounded="xl"
            >All</v-sheet
          >
          <v-sheet
            v-else-if="status"
            color="transparent"
            dark
            x-small
            class="status-text success--text font-weight-bold px-2"
            rounded="sm"
            >Active</v-sheet
          >
          <v-sheet
            v-else
            color="transparent"
            dark
            x-small
            class="status-text error--text font-weight-bold px-2"
            rounded="sm"
            >Passive</v-sheet
          >

          <span v-show="isStatus" class="ml-1">
            <v-tooltip color="primary" bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-on="on"
                  v-bind="attrs"
                  right
                  size="15"
                  color="primary"
                  @click="clearStatus($event)"
                  >mdi-close-circle</v-icon
                >
              </template>
              <span>Clear</span>
            </v-tooltip>
          </span>
        </chip>
      </template>
      <v-list class="py-0 transparent elevation-0">
        <v-list-item
          ripple
          class="status-list-item grey lighten-2 elevation-0"
          @click="setStatus(true)"
        >
          <v-list-item-content class="py-1">
            <v-sheet
              dark
              color="success"
              rounded="xl"
              class="text-subtitle-2 text-center px-2"
              >Active</v-sheet
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          ripple
          class="status-list-item elevation-0"
          @click="setStatus(false)"
        >
          <v-list-item-content class="py-0">
            <v-sheet
              dark
              color="red darken-2"
              rounded="xl"
              class="text-subtitle-2 text-center px-2"
              >Passive</v-sheet
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import Chip from "../Base/Chip.vue";
export default {
  components: { Chip },
  name: "StatusSelector",
  data: () => ({
    status: null,
  }),
  computed: {
    isStatus() {
      return typeof this.status == "boolean";
    },
  },
  methods: {
    setStatus(status) {
      this.status = status;
    },
    clearStatus(e) {
      this.status = null;
      e.stopPropagation();
    },
  },
  watch: {
    status() {
      this.$emit("change", this.status);
    },
  },
};
</script>

<style>
.status-text {
  font-size: 10px;
}
.status-list-item {
  padding: 0;
  min-height: auto !important;
}
</style>
