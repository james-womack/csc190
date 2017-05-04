import { Dialog, Toast } from 'quasar'
import { createVendor, createItem } from '../scripts/Dialogs'
import { ResolveRoute, clone, GlobalBus } from '../scripts/Utility'

// Configs for all three tables

let OrdersTableConfig = {
  rowHeight: '50px',
  title: 'Orders from All Vendors',
  refresh: true,
  columnPicker: true,
  selection: 'none'
}

// Columns for all three tables
let OrderTableColumns = [
  {
    label: 'Item',
    field: 'itemName',
    filter: true,
    sort: 'string',
    width: '100px'
  },
  {
    label: 'Vendor',
    field: 'vendorName',
    sort: 'number',
    width: '50px'
  },
  {
    label: 'SKU',
    field: 'sku',
    width: '50px'
  },
  {
    label: 'Order Price',
    field: 'orderPrice',
    sort: 'number',
    format(value, row) {
      return `$${(value / 100).toFixed(2)}`
    },
    width: '30px'
  },
  {
    label: 'Package Price',
    field: 'packagePrice',
    sort: 'number',
    format(value, row) {
      return `$${(value / 100).toFixed(2)}`
    },
    width: '30px'
  },
  {
    label: 'Unit Price',
    field: 'unitPrice',
    sort: 'number',
    format(value, row) {
      return `$${(value / 100).toFixed(2)}`
    },
    width: '30px'
  },
  {
    label: 'Total Amount',
    field: 'totalAmount',
    sort: 'number',
    format(value, row) {
      return row.contents
    },
    width: '30px'
  },
  {
    label: 'Package Amount',
    field: 'packageAmount',
    sort: 'number',
    format(value, row) {
      return row.contents
    },
    width: '30px'
  },
  {
    label: 'Order Amount',
    field: 'orderAmount',
    sort: 'number',
    format(value, row) {
      return row.contents
    },
    width: '30px'
  }
]


export default {
  data() {
    return {

      ordersConf: OrderTableConfig,
      ordersCols: OrderTableColumns,
      ordersData: [],
      // Arrays to store edits to be made
      ordersEdits: [],
      // Arrays to store new objects to add
      ordersNew: [],
      // Arrays to store objects to be deleted
      ordersDelete: [],
      statusTypes: {
        none: 'none',
        edit: 'edit',
        new: 'new'
      },
      types: {
        orders: 'orders'
      },
      // Stores dicts for what field to edit, and how the Dialog box should
      // be displayed
      editTypes: {
        // Order Amount edit types
        orderAmount: {
          for: 'orders',
          field: 'orderAmount',
          name: 'Order Amount',
          type: 'numeric'
        }
      },
      // These convert the table rows back into the version
      // used to make edits back on the server
      serverConverters: {
        orders(orderRow) {
          return {
            itemId: orderRow.item.id,
            vendorId: orderRow.vendor.id,
            paidPrice: orderRow.orderPrice,
            orderAmount: orderRow.orderAmount
          }
        }
      },
      // Converters for each type downloaded from the server
      // So the tables have it in the correct format
      converters: {
        orders(rawOrders) {
          let p = []
          rawOrders.forEach(order => {
            if (order.product === undefined || order.product === null) {
              return
            }

            let orderCpy = clone(order)
            orderCpy.itemName = order.item.name
            orderCpy.vendorName = order.vendor.name
            orderCpy.itemId = order.item.id
            orderCpy.vendorId = order.vendor.id
            orderCpy.sku = order.product.sku
            orderCpy.orderPrice = order.orderAmount * order.product.price
            orderCpy.packagePrice = order.product.price
            orderCpy.unitPrice = orderCpy.packagePrice / orderCpy.orderAmount
            orderCpy.totalAmount = orderCpy.orderAmount * order.product.packageAmount
            orderCpy.packageAmount = order.product.packageAmount
            p.push(orderCpy)
          })

          return p
        }
      },
      // Equality methods for each type to see if Id's match up
      comparators: {
        orders(a, b) {
          return a.itemId === b.itemId && a.vendorId === b.vendorId
        }
      }
    }
  },
  methods: {
    // Translates rawData into type for the table
    toTableFormat(rawData, type) {
      return this.converters[type](rawData)
    },
    // Gets the data for the type from the server
    getData(type) {
      return this.$http.get(ResolveRoute(type)).then(resp => {
        return resp.json()
      }, err => {
        console.log(err)
        console.log('Error: Failed to fetch for ' + type)

        return Error(type)
      })
    },
    refreshItems(done) {
      this.refreshTable(this.types.items).then(v => {
        done()
      })
    },
    refreshVendors(done) {
      this.refreshTable(this.types.vendors).then(v => {
        done()
      })
    },
    refreshProducts(done) {
      this.refreshTable(this.types.products).then(v => {
        done()
      })
    },
    // Edits the specified value and adds the edit to the edit list
    editValue(editType, row) {
      console.log(row)
      let prom = new Promise((res, rej) => {
        Dialog.create({
          title: `Edit ${editType.name}`,
          form: {
            val: {
              type: editType.type,
              label: editType.name,
              model: row[editType.field]
            }
          },
          buttons: [
            {
              label: 'Cancel',
              handler(d) {
                rej(Error('User Cancelled'))
              }
            },
            {
              label: 'Ok',
              handler(val) {
                res(val)
              }
            }
          ]
        })
      })
      prom.then(formData => {
        // Get which edit array to check, and converter
        let edits = this[editType.for + 'Edits']
        let data = this[editType.for + 'Data']
        let compare = this.comparators[editType.for]

        // Search for existing edit
        let existEdit = -1
        edits.forEach((x, i) => {
          if (compare(x, row)) {
            existEdit = i
          }
        })

        // Splice old out if it exists
        if (existEdit !== -1) {
          edits.splice(existEdit, 1)
        }

        // Get table index of data
        let tableEntry = null
        data.forEach((x) => {
          if (compare(x, row)) {
            tableEntry = x
          }
        })

        // Update values
        tableEntry[editType.field] = formData.val
        tableEntry.editStatus = this.statusTypes.edit
        edits.push(clone(tableEntry))
      }, err => {
        console.log(err)
        Toast.create('User Cancelled')
      })
    },
    // Refreshes the table of type specified
    refreshTable(type) {
      return this.getData(type).then(d => {
        return this.toTableFormat(d, type)
      }).then(tableData => {
        // Add editStatus to each variable
        tableData.forEach(row => {
          row.editStatus = this.statusTypes.none
        })

        let table = type + 'Data'
        console.log(`Storing ${table}`)
        this[table] = tableData
      })
    },
    // Refreshes all of the tables
    refreshAll() {
      return Promise.all([
        this.refreshTable(this.types.items),
        this.refreshTable(this.types.vendors),
        this.refreshTable(this.types.products)
      ])
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.refreshAll().then(v => {
        console.log('Loaded all')
      })
    })
  }
}
