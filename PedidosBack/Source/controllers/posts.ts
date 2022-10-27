import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
var CryptoJS = require("crypto-js");

const users = [
  {
    id: 1,
    email: "teste@teste.com",
    password: "teste123",
  },
  {
    id: 1,
    email: "teste@gmail.com",
    password: "gmail123",
  },
  {
    id: 1,
    email: "teste@hotmail.com",
    password: "hotmail123",
  },
  {
    id: 1,
    email: "teste@yahoo.com",
    password: "yahoo123",
  },
];

interface Post {
  userId: Number;
  id: Number;
  title: String;
  body: String;
}

const getAuth = async (req: Request, res: Response, next: NextFunction) => {
  const credenciais = req.body;

  //Tratamento de erros
  if (!!credenciais.email == false || !!credenciais.password == false) {
    res.status(500).send("Login ou senha incorretos!");
    res.end();
  } else {
    //Decrypt da senha e email
    let bytesPassword = CryptoJS.AES.decrypt(
      credenciais.password,
      "projetoTeste"
    );
    const originalPassWord = bytesPassword.toString(CryptoJS.enc.Utf8);
    console.log("PASSWORD", originalPassWord);

    let bytesEmail = CryptoJS.AES.decrypt(credenciais.email, "projetoTeste");
    const originalEmail = bytesEmail.toString(CryptoJS.enc.Utf8);
    console.log("EMAIL ->", originalEmail);
    //Busca do usuário nos usuários criados no node
    const find = users.find((e) => {
      return originalEmail == e.email && originalPassWord == e.password;
    });

    //Caso não encontre nenhum
    if (!!find == false) {
      res.status(500).send("Login ou senha incorretos!");
      res.end();
    } else if (find != undefined) {
      //Se achar é criptografado a senha e enviado de volta.
      //Estava tendo problemas com Else do TS, por isso decidi optar pelo else if()
      let em = find.password;
      let enc = await CryptoJS.AES.encrypt(
        em.toString(),
        "projetoTeste" //Optei por outra palavra chave por segurança
      ).toString();

      res.send({
        id: find.id,
        email: find.email,
        encrypted: enc,
        authLogin: true,
      });
      res.end();
    }
  }
};

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  // get some posts
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts`
  );
  let posts: [Post] = result.data;
  return res.status(200).json({
    message: posts,
  });
};

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from the req
  let id: string = req.params.id;
  // get the post
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  let post: Post = result.data;
  return res.status(200).json({
    message: post,
  });
};

// updating a post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from the req.params
  let id: string = req.params.id;
  // get the data from req.body
  let title: string = req.body.title ?? null;
  let body: string = req.body.body ?? null;
  // update the post
  let response: AxiosResponse = await axios.put(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      ...(title && { title }),
      ...(body && { body }),
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from req.params
  let id: string = req.params.id;
  // delete the post
  let response: AxiosResponse = await axios.delete(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  // return response
  return res.status(200).json({
    message: "post deleted successfully",
  });
};

// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
  // get the data from req.body
  let title: string = req.body.title;
  let body: string = req.body.body;
  // add the post
  let response: AxiosResponse = await axios.post(
    `https://jsonplaceholder.typicode.com/posts`,
    {
      title,
      body,
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

export default { getPosts, getPost, updatePost, deletePost, addPost, getAuth };
