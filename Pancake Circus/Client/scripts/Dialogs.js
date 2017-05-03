import { Dialog, Toast } from 'quasar'

// Creates a vendor using a dialog
function createVendor () {
  return new Promise(function (resolve, reject) {
    Dialog.create({
      title: 'Create a new Vendor',
      form: {
        name: {
          type: 'textbox',
          label: 'Name',
          model: ''
        },
        phone: {
          type: 'textbox',
          label: 'Phone Number',
          model: ''
        },
        streetAddress: {
          type: 'textbox',
          label: 'Street Address',
          model: ''
        },
        city: {
          type: 'textbox',
          label: 'City',
          model: ''
        },
        zipCode: {
          type: 'textbox',
          label: 'Zip Code',
          model: ''
        },
        state: {
          type: 'textbox',
          label: 'State',
          model: ''
        },
        country: {
          type: 'textbox',
          label: 'Country',
          model: ''
        }
      },
      buttons: [
        {
          label: 'Cancel',
          handler (data) {
            reject(Error('User Cancelled'))
          }
        },
        {
          label: 'Create',
          handler (data) {
            resolve(data)
          }
        }
      ]
    })
  })
}

// Create new item
function createItem () {
  return new Promise(function (resolve, reject) {
    Dialog.create({
      title: 'Create a new Item',
      form: {
        name: {
          type: 'textbox',
          label: 'Name',
          model: ''
        },
        units: {
          type: 'textbox',
          label: 'Units',
          model: ''
        },
        minimumAmount: {
          type: 'numeric',
          label: 'Minimum Amount',
          model: 0
        }
      },
      buttons: [
        {
          label: 'Cancel',
          handler (data) {
            reject(Error('User Cancelled'))
          }
        },
        {
          label: 'Create',
          preventClose: true,
          handler (data, close) {
            if (data.minimumAmount > 0) {
              close(() => {
                resolve(data)
              })
              return
            }
            Toast.create('Error: Minimum amount must be greater than 0')
          }
        }
      ]
    })
  })
}

export { createVendor, createItem }
