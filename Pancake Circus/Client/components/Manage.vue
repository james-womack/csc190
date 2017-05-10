<template>
  <div>
    <q-tabs
      :refs="$refs"
      default-tab="itemsTab"
      class="secondary shadow-1 justified"
      style="padding-top: 5px">
        <q-tab name="itemsTab" icon="restaurant_menu">Items</q-tab>
        <q-tab name="vendorsTab" icon="store">Vendor</q-tab>
        <q-tab name="productsTab" icon="local_shipping">Products</q-tab>
    </q-tabs>

    <!-- Tabs for items -->
    <div class="layout-padding">
      <div ref="itemsTab">
        <!-- Add item accordian -->
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
              <button v-if="newItemName.length > 0 && newItemUnits.length > 0 && newItemMinAmount > 0" 
                      class="primary" 
                      style="margin-top: 8px"
                      @click="addNewItem()">
                Add Item
              </button>
              <button v-else class="primary disabled" style="margin-top: 8px">
                Add Item
              </button>
            </div>
          </q-collapsible>
        </div>
        <br />
        <!-- Data table for items -->
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
      <!-- Vendors tab -->
      <div ref="vendorsTab">
        <div class="list">
          <q-collapsible icon="add" label="Add Vendor">
            <div style="padding: 8px">
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newVendorName" type="text" />
                <label>Name</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newVendorPhoneNumber" type="text" />
                <label>Phone Number</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newVendorStreetAddress" type="text" />
                <label>Street Address</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newVendorCity" type="text" />
                <label>City</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newVendorZipCode" type="text" />
                <label>Zip Code</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newVendorState" type="text" />
                <label>State</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newVendorCountry" type="text" />
                <label>Country</label>
              </div>
              <br />
              <button v-if="newVendorName.length > 0 && newVendorPhoneNumber.length > 0 && newVendorCity.length > 0 && newVendorZipCode.length > 0 && newVendorState.length > 0 && newVendorCountry.length > 0"
                      class="primary"
                      style="margin-top: 8px"
                      @click="addNewVendor()">
                Add Vendor
              </button>
              <button v-else class="primary disabled" style="margin-top: 8px">
                Add Vendor
              </button>
            </div>
          </q-collapsible>
        </div>
        <br />
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
      <!-- Products Tab -->
      <div ref="productsTab">
        <!-- Add product accordian -->
        <div class="list">
          <q-collapsible icon="add" label="Add Product">
            <div style="padding: 8px">
              <q-select
                style="margin-right: 8px"
                type="list"
                @input="newProductItemSelected"
                v-model="newProductItem"
                :options="itemsOptions"
                label="Item"></q-select>
              <q-select
                type="list"
                @input="newProductVendorSelected"
                v-model="newProductVendor"
                :options="vendorsOptions"
                label="From Vendor"></q-select>
              <br/>
              <div class="floating-label">
                <input required class="full-width" v-model.trim="newProductSku" type="text" />
                <label>SKU</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.number="newProductPrice" type="number" />
                <label>Price</label>
              </div>
              <div class="floating-label">
                <input required class="full-width" v-model.number="newProductPackageAmount" type="number" />
                <label>Package Amount</label>
              </div>
              <button v-if="newProductSelectionValid && newProductSku.length > 0 && newProductPrice > 0 && newProductPackageAmount > 0" 
                      class="primary" 
                      style="margin-top: 8px" 
                      @click="addNewProduct()">
                Add Product
              </button>
              <button v-else class="primary disabled" style="margin-top: 8px">
                Add Product
              </button>
            </div>
          </q-collapsible>
        </div>
        <br/>
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
