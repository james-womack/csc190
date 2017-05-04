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
          :data="itData"
          :config="itConf"
          :columns="itCols">

        </q-data-table>
      </div>
      <div ref="vendorsTab">
        <q-data-table
          :data="vtData"
          :config="vtConf"
          :columns="vtCols">

        </q-data-table>
      </div>
      <div ref="productsTab">
        <q-data-table
          :data="ptData"
          :config="ptConf"
          :columns="ptCols">

        </q-data-table>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/Manage.js">
</script>
