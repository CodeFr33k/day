<template>
  <div class="app">
    <DaysSinceLastRecord
        :date="now"
        :records="store.currentRecords"
    />
    <div class="year-box">
        <Day
            :key="i"
            v-for="(day, i) in days"
            :records="day.records"
            :year="year"
            :day="i + 1"
        />
    </div> 
  </div>
</template>

<script lang="ts">
import store from 'caml-js/store';
import format from 'time-js/format';
import dayOfYear from 'time-js/dayOfYear';
import Day from './Day.vue';
import DaysSinceLastRecord from './DaysSinceLastRecord.vue';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  components: {
      Day,
      DaysSinceLastRecord,
  },
})
export default class App extends Vue {
    store = store;
    year = (new Date()).getFullYear();
    get now() {
        const now = new Date();
        const day = dayOfYear(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );
        return format(
            now.getFullYear(),
            day,
        );
    }
    get days() {
        const days = [];
        for(const day of Array(360).keys()) {
            days.push({
                records: [],
            });
        }
        for(const record of this.store.currentRecords) {
            const date = record.annotations.find((annotation: any) => {
                return annotation.key === 'date';
            });
            if(!date) {
                continue;
            }
            const match = date.value.match(/^\d{4}-(\d{3})/);
            if(!match) {
                continue;
            }
            const day = match[1];
            (days[day - 1].records as any).push(record);
        }
        return days;
    }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap')
html
    height: 100%

body
    margin: 0
    height: 100%
    font-family: 'roboto'

.app
    height: 100%
    display: flex
    flex-direction: column

.days-since-last-record-box
    margin-left: 1px

.year-box
    display: flex
    flex-wrap: wrap
    height: 100%

.day-box
    display: inline-block
    flex: calc(6.6% - 2px) 
    height: calc(4.16% - 2px)

</style>
