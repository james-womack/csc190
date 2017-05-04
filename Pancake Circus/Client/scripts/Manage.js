import { Dialog, Toast } from 'quasar'
import { createVendor, createItem } from '../scripts/Dialog'
import { clone } from '../scripts/Utility'

// Configs for all three tables
let itemsTableConfig = {
  rowHeight: '50px',
  title: 'Possible Items',
  refresh: false,
  columnPicker: false,
  selection: 'none'
}
let vendorsTableConfig = {
  rowHeight: '50px',
  title: 'All Vendors',
  refresh: false,
  columnPicker: false,
  selection: 'none'
}
let productsTableConfig = {
  rowHeight: '50px',
  title: 'Products from All Vendors',
  refresh: false,
  columnPicker: true,
  selection: 'none'
}

// Columns for all three tables
let itemsTableColumns = [
  {
    label: 'Name',
    field: 'name',
    filter: true,
    width: '100px'
  },
  {
    label: 'Minimum Amount',
    field: 'minimumAmount',
    width: '50px'
  },
  {
    label: 'Units',
    field: 'units',
    width: '50px'
  }
]
let vendorsTableColumns = [
  {
    label: 'Name',
    field: 'name',
    filter: true,
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
  }
]
let productsTableColumns = [
  {
    label: 'Item Name',
    field: 'itemName',
    filter: true,
    width: '80px'
  },
  {
    label: 'Vendor Name',
    field: 'vendorName',
    filter: true,
    width: '80px'
  },
  {
    label: 'Price',
    field: 'price',
    width: '60px',
    // Show cents as dollars
    format (value, row) {
      return `$${(value/100).toFixed(2)}`
    }
  },
  {
    label: 'SKU',
    field: 'sku',
    width: '120px'
  }
]

export default {
  data () {
    return {
      itConf: itemsTableConfig,
      itCols: itemsTableColumns,
      itData: [],
      vtConf: vendorsTableConfig,
      vtCols: vendorsTableColumns,
      vtData: [],
      ptConf: productsTableConfig,
      ptCols: productsTableColumns,
      ptData: [],
      converters: {
        item (rawItems) {
          return rawItems
        },
        vendor (rawVendors) {
          let v = []
          rawVendors.forEach(vendor => {
            let vendorCpy = clone(vendor)
            vendorCpy.address = `${vendor.streetAddress} ${vendor.city}, ${vendor.state}, ${vendor.zipCode}, ${vendor.country}`
            v.push(vendorCpy)
          })

          return v
        },
        product (rawProducts) {
          let p = []
          rawProducts.forEach(prod => {
            let prodCpy = clone(prod)
            prodCpy.itemName = prod.item.name
            prodCpy.vendorName = prod.vendor.name
            p.push(prodCpy)
          })

          return p
        }
      }
    }
  },
  methods: {
    
  }
}
