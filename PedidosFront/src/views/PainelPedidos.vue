<template>
  <div>
    <div class="row items-center">
      <h1 class="title margin1">Painel de Pedidos</h1>
      <Transition name="bounce">
        <button
          @click="AddPedido()"
          v-if="novoPedido == false"
          class="bg-primary white float-right margin1 button-add"
        >
          Novo Pedido
        </button>

        <button
          @click="
            novoPedido = false;
            carregaDados();
          "
          v-else
          class="bg-primary white float-right margin1 button-add"
        >
          Consultar Pedidos
        </button>
      </Transition>
      <button
        @click="AdicionaProduto()"
        class="bg-primary white float-right margin1 button-add"
      >
        Novo Produto
      </button>
      <button
        @click="LogOut()"
        class="bg-primary white float-right margin1 button-add"
      >
        Sair
      </button>
    </div>
    <div class="centro">
      <div class="esquerda margin1" v-if="novoPedido">
        <div class="sub-title" style="padding: 10px 0px 5px 5px">Pesquisa</div>
        <input
          placeholder="Produto"
          v-model="nm_produto"
          class="input-default"
          @keypress.enter="PesquisaProduto()"
          type="text"
        />
        <div class="margin1 items-center">
          <button
            @click="PesquisaProduto()"
            style="width: 200px"
            class="bg-primary white margin1 button-add button-save"
          >
            Pesquisar
          </button>
        </div>
        <div
          v-show="pesquisados.length > 0"
          class="sub-title"
          style="padding: 10px 5px 5px 0"
        >
          Produtos
        </div>
        <div
          v-for="(l, index) in pesquisados"
          v-show="!!pesquisados"
          :key="index"
          class="card grid-container"
        >
          <div class="grid-item text-info">{{ l.nm_produto }}</div>
          <div class="grid-item text-info">{{ l.vl_produto }}</div>
          <div class="grid-item text-info">
            {{ retornaCategoria(l.cd_categoria) }}
          </div>
          <button class="button bg-primary white" @click="AddCarrinho(l)">
            +
          </button>
        </div>
      </div>

      <div
        v-else
        v-for="(p, indexP) in orders"
        v-show="orders.length > 0"
        :key="indexP"
        class="margin1 grid-pedido card"
        style="height: 35vh; overflow-y: scroll; min-width: 200px"
      >
        <div class="row items-center" style="font-size: 22px">
          Pedido: {{ indexP + 1 }}
          <!--
             <button @click="ExcluirPedido(p)" class="btn-excluir white margin1">
            Excluir
          </button>
          -->
        </div>

        <!--<H1>PEDIDO - {{ indexP + 1 }}</H1>-->
        <div
          class="grid-items-pedido margin1"
          v-for="(i, indexI) in p"
          v-show="orders.length > 0"
          :key="indexI"
          style="text-justify: center"
        >
          <div style="font-size: 16px; text-justify: center">
            Produto: {{ i.nm_produto }} - Categoria:
            {{ retornaCategoria(i.cd_categoria) }} - {{ i.vl_produto }}
          </div>
        </div>
      </div>
      <div class="direita margin1">
        <div
          class="sub-title"
          v-show="carrinho.length > 0"
          style="padding: 10px 5px 5px 0px"
        >
          Carrinho de Compras
        </div>
        <div
          v-for="(c, index) in carrinho"
          v-show="!!carrinho"
          :key="index"
          style="margin-top: 5px"
          class="card grid-container2"
        >
          <div class="grid-item text-info">Produto: {{ c.nm_produto }}</div>
          <div class="grid-item text-info">Valor: {{ c.vl_produto }}</div>
          <div class="grid-item text-info">
            Categoria: {{ retornaCategoria(c.cd_categoria) }}
          </div>
          <button @click="ExcluirProduto(c)" class="btn-excluir white margin1">
            Excluir
          </button>
        </div>
        <div class="row items-center" style="justify-content: center">
          <Transition name="bounce">
            <button
              v-show="carrinho.length > 0"
              @click="FecharPedido()"
              class="bg-positive white button-add margin1"
            >
              Fechar Pedido
            </button>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Validation from "../views/http/validation";
