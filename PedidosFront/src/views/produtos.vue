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
        <select class="margin1 select-default" v-model="categoria">
          <option value="1">Fruta</option>
          <option value="2">Legume/Verdura</option>
          <option value="3">Carne</option>
          <option value="4">Ovo</option>
          <option value="5">Leite/derivados</option>
          <option value="6">Doce</option>
          <option value="7">Pão</option>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProdutosView",
  data() {
    return {
      novoProduto: false,
      vl_produto: 0,
      nm_produto: "",
      categoria: 1,
    };
  },
  methods: {
    async SaveProduto() {
      console.log("Salvando");
      const produto = {
        nm_produto: this.nm_produto,
        vl_produto: this.vl_produto,
        cd_categoria: parseInt(this.categoria),
      };
      console.log(produto);
    },
    FormataMoeda() {
      let f = this.vl_produto.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
      console.log(f.replaceAll("R$", ""));
      //this.vl_produto = f.replaceAll("R$", "");
    },
  },
});
</script>

<style>
@import url("./Views.css");
</style>
