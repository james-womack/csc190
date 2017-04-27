<template>
    <div>
        <div class="layout-padding">
            <q-transition name="slide">
                <q-stepper @finish="addStock()" ref="addStock" v-show="!finished">
                  <q-step title="Select Vendors" :ready="selectedVendorsAmt > 0">
                    Select what vendors you'll want to add stock from manually, or <a @click="addVendor()">add one</a> 
                    <br/><br/>
                    <!-- Show progress bar if we are still loading vendors -->
                    <q-progress v-if="isLoadingVendors && !serverError" class="indeterminate"></q-progress>
                    <q-progress v-else-if="serverError" class="indeterminate error"></q-progress>
                    <!-- Otherwise show list of vendors-->
                    <div class="list" v-else>
                        <label class="item" v-for="(vendor, index) in vendors">
                            <div class="item-primary">
                                <q-checkbox @input="selectVendor(index)" v-model="selectedVendors[index]"></q-checkbox>
                            </div>
                            <div class="item-content">
                                <div>{{ vendor.name }}</div>
                            </div>
                        </label>
                    </div>
                  </q-step>
                  <q-step title="Select Items">
                    
                  </q-step>
                </q-stepper>
            </q-transition>
        </div>
    </div>
</template>

<style lang="styl">
.ns-cell
  background-color #f4f4f4
  padding 10px
.ns-select
  margin-bottom 8px
#view 
  margin-top 30px 
  max-width 95vw
  .row, .column, .flex
    > div > div
      padding 10px
      border-radius 3px

</style>

<script src="../scripts/NewStock.js">
</script>
