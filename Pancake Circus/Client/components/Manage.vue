<template>
  <div>
    <q-tabs
      :refs="$refs"
      default-tab="itemsTab"
      class="warning shadow-1 justified"
      style="padding-top: 5px">
        <q-tab name="itemsTab" icon="restaurant_menu">Items</q-tab>
        <q-tab name="vendorsTab" icon="store">Vendor</q-tab>
        <q-tab name="productsTab" icon="local_shipping">Products</q-tab>
    </q-tabs>

    <!-- Tabs for items -->
    <div class="layout-padding">
      <div ref="itemsTab">
        <div class="list">
          <q-collapsible icon="add" label="Add Item">
            <div style="padding: 8px">
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newItemName" type="text"/>
                <label>Name</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.number="newItemMinAmount" type="number"/>
                <label>Minimum Amount</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newItemUnits" type="text"/>
                <label>Units</label>
              </div>
              <br/>
              <button v-if="newItemName.length > 0 && newItemUnits.length > 0 && newItemMinAmount > 0" class="primary" style="margin-top: 8px">
                Add Item
              </button>
              <button v-else class="primary disabled" style="margin-top: 8px">
                Add Item
              </button>
            </div>
          </q-collapsible>
        </div>
        <br />
        <q-data-table
          :data="itemsData"
          :config="itemsConf"
          :columns="itemsCols"
          @refresh="refreshItems">
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
            <div v-else></div>
          </template>
          <template slot="col-name" scope="cell">
            <button class="primary clear small" @click="editValue(editTypes.itemName, cell.row)">{{ cell.data }}</button>
          </template>

          <template slot="col-minimumAmount" scope="cell">
            <button class="green clear small" @click="editValue(editTypes.minimumAmount, cell.row)">{{ cell.data }}</button>
          </template>

          <template slot="col-units" scope="cell">
            <button class="primary clear small" @click="editValue(editTypes.units, cell.row)">{{ cell.data }}</button>
          </template>
        </q-data-table>
      </div>
      <div ref="vendorsTab">
        <q-data-table
          :data="vendorsData"
          :config="vendorsConf"
          :columns="vendorsCols"
          @refresh="refreshVendors">
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
            <div v-else></div>
          </template>
          <template slot="col-name" scope="cell">
            <button class="primary clear small" @click="editValue(editTypes.vendorName, cell.row)">{{ cell.data }}</button>
          </template>

          <template slot="col-phone" scope="cell">
            <button class="primary clear small" @click="editValue(editTypes.phone, cell.row)">{{ cell.data }}</button>
          </template>
        </q-data-table>
      </div>
      <div ref="productsTab">
        <q-data-table
          :data="productsData"
          :config="productsConf"
          :columns="productsCols"
          @refresh="refreshProducts">
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
              <div v-else></div>
            </template>
            <template slot="col-packageAmount" scope="cell">
              <button class="green small clear" @click="editValue(editTypes.packageAmount, cell.row)">{{ cell.data }}</button>
            </template>

          <template slot="col-price" scope="cell">
            <button class="green small clear" @click="editValue(editTypes.price, cell.row)">{{ '$' + (cell.data/100).toFixed(2) }}</button>
          </template>

          <template slot="col-sku" scope="cell">
            <button class="primary clear small" @click="editValue(editTypes.sku, cell.row)">{{ cell.data }}</button>
          </template>
        </q-data-table>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/Manage.js">
</script>
