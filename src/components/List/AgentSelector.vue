<template>
  <div>
    <div>
      <chip
        border-size="1"
        @click="openAgentsDialog"
        small
        class="pl-2"
        :active="isAgent"
      >
        <strong class="d-inline-block mr-2">
          <v-icon color="primary" size="16">mdi-account-tie</v-icon>
          Agent:</strong
        >
        <span v-if="getAgent">
          {{ getAgent.agent_name.toString() }}
          {{ getAgent.agent_surname.toString() }}
        </span>
        <span v-else class="secondary--text">Select</span>
        <span v-show="isAgent" class="ml-1">
          <v-tooltip color="primary" bottom>
            <template #activator="{ on, attrs }">
              <v-icon
                v-on="on"
                v-bind="attrs"
                right
                size="15"
                color="primary"
                @click="clearAgent($event)"
                >mdi-close-circle</v-icon
              >
            </template>
            <span>Clear</span>
          </v-tooltip>
        </span>
      </chip>
    </div>
    <v-dialog v-model="dialog" max-width="450">
      <v-card>
        <v-card-title class="primary white--text">
          <div class="text-subtitle-1">
            <v-icon dark size="22" left>mdi-magnify</v-icon>
            Select an agent
          </div>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="grey lighten-2 py-3">
          <v-chip-group active-class="primary--text" column v-model="agent">
            <v-chip
              v-for="(agent, key) in agentsList"
              :key="key"
              color="white"
              label
              class="elevation-1"
              :value="agent.id"
              @click="setAgent"
            >
              {{ agent.agent_name.toString() }}
              {{ agent.agent_surname.toString() }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="dialog = false" color="red darken-2" dark>
            <v-icon size="18">mdi-close</v-icon>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Chip from "../Base/Chip.vue";
export default {
  components: { Chip },
  name: "AgentSelector",
  data: () => ({
    dialog: false,
    agent: null,
  }),
  computed: {
    /**
     * @returns {Array}
     */
    agentsList() {
      return this.$store.state.Agents.agentsList
    },
    /**
     * @returns {String}
     */
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary;
    },
    /**
     * @returns {Object}
     */
    getAgent() {
      return this.agentsList.find((o) => o.id == this.agent);
    },
    /**
     * @returns {Boolean}
     */
    isAgent() {
      return !!this.agent;
    },
  },
  created() {
    /**
     * Load agents list
     */
    if (!this.agentsList.length) {
      this.$store.dispatch("Agents/getAgents");
    }
  },
  methods: {
    openAgentsDialog() {
      this.dialog = true;
    },
    setAgent() {
      this.dialog = false;
    },
    clearAgent(e) {
      e.stopPropagation();
      this.agent = null;
    },
  },
  watch: {
    agent() {
      this.$emit("change", this.agent);
    },
  },
};
</script>

<style></style>
