<template>
  <div class="container-fluid">
    <div class="card mt-3">
      <div class="card-body mb-3">
        <h3 class="card-title mb-3 mt-2">Cadastrar Escola</h3>

        <form @submit.prevent="cadastrarEscola">
          <p v-show="msg_erro" class="text-danger">{{ msg_erro }}</p>

          <div class="row">
            <div class="col-md form-group">
              <label for="nomeEscola">Nome da Escola</label>
              <input
                type="text"
                class="form-control"
                id="nomeEscola"
                v-model.trim="nova_escola.nome"
                placeholder="Ex: Escola Lorem Ipsum"
              />
            </div>
            <div class="col-md form-group">
              <label for="nomeDiretor">Nome do Diretor</label>
              <input
                type="text"
                class="form-control"
                id="nomeDiretor"
                v-model.trim="nova_escola.diretor"
                placeholder="Ex: Lorenzo Ipsolium"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md form-group">
              <label for="selectLocalizacao">Localização da Escola</label>
              <select
                class="custom-select"
                id="selectLocalizacao"
                v-model="nova_escola.localizacao"
              >
                <option selected value="">Selecione uma Opção:</option>
                <option value="1">Urbana</option>
                <option value="2">Rural</option>
              </select>
            </div>

            <div class="col-md form-group">
              <label>Turnos da Escola (Selecione uma ou mais opções)</label>
              <div class="custom-control custom-checkbox ml-3">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="turnoManha"
                  v-model="nova_escola.turnos"
                  value="M"
                />
                <label class="custom-control-label pt-1" for="turnoManha"
                  >Manhã</label
                >
              </div>
              <div class="custom-control custom-checkbox ml-3">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="turnoTarde"
                  v-model="nova_escola.turnos"
                  value="T"
                />
                <label class="custom-control-label pt-1" for="turnoTarde"
                  >Tarde</label
                >
              </div>
              <div class="custom-control custom-checkbox ml-3">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="turnoNoite"
                  v-model="nova_escola.turnos"
                  value="N"
                />
                <label class="custom-control-label pt-1" for="turnoNoite"
                  >Noite</label
                >
              </div>
              <div class="custom-control custom-checkbox ml-3">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="turnoIntegral"
                  v-model="nova_escola.turnos"
                  value="I"
                />
                <label class="custom-control-label pt-1" for="turnoIntegral"
                  >Integral</label
                >
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-fill">
            Cadastrar Escola
          </button>
        </form>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-body">
        <h3 class="card-title mb-3 mt-2">Escolas Cadastradas</h3>
        <table class="table table-hover table-striped table-responsive-sm">
          <thead>
            <tr>
              <th
                scope="col"
                v-for="(item, index) in tabela.colunas"
                :key="index"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="escola in tabela.dados" :key="escola.id">
              <td>{{ escola.nome }}</td>
              <td>{{ escola.diretor }}</td>
              <td>{{ escola.localizacao === 1 ? "Urbana" : "Rural" }}</td>
              <td>{{ listarTurnos(escola.turnos).join(" / ") }}</td>
            </tr>
          </tbody>
        </table>
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
  name: "cadastro-escolas",
  data() {
    return {
      nova_escola: {
        nome: "",
        diretor: "",
        localizacao: "",
        turnos: [],
      },

      //erros encontrados nas validações
      msg_erro: null,
      erro: [],

      //spinner
      spinner: false,

      tabela: {
        colunas: ["Nome da Escola", "Nome do Diretor", "Localizacao", "Turnos"],
        dados: [
          {
            id: 1,
            nome: "Escola Charles Xavier",
            diretor: "Charles Xavier",
            localizacao: 2,
            turnos: ["M", "T"],
          },
          {
            id: 2,
            nome: "East High School",
            diretor: "Suzanna Alves",
            localizacao: 1,
            turnos: ["T", "N"],
          },
          {
            id: 3,
            nome: "Escola Hogwarts",
            diretor: "Alvo Dumbledore",
            localizacao: 1,
            turnos: ["M", "T"],
          },
          {
            id: 4,
            nome: "Instituto Shield",
            diretor: "Nick Fury",
            localizacao: 2,
            turnos: ["I"],
          },
        ],
      },
    };
  },
  methods: {
    listarTurnos(listaTurnos) {
      let turnos = [];

      listaTurnos.forEach((element) => {
        switch (element) {
          case "M":
            turnos.push("Manhã");
            break;
          case "T":
            turnos.push("Tarde");
            break;
          case "N":
            turnos.push("Noite");
            break;
          case "I":
            turnos.push("Integral");
            break;
          default:
            break;
        }
      });

      return turnos;
    },
    cadastrarEscola() {
      this.spinner = true;

      setTimeout(() => {
        if (
          this.nova_escola.nome == "" ||
          this.nova_escola.localizacao == "" ||
          this.nova_escola.turnos.length == 0
        ) {
          this.msg_erro = "Todos os campos (com exceção do nome do diretor) devem ser preenchidos";
          this.spinner = false;
        } else {
          let qtde_itens = this.tabela.dados.length + 1;

          this.nova_escola = { ...this.nova_escola, id : qtde_itens }

          this.tabela.dados.push(this.nova_escola);

          this.notifyVue("success", "Escola cadastrada com sucesso");

          this.nome = "";
          this.diretor = "";
          this.localizacao = "";
          this.turnos = [];
          this.erros = [];
          this.msg_erro = null;
          this.spinner = false;
        }
      }, 1000);
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