import { Dialog } from 'quasar'

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

export { createVendor }
