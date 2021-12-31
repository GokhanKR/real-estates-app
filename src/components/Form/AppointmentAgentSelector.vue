<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    max-width="500"
    scrollable
    :return-value="agent"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-on="on"
        v-bind="attrs"
        :value="agentName"
        readonly
        solo
        hint="Select an agent"
        persistent-hint
        outlined
        prepend-inner-icon="mdi-account-tie"
        rounded
        dense
        label="Select Agent"
        required
        :rules="inputRules"
      ></v-text-field>
    </template>
    <v-card>
      <v-card-title
        class="text-subtitle-1 text-center primary white--text d-block pb-4"
      >
        Select an Agent
      </v-card-title>
      <v-card-text class="grey lighten-2 pt-5">
        <div
          :key="key"
          v-for="(agent, key) in agentsList"
          class="text-center mb-2"
        >
          <v-chip
            @click="selectAgent(agent.agent_id)"
            color="white elevation-1 px-5 primary--text"
          >
            <v-icon left>mdi-account-tie</v-icon>
            {{ agent.agent_name.toString() }}
            {{ agent.agent_surname.toString() }}</v-chip
          >
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small text color="primary" @click="modal = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AppointmentAgentSelector",
  props: {
    value: Number,
    inputRules: Array,
    setAgentId: String,
  },
  data: () => ({
    agent: null,
    modal: false,
  }),
  computed: {
    /**
     * @returns {Array}
     */
    agentsList() {
      return this.$store.state.Agents.agentsList;
    },
    /**
     * @returns {Object}
     */
    refDialog() {
      return this.$refs.dialog;
    },
    /**
     * @returns {String}
     */
    agentName() {
      return this.agent
        ? `${this.agent.agent_name.toString()} ${this.agent.agent_surname.toString()}`
        : "";
    },
  },
  methods: {
    selectAgent(agentId) {
      this.agent = this.agentsList.find((o) => o.agent_id == agentId);
      this.$emit("change", this.agent);
      this.refDialog.save(this.agent);
    },
  },
  created() {
    /**
     * Load agents list
     */
    if (!this.agentsList.length) {
      this.$store.dispatch("Agents/getAgents");
    }

    if (this.setAgentId) {
      this.$store.dispatch("Agents/getAgent", this.setAgentId).then((res) => {
        if (res.status === 200) {
          this.selectAgent(res.data.agent_id);
        }
      });
    }
  },
  watch: {
    value() {
      this.selectAgent(this.value);
    },
  },
};
</script>

<style></style>
