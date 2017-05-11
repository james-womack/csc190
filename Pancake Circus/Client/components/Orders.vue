<template>
  <div>
    <div class="layout-padding">
      <div class="list">
        <q-collapsible icon="add" label="Generate Order">
          <div style="padding: 8px">
            <div class="floating-label">
              <input required v-model.number="safetyFactor" type="number"/>
              <label>Safety Factor</label>
            </div>
            <label>Perferred Vendor: </label>
            <q-select
              style="margin-left: 8px"
              type="list"
              v-model="perferredVendor"
              :options="vendorOptions"></q-select>
            <br />
            <button style="margin-top: 8px" class="primary" @click="generateOrder()">Generate Order</button>
          </div>
          
        </q-collapsible>
      </div>
      <br />
      <q-data-table :data="table" :config="config" :columns="columns" @refresh="refresh">
        <template slot="col-id" scope="cell">
          <button class="primary small clear" @click="showOrder(cell.data)">
            {{ cell.data }}
          </button>
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

<script src="../scripts/Orders.js">
</script>

