let productList = [];
let cart = [];
let productDetail = [];
const DSSP_LOCALSTORAGE = "DSSP_LOCALSTORAGE";

productServ
  .getList()
  .then((res) => {
    productList = res.data;
    renderProductList(productList);
  })
  .catch((err) => {
    console.log(err);
  });

const renderProductList = (list) => {
  let contentHTML = "";
  for (let i = 0; i < list.length; i++) {
    let product = list[i];
    let contentDiv = `<div class="col-3">
      <div class="card product-item p-3">
        <button onclick="addToCart('${product.name}')" class="badge-pill btn-addtocart">Add to cart</button>
        <img src=${product.img} class="card-img-top pt-2" alt="...">
        <div class="card-body">
          <p class="card-title">${product.name}</p>
          <p class="card-text">${product.price}</p>
        </div>
        <button onclick="showDetail('${product.name}')" class="btn btn-light rounded-pill detail">See detail</button>
      </div>
    </div>`;
    contentHTML += contentDiv;
  }
  document.getElementById("product-list").innerHTML = contentHTML;
};

const filterProduct = () => {
  let value = document.getElementById("loai-sp").value;
  if (value == "ss") {
    let samsungList = [];
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].type === "Samsung") {
        samsungList.push(productList[i]);
        renderProductList(samsungList);
      }
    }
  } else if (value == "ip") {
    let iphoneList = [];
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].type === "iphone") {
        iphoneList.push(productList[i]);
        renderProductList(iphoneList);
      }
    }
  } else {
    renderProductList(productList);
  }
};

const renderCart = (list) => {
  localStorage.setItem("cartItem", JSON.stringify(cart));
  let contentCart = "";
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let contentDiv = `
    <tr>
    <td class="w-25">${item.name}</td>
    <td class="w-25"><img class="img-fluid w-50" src=${item.img} /></td>
    <td >
    <i class="fa fa-plus border border-info rounded" onclick="tangGiamSL('${item.name}',1)"></i>
    <span class="px-2">${item?.quantity}</span>
    <i class="fa fa-minus border border-warning rounded" onclick="tangGiamSL('${item.name}',-1)"></i>
    </td>
    <td>${item.price}</td>
    <td>
    <button class="btn btn-danger" onclick="deleteProduct('${item.name}')">Xoá</button>
    </td>
    </tr>
    `;
    contentCart += contentDiv;

    let contentTableFooter = `
    <h5>Tổng tiền: ${item.price * item.quantity}</h5>
    <button onclick="thanhToan()" class="btn btn-success mx-5">
      Thanh toán
    </button>`;
    tabletFooter = contentTableFooter;
  }
  let contentCartEmpty = `<tr><td class="text-danger" colspan="5">Không có sản phẩm trong giỏ hàng</td></tr>`;
  if (cart.length > 0) {
    document.getElementById("table-body").innerHTML = contentCart;
    document.getElementById("table-footer").innerHTML = tabletFooter;
  } else {
    document.getElementById("table-body").innerHTML = contentCartEmpty;
    document.getElementById("table-footer").innerHTML = null;
  }
};
const renderProductDetail = (list) => {
  let contentDetail = "";
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let contentTrTag = `
    <div class="d-flex">
      <div class="col-4"><img class="w-75" src=${item.img} /></div>
      <div class="col-8">
      <table class="table">
        <tr>
          <td class="font-weight-bold">Tên sản phẩm</td>
          <td>${item.name}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Màn hình</td>
          <td>${item.screen}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Camera sau</td>
          <td>${item.backCamera}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Camera trước</td>
          <td>${item.frontCamera}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Mô tả</td>
          <td>${item.desc}</td>
        </tr>
      </table>
      </div>
    </div>
    `;
    contentDetail += contentTrTag;
  }
  document.getElementById("product-detail").innerHTML = contentDetail;
};

const addToCart = (product) => {
  let index = cart.findIndex((item) => {
    return item.name == product.name;
  });
  if (index == -1) {
    cartItem = productList.map((item) => {
      return { ...item, quantity: 1 };
    });
    cart.push(...cartItem);
  } else {
    cart[index].quantity++;
  }
  renderCart(cart);
  console.log(index);
  console.log("cart", cart);
  saveLocalStorage();
};

const deleteProduct = (idProduct) => {
  let index = cart.findIndex((item) => {
    return item.name == idProduct;
  });
  if (index !== -1) {
    cart.splice(index, 1);
  }
  console.log(index);
  renderCart(cart);
  saveLocalStorage();
};

const tangGiamSL = (idProduct, value) => {
  let index = cart.findIndex((item) => {
    return item.name == idProduct;
  });
  if (index !== -1) {
    cart[index].quantity += value;
  }
  cart[index].quantity == 0 && cart.splice(index, 1);
  renderCart(cart);
  saveLocalStorage();
};
const thanhToan = () => {
  $("#myModal").modal("hide");
  cart = [];
  renderCart(cart);
  saveLocalStorage();
};

const showDetail = (product) => {
  let index = productDetail.findIndex((item) => {
    return item.name == product.name;
  });
  if (index == -1) {
    newProduct = productList.map((item) => {
      return { ...item };
    });
    productDetail.splice(0, 1, ...newProduct);
  }
  renderProductDetail(productDetail);
};

const saveLocalStorage = () => {
  let cartListJson = JSON.stringify(cart);
  localStorage.setItem(DSSP_LOCALSTORAGE, cartListJson);
};
let cartListJson = localStorage.getItem(DSSP_LOCALSTORAGE);
if (cartListJson) {
  cart = JSON.parse(cartListJson);
  renderCart(cart);
}
