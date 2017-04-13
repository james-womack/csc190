﻿import { Platform, Utils, Toast, Dialog } from 'quasar'

let tableConfig = {
    rowHeight: '50px',
    title: 'Inventory',
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
        width: '100px',
        filter: true,
        sort: 'string'
    },
    {
        label: 'Location',
        field: 'location',
        width: '80px',
        filter: true,
        sort: 'string'
    },
    {
        label: 'Amount Left',
        field: 'amount',
        width: '80px',
        filter: true,
        sort: 'number'

    },
    {
        label: 'Vendor',
        field: 'vendor',
        width: '150px',
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
        deleteRows(props) {
            let str = '';
            let propsToDelete = []
            let _this = this;
            props.rows.forEach(row => {
                str += `${row.data.name}, `
                propsToDelete.push({
                    itemId: row.data.itemId,
                    vendorId: row.data.vendorId
                })
            })
            Dialog.create({
                title: 'Confirm Deletion',
                message: `This will delete these items from stock: [${str.substr(0, str.length - 2)}]`,
                icon: 'warning',
                buttons: [
                    {
                        label: 'OK',
                        handler() {
                            let resp = _this.$http.delete('http://localhost:5000/api/stock', { body: propsToDelete })
                            resp.then(r => {
                                props.rows.forEach(row => {
                                    _this.table.splice(row.index, 1)
                                    console.log(row)
                                })
                                Toast.create(`Deleted ${propsToDelete.length} rows...`)
                            },
                            e => {
                                Toast.create('Failed to delete rows...')
                            })
                        }
                    },
                    {
                        label: 'Cancel',
                        handler() {
                            Toast.create('Cancelled...')
                        }
                    }

                ]
            })
            
        },
        editRows(props) {
            
        },
        refresh (done) {
            this.getNewData().then(obj => {
                this.table = toTableFormat(obj);
                done();
            });
        },
        getNewData() {
            return this.$http.get('http://localhost:5000/api/stock').then(response => {
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
                    name: val.item.name,
                    amount: val.amount,
                    location: val.location,
                    vendor: val.vendor.name,
                    vendorId: val.vendor.id,
                    itemId: val.item.id
                });
            }
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