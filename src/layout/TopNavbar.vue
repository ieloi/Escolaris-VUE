<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <p class="navbar-brand">{{ routeName }}</p>
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <p class="pt-3">
              Usuario: {{ usuario_logado.nome }}
            </p>
          </li>
          <li class="nav-item ml-2">
           <button type="button" class="btn btn-link" @click="deslogarSistema">Sair do Sistema</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
        activeNotifications: false,
        usuario_logado: "",
        nome_componente: ""
      }
    },
    mounted: function () {
      this.usuario_logado = JSON.parse(window.sessionStorage.getItem("credenciais-usuario"));
      this.nome_componente = this.$route.name;
      console.log(this.nome_componente);
    },
    methods: {
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      deslogarSistema() {
        window.sessionStorage.removeItem("credenciais-usuario");
        this.$router.push({path: '/login'});
      }
    },
  }

</script>
<style>

</style>
