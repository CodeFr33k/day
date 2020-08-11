<template>
    <DaysSinceLastRecord 
        :records="records"
        :date="date"
    ></DaysSinceLastRecord>
</template>

<script lang="ts">
import Record from 'caml-js/Record';
import DaysSinceLastRecord from './DaysSinceLastRecord.vue';
import {
    Component,
    Vue,
} from 'vue-property-decorator';

@Component({
    components: { DaysSinceLastRecord },
})
export default class extends Vue {
    records: Record[] = []; 
    date = '2020-202'; 
    created() {
        const record = new Record;
        record.annotations.push({
            key: 'date',
            value: '2020-200',
        });
        this.records.push(record);
    }
};
</script>

