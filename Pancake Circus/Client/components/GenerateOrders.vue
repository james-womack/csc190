<template>
  <div>
    <div class="layout-padding">
      <q-data-table :data="table" :config="config" :columns="columns" @refresh="refresh">
        <template slot="col-orderAmount" scope="cell">
          <button class="green clear small" @click="editValue(editTypes.orderAmount, cell.row)">
            {{ cell.data }}
          </button>
        </template>

        <template slot="col-editStatus" scope="cell">
          <div v-if="cell.data == statusTypes.edit">
            <i>edit</i>
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, -10]">
              Edited Item
            </q-tooltip>
          </div>
          <div v-else-if="cell.data == statusTypes.new">
            <i>new_releases</i>
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, -10]">
              New Item
            </q-tooltip>
          </div>
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
