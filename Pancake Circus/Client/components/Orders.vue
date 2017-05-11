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
            <button style="margin-top: 8px" class="primary" @click="gotoGenerate()">Generate Order</button>
          </div>
          
        </q-collapsible>
      </div>
      <br />
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

<script src="../scripts/Orders.js">
</script>

