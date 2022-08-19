const url = "http://localhost:3000/api";

class Cart {
  constructor() {
    this.cart = [];
  }

  init() {
    this.getCartFromLocalStorage();
    if (this.cart.length === 0) this.draw();

    fetch(url + "/products")
      .then(res => res.json())
      .then(originalProducts => {
        this.originalProducts = originalProducts;
        this.createProductListForCart();
        this.draw();
      });
  }

  draw() {
    let productList = document.getElementById("cart__items");
    productList.innerHTML = "";

    if (this.cart.length === 0) {
      productList.appendChild(createElementFromHTML("<p>Votre panier est vide!</p>"));
      document.getElementById("totalQuantity").innerText = 0;
      document.getElementById("totalPrice").innerText = 0;
      return;
    }

    this.cart.forEach(product => {
      let productElement = this.createProduct(product);

      productElement.addEventListener("click", e => {
        if (e.target.className === "deleteItem") {
          this.removeProduct(product);
          productElement.remove();
        } else if (e.target.className === "itemQuantity") {
          if (Number(e.target.value) <= 0) {
            e.target.value = 1;
          }
          this.setProductQuantity({ id: product.id, color: product.color, quantity: e.target.value });
        }
      });

      productList.appendChild(productElement);
    });

    document.getElementById("totalQuantity").innerText = this.getTotalQuantity();
    document.getElementById("totalPrice").innerText = this.getTotalPrice();
  }

  getTotalQuantity() {
    let totalQuantity = 0;

    this.cart.forEach(product => {
      totalQuantity += Number(product.quantity);
    });

    return totalQuantity;
  }

  getTotalPrice() {
    let totalPrice = 0;

    this.cart.forEach(product => {
      totalPrice += Number(product.price) * Number(product.quantity);
    });

    return totalPrice;
  }

  createProductListForCart() {
    if (!this.cart) return;

    this.cart.forEach((product, index) => {
      let originalProduct = this.originalProducts.filter(originalProduct => originalProduct._id === product.id)[0];
      this.cart[index] = {
        ...product,
        imageUrl: originalProduct.imageUrl,
        altTxt: originalProduct.altTxt,
        name: originalProduct.name,
        price: originalProduct.price
      };
    });

    this.cart = this.cart.sort((a, b) => (a.name.localeCompare(b.name) >= 0 ? 1 : -1));
  }

  getCartFromLocalStorage() {
    if (!(this.cart = JSON.parse(localStorage.getItem("cart")))) {
      this.cart = [];
    }
  }

  setProductQuantity({ id, color, quantity }) {
    this.cart.forEach((product, index) => {
      if (product.id === id && product.color === color) {
        this.cart[index].quantity = quantity;
      }
    });

    this.writeCartToLocalStorage();
  }

  writeCartToLocalStorage() {
    let cleanCart = this.cart.map(product => {
      return {
        id: product.id,
        color: product.color,
        quantity: product.quantity
      };
    });
    localStorage.setItem("cart", JSON.stringify(cleanCart));
    this.draw();
  }

  removeProduct({ id, color }) {
    this.cart = this.cart.filter(product => (product.id !== id) | (product.color !== color));
    this.writeCartToLocalStorage();
  }

  createProduct(product) {
    let html = `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
            <div class="cart__item__img">
              <img src="${product.imageUrl}" alt="${product.altTxt}" />
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p class="itemPrice">${product.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté :</p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}" />
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;

    return createElementFromHTML(html);
  }
}

function isEmailValid(email) {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function isNameValid(word) {
  const regex = /^[a-zA-Z]*$/;
  return regex.test(word);
}

function isAddressValid(address) {
  const regex = /^[a-zA-Z0-9 ]*$/;
  return regex.test(address);
}

function setErrMsg(field, message) {
  field.nextElementSibling.innerText = message;
}

function clearErrMsg(field) {
  field.nextElementSibling.innerText = "";
}

const fields = [
  {
    field: document.getElementById("firstName"),
    name: "prénom",
    validator: isNameValid,
    errMsg: "Votre prénom ne doit contenir que des lettres"
  },
  {
    field: document.getElementById("lastName"),
    name: "nom",
    validator: isNameValid,
    errMsg: "Votre nom ne doit contenir que des lettres"
  },
  {
    field: document.getElementById("address"),
    name: "adresse",
    validator: isAddressValid,
    errMsg: "Votre adresse ne doit contenir que des lettres, des chiffres et des espaces"
  },
  {
    field: document.getElementById("city"),
    name: "ville",
    validator: isNameValid,
    errMsg: "Votre ville ne doit contenir que des lettres"
  },
  {
    field: document.getElementById("email"),
    name: "email",
    validator: isEmailValid,
    errMsg: "Votre email n'est pas valide"
  }
];

//submit form to server and redirect to confirmation page
function submitForm(cart) {
  let products = cart.cart.map(product => product.id);
  let body = {
    contact: {
      firstName: fields[0].field.value,
      lastName: fields[1].field.value,
      address: fields[2].field.value,
      city: fields[3].field.value,
      email: fields[4].field.value
    },
    products
  };

  fetch(url + "/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(res => {
      if (!res.ok) throw "Une erreur est survenue!";
      return res.json();
    })
    .then(res => {
      location.href = "/confirmation.html?orderId=" + res.orderId;
    })
    .catch(alert);
}

function checkFieldsOnFocus() {
  for (let field of fields) {
    field.field.addEventListener("focusout", () => {
      if (!field.validator(field.field.value)) {
        setErrMsg(field.field, field.errMsg);
      } else {
        clearErrMsg(field.field);
      }
    });
  }
}

function checkFieldsOnSubmit(cart) {
  for (let field of fields) {
    if (!field.validator(field.field.value)) {
      setErrMsg(field.field, field.errMsg);
    }
  }
  if (fields.every(field => field.validator(field.field.value))) {
    submitForm(cart);
  }
}

// watch submit button click event
function form(cart) {
  checkFieldsOnFocus();
  let order = document.querySelector("#order");
  order.addEventListener("click", e => {
    e.preventDefault();
    if (cart.cart.length === 0) {
      alert("Votre panier est vide!");
      return;
    }
    checkFieldsOnSubmit(cart);
  });
}

// init cart object and call form function with cart
function main() {
  let cart = new Cart();
  cart.init();
  if (cart.cart.length === 0) {
    document.querySelector(".cart__order__form").style.display = "none";
    return;
  }
  form(cart);
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

main();
