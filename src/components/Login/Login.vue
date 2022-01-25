<template>
  <div class="container">
    <div
      class="row"
      :style="{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >
      <div class="card p-3" :style="{ width: '320px' }">
        <h3 class="card-title mb-3 mt-2">Login Escolaris</h3>
        <form @submit.prevent="acessarSistema">
          <div v-if="possuiErro">
            <p
              v-for="(erro, index) in lista_erros"
              :key="index"
              class="form-text text-danger text-muted"
            >
              {{ erro }}
            </p>
          </div>

          <div class="form-group mb-3">
            <label for="emailUsuario">Email</label>
            <input
              type="email"
              class="form-control"
              id="emailUsuario"
              v-model.trim="dados_login.email"
              placeholder="Ex: email@teste.com"
            />
          </div>

          <div class="form-group mb-3">
            <label for="senhaUsuario">Senha</label>
            <input
              type="password"
              class="form-control"
              id="senhaUsuario"
              v-model.trim="dados_login.senha"
              placeholder="Ex: 1234"
            />
          </div>

          <Button
            class="btn btn-primary btn-fill mt-1 mb-2"
            type="submit"
            :style="{ width: '100%' }"
          >
            Acessar sistema
          </Button>
        </form>
      </div>
    </div>
    <div
      v-if="spinner"
      class="spinner-grow"
      style="width: 3rem; height: 3rem; position: absolute; left: 45%; top: 50%"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      usuariosCadastradosSistema: [
        {
          id: 1,
          nome: "teste",
          email: "teste@email.com",
          senha: "1234",
          token: "81dc9bdb52d04dc20036dbd8313ed055",
        },
        {
          id: 2,
          nome: "admin",
          email: "admin@hotmail.com",
          senha: "admin",
          token: "21232f297a57a5a743894a0e4a801fc3",
        },
      ],
      dados_login: {
        email: "",
        senha: "",
      },
      lista_erros: {
        erro_email: "",
        erro_senha: "",
      },
      possuiErro: false,
      spinner: false,
    };
  },
  methods: {
    buscarUsuarioNaLista() {
      let usuarioEncontrado = null;

      this.usuariosCadastradosSistema.filter((usuario) => {
        if (
          usuario.email == this.dados_login.email &&
          usuario.senha == this.dados_login.senha
        ) {
          usuarioEncontrado = usuario;
          return;
        }
      });

      return usuarioEncontrado;
    },
    acessarSistema() {
      //validações de formulario
      this.possuiErro = false
      this.lista_erros.email = "";
      this.lista_erros.senha = "";

      if (!this.dados_login.email) {
        this.lista_erros.email = "Preenchimento de Email necessário";
        this.possuiErro = true;
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
          this.dados_login.email
        )
      ) {
        this.lista_erros.email = "Endereço de Email invalido";
        this.possuiErro = true;
      }

      if (!this.dados_login.senha) {
        this.lista_erros.senha = "Preenchimento de Senha necessário";
        this.possuiErro = true;
      } else if (this.dados_login.senha.length < 4) {
        this.lista_erros.senha = "Senha deve ter 4 ou mais caracteres";
        this.possuiErro = true;
      }

      this.spinner = true;

      if (!this.possuiErro) {
        setTimeout(() => {
          const userEncontrado = this.buscarUsuarioNaLista(this.dados_login);

          if (userEncontrado == null) {
            this.notifyVue("danger", "email e/ou senha não cadastrados");
            this.spinner = false;
          } else {
            window.sessionStorage.setItem(
              "credenciais-usuario",
              JSON.stringify({
                nome: userEncontrado.nome,
                token: userEncontrado.token,
              })
            );
            this.spinner = false;
            this.lista_erros.email = "";
            this.lista_erros.senha = "";
            this.dados_login.nome = "";
            this.dados_login.senha = "";
            this.$router.push({path: '/'});
          }
        }, 1000);
      } else {
        this.spinner = false;
      }

    },
    notifyVue(color, mensagem) {
      this.$notifications.notify({
        message: `<div class="mt-3 mb-3">${mensagem}</div>`,
        icon: "nc-icon nc-bell-55",
        horizontalAlign: "right",
        verticalAlign: "top",
        type: color,
      });
    },
  },
};
</script>
<style scoped>
</style>