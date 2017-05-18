import { Toast, Dialog } from 'quasar'
import { ResolveRoute, GlobalBus } from '../scripts/Utility'

let tableConf = {
  rowHeight: '50px',
  title: 'All Order Items',
  refresh: false,
  columnPicker: false,
  selection: 'multiple'
}

let tableCols = [
  {
    label: 'Item',
    field: 'itemName',
    filter: true,
    sort: 'string',
    width: '60px'
  },
  {
    label: 'Vendor',
    field: 'vendorName',
    filter: true,
    sort: 'string',
    width: '60px'
  },
  {
    label: 'Price',
    field: 'paidPrice',
    sort: 'number',
    // Show cents as dollars
    format (value, row) {
      return `$${(value/100).toFixed(2)}`
    },
    width: '40px'
  },
  {
    label: 'Order Amount',
    field: 'orderAmount',
    sort: 'number',
    width: '40px'
  },
  {
    label: 'Total Amount',
    field: 'totalAmount',
    sort: 'number',
    width: '40px',
    format (value, row) {
      return `${value} ${row.units}`
    }
  },
  {
    label: 'Status',
    field: 'editStatus',
    width: '40px'
  }
]

export default {
  data() {
    return {
      conf: tableConf,
      cols: tableCols,
      data: [],
      order: null,
      loading: false,
      // For edits, adds, deletes
      news: [],
      edit: [],
      deletes: [],
      // For selecting items, vendors from add order item
      newSelectedItem: null,
      newSelectedProduct: null,
      // This flag is for if the current selection is valid
      isValidSelection: true,
      newTotal: 0,
      newOrderAmount: 0,
      newPrice: 0,
      itemOptions: [],
      vendorOptions: [],
      itemProductMap: {}
    }
  },
  methods: {
    // Loads the item/vendor choices from the server
    loadOptions() {
      return this.$http.get(ResolveRoute('products')).then(resp => {
        return resp.json()
      }, err => {
        console.log(err)
        Toast.create('Failed to load product options')
      }).then(json => {
        json.forEach(prod => {
          // Create mapping if it doesn't exist
          if (this.itemProductMap[prod.item.id] === undefined) {
            this.itemProductMap[prod.item.id] = []
          }

          // Add the product to the mapping
          this.itemProductMap[prod.item.id].push({
            label: `${prod.vendor.name} [${prod.packageAmount} for $${(prod.price / 100).toFixed(2)} ($${(prod.price / (100 * prod.packageAmount)).toFixed(2)} ea)]`,
            value: {
              itemId: prod.item.id,
              vendorId: prod.vendor.id,
              itemName: prod.item.name,
              vendorName: prod.vendor.name,
              units: prod.item.units,
              sku: prod.sku,
              price: prod.price,
              packageAmount: prod.packageAmount
            }
          })

          // Add the items to the item options
          // find exist item
          let itemExist = false
          this.itemOptions.forEach(item => {
            if (item.value.id === prod.item.id) {
              itemExist = true
            }
          })

          if (!itemExist) {
            this.itemOptions.push({
              label: prod.item.name,
              value: prod.item
            })  
          }
        })
      }, err => {
        console.log(err)
        Toast.create('Failed to parse product options')
      })
    },
    // Loads the data from the server
    loadData() {
      console.log(this.order)
      return this.$http.get(ResolveRoute(`orders/${this.order}`)).then(resp => {
        return resp.json()
      }, err => {
        console.log(err)
      }).then(json => {
        // Clear out existing data
        this.reset()
        this.data = []

        // Transform into table data format
        json.forEach(oi => {
          this.data.push({
            itemId: oi.item.id,
            itemName: oi.item.name,
            units: oi.item.units,
            vendorName: oi.vendor.name,
            vendorId: oi.vendor.id,
            paidPrice: oi.paidPrice,
            totalAmount: oi.totalAmount,
            orderAmount: oi.orderAmount,
            editStatus: 'none'
          })
        })
      }, err => {
        console.log(err)
      })
    },
    reset() {
      this.news = []
      this.edit = []
      this.deletes = []
      this.newSelectedItem = null
    },
    editRow(row) {
      let prom = new Promise((resolve, rej) => {
        Dialog.create({
          title: 'Enter Amount',
          form: {
            amt: {
              type: 'numeric',
              label: 'New Amount',
              model: `${row.row.orderAmount}`
            }
          },
          buttons: [
            {
              label: 'Cancel',
              handler(data) {
                rej(Error('User Cancelled'))
              }
            },
            {
              label: 'Ok',
              preventClose: true,
              handler(data, close) {
                if (data.amt > 0) {
                  close(() => {
                    console.log(data)
                    resolve(data.amt)
                  })

                  return
                }

                Toast.create('Please enter a positive number > 0')
              }
            }
          ]
        })
      }).then(d => {
        let existI = -1
        console.log(d)
        // Look for exist edit
        this.edit.forEach((e, i) => {
          if (e.itemId === row.row.itemId && e.vendorId === row.row.vendorId) {
            existI = i
          }
        })

        if (existI >= 0) {
          // Edit existing edit
          this.edit[existI].paidPrice = d * row.row.paidPrice / row.row.orderAmount
          this.edit[existI].totalAmount = d * row.row.totalAmount / row.row.orderAmount
          this.edit[existI].orderAmount = d
        } else {
          // Make sure there is no new already
          let newI = -1
          this.news.forEach((n, i) => {
            if (n.itemId === row.row.itemId && n.vendorId === row.row.vendorId) {
              newI = i
            }
          })
          if (newI < 0) {
            this.edit.push({
              vendorId: row.row.vendorId,
              itemId: row.row.itemId,
              orderId: this.order,
              orderAmount: d,
              paidPrice: d * row.row.paidPrice / row.row.orderAmount,
              totalAmount: d * row.row.totalAmount / row.row.orderAmount

            })
          } else {
            this.news[newI].paidPrice = d * row.row.paidPrice / row.row.orderAmount
            this.news[newI].totalAmount = d * row.row.totalAmount / row.row.orderAmount
            this.news[newI].orderAmount = d
          }
        }

        // Update rows
        let dI = -1
        this.data.forEach((d, i) => {
          if (d.vendorId === row.row.vendorId && d.itemId === row.row.itemId) {
            dI = i
          }
        })
        this.data[dI].paidPrice = d * row.row.paidPrice / row.row.orderAmount
        this.data[dI].totalAmount = d * row.row.totalAmount / row.row.orderAmount
        this.data[dI].orderAmount = d
        if (this.data[dI].editStatus !== 'news') {
          this.data[dI].editStatus = 'edit'
        }
      })
    },
    deleteRows (props) {
      props.rows.forEach(oi => {
        // Check for exist edit
        let eI = -1
        this.edit.forEach((d, i) => {
          if (d.itemId === oi.data.itemId && d.vendorId === oi.data.vendorId) {
            eI = i
          }
        })
        if (eI >= 0) {
          // Drop the exit edit
          this.edit.splice(eI, 1)
        }

        // Add to delete list, if not already there
        let shouldAdd = true
        this.deletes.forEach(d => {
          if (d.itemId === oi.data.itemId && d.vendorId === oi.data.vendorId) {
            shouldAdd = false
          }
        })

        let newI = -1
        this.news.forEach((n, i) => {
          if (n.itemId === oi.data.itemId && n.vendorId === oi.data.vendorId) {
            newI = i
          }
        })

        if (newI >= 0) {
          this.news.splice(newI, 1)
        } else if (shouldAdd) {
          this.deletes.push({
            itemId: oi.data.itemId,
            vendorId: oi.data.vendorId,
            orderId: this.order
          })
        }

        // Update table entry
        let tableI = -1
        this.data.forEach((d, i) => {
          if (d.itemId === oi.data.itemId && d.vendorId === oi.data.vendorId) {
            tableI = i
          }
        })
        console.log(tableI)
        this.data[tableI].editStatus = 'delete'
      })
    },
    saveChanges() {
      // Adds any pending changes to the database
      let deleteOp = Promise.resolve();
      let editOp = Promise.resolve();
      let newOp = Promise.resolve();

      // Resolve all of the requests to the server
      if (this.deletes.length !== 0) {
        console.log(this.deletes)
        deleteOp = this.$http.delete(ResolveRoute('orders/items'), { body: this.deletes })
      }
      if (this.edit.length !== 0) {
        console.log(this.edit)
        editOp = this.$http.patch(ResolveRoute('orders/items'), this.edit)
      }
      if (this.news.length !== 0) {
        console.log(this.news)
        newOp = this.$http.put(ResolveRoute('orders/items'), this.news)
      }

      // Show toast for success/failure
      const finish = Promise.all([deleteOp, editOp, newOp]);
      finish.then(resp => {
          Toast.create('Changes Saved!')
          this.edit = []
          this.deletes = []
          this.news = []
          this.data.forEach(i => {
            i.editStatus = 'none'
          })

          return this.loadData()
        },
        e => {
          Toast.create('Failed to save changes...')
          console.log(e)
        })
    },
    discardChanges() {
      // Just load data
      this.loadData()
    },
    addOrderItem() {
      // Get the selected product, and create order item for server and table
      let serverOI = {
        vendorId: this.newSelectedProduct.vendorId,
        itemId: this.newSelectedProduct.itemId,
        orderId: this.order,
        orderAmount: this.newOrderAmount,
        totalAmount: this.newTotal,
        paidPrice: this.newPrice
      }

      let tableOI = {
        vendorId: this.newSelectedProduct.vendorId,
        itemId: this.newSelectedProduct.itemId,
        orderId: this.order,
        orderAmount: this.newOrderAmount,
        totalAmount: this.newTotal,
        paidPrice: this.newPrice,
        itemName: this.newSelectedProduct.itemName,
        vendorName: this.newSelectedProduct.vendorName,
        units: this.newSelectedProduct.units,
        editStatus: 'new'
      }

      // Push to both lists
      this.news.push(serverOI)
      this.data.push(tableOI)

      // Clear out options
      this.newSelectedItem = null
    }
  },
  watch: {
    newSelectedItem(val) {
      if (val !== undefined && val !== null) {
        // Put in the correct vendorOptions
        this.vendorOptions = this.itemProductMap[val.id]
        this.newSelectedProduct = null
      } else {
        // Otherwise reset
        this.vendorOptions = []
        this.newSelectedProduct = null
      }
    },
    newSelectedProduct(val) {
      this.newOrderAmount = 0
      this.isValidSelection = true
      if (val === undefined || val === null) {
        return
      }

      // Make sure that there is no order item with same combo
      this.data.forEach(v => {
        if (v.itemId === val.itemId && v.vendorId === val.vendorId) {
          this.isValidSelection = false
        }
      })
    },
    newOrderAmount(val) {
      if (this.newSelectedProduct !== undefined && this.newSelectedProduct !== null) {
        this.newPrice = this.newSelectedProduct.price * this.newOrderAmount
        this.newTotal = this.newSelectedProduct.packageAmount * this.newOrderAmount
      } else {
        this.newPrice = 0
        this.newTotal = 0
      }
    },
    order(val) {
      if (this.order !== undefined && this.order !== null) {
        if (!this.loading) {
          this.loading = true

          // Only load if we aren't already
          this.loadData().then(v => {
            this.loading = false
            Toast.create('Order loaded')
          }, err => {
            Toast.create('Failed to load order...')
            console.log(err)
          })
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.order = GlobalBus.showOrder
      this.loadOptions().then(v => {
        console.log('Loaded options')
      })
    })
  }
}
