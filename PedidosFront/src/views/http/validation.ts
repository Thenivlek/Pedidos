import axios from "axios";
import CryptoJS from "crypto-js";
const httpValidation = "http://localhost:6060/posts/user";

export default {
  //Confere se o usuário existe no back-End
  async ValidationUser(email = String, password = String) {
    if (email.length == 0 || password.length == 0) {
      return {
        dados: "Usuário não encontrado",
        status: 500,
      };
    } else {
      const e = await CryptoJS.AES.encrypt(
        email.toString(),
        "projetoTeste"
      ).toString();
      //const p = CryptoJS.AES.encrypt(password.toString(), "projetoTeste");

      const param = {
        email: e,
        password: password,
      };
      return await axios
        .post(httpValidation, param)
        .then((response) => {
          if (response.status == 200 && !!response.data.id == true) {
            return {
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
          return {
            dados: "Usuário e/ou senha incorretos!",
            status: 500,
          };
        });
    }
  },
};
