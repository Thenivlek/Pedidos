<template>
  <div>
    <div class="centro">
      <div class="esquerda">
        <div class="row items-center" style="justify-content: center">
          <button
            @click="Painel()"
            class="bg-primary white float-right margin1 button-add"
          >
            Voltar
          </button>
          <h1 class="title margin1">Produtos</h1>
          <button
            @click="
              novoProduto = true;
              Clear();
            "
            class="bg-primary white float-right margin1 button-add"
          >
            +
          </button>
        </div>
        <Transition name="bounce">
          <div style="padding: 5px" v-show="novoProduto">
            <div class="display-block">
              <div class="label">Nome</div>
              <input
                placeholder="Nome"
                v-model="nm_produto"
                class="input-default"
                type="text"
              />
            </div>
            <div class="display-block">
              <div class="label">Preço</div>

              <input
                placeholder="Preço"
                class="input-default"
                type="text"
                @blur="FormataMoeda(vl_produto, 1)"
                v-model="vl_produto"
                min="0.00"
                max="10000"
                step="0.01"
              />
            </div>
            <div class="display-block">
              <div class="label">Categoria</div>
              <select class="select-default" v-model="cd_categoria">
                <option
                  v-for="(c, index1) in categoria"
                  :key="index1"
                  :value="c"
                  style="margin: 50px"
                >
                  {{ c.nm_categoria }}
                </option>
              </select>
            </div>
            <div class="display-block items-center margin1">
              <Transition name="bounce">
                <button
                  v-show="edit == false"
                  style="width: 200px"
                  @click="SaveProduto()"
                  class="bg-primary white margin1 button-add button-save"
                >
                  Salvar
                </button>
              </Transition>
              <Transition name="bounce">
                <button
                  v-show="edit == true"
                  style="width: 200px"
                  @click="ConfirmaEdit()"
                  class="bg-positive white margin1 button"
                >
                  Confirmar
                </button>
              </Transition>
              <Transition name="bounce">
                <button
                  v-show="edit == true"
                  style="width: 200px"
                  @click="CancelEdit()"
                  class="bg-negative white margin1 button"
                >
                  Cancelar
                </button>
              </Transition>
            </div>
          </div>
        </Transition>
      </div>
      <Transition name="bounce">
        <div class="direita">
          <div class="any margin1" v-if="ic_nenhum_Produto">
            Nenhum produto encontrado!
          </div>

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
              <button
                @click="ExcluirProduto(p)"
                class="btn-excluir white margin1"
              >
                Excluir
              </button>
              <button
                @click="editarProduto(p)"
                class="btn-alterar white margin1"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import product from "../views/http/products";
import funcao from "../ts/funcoes";

interface Produto {
  [index: number]: {
    id: number;
    cd_categoria: number;
    nm_produto: string;
    vl_produto: number | number;
  };
}

export default defineComponent({
  name: "ProdutosView",
  data() {
    return {
      produtos: [] as Produto,
      novoProduto: false,
      vl_produto: "",
      nm_produto: "",
      idEdit: 0,

      cd_categoria: {
        cd_categoria: 0,
        nm_categoria: "",
      },
      edit: false,
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
    async FormataMoeda(vl: string, index: number) {
      if (index == 1) {
        let strNum = parseInt(vl.replace(/[^0-9]/g, ""));

        this.vl_produto = strNum.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });

        //this.vl_produto = await funcao.FormataMoeda(vl);
      }
    },
    Painel() {
      this.$router.push("/painel");
    },
    Clear() {
      this.vl_produto = "";
      this.nm_produto = "";
      this.idEdit = 0;

      this.cd_categoria = {
        cd_categoria: 0,
        nm_categoria: "",
      };
      this.edit = false;
    },

    async CancelEdit() {
      this.novoProduto = false;
      this.Clear();
    },
    async ConfirmaEdit() {
      if (
        !!this.idEdit ||
        !!this.nm_produto ||
        !!this.cd_categoria ||
        !!this.vl_produto
      ) {
        const produto = {
          nm_produto: this.nm_produto,
          vl_produto: this.vl_produto,
          cd_categoria: this.cd_categoria.cd_categoria,
          nm_categoria: this.cd_categoria.nm_categoria,
          id: this.idEdit,
        };
        try {
          const envio = await product.editProduct(produto);
          if (envio.status == 500) {
            alert(envio.dados);
          }
        } catch (error) {
          alert("Impossível editar produto");
        }
      } else {
        alert("Confira as informações!");
      }
      this.ConsultaProdutos();
    },
    async editarProduto(p: {
      id: number;
      cd_categoria: number;
      nm_produto: string;
      vl_produto: string;
    }) {
      this.nm_produto = p.nm_produto;
      this.vl_produto = p.vl_produto;

      const cat = this.categoria.find((e) => {
        return e.cd_categoria == p.cd_categoria;
      });
      if (cat) {
        this.cd_categoria.cd_categoria = cat.cd_categoria;
        this.cd_categoria.nm_categoria = cat.nm_categoria;
      }
      this.idEdit = p.id;
      this.edit = true;
      this.novoProduto = true;
    },
    async ExcluirProduto(p: {
      id: number;
      cd_categoria: string | number;
      nm_produto: string;
      vl_produto: string;
    }) {
      this.Clear();
      await product.deleteProduct(p);
      await this.ConsultaProdutos();
    },
    retornaCategoria(e: number | string) {
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
        alert("Confira as informações!");
        return;
      } else {
        // noinspection TypeScriptValidateTypes

        await product.SaveProduct(produto);
      }
      alert("Produto inserido com sucesso!");
      this.ConsultaProdutos();
    },
  },
});
</script>

<style>
@import url("./Views.css");

.any {
  font-size: 22px;
  text-align: center;
}
</style>
