<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.drawer.open()" >
        <i class="material-icons md-48">account_circle</i>
      </button>
      <q-toolbar-title :padding="1">
        Pancake Circus
      </q-toolbar-title>
    </div>

    <q-drawer ref="drawer">
      <div class="list platform-delimiter">
        <div class="list-header">
          Main
        </div>
        <q-drawer-link to="inventory">Inventory</q-drawer-link>
        <q-drawer-link to="orders">Orders</q-drawer-link>
        <q-drawer-link to="vendors">Vendors</q-drawer-link>
        <q-drawer-link to="manage">Manage</q-drawer-link>
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
var moveForce = 30
var rotateForce = 40

import { Utils } from 'quasar'

export default {
  data () {
    return {
      moveX: 0,
      moveY: 0,
      rotateY: 0,
      rotateX: 0
    }
  },
  computed: {
    position () {
      let transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
      return {
        top: this.moveY + 'px',
        left: this.moveX + 'px',
        '-webkit-transform': transform,
        '-ms-transform': transform,
        transform
      }
    }
  },
  methods: {
    move (event) {
      const {width, height} = Utils.dom.viewport()
      const {top, left} = Utils.event.position(event)
      const halfH = height / 2
      const halfW = width / 2

      this.moveX = (left - halfW) / halfW * -moveForce
      this.moveY = (top - halfH) / halfH * -moveForce
      this.rotateY = (left / width * rotateForce * 2) - rotateForce
      this.rotateX = -((top / height * rotateForce * 2) - rotateForce)
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.addEventListener('mousemove', this.move)
      document.addEventListener('touchmove', this.move)
    })
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.move)
    document.removeEventListener('touchmove', this.move)
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
