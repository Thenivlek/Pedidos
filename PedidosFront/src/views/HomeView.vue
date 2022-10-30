<template>
  <div class="father">
    <div class="card">
      <div class="center marginP">
        <img
          alt="Vue logo"
          class="logo"
          src="../assets/logo.png"
          width="125"
          height="125"
        />
      </div>
      <div class="title text-center marginP">Faça seu login</div>
      <div class="center">
        <div class="text-left">E-mail</div>
        <input
          type="email"
          placeholder="Ex. teste@teste.com"
          class="marginP"
          v-model.trim="email"
        />
      </div>
      <div class="center">
        <Transition name="bounce">
          <div class="text-left" v-show="!!email">Senha</div>
        </Transition>
        <Transition name="bounce">
          <input
            @keypress.enter="ValidationUser()"
            v-show="!!email"
            type="password"
            class="marginP"
            placeholder="Ex. teste123"
            v-model.trim="password"
          />
        </Transition>

        <button @click="ValidationUser()" class="button marginP">Login</button>
      </div>
    </div>
  </div>
  <!--

     <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div>
  -->
</template>
<script>
import axios from "axios";
import CryptoJS from "crypto-js";
//import { RouterLink, RouterView } from "vue-router";

//var CryptoJS = require("crypto-js");

export default {
  name: "HomeView",
  data() {
    return {
      email: "",
      password: "",
      httpValidation: "http://localhost:6060/posts/user",
    };
  },
  async created() {
    //const email = sessionStorage.email;
    //const password = sessionStorage.encryptedKey;
    //if (email.length > 0 && password.length > 0) {
    //  this.email = email;
    //  this.password = password
    //}
  },
  methods: {
    async ValidationUser() {
      if (!!this.email == false || !!this.password == false) {
        alert("Digite as credenciais corretamente! ");
      } else {
        const e = await CryptoJS.AES.encrypt(
          this.email.toString(),
          "projetoTeste"
        ).toString();
        const p = await CryptoJS.AES.encrypt(
          this.password.toString(),
          "projetoTeste"
        ).toString();

        const param = {
          email: e,
          password: p,
        };

        axios
          .post(this.httpValidation, param)
          .then(async (response) => {
            const dataResponse = {
              data: response.data,
              status: response.status,
            };
            if (response.status == 200 && !!dataResponse.data.id == true) {
              await this.Login(response.data);
            }
          })
          .catch((error) => {
            console.log(error);
            sessionStorage.removeItem("id");
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("encryptedKey");
            sessionStorage.removeItem("auth");

            alert("Usuário e/ou senha incorretos!");
          });
      }
    },
    async Login(user) {
      sessionStorage.setItem("id", user.id);
      sessionStorage.setItem("email", user.email);
      sessionStorage.setItem("auth", user.authLogin);
      sessionStorage.setItem("encryptedKey", user.encrypted);
      this.$router.push("painel");
    },
  },
};
</script>

<style scoped>
.father {
  color: black;
}
.card {
  background: rgb(223, 223, 223);
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  align-items: center;
  align-content: center;
}
.text-center {
  text-align: center;
}
.center {
  align-items: center;
  align-content: center;
  text-align: center;
}
.marginP {
  margin: 5px;
}
.text-left {
  text-align: left;
}

input {
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  border: none;
  margin-bottom: 10px;
  border-radius: 40px;
  background-color: whitesmoke;
  outline: none;
}
.title {
  font-size: 42px;
  margin-bottom: 50px;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
.button {
  width: 100%;
  opacity: 0.6;
  border: none;

  height: 40px;
  text-align: center;
  padding: 5px;
  border-radius: 20px;
  outline: none;
  transition: 0.3s;
  font-size: 16px;
  background-color: #34495e;
  color: white;
  margin-top: 50px;
}

.button:hover {
  color: black;
  background: #1bfc96;
  transition: all 0.5s ease-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

/*

  h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

*/

@media (max-width: 1024px) {
  .card {
    padding: 20px;
  }
}
</style>
