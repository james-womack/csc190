<template>
  <div>
    <div class="layout-padding">
      <div class="card" style="max-width: 500px">
        <div class="card-title">
          Login/Register
        </div>
        <div class="card-content">

          <div>
            <div class="layout-padding">
              <p class="caption">Login</p>
              <small>Default:</small>
              <input v-model="username">
                <br>
                  <small>Password:</small>
                  <input type="password" v-model="password">
            </div>
          </div>

          <div>
            <div class="layout-padding">
              <p class="caption">Register</p>
              <small>Username:</small>
              <input v-model="username">
                <br>
                  <small>Password:</small>
                  <input type="password" v-model="password">
                    <br>
                      <small>Password</small>
                      <input type="password" v-model="password">
                    </br>
                    
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/Login.js">
</script>