export default {
    methods: {
        refresh (done) {
            done();
        }
    },
    data() {
        return {
            table: [
                {
                    name: 'Costco',
                    address: '123 wallaby street',
                    phoneNumber: '123'
                },
                {
                    name: 'wallstreet',
                    address: '123 wing street',
                    phoneNumber: '456'
                },
                {
                    name: 'wallmart',
                    address: '123 king street',
                    phoneNumber: '3233'
                },
                {
                    name: 'Sams',
                    address: '123 butt street',
                    phoneNumber: '23445'
                }
            ],
            config: {
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
            },
            columns: [
                {
                    label: 'Vendor name',
                    field: 'name',
                    width: '100px',
                    filter: true,
                    sort: 'string'
                },
                {
                    label: 'Address',
                    field: 'address',
                    width: '150px'
                },
                {
                    label: 'Phone number',
                    field: 'phoneNumber',
                    width: '100px'
                }
            ]
        }
    }
}