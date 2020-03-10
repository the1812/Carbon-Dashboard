(async () => {
  const app = document.createElement('div')
  document.body.insertAdjacentElement('beforeend', app)
  const { default: App } = await import('./App.vue')
  const { default: Vue } = await import('vue')
  const { default: VueRouter } = await import('vue-router')
  const { default: Vuex } = await import('vuex')
  const { BootstrapVue, BootstrapVueIcons } = await import('bootstrap-vue')
  await import('echarts')
  const { default: VueECharts } = await import('vue-echarts')

  Vue.use(BootstrapVue)
  Vue.use(BootstrapVueIcons)
  Vue.use(VueRouter)
  Vue.use(Vuex)
  Vue.component('v-chart', VueECharts)

  const { routes } = await import('./routes')
  const { store } = await import('./store')
  const router = new VueRouter({
    routes,
  })
  new Vue({
    render: h => h(App),
    router,
    store,
  }).$mount(app)
})()