﻿import Vue from 'vue'
import Config from 'config'

console.log(Config)

function clone (obj) {
  var copy

  // Handle the 3 simple types, and null or undefined
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr])
      }
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

function ResolveRoute (route) {
  return `${Config.server}api${route.startsWith('/') ? '' : '/'}${route}`
}

var GlobalBus = new Vue({
  data: {
    showOrder: null
  }
})

export { clone, ResolveRoute, GlobalBus }
