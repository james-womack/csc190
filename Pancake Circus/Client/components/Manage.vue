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

    <div class="layout-padding">
      <div ref="itemsTab">
        <q-data-table
          :data="itemsData"
          :config="itemsConf"
          :columns="itemsCols"
          @refresh="refreshItems">
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
