<template>
  <div>
    <h1 class="title">Painel pedidos</h1>
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
      user_id: sessionStorage.id,
      email: sessionStorage.id,
    };
  },

  async created() {
    if (!!this.user_id && !!this.email) {
      const validado = await Validation.ValidationUser();
      console.log("Validado", validado);

      if (validado.status == 500) {
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("encryptedKey");
        console.log("deuruim");
        await funcoes.sleep(2000);
        alert("Sessão expirada faça o login novamente!");
        this.$router.push("/");
      }
      //      else if (validado.status == 200) {      }
    }

    //sessionStorage.removeItem("auth");
  },

  methods: {},
});
</script>

<style>
.title {
  font-size: 26px;
  text-align: left;
}
</style>
