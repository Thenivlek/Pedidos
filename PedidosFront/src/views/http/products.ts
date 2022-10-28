import axios from "axios";
const httpNewProduct = "http://localhost:6060/posts/product";
const httpAllProducts = "http://localhost:6060/posts/products";

export default {
  //Salva um novo produto
  async SaveProduct(product: {
    nm_produto: string;
    vl_produto: number;
    cd_categoria: number;
    nm_categoria: string;
  }) {
    let retorno = {};
    await axios
      .post(httpNewProduct, product)
      .then((response) => {
        const dados = {
          id: response.data.id,
          nm_produto: response.data.nm_produto,
          vl_produto: response.data.vl_produto,
          cd_categoria: response.data.cd_categoria,
        };
        retorno = {
          dados: dados,
          status: response.status,
        };
      })
      .catch((error) => {
        alert(error);
        retorno = {
          dados: error,
          status: parseInt(error.status),
        };
      });
    return retorno;
  },
  async getProdutos() {
    return await axios
      .get(httpAllProducts)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  },
};
