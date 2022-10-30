import axios from "axios";
const httpNewOrder = "http://localhost:6060/posts/order";
const httpConsultaOrder = "http://localhost:6060/posts/orders/";

export default {
  async ConsultaOrders(id: number) {
    return await axios
      .get(httpConsultaOrder + id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response;
      });
  },
  async NewOrder(
    o: {
      id: number;
      nm_produto: string;
      vl_produto: number;
      cd_categoria: number | string;
    },
    user: number
  ) {
    return await axios
      .post(httpNewOrder, {
        order: o,
        user: user,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response;
      });
  },
};
