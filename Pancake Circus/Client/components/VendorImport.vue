
<template>
  <div class="layout-padding">
    <div class="card">
      <div class="card-title">
        Import Product
      </div>
      <div class="card-content">
        <span class="label">Vendor</span>
        <q-select type="radio" 
                  v-model="vendorSelect" 
                  :options="vendorOptions"></q-select>
        <p class="caption">Column In Excel:</p>
        <div style="padding: 5px">
          <span class="label">Name</span>
          <input v-model="nameOptions" placeholder="A">
          <span class="label">SKU</span>
          <input v-model="skuOptions" placeholder="B">
          <span class="label">Price</span>
          <input v-model="priceOptions" placeholder="C">
          <span class="label">Amount</span>
          <input v-model="amtOptions" placeholder="D">
        </div>
        <div style="padding: 5px">
          <span class="label">Row Start</span>
          <input v-model="rowStart" placeholder="0">
          <span class="label">Row End</span>
          <input v-model="rowEnd">
        </div>
        <div style="padding: 5px">
          <span class="label">CSV File Upload:</span>
          <input v-model="csvFile">
          <button class="light">
            Browse Files
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/VendorImport.js">

</script>
