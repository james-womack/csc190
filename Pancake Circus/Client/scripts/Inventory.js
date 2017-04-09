import { Platform, Utils, Toast } from 'quasar'

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
}

let tableData = [
    {
        Name: "Eggs",
        Location: "Shelf A1 Sauce",
        AmtLeft: 20,
        Vendor: "Vendor A"
    },
    {
        Name: "Flour",
        Location: "Shelf A2 Sauce",
        AmtLeft: 15,
        Vendor: "Vendor B"
    },
    {
        Name: "Milk",
        Location: "Shelf Siracha",
        AmtLeft: 10,
        Vendor: "Vendor A"
    },
    {
        Name: "Cereal",
        Location: "Shelf BBQ Sauce",
        AmtLeft: 69,
        Vendor: "Vender B"
    },
]

let tableColumns = [
    {
        label: 'Name',
        field: 'Name',
        width: '100px',
        filter: true,
        sort: 'string'
    },
    {
        label: 'Location',
        field: 'Location',
        width: '80px',
        filter: true,
        sort: 'string'
    },
    {
        label: 'Amount Left',
        field: 'AmtLeft',
        width: '80px',
        filter: true,
        sort: 'number'

    },
    {
        label: 'Vendor',
        field: 'Vendor',
        width: '150px',
        filter: true,
        sort: 'string'
    }
]

export default {
  data() {
      return {
          table: tableData,
          config: tableConfig,
          columns: tableColumns
      }
  },
  methods: {
      refresh (done) {
          Toast.create('You hit the refresh button')
          this.timeout = setTimeout(() => {
              done()
          }, 5000)
      }
  }
}