export default {
  async sleep(ms: number) {
    if (!!ms == false) {
      ms = 1000;
    }
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
