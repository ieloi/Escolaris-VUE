<template>
  <ul class="nav nav-mobile-menu">
    <li class="nav-item">
      <p class="text-center pr-3">Usuario: {{ usuario_logado.nome }}</p>
    </li>

    <li class="nav-item pl-3 pr-4">
      <button
        type="button"
        class="btn btn-link btn-block"
        @click="deslogarSistema"
      >
        Sair do Sistema
      </button>
    </li>
  </ul>
</template>
<script>
export default {
  name: "mobile-menu",
  data() {
    return {
      usuario_logado: "",
    };
  },
  mounted: function () {
    this.usuario_logado = JSON.parse(
      window.sessionStorage.getItem("credenciais-usuario")
    );
  },
  methods: {
    deslogarSistema() {
      window.sessionStorage.removeItem("credenciais-usuario");
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
<style>
</style>
