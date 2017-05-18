import { Platform, Utils, Toast, Dialog } from 'quasar'
import { ResolveRoute, GlobalBus } from '../scripts/Utility'

let tableConfig = {
  rowHeight: '50px',
  title: 'Orders',
  refresh: true,
  columnPicker: true,
  leftStickyColumns: 0,
  rightStickyColumns: 0,
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
    width: '150px',
    filter: true,
    sort: 'number'

  },
  {
    label: 'Price Paid',
    field: 'pricePaid',
    width: '100px',
    filter: true,
    sort: 'number',
    format(val, row) {
      return `$${(val/100).toFixed(2)}`
    }
  },
  {
    label: 'Order Date',
    field: 'orderDate',
    width: '100px',
    filter: true,
    sort: 'date',
    format(val, row) {
      let date = new Date(val)
      return date.toLocaleDateString()
    }
  },
  {
    label: 'Status',
    field: 'status',
    width: '110px',
    filter: true,
    sort: 'string'
  },
  {
    label: 'Copy',
    field: 'ph',
    width: '80px'
  }
];
export default {
  data() {
    return {
      table: [],
      config: tableConfig,
      columns: tableColumns,
      vendorOptions: [
        {
          label: 'None',
          value: ''
        }
      ],
      perferredVendor: '',
      safetyFactor: 2.0
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
              const resp = _this.$http.delete(ResolveRoute('orders'), { body: propsToDelete });
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
          console.log(err);
        });
    },
    updateVenderOptions() {
      return this.$http.get(ResolveRoute('vendors')).then(resp => {
        return resp.json()
      },
      err => {
        console.log(err)
      }).then(json => {
        let newOpts = [
          {
            label: 'None',
            value: ''
          }
        ]

        // Create new options
        json.forEach(v => {
          newOpts.push({
            label: v.name,
            value: v.id
          })
        })

        // Update vendor options
        this.vendorOptions = newOpts
      })
    },
    toTableFormat(obj) {
      const newData = [];
      for (let val of obj) {
        newData.push({
          orderDate: val.orderDate,
          status: val.status,
          pricePaid: val.pricePaid,
          itemCount: val.itemCount,
          ph: 0,
          id: val.id
        });
      }
      return newData;
    },
    generateOrder() {
      
    },
    copyOrder(cell) {
      this.$http.get(ResolveRoute(`orders/copy/${cell.row.id}`)).then(resp => {
        return resp.json()
      }, err => {
        Toast.create('Failed to copy order')
        console.log(err)
      }).then(x => {
        this.table.push(x)
        GlobalBus.$emit('showOrder', x.id)
      })
    },
    showOrder(orderId) {
      GlobalBus.$emit('showOrder', orderId)
    },
    approveDenyDialog(cell) {
      Dialog.create({
        title: 'Change order status',
        message: 'What status would you like to set for this order?',
        stackButtons: true,
        buttons: [
          {
            label: 'Approved',
            handler() {
              console.log('Approved')
            }
          },
          {
            label: 'Denied',
            handler() {
              console.log('Denied')
            }
          },
          {
            label: 'Fullfilled',
            handler() {
              console.log('Fullfilled')
            }
          },
          {
            label: 'Cancel',
            handler() {
              console.log('Cancel')
            }
          }
        ]
      })
    }
  },
  mounted() {
    const resp = this.getNewData();
    resp.then(obj => {
      this.table = this.toTableFormat(obj);
    });

    // Get vendor options now too
    this.updateVenderOptions().then(v => {
      console.log('Updated vendor options')
    })
  }

}