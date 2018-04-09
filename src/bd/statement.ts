import {Contract, EventLog} from 'web3/types';
import {StatementTree, Unit} from '../interfaces/statement-tree';
import findIndex from 'lodash-es/findIndex';
import has from 'lodash-es/has';
import get from 'lodash-es/get';
import set from 'lodash-es/set';

export default class Statement {
    private contract: Contract;
    private tree: StatementTree;
    private tables: Unit[];

    constructor(tree: StatementTree, contract: Contract) {
        this.contract = contract;
        this.tree = tree;
        this.decomposeTree(tree);
    }

    decomposeTree(tree) {
        this.parseTablesNamespace(tree);
    }

    parseTablesNamespace(tree) {
        //TODO Нужно разобрать from для случаев когда идет объединение таблиц
        this.tables = [tree.from];
    }

    getExhaust() {
        const {from} = this.tree;
        const eventsPr = this.contract.getPastEvents(from.name, {fromBlock: 0});
        //TODO Реализовать запрос нескольких ивентов, когда идет объединение таблиц
        return this.needsAllEvents() ?
            eventsPr :
            this.assembleResult(eventsPr);
    }

    needsAllEvents() {
        const {result} = this.tree;
        return result.length === 1 && result[0].name === '*';
    }

    assembleResult(eventsPr: Promise<any>) {
        const {result} = this.tree;
        return eventsPr.then((events: EventLog[]) => {
            //TODO Реализовать выделение подсписка когда в списке возвращамых полей будут поля из разных таблиц
            return events.map((event: EventLog) => this.getRecord(event, result as Unit[]));
        })
    }

    getRecord = (event: EventLog, resultUnits: Unit[]) => {
        return resultUnits.reduce((acc, resUnit) => {
            const pathParts = resUnit.name.split('.');
            let path = this.getNonSpecifiedAddress(pathParts);
            if(has(event,path)){
                set(acc, pathParts.slice(-1*(pathParts.length-1)), get(event, path));
            } else {
                throw Error(`Event ${event.event} do not have value by path '${path}'.`);
            }
            return acc;
        },{});
    };

    getNonSpecifiedAddress(parts: string[]){
        let path = '';
        if(this.isNoSpecifiedColumn(parts)){
            if(this.tables.length === 1) {
                path = parts.join('.');
            } else {
                throw Error(`Field '${parts.join('.')}' should be specified for one of any tables.`);
            }
        } else {
            path = parts.slice(-1*(parts.length-1)).join('.');
        }

        return path;
    }

    isNoSpecifiedColumn(parts: string[]) { //column name does not have table name
        return parts.length === 1 ?
            true :
            !~findIndex(this.tables, {name: parts[0]}) && !~findIndex(this.tables, {alias: parts[0]});
    }
}