<template>
  <div>
    <div class="row items-center">
      <h1 class="title margin1">Painel pedidos</h1>

      <button
        @click="AddPedido()"
        class="bg-primary black float-right margin1 button-add"
      >
        Novo Item
      </button>
      <button
        @click="AdicionaProduto()"
        class="bg-primary black float-right margin1 button-add"
      >
        Novo Produto
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Validation from "../views/http/validation";
import funcoes from "../ts/funcoes";
import { defineComponent } from "vue";

export default defineComponent({
  name: "PainelPedidos",
  data() {
    return {
      id: sessionStorage.id,
      email: sessionStorage.email,
      auth: sessionStorage.auth,
      encryptedKey: sessionStorage.encryptedKey,
    };
  },
  async created() {
    if (!!this.id == false || !!this.email == false) {
      alert("Sessão expirada faça o login novamente!");
      this.$router.push("/");
    }
  },

  async mounted() {
    if (!!this.id && !!this.email) {
      let validado = await Validation.ValidationUser(
        this.email,
        this.encryptedKey
      );
      validado == undefined ? (validado = { status: 500, dados: "" }) : "";

      if (validado.status == 500) {
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("encryptedKey");
        await funcoes.sleep(2000);
        alert("Sessão expirada faça o login novamente!");
        this.$router.push("/");
      }
      //      else if (validado.status == 200) {      }
    }

    //sessionStorage.removeItem("auth");
  },

  methods: {
    AdicionaProduto() {
      this.$router.push("products");
    },
    AddPedido() {
      alert("Adicionando novo pedido");
    },
  },
});
</script>

<style>
@import url("./Views.css");
</style>
