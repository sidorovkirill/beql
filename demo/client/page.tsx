import React, {Component} from 'react';
import Web3 from 'web3';
import axios from 'axios';
import {BEDO} from '../../src/bd/bedo';

export default class Page extends Component<null, null> {
    constructor(props) {
        super(props);
        const query = 'SELECT `IN`.`returnValues`.`notary`,`IN`.`returnValues`.`parent` FROM `NotaryInvited` AS `IN` WHERE `IN`.`notary` = 2';

        axios.get('abi/abi-notary.json')
            .then(({data: abi}) => {
                const web3 = new Web3('wss://midhub.getmobileup.com/wsgeth/:8545');
                return new web3.eth.Contract(abi, '0x34ab6f233453e4fbDAa72628a3B80Ea4bCCA1ce2');
            })
            .then(contract => {
                const DBH = new BEDO(contract);
                DBH.exec(query)
                    .then(events => console.log(events))
            })
            .catch(console.error);
    }

    render() {
        return <div></div>;
    }
}
