const BASE_URL = "https://6271e185c455a64564b8efa7.mockapi.io";

const productServ = {
  getList: () => {
    return axios({
      url: `${BASE_URL}/dien-thoai`,
      method: "GET",
    });
  },
};
