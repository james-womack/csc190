import { Platform, Utils, Toast, Dialog, ActionSheet } from 'quasar'
import { Clone, ResolveRoute, GlobalBus } from '../scripts/Utility'


let tableConfig = {
  rowHeight: '50px',
  title: 'Vendors',
  refresh: true,
  columnPicker: true,
  leftStickyColumns: 1,
  rightStickyColumns: 2,
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

let tableColumns = [
  {
    label: 'Name',
    field: 'name',
    width: '80px',
    filter: true,
    sort: 'string'
  },
  {
    label: 'Phone Number ',
    field: 'phoneNumber',
    width: '100px',
    filter: true,
    sort: 'string'
  },
  {
    label: 'Address',
    field: 'address',
    width: '200px',
    filter: true,
    sort: 'string'
  }
];

export default {
  data() {
    return {
      table: [],
      config: tableConfig,
      columns: tableColumns,
      edits: {
        delete: [],
        change: []
      }
    };
  },
  methods: {
    commitEdits() {
      let deleteOp = Promise.resolve();
      let editOp = Promise.resolve();

      // Resolve all of the requests to the server
      if (this.edits.delete.length !== 0) {
        deleteOp = this.$http.delete(ResolveRoute('vendor'), { body: this.edits.delete })
      }
      if (this.edits.change.length !== 0) {
        editOp = this.$http.patch(ResolveRoute('vendor'), this.edits.change)
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
    addVendor() {
      GlobalBus.$emit('newVendor')
    },
    discardEdits() {
      this.edits.change = []
      this.edits.delete = []
      this.refresh(() => { })
    },
    deleteRows(props) {
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
        message: `This will delete the following vendor: [${str.substr(0, str.length - 2)}]`,
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
      return this.$http.get(ResolveRoute('vendor')).then(response => {
        const resp = response.json();
        console.log(response.status);
        return resp;
      },
        err => {
          log(err);
        });
    },
    toTableFormat(obj) {
      const newData = [];
      for (let val of obj) {
        newData.push({
          address: `${val.streetAddress}, ${val.city} ${val.state}, ${val.zipCode}`,
          phoneNumber: {
            number: val.phone,
            numberLink: `tel:+${val.phone.replace(/-|\s/g, "")}`
          },
          name: val.name,
          id: val.id,
          streetAddress: val.streetAddress,
          city: val.city,
          state: val.state,
          zipCode: val.zipCode
        });
      }
      return newData;
    },
    editAddress(row) {
      console.log(`${row.address}`)
    },
    editNumber(row) {
      ActionSheet.create({
        title: "Actions", 
        //Gallery mode
        gallery: true, 

        // what you want to do
        actions: [
          {
            label: 'Delete',
            icon: 'delete',

            handler: function () {
              console.log('Deleted Article')
            }
          },
          {
            label: 'Call',
            icon: 'call',
            handler: this.handleCall
          },
          {
            label: 'Edit Number',
            icon: 'mode_edit',
            handler: this.handleEdit
          }
        ]
      })
      console.log(row)
    },
    addChange(data) {
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
        cost: data.cost,
        vendor: data.vendor,
        vendorId: data.vendorId,
        itemId: data.itemId
      })

      console.log(tableIndex)
      console.log(this.table[tableIndex])

      this.table[tableIndex].amount = data.amount
      console.log(this.edits)
    }
  },
  mounted() {
    const resp = this.getNewData();
    resp.then(obj => {
      this.table = this.toTableFormat(obj);
    });
  }
}