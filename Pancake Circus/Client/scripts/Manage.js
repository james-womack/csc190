import { Dialog, Toast } from 'quasar'
import { createVendor, createItem } from '../scripts/Dialogs'
import { ResolveRoute, clone } from '../scripts/Utility'

// Configs for all three tables
let itemsTableConfig = {
  rowHeight: '50px',
  title: 'All Items',
  refresh: true,
  columnPicker: false,
  selection: 'multiple'
}
let vendorsTableConfig = {
  rowHeight: '50px',
  title: 'All Vendors',
  refresh: true,
  columnPicker: false,
  selection: 'multiple'
}
let productsTableConfig = {
  rowHeight: '50px',
  title: 'All Products',
  refresh: true,
  columnPicker: true,
  selection: 'multiple'
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
      // Arrays with the raw data from the server
      itemsActual: [],
      vendorsActual: [],
      productsActual: [],
      // Options for any select UI elements
      itemsOptions: [],
      vendorsOptions: [],
      productsOptions: [],
      statusTypes: {
        none: 'none',
        edit: 'edit',
        delete: 'delete',
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
      // Converters for various UI elements in the manage page
      uiConverters: {
        items (item) {
          return {
            label: item.name,
            value: item
          }
        },
        vendors (vendor) {
          return {
            label: vendor.name,
            value: vendor
          }
        },
        products (product) {
          return {
            label: `${product.item.name} (${product.vendor.name})`,
            value: product
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
      },
      // Stuff for adding new items
      newItemName: '',
      newItemMinAmount: '',
      newItemUnits: '',
      // Stuff for adding new vendors
      newVendorName: '',
      newVendorPhoneNumber: '',
      newVendorStreetAddress: '',
      newVendorCity: '',
      newVendorZipCode: '',
      newVendorState: '',
      newVendorCountry: '',
      // Stuff for adding new products
      newProductItem: null,
      newProductVendor: null,
      newProductSku: '',
      newProductPrice: '',
      newProductPackageAmount: '',
      newProductSelectionReady: false,
      newProductSelectionValid: false,
      // Stuff for actually adding/deleting/editing items
      criticalActionDone: false, // AKA added/deleted item or vendor
      addRemovedProduct: false,
      // this is true when we are saving
      saving: false,
      // Import vendors option
      vendorSelect: '',
      nameOptions: '',
      skuOptions: '',
      priceOptions: '',
      amtOptions: '',
      rowStart: '',
      rowEnd: '',
      csvFile: ''
    }
  },
  methods: {
    // Translates rawData into type for the table
    toTableFormat(rawData, type) {
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
      this.refreshData(this.types.items).then(v => {
        done()
      })
    },
    refreshVendors (done) {
      this.refreshData(this.types.vendors).then(v => {
        done()
      })
    },
    refreshProducts (done) {
      this.refreshData(this.types.products).then(v => {
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
    // Refreshes the data of type specified
    refreshData (type) {
      return this.getData(type).then(d => {
        this[type + 'Actual'] = d

        // Convert data into ui options
        let newOptions = []
        d.forEach(v => {
          let converter = this.uiConverters[type]
          newOptions.push(converter(v))
        })

        // Store new options
        this[type + 'Options'] = newOptions

        return this.toTableFormat (d, type)
      }).then(tableData => {
        // Add editStatus to each variable
        tableData.forEach(row => {
          row.editStatus = this.statusTypes.none
        })

        let table = type + 'Data'
        this[table] = tableData
      })
    },
    // Refreshes all of the tables
    refreshAll () {
      return Promise.all([
        this.refreshData(this.types.items),
        this.refreshData(this.types.vendors),
        this.refreshData(this.types.products)
      ])
    },
    // Adds a new item to the table
    addNewItem() {
      // disallow if we added/removed product
      if (this.addRemovedProduct) {
        return
      }

      // Set critical flag to true
      this.criticalActionDone = true
      this.productsConf.selection = 'none'

      // Now add the item and clear out the field
      let item = {
        name: this.newItemName,
        minimumAmount: this.newItemMinAmount,
        units: this.newItemUnits
      }
      this.itemsNew.push(item)
      let convItem = this.converters.items([item])
      convItem[0].editStatus = this.statusTypes.new

      // Add item to the table
      this.itemsData.push(convItem[0])

      this.newItemName = ''
      this.newItemMinAmount = ''
      this.newItemUnits = ''
    },
    addNewVendor () {
      // Disallow if we added/removed product
      if (this.addRemovedProduct) {
        return
      }

      // Set critical flag to true
      this.criticalActionDone = true
      this.productsConf.selection = 'none'

      // Now add the vendor
      this.vendorsNew.push({
        name: this.newVendorName,
        phone: this.newVendorPhoneNumber,
        streetAddress: this.newVendorStreetAddress,
        city: this.newVendorCity,
        zipCode: this.newVendorZipCode,
        state: this.newVendorState,
        country: this.newVendorCountry
      })

      // Add it to the table
      let conv = this.converters.products([
        {
          name: this.newVendorName,
          phone: this.newVendorPhoneNumber,
          streetAddress: this.newVendorStreetAddress,
          city: this.newVendorCity,
          zipCode: this.newVendorZipCode,
          state: this.newVendorState,
          country: this.newVendorCountry
      }])

      conv[0].editStatus = this.statusTypes.new
      this.vendorsData.push(conv[0])

      // Clear out fields
      this.newVendorName = ''
      this.newVendorPhoneNumber = ''
      this.newVendorStreetAddress = ''
      this.newVendorCity = ''
      this.newVendorZipCode = ''
      this.newVendorState = ''
      this.newVendorCountry = ''
    },
    addNewProduct () {
      // Disallow if we added/removed item/vendor
      if (this.criticalActionDone) {
        return
      }

      // Set the added/removed flag
      this.addRemovedProduct = true
      this.itemsConf.selection = 'none'
      this.vendorsConf.selection = 'none'

      // Now add the product
      this.productsNew.push({
        itemId: this.newProductItem.id,
        vendorId: this.newProductVendor.id,
        sku: this.newProductSku,
        price: this.newProductPrice,
        packageAmount: this.newProductPackageAmount
      })

      // Add it to the table
      let conv = this.converters.products([
        {
          item: this.newProductItem,
          vendor: this.newProductVendor,
          sku: this.newProductSku,
          packageAmount: this.newProductPackageAmount,
          price: this.newProductPrice
      }])

      conv[0].editStatus = this.statusTypes.new
      this.productsData.push(conv[0])

      // Clear out fields
      this.newProductVendor = null
      this.newProductItem = null
      this.newProductSku = ''
      this.newProductPackageAmount = ''
      this.newProductPrice = ''
    },
    // Method to see if newProduct dialogs item and vendors are selected
    productIsVendorSelected () {
      let selected = this.newProductVendor !== undefined && this.newProductVendor !== null && this.newProductVendor.id !== undefined && this.newProductVendor.id !== ''
      return selected
    },
    productIsItemSelected() {
      let selected = this.newProductItem !== undefined && this.newProductItem !== null && this.newProductItem.id !== undefined && this.newProductItem.id !== ''
      return selected
    },
    // Makes sure that the product doesn't exist already
    newProductEnsureSelection () {
      // Now see if this combo exists
      let itemId = this.newProductItem.id
      let vendorId = this.newProductVendor.id
      let unique = true

      // See's if the product already exists
      this.productsActual.forEach(p => {
        if (itemId === p.item.id && vendorId === p.vendor.id) {
          unique = false
        }
      })

      this.newProductSelectionValid = unique
    },
    // Saves the changes done to the manage page
    saveChanges() {
      /*
      console.log('Item Changes')
      console.log(this.itemsEdits)
      console.log(this.itemsNew)
      console.log(this.itemsDelete)

      console.log('Vendor Changes')
      console.log(this.vendorsEdits)
      console.log(this.vendorsNew)
      console.log(this.vendorsDelete)

      console.log('Product Changes')
      console.log(this.productsEdits)
      console.log(this.productsNew)
      console.log(this.productsDelete)
      */

      // Convert product edits into server type
      let productEdits = []
      this.productsEdits.forEach(p => {
        productEdits.push(this.serverConverters.products(p))
      })

      // Make requests pertainning to items now
      this.saving = true

      let itemsSave = Promise.resolve()
      let itemsNew = Promise.resolve()
      let itemsDelete = Promise.resolve()

      if (this.itemsEdits.length > 0) {
        itemsSave = this.$http.patch(ResolveRoute('items'), this.itemsEdits).then(resp => {
          console.log('Items saved')
        }, err => {
          console.log(err)
        })
      }

      if (this.itemsNew.length > 0) {
        itemsNew = this.$http.put(ResolveRoute('items'), this.itemsNew).then(resp => {
          console.log('New Items added')
        }, err => {
          console.log(err)
        })
      }

      if (this.itemsDelete.length > 0) {
        itemsDelete = this.$http.delete(ResolveRoute('items'), { body: this.itemsDelete }).then(resp => {
          console.log('Items deleted')
        })
      }

      // Now make requests pertainning to vendors
      let vendorsSave = Promise.resolve()
      let vendorsNew = Promise.resolve()
      let vendorsDelete = Promise.resolve()

      if (this.vendorsEdits.length > 0) {
        vendorsSave = this.$http.patch(ResolveRoute('vendors'), this.vendorsEdits).then(resp => {
          console.log('vendors saved')
        }, err => {
          console.log(err)
        })
      }

      if (this.vendorsNew.length > 0) {
        vendorsNew = this.$http.put(ResolveRoute('vendors'), this.vendorsNew).then(resp => {
          console.log('New vendors added')
        }, err => {
          console.log(err)
        })
      }

      if (this.vendorsDelete.length > 0) {
        vendorsDelete = this.$http.delete(ResolveRoute('vendors'), { body: this.vendorsDelete }).then(resp => {
          console.log('vendors deleted')
        })
      }

      // Now make requests pertainning to products
      let productsSave = Promise.resolve()
      let productsNew = Promise.resolve()
      let productsDelete = Promise.resolve()

      if (productEdits.length > 0) {
        productsSave = this.$http.patch(ResolveRoute('products'), productEdits).then(resp => {
          console.log('products saved')
        }, err => {
          console.log(err)
        })
      }

      if (this.productsNew.length > 0) {
        productsNew = this.$http.put(ResolveRoute('products'), this.productsNew).then(resp => {
          console.log('New products added')
        }, err => {
          console.log(err)
        })
      }

      if (this.productsDelete.length > 0) {
        productsDelete = this.$http.delete(ResolveRoute('products'), { body: this.productsDelete }).then(resp => {
          console.log('products deleted')
        })
      }

      // Combine into mega request
      let all = Promise.all([itemsNew, itemsSave, vendorsDelete, vendorsNew, vendorsSave, vendorsDelete, productsNew, productsSave, productsDelete])

      all.then(v => {
        return this.refreshAll()
      }, err => {
        Toast.create('Failed to save changes')
        this.saving = false
      }).then(v => {
        Toast.create('Saved Changes')
        this.saving = false
        this.reset()
      }, err => {
        console.log(err)
        this.saving = false
        this.reset()
      })
    },
    discardChanges() {
      this.reset()

      // Refresh table
      this.saving = true
      this.refreshAll().then(v => {
        this.saving = false
      }, err => {
        console.log(err)
        this.saving = false
      })
    },
    reset() {
      // Discard changes
      this.itemsEdits = []
      this.itemsNew = []
      this.itemsDelete = []
      this.vendorsEdits = []
      this.vendorsNew = []
      this.vendorsDelete = []
      this.productsEdits = []
      this.productsNew = []
      this.productsDelete = []

      // Restore state
      this.criticalActionDone = false
      this.addRemovedProduct = false
      this.itemsConf.selection = 'multiple'
      this.vendorsConf.selection = 'multiple'
      this.productsConf.selection = 'multiple'
    },
    deleteRows(type, rows) {
      this[type + 'DeleteRows'](rows)

      let tableData = this[type + 'Data']
      let deletes = this[type + 'Delete']

      // Mark items as deleted
      rows.rows.forEach(r => {
        // Make sure that it isnt already deleted
        if (type !== this.types.products) {
          if (deletes.indexOf(r.data.id) !== -1) {
            console.log(`Already deleting ${r.data.id}`)
            return
          }
        } else {
          if (deletes.indexOf({ itemId: r.data.item.id, vendorId: r.data.vendor.id }) !== -1) {
            console.log(`Already deleting ${r.data.item.id}, ${r.data.vendor.id}`)
            return
          }
        }

        // Delete the item
        deletes.push(r.data.id)
        let te = r.data

        // Update edit status
        te.editStatus = this.statusTypes.delete
        te.name = r.data.name

        tableData.splice(r.index, 1)
        tableData.push(te)
      })
    },
    // Methods for handling delete
    itemsDeleteRows(rows) {
      // Set correct state
      this.criticalActionDone = true
      this.productsConf.selection = 'none'
    },
    vendorsDeleteRows(rows) {
      // set correct state
      this.criticalActionDone = true
      this.productsConf.selection = 'none'
    },
    productsDeleteRows(rows) {
      // Set correct state
      this.addRemovedProduct = true
      this.itemsConf.selection = 'none'
      this.vendorsConf.selection = 'none'
    },
    importProductSheet() {
      
    }
  },
  computed: {
    changesMade: function () {
      // Check new edits
      if (this.itemsEdits.length > 0 || this.vendorsEdits.length > 0 || this.productsEdits.length > 0) {
        return true
      }

      // Check for new entities
      if (this.itemsNew.length > 0 || this.vendorsNew.length > 0 || this.productsNew.length > 0) {
        return true
      }

      // Check for deletions
      if (this.itemsDelete.length > 0 || this.vendorsDelete.length > 0 || this.productsDelete.length > 0) {
        return true
      }

      return false
    }
  },
  watch: {
    newProductItem (newItem) {
      this.newProductSelectionReady = this.productIsVendorSelected() && this.productIsItemSelected()

      // If there is a selection, ensure its a unique selection
      if (this.newProductSelectionReady) {
        this.newProductEnsureSelection ()
      }
    },
    newProductVendor (newVendor) {
      this.newProductSelectionReady = this.productIsVendorSelected() && this.productIsItemSelected()

      if (this.newProductSelectionReady) {
        this.newProductEnsureSelection ()
      }
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
