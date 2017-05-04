import { Dialog, Toast } from 'quasar'
import { createVendor, createItem } from '../scripts/Dialogs'
import { ResolveRoute, clone } from '../scripts/Utility'

// Configs for all three tables
let itemsTableConfig = {
  rowHeight: '50px',
  title: 'Possible Items',
  refresh: true,
  columnPicker: false,
  selection: 'none'
}
let vendorsTableConfig = {
  rowHeight: '50px',
  title: 'All Vendors',
  refresh: true,
  columnPicker: false,
  selection: 'none'
}
let productsTableConfig = {
  rowHeight: '50px',
  title: 'Products from All Vendors',
  refresh: true,
  columnPicker: true,
  selection: 'none'
}

// Columns for all three tables
let itemsTableColumns = [
  {
    label: 'Name',
    field: 'name',
    filter: true,
    sort: 'string',
    width: '100px'
  },
  {
    label: 'Minimum Amount',
    field: 'minimumAmount',
    sort: 'number',
    width: '50px'
  },
  {
    label: 'Units',
    field: 'units',
    width: '50px'
  },
  {
    label: 'Edit',
    field: 'editStatus',
    width: '30px'
  }
]
let vendorsTableColumns = [
  {
    label: 'Name',
    field: 'name',
    filter: true,
    sort: 'string',
    width: '80px'
  },
  {
    label: 'Phone Number',
    field: 'phone',
    width: '100px'
  },
  {
    label: 'Address',
    field: 'address',
    width: '150px'
  },
  {
    label: 'Edit',
    field: 'editStatus',
    width: '30px'
  }
]
let productsTableColumns = [
  {
    label: 'Item Name',
    field: 'itemName',
    filter: true,
    sort: 'string',
    width: '80px'
  },
  {
    label: 'Vendor Name',
    field: 'vendorName',
    filter: true,
    sort: 'string',
    width: '60px'
  },
  {
    label: 'Pkg Amount',
    field: 'packageAmount',
    sort: 'number',
    width: '60px',
    format (value, row) {
      return row.contents
    }
  },
  {
    label: 'Price (Unit)',
    field: 'pricePerPackage',
    sort: 'number',
    width: '60px',
    format (value, row) {
      return `$${(value/100).toFixed(2)}`
    }
  },
  {
    label: 'Price',
    field: 'price',
    sort: 'number',
    width: '60px',
    // Show cents as dollars
    format (value, row) {
      return `$${(value/100).toFixed(2)}`
    }
  },
  {
    label: 'SKU',
    field: 'sku',
    width: '100px'
  },
  {
    label: 'Edit',
    field: 'editStatus',
    width: '30px'
  }
]

