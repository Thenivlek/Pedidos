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
interface Order {
  length: number;
  user: number;
  idOrder: number;
  [index: number]: {
    id: number;
    cd_categoria: number;
    nm_produto: string;
    vl_produto: number | number;
  };
}
interface Produtos {
  id: number;
  cd_categoria: string;
  nm_produto: string;
  vl_produto: number;
}
interface Post {
  userId: Number;
  id: Number;
  title: String;
  body: String;
}

var Produtos: Array<Produtos> = [];
var Orders: Array<Order> = [];

//Verifica a autorização---------------------------------------------
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

    let bytesEmail = CryptoJS.AES.decrypt(credenciais.email, "projetoTeste");
    const originalEmail = bytesEmail.toString(CryptoJS.enc.Utf8);
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

//Retorna todos os produtos da base--------------------------------------
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  if (Produtos.length > 0) {
    res.send(Produtos);
    res.end();
  } else {
    res.send({ dados: "Nenhum produto encontrado", status: 500 });
    res.end();
  }
};

// Pesquisa de Produtos por nome---------------------------------------------
const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.params.nm_produto.toUpperCase();
  let encontrados = [];

  if (Produtos.length > 0) {
    for (let a = 0; a < Produtos.length; a++) {
      Produtos[a].nm_produto.toUpperCase().indexOf(name);
      if (Produtos[a].nm_produto.toUpperCase().indexOf(name) != -1) {
        encontrados.push(Produtos[a]);
      }
    }
  } else {
    return res.status(500).json({ dados: "Nenhum produto cadastrado!" });
  }

  if (encontrados.length > 0) {
    return res.status(200).json(encontrados);
  } else {
    return res
      .status(500)
      .json({ dados: "Nenhum produto encontrado", status: 500 });
  }
};

// Atualizando um produto---------------------------------------------
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  const body = req.body.p;

  const index = Produtos.findIndex((e) => {
    return e.id == id;
  });

  if (index != -1) {
    Produtos[index].cd_categoria = body.cd_categoria;
    Produtos[index].vl_produto = body.vl_produto;
    Produtos[index].nm_produto = body.nm_produto;
    return res.status(200).json({
      dados: "Produto alterado com sucesso!",
      status: 200,
    });
  } else {
    return res.status(500).json({
      dados: "Produto não encontrado!",
      status: 500,
    });
  }
};

// Deletando um produto---------------------------------------------
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id: string = req.params.id;
  if (!!req.params.id) {
    Produtos = Produtos.filter((e) => {
      return e.id != parseInt(req.params.id);
    });
  }
  return res.status(200).json({
    dados: "Produto excluído com sucesso!",
  });
};

// Adicionando um produto novo---------------------------------------------
const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  // get data from req.body

  let produto = {
    id: 0,
    nm_produto: req.body.nm_produto,
    vl_produto: req.body.vl_produto,
    cd_categoria: req.body.cd_categoria,
  };

  //Verifica se existe algum produto sem informação
  if (!!produto.nm_produto || !!produto.vl_produto || produto.cd_categoria) {
    try {
      //Pega o próximo id disponível
      produto.id = getFinalId() + 1;
      Produtos.push(produto);
      res.status(200).send(produto);
      res.end();
    } catch (error) {
      //Caso haja algum erro
      res.status(500).send("Não foi possível adicionar um novo produto!");
      res.end();
    }
  } else {
    //Caso falte parâmetros
    res.status(500).send("Faltam informações de cadastro do produto!");
    res.end();
  }
};
//Adicionando um pedido--------------------------------------------------
const newOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orders = req.body.order;
  const user = req.body.user;
  if (!!user) {
    Orders.push(orders);

    res.status(200).send({ dados: "Pedido gravado com sucesso!", status: 200 });
    res.end();
  } else {
    res.status(500).send({ dados: "Impossível gravar o pedido!", status: 500 });
    res.end();
  }
};
//Consulta de todas as orders-------------------------------------------
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  if (Orders.length > 0) {
    res.status(200).send(Orders);
    res.end();
  } else {
    res.status(500).send({ dados: "Nenhuma ordem encontrada!", status: 500 });
    res.end();
  }
};
//Delete do pedido-------------------------------------------
const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  let id: number = parseInt(req.params.id);
  if (Orders.length > 0) {
    const find = Orders.find((e) => {
      return e.idOrder == id;
    });
    if (!!find) {
      Orders = Orders.filter((e) => {
        return e.idOrder != find.idOrder;
      });
      res
        .status(200)
        .send({ dados: "Ordem excluída com sucesso!", status: 200 });
    } else {
      res.status(500).send({ dados: "Ordem não encontrada", status: 500 });
    }
  } else {
    res.status(500).send({ dados: "Ordem não encontrada", status: 500 });
  }
};

//Busca o ultimo Id de produto cadastrado-------------------------------
function getFinalId() {
  let final = 0;
  //Verifica se existe algum produto, se não existir retorna o id = 0
  if (Produtos.length == 0) {
    final = 0;
  } else {
    final = Produtos[Produtos.length - 1].id;
  }
  //Tratamento de erro
  if (final == null || final == undefined) {
    final = 0;
  }
  return final;
}
//-----------------------------------------------------------------------

export default {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addProduct,
  getAuth,
  newOrder,
  getOrders,
  deleteOrder,
};
