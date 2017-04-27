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
    this.$http.get(ResolveRoute('vendors')).then(resp => {
      // Return the JSON form
      return resp.json()
    }, err => {
      console.log(err);

      // Tell them it errored out
    }).then(val => {
      this.selectedVendors = {}
      for (let i = 0; i < val.length; ++i) {
        this.selectedVendors[i] = false
      }
      this.vendors = val
    })
  },
  methods: {
    addVendor() {
      createVendor().then(data => {
      }, err => {
        Toast.create('User Cancelled')
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
    }
  }
}
