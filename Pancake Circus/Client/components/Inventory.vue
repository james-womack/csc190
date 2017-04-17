<template>
  <div>
    <div class="layout-padding">
      <q-data-table :data="table" :config="config" :columns="columns" @refresh="refresh">
        <template slot="col-location" scope="cell">
          <span class="label">{{ cell.data }}</span>
        </template>
        <template slot="col-amount" scope="cell">  
          <button v-if="cell.row.amount >= cell.row.minAmount" class="green small round" @click="editAmount(cell.row)">{{ cell.data }}</button>
          <button v-else class="red small round" @click="editAmount(cell.row)">{{ cell.data }}</button>
        </template>
        <template slot="col-location" scope="cell">
          <button class="blue clear small" @click="editLocation(cell.row)">{{ cell.data }}</button>
        </template>

        <template slot="selection" scope="props">
          <button class="primary clear" @click="deleteRows(props)">
            <i>delete</i>
          </button>
        </template>
      </q-data-table>
    </div>
  </div>
</template>

<script src="../scripts/Inventory.js">
</script>
