<template>
  <div class="app">
    <DaysSinceLastRecord
        v-if="store.currentRecords.length > 0"
        :date="now"
        :records="store.currentRecords"
    />
    <div class="year-box">
        <Day
            :key="i"
            v-for="(day, i) in store.days"
            :records="day.records"
            :year="year"
            :day="i + 1"
        />
    </div> 
  </div>
</template>

<script lang="ts">
import format from 'time-js/format';
import dayOfYear from 'time-js/dayOfYear';
import store from '@/store';
import Day from './Day.vue';
import DaysSinceLastRecord from './DaysSinceLastRecord.vue';
import { Component, Vue } from 'vue-property-decorator';
import { observe } from 'mobx';
import {
    Observer,
} from 'mobx-vue';
@Observer
@Component({
  components: {
      Day,
      DaysSinceLastRecord,
  },
})
export default class App extends Vue {
    store = store;
    year = (new Date()).getFullYear();
    disposer: any;

    mounted() {
        this.disposer = observe(this.store.title, (delta: any) => {
            document.title = delta.object;
        });
        document.title = store.title;
    }

    destroyed() {
        this.disposer();
    }

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
