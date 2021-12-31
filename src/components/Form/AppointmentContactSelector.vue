<template>
  <v-dialog max-width="500" v-model="modal">
    <template #activator="{ on, attrs }">
      <v-btn v-on="on" v-bind="attrs" color="primary" class="text-capitalize">
        <v-icon left>mdi-view-list-outline</v-icon>

        <!-- Detail Text -->
        <div v-if="!model">Select Contact from Contacts List</div>
        <div v-else>Selected Contact: {{ model.contact_name.toString() }} {{ model.contact_surname.toString() }}</div>
        <!-- ./Detail Text -->

        <!-- Clear Button -->
        <v-btn
          v-show="model"
          fab
          small
          dark
          color="white"
          class="ml-4"
          @click="clear($event)"
        >
          <v-icon size="24" color="primary">mdi-close</v-icon>
        </v-btn>
        <!-- ./Clear Button -->
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="primary white--text text-body-1 pb-4">
        <v-icon left dark>mdi-view-list-outline</v-icon>
        Select Contact
        <v-spacer></v-spacer>
        <v-btn icon dark @click="modal = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-6">
        <v-autocomplete
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          :hide-no-data="!items.length"
          no-data-text="Contact not found"
          item-text="name"
          item-value="API"
          label="Search in Contact List"
          placeholder="Contact name and surname"
          prepend-icon="mdi-text-box-search"
          return-object
        ></v-autocomplete>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!model" color="primary" @click="modal = false">
          <v-icon left> mdi-check-outline </v-icon>
          OK
        </v-btn>
        <v-btn :disabled="!model" color="primary" @click="model = null">
          <v-icon left> mdi-close-circle </v-icon>
          Clear
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AppointmentContactSelector",
  props: {
    setContactId: String,
  },
  data: () => ({
    modal: false,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
  }),
  computed: {
    /**
     * @returns {Array}
     */
    contactsList() {
      return this.$store.state.Contacts.contactsList;
    },
    /**
     * @returns {Array}
     */
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
    },
    /**
     * @returns {Array}
     */
    items() {
      return this.entries.map((entry) => {
        return Object.assign({}, entry, {
          name:
            entry.contact_name.toString() +
            " " +
            entry.contact_surname.toString(),
        });
      });
    },
  },
  methods: {
    clear(e) {
      e.stopPropagation();
      this.model = null;
    },
  },
  watch: {
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      this.$store
        .dispatch("Contacts/getContacts")
        .then(() => {
          this.count = this.contactsList.length;
          this.entries = this.contactsList;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
    model() {
      this.$emit("change", this.model);
    },
    setContactId() {
      this.$store.dispatch("Contacts/getContact", this.setContactId).then((res) => {
        if (res.status === 200) {
          this.model = res.data;
        }
      }).catch((err) => {
        console.error(err);
      });
    },
  },
};
</script>

<style></style>
