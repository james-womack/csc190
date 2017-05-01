<template>
    <div class="layout-padding">
  <q-data-table :data="table" :config="config" :columns="columns" @refresh="refresh">
    <template slot="col-source" scope="cell">
      <span class="label">{{ cell.data }}</span>
    </template>
  </q-data-table>
        </div>
</template>

<script src="../scripts/Vendors.js">
</script>
