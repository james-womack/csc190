export default {
  methods: {
    add() {
      this.count++
    }
  },
  data() {
    return {
      count: 0,
      vendorOptions: [
        {
          label: 'Costco',
          value: 'costco'
        }
      ],
      vendorSelect: '',
      nameOptions: '',
      skuOptions: '',
      priceOptions: '',
      amtOptions: '',
      rowStart: '',
      rowEnd: '',
      csvFile: ''

    }
  }
}
