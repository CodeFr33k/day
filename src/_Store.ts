import {
    computed,
    observable,
    observe,
} from 'mobx';
import Reader from 'caml-js/Reader';
import RecordsFactory from 'caml-js/RecordsFactory';
import Record from 'caml-js/Record';
import Manifest from 'caml-js/Manifest';
import * as Util from 'caml-js/util';
import * as Uri from 'caml-js/Uri';

export default class Store {
    reader: Reader;
    records: any;
    disposer: any;
    handler: any;
    @observable title: any = observable.box('App');
    @observable reducers: any = [];
    @observable htmls: any = [];

    constructor() {
        this.reader = new Reader();
        this.records = RecordsFactory.create();
        this.disposer = observe(this.reader.lines, (delta: any) => {
            this.records.load(delta.object);
        });
        this.handler = {
            'js': this.loadJavascript.bind(this),
            'caml': this.loadCaml.bind(this),
            'html': this.loadHtml.bind(this),
        }
    }
    
    close() {
        this.disposer();
    }

    @computed get currentRecords() {
        let records: any[] = [...this.records];
        for(const reducer of this.reducers) {
            records = reducer(records);
        }
        return records; 
    }

    @computed get days() {
        const days = [];
        for(const day of Array(360).keys()) {
            days.push({
                records: [],
            });
        }
        for(const record of this.currentRecords) {
            for(const data of record.userData) {
                if(data.key !== 'date') {
                    continue;
                }
                const match = data.value.match(/^\d{4}-(\d{3})/);
                if(!match) {
                    continue;
                }
                const day = match[1];
                (days[day - 1].records as any).push(record);
            }
        }
        return days;
    }

    loadCaml(text: string) {
        for(let i = 0; i < text.length; i++) {
            const char = text.substr(i, 1);
            this.reader.read(char);
        }
        this.reader.end();
    }

    loadJavascript(text: string) {
        const reducer = Util.evalFn(text);
        this.addReducer(reducer);
    }

    loadHtml(text: string) {
        const html = 'data:text/html;charset=utf-8,' + escape(text);
        this.htmls.push(html);
    }

    addReducer(reducer: any) {
        this.reducers.push(reducer);
    }

    async loadManifest(uri: string) {
        const manifest = await Manifest.fetch(uri)
        const files = manifest.toFiles();
        this.title.set(files[0]);
        for(const file of files) {
            const fileuri = uri.replace(/[^\\/]+$/, file);
            this.loadFile(fileuri);
        }
    }

    async loadFile(file: any) {
        const ext: string | undefined = Util.parseExt(file);
        const text = await Uri.fetchText(file);
        if(ext) {
            this.handler[ext](text); 
        }
    }

}

