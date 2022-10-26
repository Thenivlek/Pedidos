import axios from "axios";
import CryptoJS from "crypto-js";
const httpValidation = "http://localhost:6060/posts/user";

export default {
  async ValidationUser() {
    let retorno = {
      dados: "",
      status: 500,
    };
    const password = sessionStorage.encryptedKey;
    const email = sessionStorage.email;

    if (!!email == false || !!password == false) {
      retorno = {
        dados: "Usuário não encontrado",
        status: 500,
      };
    } else {
      const e = await CryptoJS.AES.encrypt(
        email.toString(),
        "projetoTeste"
      ).toString();
      const p = await CryptoJS.AES.encrypt(
        password.toString(),
        "projetoTeste"
      ).toString();

      const param = {
        email: e,
        password: p,
      };

      const validation = axios
        .post(httpValidation, param)
        .then((response) => {
          const dataResponse = {
            data: response.data,
            status: response.status,
          };
          if (response.status == 200 && !!dataResponse.data.id == true) {
            retorno = {
              dados: response.data,
              status: response.status,
            };
          }
        })
        .catch((error) => {
          sessionStorage.removeItem("id");
          sessionStorage.removeItem("email");
          sessionStorage.removeItem("encryptedKey");
          sessionStorage.removeItem("auth");
          retorno = {
            dados: "Usuário e/ou senha incorretos!",
            status: 500,
          };
        });
    }
    return retorno;
  },
};
