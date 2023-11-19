import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueCesium from 'vue-cesium'
import enUS from 'vue-cesium/es/locale/lang/en-us'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueCesium, {
    cesiumPath: 'path/to/Cesium.js',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OTBmMTQwNi0yNjc1LTRiMGItOGY4MS00MmZlMmY0NzhhNDEiLCJpZCI6MTc4NjE5LCJpYXQiOjE3MDAwODczOTN9.XKBBO9vovmCeMbDaI6GEQqHTq7LOg2eVkqZlzoUd3Do',
    locale: enUS // change to English
  })
app.use(createPinia())
app.use(router)

app.mount('#app')
