export default {
  data() {
    return {
      finished: false,
      vendors: [
        {
          name: 'Loading...',
          address: 'ld'
        }
      ],
      items: [
        {
          label: 'Select a Vendor',
          value: 'sv'
        }
      ],
      selectedItems: { 0: false },
      selectedVendors: { 0: false },
      // Map for itemName -> itemId
      itemsMap: {},
      // Map for vendorName -> vendorId
      vendorsMap: {}
    }
  },
  computed: {
    itemReady() {
      let i = 0
      for (i = 0; i < items.length; ++i) {
        if (items[i].name === 'Loading...') {
          return false
        }
        if (selectedItems[i])
            return true
      }

      return false
    },
    vendorReady() {
      let i = 0

      for (i = 0; i < vendors.length; ++i) {
        if (vendors[i].name === 'Loading...') {
          return false
        }
        if (selectedVendors[i]) {
          console.log('Returned True')
          return true
        }
      }

      return false
    }
  },
  methods: {
    addStock () {
      
    }
  }
}
