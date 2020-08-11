<template>
    <div
        class="days-since-last-record-box"
    >
        <div class="text">Days since <br /> last record</div>
        <div class="days-since-last-record">{{ daysSinceLastRecord }}</div>
    </div>
</template>

<script lang="ts">
import Record from 'caml-js/Record';
import toSeconds from 'time-js/toSeconds';
import {
    Component,
    Vue,
    Prop,
} from 'vue-property-decorator';
@Component
export default class App extends Vue {
    @Prop() readonly records!: Record[];
    @Prop() readonly date!: string;
    get daysSinceLastRecord() {
        let lastDate = '1970-001';
        for(const record of this.records) {
            const annotation = record.annotations.find((annotation) => {
                return annotation.key === 'date';     
            });
            if(!annotation) {
                continue;
            }
            const match = annotation.value.match(/^\d{4}-(\d{3})/);
            if(!match) {
                continue;
            }
            const a = toSeconds(annotation.value);
            const b = toSeconds(lastDate);
            if(a > b) {
                lastDate = annotation.value;
            }
        }
        const x = toSeconds(lastDate);
        const y = toSeconds(this.date);
        const delta = y - x;
        return delta / 60 / 60 / 24;
    }
}
</script>

<style lang="sass">
@import '@/common.sass'

.days-since-last-record-box
    display: flex
    width: 140px

.text
    line-height: 20px

.days-since-last-record
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    flex: 1
    font-size: 30px
    font-weight: 600

</style>
