﻿import { Platform, Utils, Toast, Dialog } from 'quasar'
import { Clone, ResolveRoute, GlobalBus } from '../scripts/Utility'
import { createVendor, createItem } from '../scripts/Dialogs'

// Configuration of table its self
let tableConfig = {
  rowHeight: '50px',
  title: 'Inventory',
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

// Configuration of table columns
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
      // Table data its self
      table: [],
      config: tableConfig,
      columns: tableColumns,
      itemOptions: [],
      vendorOptions: [],
      edits: {
        delete: [],
        change: []
      },
      newStockItem: null,
      newStockVendor: null,
      newStockAmount: '',
      newStockLocation: ''
    };
  },
  methods: {
    commitEdits() {
      // Adds any pending changes to the database
      let deleteOp = Promise.resolve();
      let editOp = Promise.resolve();

      // Resolve all of the requests to the server
      if (this.edits.delete.length !== 0) {
        deleteOp = this.$http.delete(ResolveRoute('stock'), { body: this.edits.delete })
      }
      if (this.edits.change.length !== 0) {
        editOp = this.$http.patch(ResolveRoute('stock'), this.edits.change)
      }

      // Show toast for success/failure
      const finish = Promise.all([deleteOp, editOp]);
      finish.then(resp => {
          Toast.create('Changes Saved!')
          this.edits.change = []
          this.edits.delete = []
        },
        e => {
          Toast.create('Failed to save changes...')
          console.log(e)
        })
    },
    discardEdits() {
      // Just discards any pending edits
      this.edits.change = []
      this.edits.delete = []
      this.refresh(() => {})
    },
    deleteRows(props) {
      // Deletes all rows selected from the table and puts
      // The rows in pending edits
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
        message: `This will delete these items from stock: [${str.substr(0, str.length - 2)}]`,
        icon: 'warning',
        buttons: [
          {
            label: 'OK',
            handler() {
              propsToDelete.forEach(x => {
                _this.edits.delete.push(x)
              })

              props.rows.forEach(row => {
                // Grab a change in the edits array
                // if it does exist, then delete it
                let existEdit = -1

                _this.edits.change.forEach((x, i) => {
                  console.log(x)
                  console.log(row)
                  if (x.vendorId === row.data.vendorId && x.itemId === row.data.itemId) {
                    existEdit = i;
                  }
                })
                if (existEdit > -1) {
                  _this.edits.change.splice(existEdit, 1)
                }

                // Delete from the table
                _this.table.splice(row.index, 1)
              })
              Toast.create(`Deleted ${propsToDelete.length} rows...`)

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
    addVendor() {
      createVendor().then(value => {
        return this.$http.put(ResolveRoute('vendors'), value)
      }, error => {
        Toast.create('Cancelled')
      }).then(value => {
        Toast.create('Added vendor')
      }, error => {
        Toast.create('Error: Failed to add new vendor')
      })
    },
    addItem() {
      createItem().then(value => {
        return this.$http.put(ResolveRoute('items'), value)
      }, error => {
        Toast.create('Cancelled')
      }).then(value => {
        Toast.create('Added item') 
      }, error => {
        Toast.create('Error: Failed to add new item')
      })
    },
    addStock() {
      console.log("Add stock")
    },
    refresh(done) {
      // See if there are any pending changes
      if (this.edits.change.length === 0 && this.edits.delete.length === 0) {
        // No pending changes, refresh the inventory
        this.getNewData().then(obj => {
          this.table = this.toTableFormat(obj);
          done();
        });
      } else {
        // Warn user that they'll loose their changes
        const _this = this;
        Dialog.create({
          title: 'Warning',
          message:
            "This will discard any edits you've made, are you sure?\nYou can save them using the save button in the lower right",
          buttons: [
            'Cancel',
            {
              label: 'Ok',
              handler(data) {
                _this.edits.change = []
                _this.edits.delete = []

                _this.getNewData().then(obj => {
                  _this.table = _this.toTableFormat(obj)
                  done()
                });
              }
            }
          ]
        })
      }
    },
    getNewData() {
      // Gets new stock info from the server
      return this.$http.get(ResolveRoute('stock')).then(response => {
          const resp = response.json()
          console.log(response.status)
          return resp
        },
        err => {
          log(err)
        });
    },
    toTableFormat(obj) {
      // Converts data from server into table friendly format
      const newData = []
      for (let val of obj) {
        newData.push({
          name: val.item.name,
          amount: val.amount,
          location: val.location,
          minAmount: val.item.minimumAmount,
          vendor: val.vendor.name,
          vendorId: val.vendor.id,
          itemId: val.item.id
        });
      }
      return newData
    },
    // Loads the options for the select controls
    loadOptions () {
      let vendorProm = this.$http.get(ResolveRoute('vendors')).then(resp => {
        return resp.json()
      }, err => {
        console.log(err)
      }).then(json => {
        // Parse into select comp format
        let newOpts = []
        json.forEach(v => {
          newOpts.push({
            label: v.name,
            value: v
          })
        })

        this.vendorOptions = newOpts
       })

       let itemProm = this.$http.get(ResolveRoute('items')).then(resp => {
         return resp.json()
       }, err => {
         console.log(err)
       }).then(json => {
         // Parse into select comp format
         let newOpts = []
         json.forEach(i => {
           newOpts.push({
             label: i.name,
             value: i
           })
         })

         this.itemOptions = newOpts
       })

       return Promise.all([vendorProm, itemProm])
    },
    editAmount(row) {
      // Edits the amount left for a certain row
      const _this = this
      Dialog.create({
        title: 'Enter Amount',
        form: {
          amt: {
            type: 'numeric',
            label: 'New Amount',
            model: `${row.amount}`
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler(data) {
              _this.addChange({
                name: row.name,
                amount: data.amt,
                location: row.location,
                minAmount: row.minAmount,
                vendor: row.vendor,
                vendorId: row.vendorId,
                itemId: row.itemId
              })
            }
          }
        ]
      })
    },
    editLocation(row) {
      // Edits the location of the stock in inventory
      const _this = this
      Dialog.create({
        title: 'Enter Location',
        form: {
          loc: {
            type: 'textbox',
            label: 'New Location',
            model: `${row.location}`
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler(data) {
              _this.addChange({
                name: row.name,
                amount: row.amount,
                location: data.loc,
                minAmount: row.minAmount,
                vendor: row.vendor,
                vendorId: row.vendorId,
                itemId: row.itemId
              })
            }
          }
        ]
      })
    },
    addChange(data) {
      // Adds a change to the table
      let existingEdit = -1
      let tableIndex = null

      // Search for any existing edits
      this.edits.change.forEach((x, i) => {
        if (x.itemId === data.itemId && x.vendorId === data.vendorId)
          existingEdit = i
      })

      // Search for existing entry on table
      this.table.forEach((x, i) => {
        if (x.itemId === data.itemId && x.vendorId === data.vendorId)
          tableIndex = i
      })

      // Add the edit if needed
      if (existingEdit !== -1) {
        this.edits.change.splice(existingEdit, 1)
      }

      this.edits.change.push({
        name: data.name,
        amount: data.amount,
        location: data.location,
        minAmount: data.minAmount,
        vendor: data.vendor,
        vendorId: data.vendorId,
        itemId: data.itemId
      })

      console.log(tableIndex)
      console.log(this.table[tableIndex])

      this.table[tableIndex].amount = data.amount
      this.table[tableIndex].location = data.location
      console.log(this.edits)
    }
  },
  mounted() {
    const resp = this.getNewData();
    resp.then(obj => {
      this.table = this.toTableFormat(obj)
    });

    this.loadOptions().then(v => {
      console.log('loaded options')
    }, err => {
      console.log(err)
    })
  }
}
