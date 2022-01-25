/*!

 =========================================================
 * Vue Light Bootstrap Dashboard - v2.0.0 (Bootstrap 4)
 =========================================================

 * Product Page: http://www.creative-tim.com/product/light-bootstrap-dashboard
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

import './registerServiceWorker'
// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active',
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash }
    } else {
      return { x: 0, y: 0 }
    }
  }
})

function buscarCredenciais() {
  let credenciais = window.sessionStorage.getItem("credenciais-usuario");

  return credenciais;
}


router.beforeEach((to, from, next) => {

  //verificar sempre se o token de sessão está preenchido caso bata com alguma das rotas, se estiver, permitir o acesso, senão redirecionar para o login
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (buscarCredenciais() != null) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
