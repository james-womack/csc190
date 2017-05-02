
<template>
<div style="padding: 15px;">
          <div ref="tab-1">
            <div v-for="n in 5">Tab 1</div>
          </div>
          <div ref="tab-2">
            <div v-for="n in 10">Tab 2</div>
          </div>
          <div ref="tab-3">
            <div v-for="n in 7">Tab 3</div>
          </div>
          <div ref="tab-4">
            <div v-for="n in 4">Tab 4</div>
          </div>
          <div ref="tab-5">
            <div v-for="n in 2">Tab 5</div>
          </div>
        </div>
      </div>
</template>

<script>
  export default {
  data () {
  return {
  search: ''
  }
  }
  }
</script>