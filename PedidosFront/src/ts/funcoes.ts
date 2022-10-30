export default {
  async sleep(ms: number) {
    if (!!ms == false) {
      ms = 1000;
    }
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  async FormataMoeda(vl: number) {
    //const valor = parseInt(vl.replaceAll("R$", "").replaceAll(",", "."));
    const f = vl.toLocaleString("pt-br", { minimumFractionDigits: 2 });
    //const f = vl
    //  .toLocaleString("pt-br", {
    //    style: "currency",
    //    currency: "BRL",
    //  });

    //this.vl_produto = f.replaceAll("R$", "");
    return f;
  },
};
