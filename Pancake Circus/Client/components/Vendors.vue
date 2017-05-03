<template>
  <div>
    <q-fab class="absolute-bottom-right"
           @click="commitEdits()"
           classNames="primary"
           active-icon="save"
           direction="up"
           v-show="edits.change.length !== 0 || edits.delete.length !== 0"
           style="right: 14px; bottom: 14px;">
      <q-small-fab class="red" @click.native="discardEdits()" icon="delete_forever"></q-small-fab>
    </q-fab>
    <button class="green circular absolute-bottom-right"
            @click="addVendor()"
            v-show="edits.change.length === 0 && edits.delete.length === 0"
            id="addButton">
      <i>add</i>
    </button>
    <div class="layout-padding">
      <q-data-table :data="table" :config="config" :columns="columns" @refresh="refresh">
        <template slot="col-source" scope="cell">
          <span class="label">{{ cell.data }}</span>
        </template>
        <template slot="col-phoneNumber" scope="cell">
          <button class="primary small round" @click="editNumber(cell.row)">{{ cell.data.number }}</button>
        </template>
        <template slot="col-address" scope="cell">
          <button class="blue clear small" @click="editAddress(cell.row)">{{ cell.data }}</button>
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

<script src="../scripts/Vendors.js">
</script>