export default {
  data () {
    return {
      itemsConf: itemsTableConfig,
      itemsCols: itemsTableColumns,
      itemsData: [],
      vendorsConf: vendorsTableConfig,
      vendorsCols: vendorsTableColumns,
      vendorsData: [],
      productsConf: productsTableConfig,
      productsCols: productsTableColumns,
      productsData: [],
      // Arrays to store edits to be made
      itemsEdits: [],
      vendorsEdits: [],
      productsEdits: [],
      // Arrays to store new objects to add
      itemsNew: [],
      vendorsNew: [],
      productsNew: [],
      // Arrays to store objects to be deleted
      itemsDelete: [],
      vendorsDelete: [],
      productsDelete: [],
      statusTypes: {
        none: 'none',
        edit: 'edit',
        new: 'new'
      },
      types: {
        items: 'items',
        vendors: 'vendors',
        products: 'products'
      },
      // Stores dicts for what field to edit, and how the Dialog box should
      // be displayed
      editTypes: {
        // Item edit types
        itemName: {
          for: 'items',
          field: 'name',
          name: 'Item Name',
          type: 'textbox'
        },
        minimumAmount: {
          for: 'items',
          field: 'minimumAmount',
          name: 'Minimum Amount',
          type: 'numeric'
        },
        units: {
          for: 'items',
          field: 'units',
          name: 'Units',
          type: 'textbox'
        },
        // Vendor edit types
        vendorName: {
          for: 'vendors',
          field: 'name',
          name: 'Vendor Name',
          type: 'textbox'
        },
        phone: {
          for: 'vendors',
          field: 'phone',
          name: 'Phone Number',
          type: 'textbox'
        },
        // Product edit types
        packageAmount: {
          for: 'products',
          field: 'packageAmount',
          name: 'Package Amount',
          type: 'numeric'
        },
        price: {
          for: 'vendors',
          field: 'price',
          name: 'Price (Cents)',
          type: 'numeric'
        },
        sku: {
          for: 'vendors',
          field: 'sku',
          name: 'SKU',
          type: 'textbox'
        }
      },
      // These convert the table rows back into the version
      // used to make edits back on the server
      serverConverters: {
        items (itemRow) {
          return {
            id: itemRow.id,
            name: itemRow.name,
            minimumAmount: itemRow.minimumAmount,
            units: itemRow.units
          }
        },
        vendors (vendorRow) {
          return {
            id: vendorRow.id,
            name: vendorRow.name,
            phone: vendorRow.phone,
            streetAddress: vendorRow.streetAddress,
            city: vendorRow.city,
            zipCode: vendorRow.zipCode,
            state: vendorRow.state,
            country: vendorRow.country
          }
        },
        products (productRow) {
          return {
            itemId: productRow.item.id,
            vendorId: productRow.vendor.id,
            sku: productRow.sku,
            price: productRow.price,
            packageAmount: productRow.packageAmount
          }
        }
      },
      // Converters for each type downloaded from the server
      // So the tables have it in the correct format
      converters: {
        items (rawItems) {
          return rawItems
        },
        vendors (rawVendors) {
          let v = []
          rawVendors.forEach(vendor => {
            let vendorCpy = clone(vendor)
            vendorCpy.address = `${vendor.streetAddress} ${vendor.city}, ${vendor.state}, ${vendor.zipCode}, ${vendor.country}`
            v.push(vendorCpy)
          })

          return v
        },
        products (rawProducts) {
          let p = []
          rawProducts.forEach(prod => {
            let prodCpy = clone(prod)
            prodCpy.itemName = prod.item.name
            prodCpy.vendorName = prod.vendor.name
            prodCpy.pricePerPackage = (prod.price / prod.packageAmount)
            prodCpy.contents = `${prod.packageAmount.toFixed()} ${prod.item.units}`
            p.push(prodCpy)
          })

          return p
        }
      },
      // Equality methods for each type to see if Id's match up
      comparators: {
        items (a, b) {
          return a.id === b.id
        },
        vendors (a, b) {
          return a.id === b.id
        },
        products (a, b) {
          return a.itemId === b.itemId && a.vendorId === b.vendorId
        }
      }
    }
  },
  methods: {
    // Translates rawData into type for the table
    toTableFormat (rawData, type) {
      return this.converters[type](rawData)
    },
    // Gets the data for the type from the server
    getData (type) {
      return this.$http.get(ResolveRoute(type)).then(resp => {
        return resp.json()
      }, err => {
        console.log(err)
        console.log('Error: Failed to fetch for ' + type)

        return Error(type)
      })
    },
    refreshItems (done) {
      this.refreshTable(this.types.items).then(v => {
        done()
      })
    },
    refreshVendors (done) {
      this.refreshTable(this.types.vendors).then(v => {
        done()
      })
    },
    refreshProducts (done) {
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
              handler (d) {
                rej(Error('User Cancelled'))
              }
            },
            {
              label: 'Ok',
              handler (val) {
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
    refreshTable (type) {
      return this.getData (type).then(d => {
        return this.toTableFormat (d, type)
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
    refreshAll () {
      return Promise.all([
        this.refreshTable(this.types.items),
        this.refreshTable(this.types.vendors),
        this.refreshTable(this.types.products)
      ])
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.refreshAll().then(v => {
        console.log('Loaded all')
      })
    })
  }
}
