export default {
  data() {
    return {
      loginUsername: '',
      loginPassword: '',
      registerEmail: '',
      registerPassword: '',
      registerConfirmPassword: ''
    }
  },
  methods: {
    login() {
      console.log('You logged in!')
    },
    register() {
      console.log('You Registered')
    }
  }
}