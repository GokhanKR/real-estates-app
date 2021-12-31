<template>
  <div>
    <panel-subtitle icon="mdi-calendar" title="Date" />
    <v-sheet id="dateWrapper" elevation="0" color="transparent">
      <v-chip-group mandatory v-model="select">
        <v-menu ref="dateSelectMenu" offset-y :close-on-content-click="false">
          <template #activator="{ on, attrs }">
            <chip
              v-on="on"
              v-bind="attrs"
              :value="null"
              small
              :active="isSelectedDate(null)"
              class="font-weight-medium"
            >
              <strong class="d-inline-block mr-2">
                <v-icon color="primary" size="14">mdi-calendar-range</v-icon>
                Date:
              </strong>
              <span v-if="isSelectDateMenu">
                {{ getSelectDateMenu }}
              </span>
              <span v-else class="secondary--text">Select</span>
              <span v-show="isSelectDateMenu" class="ml-1">
                <v-tooltip color="primary" bottom>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      v-on="on"
                      v-bind="attrs"
                      right
                      size="15"
                      color="primary"
                      @click="clearSelectDate($event)"
                      >mdi-close-circle</v-icon
                    >
                  </template>
                  <span>Clear</span>
                </v-tooltip>
              </span>
            </chip>
          </template>
          <date-picker
            v-model="selectMenuDate"
            @cancel="selectDateMenuRef.save()"
            @close="selectDateMenuRef.save()"
          />
        </v-menu>
        <v-badge
          offset-x="23"
          offset-y="10"
          :value="countBadges(key)"
          :content="countBadges(key)"
          v-for="(tag, key) in dateList"
          :key="key"
        >
          <chip
            small
            :active="isSelectedDate(key)"
            :value="key"
            @click="clearSelectDate"
          >
            {{ tag | filterDay }}
          </chip>
        </v-badge>
        <v-badge
          offset-x="23"
          offset-y="10"
          :value="countBadges(7)"
          :content="countBadges(7)"
        >
          <chip
            small
            :value="7"
            :active="isSelectedDate(7)"
            class="font-weight-medium"
          >
            Next Week
          </chip>
        </v-badge>
        <v-badge
          offset-x="23"
          offset-y="10"
          :value="countBadges(8)"
          :content="countBadges(8)"
        >
          <chip
            small
            :value="8"
            :active="isSelectedDate(8)"
            class="font-weight-medium"
          >
            Next Month
          </chip>
        </v-badge>
      </v-chip-group>
    </v-sheet>
  </div>
</template>

<script>
/* eslint-disable */
import Chip from "../Base/Chip.vue";
import PanelSubtitle from "../PanelSubtitle.vue";
import DatePicker from "./DatePicker.vue";

export default {
  components: { Chip, PanelSubtitle, DatePicker },
  name: "DatePickerHorizontal",
  data: () => ({
    select: "",
    dateList: [],
    dateRanges: [],
    selectDate: new Date(),
    badgeList: {},
    selectMenuDate: ["", ""],
  }),
  filters: {
    /**
     * Take the timestamp and generate
     * the days of the week from each
     */
    filterDay(timeStamp) {
      let day = new Date(timeStamp).getDate(),
        isNow = day == new Date(Date.now()).getDate();

      if (isNow) {
        return "Today";
      } else {
        return new Intl.DateTimeFormat("en-GB", {
          weekday: "long",
        }).format(new Date(timeStamp));
      }
    },
  },
  computed: {
    selectedDate() {
      return this.selectDate;
    },
    /**
     * @returns {Object}
     */
    selectDateMenuRef() {
      return this.$refs.dateSelectMenu;
    },
    isSelectDateMenu() {
      return this.selectMenuDate[0] && this.selectMenuDate[1];
    },
    getSelectDateMenu() {
      return (
        this.formatDate(this.selectMenuDate[0]) +
        " - " +
        this.formatDate(this.selectMenuDate[1])
      );
    },
    today() {
      let today = new Date().getDay();
      return today == 0 ? 6 : today - 1;
    },
  },
  methods: {
    formatDate(date) {
      if (date) {
        let d = date.split("-");
        return `${d[2]}/${d[1]}/${d[0]}`;
      } else {
        return null;
      }
    },
    isSelectedDate(key) {
      return this.select === key;
    },
    countBadges(key) {
      return this.badgeList[key] ? this.badgeList[key].length : null;
    },
    clearSelectDate(e = null) {
      if (e) e.stopPropagation();
      this.select = this.today;
      this.selectMenuDate = ["", ""];
    },
  },
  created() {
    /**
     * Set date range of last week
     */
    let day = 86400000,
      now = Date.now(),
      week = new Date(now - new Date(now).getDay() * day);

    for (let i = 0; i < 7; i++) {
      week.setDate(week.getDate() + 1);
      week.setHours(0, 0, 0);
      this.dateList.push(week.getTime());
    }

    // Set today
    this.select = this.today;

    // set dates
    let dateList = [];
    this.dateList.forEach((date) => {
      let start = new Date(date);

      let end = new Date(date);
      end.setDate(start.getDate() + 1);

      dateList.push({
        start: start.toString(),
        end: end.toString(),
      });
    });

    // Set next week chip
    let nextWeek = this.dateList[this.dateList.length - 1],
      nextWeekDateStart = new Date(nextWeek + day),
      nextWeekDateEnd = new Date(nextWeek + day);
    nextWeekDateEnd.setDate(nextWeekDateEnd.getDate() + 7);

    dateList.push({
      start: nextWeekDateStart.toString(),
      end: nextWeekDateEnd.toString(),
    });

    // Set next month chip
    let nextMonthDateStart = new Date(nextWeekDateEnd),
      nextMonthDateEnd = new Date(nextWeekDateEnd);

    nextMonthDateStart.setMonth(nextMonthDateStart.getMonth() + 1);
    nextMonthDateStart.setDate(1);
    nextMonthDateEnd.setMonth(nextMonthDateStart.getMonth() + 1);
    nextMonthDateEnd.setDate(1);

    dateList.push({
      start: nextMonthDateStart.toString(),
      end: nextMonthDateEnd.toString(),
    });

    // Ranges for all dates
    this.dateRanges = dateList;

    // Get appointments by date
    this.$store
      .dispatch("Appointments/getAppointmentsByDate", dateList)
      .then((res) => {
        this.badgeList = res.data.list;
      });
  },
  watch: {
    select: {
      handler() {
        if (this.select == null) return;

        this.$nextTick(() => {
          this.$emit("change", {
            select: this.select,
            range: this.dateRanges[this.select],
          });
        });
      },
      immediate: true,
    },
    selectMenuDate(date) {
      if (this.isSelectDateMenu) {
        let date1 = new Date(date[0]);
        date1.setHours(0, 0, 0);
        let date2 = new Date(date[1]);
        date2.setHours(0, 0, 0);

        this.$emit("change", {
          select: null,
          range: { start: date1, end: date2 },
        });
      }
    },
  },
};
</script>

<style>
#dateWrapper .v-slide-group__wrapper {
  padding-top: 10px;
}
</style>
