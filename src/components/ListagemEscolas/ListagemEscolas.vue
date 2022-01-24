<template>
  <div class="container-fluid">
    <div class="card mt-3">
      <div class="card-body mb-3">
        <h3 class="card-title mb-3 mt-2">Pesquisar Escolas</h3>
        <h6 class="card-subtitle mb-2 text-muted">
          A pesquisa pode ser realizada de 3 formas: Pelo nome, Pelo nome e
          municipio e somente pelo municipio
        </h6>

        <form @submit.prevent="pesquisarEscolas">
          <p v-show="msg_erro" class="text-danger mt-3 mb-0">{{ msg_erro }}</p>
          <div class="row">
            <div class="col-md-6 form-group">
              <label for="nomeEscola">Nome da Escola</label>
              <input
                type="text"
                class="form-control"
                id="nomeEscola"
                v-model.trim="nome"
                placeholder="Ex: Escola Lorem Ipsum"
              />
            </div>

            <div class="col-md-3 form-group">
              <label for="selectEstado">Estado da Escola</label>
              <select class="custom-select" id="selectEstado" v-model="estado">
                <option selected value="">Selecione uma Opção:</option>
                <option
                  v-for="(estado, index) in listaEstados"
                  :value="estado.value"
                  :key="index"
                >
                  {{ estado.name }}
                </option>
              </select>
            </div>

            <div class="col-md-3 form-group" v-show="mostrarInputMunicipio">
              <label for="selectMunicipio">Municipio da Escola</label>
              <select
                class="custom-select"
                id="selectMunicipio"
                v-model="municipio"
              >
                <option selected value="">Selecione uma Opção:</option>
                <option
                  v-for="(municipio, index) in listaMunicipios"
                  :value="municipio[0]"
                  :key="index"
                >
                  {{ municipio[1] }}
                </option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-fill">
            Pesquisar Escolas
          </button>
        </form>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-body">
        <h3 class="card-title mb-3 mt-2">Resultados Encontrados</h3>
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
              <td>{{ escola.estado }}</td>
              <td>{{ escola.cidade }}</td>
              <td>{{ escola.dependenciaAdministrativaTxt }}</td>
              <td>{{ escola.situacaoFuncionamentoTxt }}</td>
            </tr>
          </tbody>
        </table>
        <p class="text-center" v-if="semResultadosEncontrados">
          Sem resultados para mostrar
        </p>
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
import axios from "axios";

export default {
  name: "listagem-escolas",
  data() {
    return {
      url: `http://apiteste.felixsapp.com/educacao.php?request=`,
      listaEstados: [
        { name: "Acre", value: "ac" },
        { name: "Alagoas", value: "al" },
        { name: "Amapá", value: "ap" },
        { name: "Amazonas", value: "am" },
        { name: "Bahia", value: "ba" },
        { name: "Ceará", value: "ce" },
        { name: "Espírito Santo", value: "es" },
        { name: "Goiás", value: "go" },
        { name: "Maranhão", value: "ma" },
        { name: "Mato Grosso", value: "mt" },
        { name: "Mato Grosso do Sul", value: "ms" },
        { name: "Minas Gerais", value: "mg" },
        { name: "Pará", value: "pa" },
        { name: "Paraíba", value: "pb" },
        { name: "Paraná", value: "pr" },
        { name: "Pernambuco", value: "pe" },
        { name: "Piauí", value: "pi" },
        { name: "Rio de Janeiro", value: "rj" },
        { name: "Rio Grande do Norte", value: "rn" },
        { name: "Rio Grande do Sul", value: "rs" },
        { name: "Rondonia", value: "ro" },
        { name: "Roraima", value: "rr" },
        { name: "Santa Catarina", value: "sc" },
        { name: "São Paulo", value: "sp" },
        { name: "Sergipe", value: "se" },
        { name: "Tocantins", value: "to" },
        { name: "Distrito Federal", value: "df" },
      ],
      listaMunicipios: null,
      mostrarInputMunicipio: false,
      nome: "",
      estado: "",
      municipio: "",
      semResultadosEncontrados: true,
      tabela: {
        colunas: [
          "Nome",
          "Estado",
          "Cidade",
          "Dependência Administrativa",
          "Situação de Funcionamento",
        ],
        dados: [],
      },
      spinner: false,
      msg_erro: null,
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      // Código que irá rodar apenas após toda
      // a árvore do componente ter sido renderizada
      try {
        this.buscarEscolasAPI(`api/escolas?nome=aplicacao`);
        this.semResultadosEncontrados = false;
      } catch (error) {
        this.notifyVue(
          "danger",
          "Não foi possivel realizar a busca de Escolas"
        );
      }
    });
  },
  watch: {
    estado: function () {
      if (this.estado != "") {
        let endopint_estado = `api/cidades/${this.estado}`;
        this.buscarMunicipios(endopint_estado);
        this.mostrarInputMunicipio = true;
      } else {
        this.mostrarInputMunicipio = false;
      }
    },
  },
  methods: {
    async buscarMunicipios(endpoint) {
      this.spinner = true;
      try {
        const { data } = await axios.get(`${this.url}${endpoint}`);
        const lista_municipios_modificada = data.map((municipio) =>
          municipio.split(":")
        );
        this.listaMunicipios = lista_municipios_modificada;
      } catch (error) {
        this.notifyVue(
          "danger",
          "Não foi possivel realizar a busca de Municipios"
        );
      }
      this.spinner = false;
    },
    async buscarEscolasAPI(endpoint) {
      this.spinner = true;
      try {
        const { data } = await axios.get(`${this.url}${endpoint}`);
        if (data[0] == 0) {
          this.semResultadosEncontrados = true;
        }
        this.tabela.dados = data[1];
      } catch (error) {
        this.notifyVue(
          "danger",
          "Não foi possivel realizar a busca de Escolas"
        );
      }
      this.spinner = false;
    },
    pesquisarEscolas() {
      if ((this.nome.length < 4 || !this.nome) && !this.municipio) {
        this.msg_erro =
          "Para a busca ser realizada é necessario preencher o nome (4 ou mais letras) e/ou escolher um municipio";
      } else {
        let busca = ``;

        if (this.nome.length >= 3 && this.municipio != "") {
          busca = `api/escolas/buscaavancada?cidade=${this.municipio}&nome=${this.nome}`;
          this.buscarEscolasAPI(busca);
        } else if (this.nome.length >= 3 && this.municipio == "") {
          busca = `api/escolas?nome=${this.nome}`;
          this.buscarEscolasAPI(busca);
        } else if (
          (this.nome.length < 3 || this.nome == "") &&
          this.municipio != ""
        ) {
          busca = `api/escolas/buscaavancada?cidade=${this.municipio}`;
          this.buscarEscolasAPI(busca);
        }

        this.nome = "";
        this.municipio = "";
        this.estado = "";
        this.mostrarInputMunicipio = false;
        this.semResultadosEncontrados = false;
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