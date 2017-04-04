<template>
    <v-app id='app-root' top-toolbar left-fixed-sidebar>
        <v-toolbar>
            <v-toolbar-side-icon v-on:click="nav = !nav" />
            <v-toolbar-logo>Toolbar</v-toolbar-logo>
        </v-toolbar>
        <main>
            <v-sidebar left fixed drawer v-model="nav">
                <v-list>
                    <v-list-item v-for="route in routes">
                        <v-list-tile>
                            <v-list-tile-title>{{route.name}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list-item>
                </v-list>
            </v-sidebar>
            <v-content>
                <v-container fluid>
                    <div class="title">Main Content</div>
                    <router-view></router-view>
                </v-container>
            </v-content>
        </main>
    </v-app>
</template>

<script src="./app.ts"></script>
<style src="./app.css"></style>