import funcoes from "../ts/funcoes";
import { defineComponent } from "vue";
import product from "../views/http/products";
import order from "../views/http/order";

interface ProdutoInterface {
  length: number;
  [index: number]: {
    id: number;
    cd_categoria: number;
    nm_produto: string;
    vl_produto: number | number;
  };
}

interface CarrinhoInterface {
  push(p: {
    id: number;
    nm_produto: string;
    vl_produto: number;
    cd_categoria: number | string;
  }): unknown;
  length: number;
  [index: number]: {
    userId: number;
    id: number;
    nm_produto: string;
    vl_produto: number;
    cd_categoria: number | string;
  };
}

interface PedidosInterface {
  vl_pedido: number | number;
  idOrder: number;
  [index: number]: {
    id: number;
    cd_categoria: number;
    nm_produto: string;
    vl_produto: number | number;
  };
}
export default defineComponent({
  name: "PainelPedidos",
  data() {
    return {
      novoPedido: false,
      id: sessionStorage.id,
      email: sessionStorage.email,
      auth: sessionStorage.auth,
      orders: [],
      encryptedKey: sessionStorage.encryptedKey,
      nm_produto: "",
      pesquisados: [] as unknown as ProdutoInterface,
      carrinho: [] as unknown as CarrinhoInterface,
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
  async created() {
    if (!!this.id == false || !!this.email == false) {
      alert("Sessão expirada faça o login novamente!");
      this.$router.push("/");
    } else {
      await this.carregaDados();
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
    }
  },

  methods: {
    async ExcluirPedido(p: {
      vl_pedido: number | number;
      idOrder: number;
      [index: number]: {
        id: number;
        cd_categoria: number;
        nm_produto: string;
        vl_produto: number | number;
      };
    }) {
      console.log(p);
    },
    async LogOut() {
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("encryptedKey");
      sessionStorage.removeItem("auth");
      this.$router.push("/");
    },
    async carregaDados() {
      try {
        const consulta = await order.ConsultaOrders(this.id);

        this.orders = consulta;
      } catch (error) {
        console.log(error);
      }
    },
    async ExcluirProduto(p: {
      id: number;
      cd_categoria: string | number;
      nm_produto: string;
      vl_produto: number | number;
    }) {
      for (let u = 0; u < this.carrinho.length; u++) {
        if (this.carrinho[u].id == p.id) {
          this.carrinho.splice(u, 1);
        }
      }
    },
    async FecharPedido() {
      if (this.carrinho.length == 0) {
        alert("Selecione produtos para o carrinho!");
      } else {
        const envio = await order.NewOrder(this.carrinho, this.id);
        alert(envio.dados);
        this.carrinho = [];
        await this.carregaDados();
      }
    },
    async AddCarrinho(p: {
      id: number;
      cd_categoria: number;
      nm_produto: string;
      vl_produto: number | number;
    }) {
      if (
        !!p.id == false ||
        !!p.cd_categoria == false ||
        !!p.nm_produto == false ||
        !!p.vl_produto == false
      ) {
        alert("Produto faltando informações!");
      } else {
        const product = {
          userId: this.id,
          id: p.id,
          cd_categoria: p.cd_categoria,
          nm_produto: p.nm_produto,
          vl_produto: p.vl_produto,
        };
        this.carrinho.push(product);
        this.pesquisados = [];
        this.nm_produto = "";
      }
    },
    retornaCategoria(e: number | string) {
      const categoria = this.categoria.filter((element) => {
        return element.cd_categoria == e;
      });

      return categoria[0].nm_categoria;
    },
    async PesquisaProduto() {
      const find = await product.SearchProduct(this.nm_produto);
      if (find.status == 500) {
        alert(find.data.dados);
      } else {
        this.pesquisados = find;
      }
    },
    AdicionaProduto() {
      this.$router.push("products");
    },
    AddPedido() {
      this.nm_produto = "";
      this.novoPedido = true;
    },
  },
});
</script>

<style>
@import url("./Views.css");
</style>
