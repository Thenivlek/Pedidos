<template>
  <div class="row items-center">
    <h1 class="title margin1">Produtos</h1>
    <button
      @click="novoProduto = !novoProduto"
      class="bg-primary white float-right margin1 button-add"
    >
      +
    </button>
  </div>
  <transition name="slide-fade">
    <div v-show="novoProduto">
      <div class="display-block">
        <div class="display-inline label">Nome</div>
        <input
          placeholder="Nome"
          v-model="nm_produto"
          class="input-default margin1"
          type="text"
        />
      </div>
      <div class="display-block">
        <div class="display-inline label">R$</div>

        <input
          placeholder="Preço"
          class="input-default margin1"
          type="number"
          v-model="vl_produto"
          min="0.00"
          max="10000"
          step="0.01"
        />
      </div>
      <div class="display-block">
        <div class="display-inline label">Categoria</div>
        <select class="margin1 select-default" v-model="cd_categoria">
          <option v-for="(c, index1) in categoria" :key="index1" :value="c">
            {{ c.nm_categoria }}
          </option>
        </select>
      </div>
      <div class="display-block">
        <button
          style="width: 200px"
          @click="SaveProduto()"
          class="bg-primary white margin1 button-add"
        >
          Salvar
        </button>
      </div>
    </div>
  </transition>
  <div v-if="ic_nenhum_Produto">Nenhum produto encontrado!</div>
  <div
    v-else
    v-for="(p, index) in produtos"
    :key="index"
    class="grid-container margin1"
  >
    <div class="grid-item">ID: {{ p.id }}</div>
    <div class="grid-item">Produto: {{ p.nm_produto }}</div>
    <div class="grid-item">Valor: {{ p.vl_produto }}</div>
    <div class="grid-item">
      Categoria: {{ p.cd_categoria }} -
      {{ retornaCategoria(p.cd_categoria) }}
    </div>
    <div class="grid-item">
      <button @click="ExcluirProduto(p)" class="btn-excluir white margin1">
        Excluir
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import product from "../views/http/products";
export default defineComponent({
  name: "ProdutosView",
  data() {
    return {
      novoProduto: false,
      vl_produto: 0,
      nm_produto: "",
      cd_categoria: {
        cd_categoria: 0,
        nm_categoria: "",
      },
      produtos: "",
      ic_nenhum_Produto: false,
      categoria: [
        {
          nm_categoria: "Carnes",
          cd_categoria: 1,
        },
        {
          nm_categoria: "Doces",
          cd_categoria: 2,
        },
        {
          nm_categoria: "Frutas",
          cd_categoria: 3,
        },

        {
          nm_categoria: "Leites/derivados",
          cd_categoria: 4,
        },
        {
          nm_categoria: "Legumes/Verduras",
          cd_categoria: 5,
        },
        {
          nm_categoria: "Pães",
          cd_categoria: 6,
        },
      ],
    };
  },
  async mounted() {
    this.ConsultaProdutos();
  },
  methods: {
    async ExcluirProduto(produto: {
      nm_produto: string;
      vl_produto: number;
      cd_categoria: number;
      nm_categoria: string;
    }) {
      console.log(produto);
    },
    retornaCategoria(e: number) {
      const categoria = this.categoria.filter((element) => {
        return element.cd_categoria == e;
      });

      return categoria[0].nm_categoria;
    },
    async ConsultaProdutos() {
      const a = await product.getProdutos();
      if (a.data.status == 500) {
        this.ic_nenhum_Produto = true;
      } else {
        this.ic_nenhum_Produto = false;
      }
      this.produtos = a.data;
    },
    async SaveProduto() {
      console.log(this.cd_categoria);

      const produto = {
        nm_produto: this.nm_produto,
        vl_produto: this.vl_produto,
        cd_categoria: this.cd_categoria.cd_categoria,
        nm_categoria: this.cd_categoria.nm_categoria,
      };

      if (
        !!produto.nm_produto == false ||
        !!produto.vl_produto == false ||
        !!produto.cd_categoria == false
      ) {
        console.log("Erro");
      } else {
        // noinspection TypeScriptValidateTypes

        const envio = await product.SaveProduct(produto);
      }
      this.ConsultaProdutos();
    },
    FormataMoeda(vl = Number) {
      console.log(vl);
      //let f = vl.toLocaleString("pt-br", {
      //  style: "currency",
      //  currency: "BRL",
      //});

      //console.log(f.replaceAll("R$", ""));
      //this.vl_produto = f.replaceAll("R$", "");
      return 0;
    },
  },
});
</script>

<style>
@import url("./Views.css");
</style>
