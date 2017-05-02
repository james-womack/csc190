<template>
  <div>

    <q-tabs
          :refs="$refs"
          default-tab="loginTab"
          class="primary shadow-1"
          style="padding-top: 5px"
        >
      <q-tab name="loginTab" icon="person">Login</q-tab>
      <q-tab name="registerTab" icon="person_add">Register</q-tab>
    </q-tabs>

    <div class="layout-padding">
      <div ref="loginTab">
        <p class="caption">Login:</p>
        <input type="email" v-model="loginUsername" placeholder="Email"></input>
        <br/>
        <input type="password" v-model="loginPassword" placeholder="Password"></input>
        <br/>
        <button class="primary" @click="login()">Login</button>
      </div>
      <div ref="registerTab">
        <p class="caption">Register:</p>
        <input type="email" v-model="registerEmail" placeholder="Email"></input>
        <br/>
        <input type="password" placeholder="Password" v-model="registerPassword"></input>
        <br/>
        <input type="password" placeholder="Confirm Password" v-model="registerConfirmPassword"></input>
        <br/>
        <button class="primary" @click="register()">Register</button>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/Login.js">
</script>
