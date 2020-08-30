<template>
    <div
        class="day-box"
       :class="{ 'has-records': records.length, active: isToday }"
    >
     <div class="day">{{ day }}</div>
     <div class="label">{{ label }}</div>
    </div>
</template>

<script lang="ts">
import Record from 'caml-js/Record';
import dayOfYear from 'time-js/dayOfYear';
import {
    Component,
    Vue,
    Prop,
} from 'vue-property-decorator';
import {
    Observer,
} from 'mobx-vue';
@Observer
@Component
export default class App extends Vue {
    @Prop() readonly records!: Record[];
    @Prop() readonly year!: number;
    @Prop() readonly day!: number;

    get label() {
        let result = '';
        for(const record of this.records) {
            for(const data of record.userData) {
                if(data.key !== 'day label') {
                    continue;
                }
                result = data.value;
            }
        }
        return result;
    }

    get isToday() {
        const now = new Date();
        if(now.getFullYear() !== this.year) {
            return false;
        }
        const today = dayOfYear(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );
        if(today !== this.day) {
            return false;
        }
        return true;
    }

}

</script>

<style lang="sass">
.day-box
    position: relative
    border: 1px solid #999 
    text-align: center
    box-sizing: border-box
    width: 50px
    height: 24px
    margin: 1px

.has-records
    background: #C6E2FF	

.active
    border-color: #3e82c7 
    border-width: 2px

.day
    position: absolute
    top: 0
    left: 0
    background: inherit
    font-size: 12px
    line-height: 12px
    padding: 1px

.label
    position: absolute
    bottom: 0
    right: 0
    background: inherit
    font-size: 14px
    line-height: 14px
    padding: 1px

</style>
