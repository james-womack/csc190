﻿<template>
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
        <q-drawer-link icon="supervisor_account" to="manage">Manage</q-drawer-link>
      </div>
    </q-drawer>

    <router-view class="layout-view"></router-view>
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

      // Event for going to generate orders
      let _this = this

      // Event for going to import product page
      GlobalBus.$off('importProduct')
      GlobalBus.$on('importProduct', function () {
        _this.$router.push('importProduct')
      })

      // Event for going to view order page
      GlobalBus.$off('showOrder')
      GlobalBus.$on('showOrder', function (val) {
        GlobalBus.showOrder = val
        _this.$router.push('vieworder')
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
