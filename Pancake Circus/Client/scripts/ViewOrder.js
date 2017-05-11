import { Toast } from 'quasar'

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
    width: '100px'
  },
  {
    label: 'Vendor',
    field: 'vendorName',
    filter: true,
    sort: 'string',
    width: '100px'
  }
]

export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  }
}
