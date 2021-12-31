<template>
  <div>
    <div>
      <panel-subtitle icon="mdi-filter" title="Filters" />
    </div>
    <div class="d-flex py-1">
      <agent-selector @change="filters.agentId = $event" class="mr-2" />
      <status-selector @change="filters.status = $event" class="mr-2" />
      <!-- <time-picker @change="filters.timePicker = $event" class="mr-2" /> -->
    </div>
  </div>
</template>

<script>
import AgentSelector from "./AgentSelector.vue";
import PanelSubtitle from "../PanelSubtitle.vue";
import StatusSelector from "./StatusSelector.vue";
// import TimePicker from "./TimePicker.vue";
export default {
  components: { AgentSelector, StatusSelector, PanelSubtitle /* TimePicker */ },
  name: "AppointmentFilters",
  data: () => ({
    filters: {
      agentId: null,
      status: null,
      // timePicker: null,
    },
  }),
  watch: {
    filters: {
      handler() {
        this.$emit("change", this.filters);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
