<template>
  <div>
    <q-fab v-if="edits.change.length !== 0 || edits.delete.length !== 0"
           class="absolute-bottom-right"
           @click="commitEdits()"
           classNames="primary"
           active-icon="save"
           icon="keyboard_arrow_up"
           direction="up"
           style="right: 14px; bottom: 14px; z-index: 99;">
      <q-small-fab class="red" @click.native="discardEdits()" icon="delete_forever"></q-small-fab>
    </q-fab>
    <q-fab v-else 
           class="absolute-bottom-right"
           @click="addStock()"
           classNames="green"
           active-icon="add"
           icon="keyboard_arrow_up"
           direction="up"
           style="right: 14px; bottom: 14px; z-index: 99">
           <q-small-fab class="blue" @click.native="addVendor()" icon="person_add"></q-small-fab>
           <q-small-fab class="blue" @click.native="addItem()" icon="create"></q-small-fab>
    </q-fab>
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

<style>
  #addButton {
    right: 18px;
    bottom: 18px;
  }
</style>

<script src="../scripts/Inventory.js">
</script>
