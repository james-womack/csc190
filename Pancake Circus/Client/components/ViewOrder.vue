﻿<template>
  <div>
    <q-fab class="absolute-bottom-right"
           classNames="primary"
           icon="keyboard_arrow_up"
           active-icon="save"
           direction="up"
           @click="saveChanges()"
           style="right: 14px; bottom: 14px; z-index: 99;"
           v-if="news.length !== 0 || edit.length !== 0 || deletes.length !== 0">
      <q-small-fab class="red"
                   @click.native="discardChanges()"
                   icon="delete"></q-small-fab>
      </q-fab>
      <div class="layout-padding">
        <!-- Add order item accordian-->
        <div class="list">
          <q-collapsible label="Add Order Item" icon="add">
            <div style="padding: 8px">
              <q-select style="margin-right: 8px"
                        type="list"
                        v-model="newSelectedItem"
                        :options="itemOptions"
                        label="Item"></q-select>
              <q-select type="list"
                        v-model="newSelectedProduct"
                        :options="vendorOptions"
                        label="From Vendor"
                        v-if="newSelectedItem !== undefined && newSelectedItem !== null"></q-select>
              <div class="card bg-red text-white" v-if="!isValidSelection" style="margin: 8px">
                <div class="card-content">
                  Please select a different product, that is already on the order sheet.
                </div>
              </div>
              <div class="floating-label" v-if="newSelectedProduct !== undefined && newSelectedProduct !== null">
                <input required class="full-width" v-model.number="newOrderAmount" type="number" />
                <label>
                  Order Amount
                </label>
              </div>
              <span class="label bg-primary text-white">
                <span class="left-detail">Total Amount</span> {{ newTotal }}
              </span>
              <span class="label bg-primary text-white">
                <span class="left-detail">Price</span> {{ (newPrice/100).toFixed(2) }}
              </span>
              <button class="primary" @click="addOrderItem()" v-if="isValidSelection && newOrderAmount > 0 && newSelectedProduct !== null && newSelectedProduct !== undefined">
                Add Order Item
              </button>
              <button class="primary disabled" v-else>
                Add Order Item
              </button>
            </div>
          </q-collapsible>
        </div>
        <br />
        <q-data-table :data="data"
                      :config="conf"
                      :columns="cols">
          <template slot="col-orderAmount" scope="cell">
            <button class="green small round" @click="editRow(cell)">
              {{ cell.data }}
            </button>
          </template>

          <template slot="col-editStatus" scope="cell">
            <div v-if="cell.data == 'edit'">
              <i>edit</i>
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, -10]">
                Edited Item
              </q-tooltip>
            </div>
            <div v-else-if="cell.data == 'new'">
              <i>new_releases</i>
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, -10]">
                New Item
              </q-tooltip>
            </div>
            <div v-else-if="cell.data == 'delete'">
              <i>delete_forever</i>
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, -10]">
                Delete Item
              </q-tooltip>
            </div>
            <div v-else></div>
          </template>

          <template slot="selection" scope="props">
            <button class="primary clear" @click="deleteRows(props)">
              <i>delete</i>
            </button>
          </template>
        </q-data-table>
      </div>
</div>
</template>

<script src="../scripts/ViewOrder.js"></script>
