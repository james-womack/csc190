import { ResolveRoute } from '../scripts/Utility'
import { createVendor } from '../scripts/Dialogs'
import { Toast } from 'quasar'

export default {
  data() {
    return {
      finished: false,
      serverError: false,
      vendors: [],
      items: [],
      selectedItems: { 0: false },
      selectedVendors: { 0: false },
      selectedVendorsAmt: 0,
      vendorsReady: false,
      // Map for itemName -> itemId
      itemsMap: {},
      // Map for vendorName -> vendorId
      vendorsMap: {}
    };
  },
  computed: {
    isReady() {
      return this.isMounted !== undefined && this.isMounted
    },
    // Sees if we have selected any items
    itemReady() {
      let i = 0
      for (i = 0; i < this.items.length; ++i) {
        if (this.selectedItems[i])
          return true
      }

      return false
    },
    // Sees if we are loading vendors from the databse right now
    isLoadingVendors() {
      if (this.vendors !== undefined && this.vendors.length > 0) {
        return false
      }

      return true
    }
  },
  mounted() {
    this.reloadVendors()
  },
  methods: {
    reloadVendors() {
      return this.$http.get(ResolveRoute('vendors')).then(resp => {
          // Return the JSON form
          return resp.json()
        },
        err => {
          console.log(err);

          // Tell them it errored out
          this.serverError = true
        }).then(val => {
        this.selectedVendors = {}
        for (let i = 0; i < val.length; ++i) {
          this.selectedVendors[i] = false
        }
        this.vendors = val
      })
    },
    addVendor() {
      createVendor().then(data => {
          return this.$http.put(ResolveRoute('vendors'), data)
        },
        err => {
          Toast.create('User Cancelled')
        }).then(resp => {
        console.log('Added Vendor')
        return this.reloadVendors()
      }).then(x => {
        console.log('Reloaded vendors')
      })
    },
    addStock () {

    },
    selectVendor(index) {
      if (this.selectedVendors[index] === false) {
        this.selectedVendorsAmt -= 1
      } else {
        this.selectedVendorsAmt += 1
      }
    },
    loadProducts (next) {
      // Check to see if all vendors have an ID
      let needToLoadVendors = false
      this.vendors.forEach(x => {
        if (x.vendorId === undefined || x.vendorId === null) {
          needToLoadVendors = true
        }
      })

      let prom = Promise.resolve()
      if (needToLoadVendors) {
        // Load vendors
        prom = this.reloadVendors()
      }

      // Get a list of only vendorIds
      let vendorList = []
      console.log(this.vendors)
      this.vendors.forEach(vendor => {
        vendorList.push(vendor.id)
      })
      console.log(vendorList)

      prom.then(x => {
        return this.$http.post(ResolveRoute('products/fromVendors'), vendorList)
      }, err => {
        Toast.create('Failed to load items')
        console.log(err)
      }).then(resp => {
        // Get the json from product list
        return resp.json()
      }, err => {
        Toast.create('Failed to load products')
        console.log(err)
      }).then(products => {
        // Load in vendors now and go to next step
        console.log(products)
      })
    }
  }
}
