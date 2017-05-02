<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="openSeseame" >
        <i class="material-icons md-48">menu</i>
      </button>
      <q-toolbar-title :padding="1">
        Pancake Circus
      </q-toolbar-title>
    </div>

    <q-drawer ref="drawer">
      <div class="toolbar light">
        <q-toolbar-title :padding="1">
          <i>home</i>
          Main
        </q-toolbar-title>
      </div>
      <div class="list platform-delimiter">
        <q-drawer-link icon="assessment" to="inventory">Inventory</q-drawer-link>
        <q-drawer-link icon="assignment" to="orders">Orders</q-drawer-link>
        <q-drawer-link icon="face" to="vendors">Vendors</q-drawer-link>
        <q-drawer-link icon="supervisor_account" to="manage">Manage</q-drawer-link>
        <q-drawer-link icon="import_export" to="vendorimport">Import Product</q-drawer-link>
        <q-drawer-link icon="account_circle" to="login">Login</q-drawer-link>"
      </div>
    </q-drawer>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <router-view class="layout-view"></router-view>
    <!--
    <div class="layout-view">
      <div class="logo-container non-selectable no-pointer-events">
        <div class="logo" :style="position">
          <img src="~assets/quasar-logo.png">
          <p class="caption text-center">
            <span class="desktop-only">Your a ass</span>
            <span class="touch-only">Touch screen and move.</span>
          </p>
        </div>
      </div>
    </div>
    -->
  </q-layout>
</template>

<script>
import { GlobalBus } from '../scripts/Utility'

export default {
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    openSeseame (event) {
      this.$refs.drawer.open()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$router.replace('inventory')
      GlobalBus.$off('newStock')
      let _this = this
      GlobalBus.$on('newStock', function () {
        _this.$router.push('newstock')
      })
    })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">
.logo-container
  width 192px
  height 268px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
</style>
