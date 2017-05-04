<template>
  <div>
    <div class="layout-padding">
      <q-data-table :data="table" :config="config" :columns="columns" @refresh="refresh">
        <template slot="col-source" scope="cell">
          <span class="label">{{ cell.data }}</span>
        </template>

        
        <template slot="selection" scope="props">
          <button class="primary clear" @click="deleteRows(props)">
            <i>delete</i>
          </button>
          <button v-back-to-top.animate="{offset: 500, duration: 200}"
                  class="primary circular fixed-bottom-right animate-pop"
                  style="margin: 0 15px 15px 0">
            <i>keyboard_arrow_up</i>
          </button>
        </template> 
      </q-data-table>
    </div>
  </div>
</template>

<script src="../scripts/GenerateOrders.js">
</script>
