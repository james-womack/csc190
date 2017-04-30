﻿import { Platform, Utils, Toast } from 'quasar'
import { Clone, ResolveRoute, GlobalBus } from '../scripts/Utility'


let tableConfig = {
    rowHeight: '50px',
    title: 'Vendors',
    refresh: true,
    columnPicker: true,
    leftStickyColumns: 1,
    rightStickyColumns: 2,
    responsive: true,
    pagination: {
        rowsPerPage: 15,
        options: [5, 10, 15, 30, 50, 500]
    },
    selection: 'multiple',
    messages: {
        noData: '<i>warning</i> Data there is not.',
        noDataAfterFiltering: '<i>warning</i> Results are no, search terms redefine you must.'
    }
};

let tableColumns = [
    {
        label: 'Name',
        field: 'name',
        width: '80px',
        filter: true,
        sort: 'string'
    },
    {
        label: 'Phone',
        field: 'phoneNumber',
        width: '100px',
        filter: true,
        sort: 'string'
    },
    {
        label: 'Address',
        field: 'address',
        width: '200px',
        filter: true,
        sort: 'string'
    }
];

export default {
    data() {
        return {
            table: [],
            config: tableConfig,
            columns: tableColumns
        };
    },
    methods: {
        refresh(done) {
            this.getNewData().then(obj => {
                this.table = this.toTableFormat(obj);
                done();
            });
        },
        getNewData() {
            return this.$http.get('http://localhost:5000/api/vendor').then(response => {
                const resp = response.json();
                console.log(response.status);
                return resp;
            },
                err => {
                    log(err);
                });
        },
        toTableFormat(obj) {
            const newData = [];
            for (let val of obj) {
                newData.push({
                    name: val.name,
                    id: val.id,
                    address: `${val.streetAddress}, ${val.city} ${val.state}, ${val.zipCode}`,
                    phoneNumber: val.phone
                });
            }
            console.log(newData)
            return newData;
        }
    },
    mounted() {
        const resp = this.getNewData();
        resp.then(obj => {
            this.table = this.toTableFormat(obj);
        });
    }
}