<template>
  <q-data-table :data="table" :config="config" :columns="columns" @refresh="refresh">
    <template slot="col-source" scope="cell">
      <span class="label">{{ cell.data }}</span>
    </template>
  </q-data-table>
</template>

<script src="../scripts/Vendors.js">
</script>
