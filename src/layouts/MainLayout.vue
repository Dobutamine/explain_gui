<template>
  <div class="q-pa-es">
    <q-layout view="lHh lpr lFf" container style="height: 920px" class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-bar>
          <q-icon name="laptop_chromebook" />
          <div>Explain - Explanatory models in neonatology - research environment</div>
        </q-bar>
      </q-header>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>

export default {
  name: 'MainLayout',

  data () {
    return {
      leftDrawerOpen: false

    }
  }
}
</script>
