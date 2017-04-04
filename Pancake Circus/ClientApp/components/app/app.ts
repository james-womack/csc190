import Vue from 'vue';
import { Component } from 'av-ts';

interface INavItem {
    name: string;
    route: string;
}

export default class AppComponent extends Vue {
    routes: INavItem[] = [
        { name: 'Inventory', route: '/' },
        { name: 'Vendors', route: '/vendors' },
        { name: 'Orders', route: '/orders' }
    ];
}
