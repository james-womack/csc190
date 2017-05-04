
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
        <span class="label">Name</span>
        <input v-model="nameOptions" placeholder="A">
        <span class="label">SKU</span>
        <input v-model="skuOptions" placeholder="B">
        <span class="label">Price</span>
        <input v-model="priceOptions" placeholder="C">
        <span class="label">Amount</span>
        <input v-model="amtOptions" placeholder="D">
        <div>
          <span class="label">Row Start</span>
          <input v-model="rowStart" placeholder="0">
          <span class="label">Row End</span>
          <input v-model="rowEnd">
        </div>
        <div>
          <span class="label">CSV File Upload:</span>
          <input v-model="csvFile">
          <button class="light relative-position">
            Browse Files
            <span class="floating label circular bg-primary text-white"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/VendorImport.js">

</script>
