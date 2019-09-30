<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import db from './Services/Database/index.js'
// import adMob from './Services/Admob/index.js'

export default {
  name: 'App',
  created () {
    // carrega função dos anúncios
    // adMob()
    // display the banner
    // window.plugins.AdMob.createBannerView()
  }
}
</script>

<style>
</style>
