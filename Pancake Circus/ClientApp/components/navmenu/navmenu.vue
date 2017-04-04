<template>
    <v-list>
        <v-list-item v-for="route in routes">
            <v-list-tile>
                {{ route.name }}
            </v-list-tile>
        </v-list-item>
    </v-list>
</template>

<script src="./navmenu.ts"></script>