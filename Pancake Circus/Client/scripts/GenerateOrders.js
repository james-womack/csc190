import { Platform, Utils, Toast, Dialog } from 'quasar'
import { ResolveRoute } from '../scripts/Utility'


let tableConfig = {
  rowHeight: '50px',
  title: 'GenerateOrders',
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
    label: 'Order Id',
    field: 'id',
    width: '80px',
    filter: true,
    sort: 'number'

  },
  {
    label: 'Price Paid',
    field: 'pricePaid',
    width: '150px',
    filter: true,
    sort: 'string'
  },
  {
    label: 'Order Date',
    field: 'orderDate',
    width: '100px',
    filter: true,
    sort: 'date'
  },
  {
    label: 'Status',
    field: 'name',
    width: '100px',
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
  }
}