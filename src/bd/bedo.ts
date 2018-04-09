import {Contract} from 'web3/types';
import sqliteParser  from 'sqlite-parser';

import Statement from './statement';

export class BEDO {
    private contract: Contract;

    constructor(contract: Contract) {
        this.contract = contract;
    };

    exec = (query: string): Promise<any> => {
        const tree = sqliteParser(query);
        const statement = new Statement(tree.statement[0], this.contract);
        return statement.getExhaust();
    }
}