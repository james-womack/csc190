import { Platform, Utils, Toast, Dialog } from 'quasar'
import { ResolveRoute } from '../scripts/Utility'

let tableConfig = {
  rowHeight: '50px',
  title: 'Orders',
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
    deleteRows(props) {
      let str = '';
      const propsToDelete = [];
      const _this = this;
      props.rows.forEach(row => {
        str += `${row.data.name}, `
        propsToDelete.push({
          itemId: row.data.itemId,
          vendorId: row.data.vendorId
        })
      })
      Dialog.create({
        title: 'Confirm Deletion',
        message: `This will delete these items from orders: [${str.substr(0, str.length - 2)}]`,
        icon: 'warning',
        buttons: [
          {
            label: 'OK',
            handler() {
              const resp = _this.$http.delete('http://localhost:5000/api/stock', { body: propsToDelete });
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
    refresh(done) {
      this.getNewData().then(obj => {
        this.table = toTableFormat(obj);
        done();
      });
    },
    getNewData() {
      return this.$http.get(ResolveRoute('orders')).then(response => {
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
          orderDate: val.orderDate,
          status: val.status,
          pricePaid: val.pricePaid,
          itemCount: val.itemCount,
          id: val.id
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