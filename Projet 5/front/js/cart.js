async function main() {
  let cart = JSON.parse(localStorage.getItem("cart"));

  let productList = document.getElementById("cart__items");
  const originalProducts = await (await fetch("http://grossebeut.eu:3000/api/products")).json();

  if (!cart) {
    productList.appendChild(createElementFromHTML("<p>Votre panier est vide!</p>"));
    return;
  }

  let price = 0;
  let quantity = 0;

  cart.forEach(product => {
    let originalProduct = getProduct(product.id, originalProducts);
    product = {
      ...product,
      imageUrl: originalProduct.imageUrl,
      altTxt: originalProduct.altTxt,
      name: originalProduct.name,
      price: originalProduct.price
    };

    price += product.price * product.quantity;
    quantity += Number(product.quantity);

    productList.appendChild(createProduct(product));
  });

  document.getElementById("totalQuantity").innerText = quantity;
  document.getElementById("totalPrice").innerText = price;
}

function getProduct(id, products) {
  let product;
  products.forEach(element => {
    if (element._id === id) product = element;
  });

  return product;
}

function createProduct(product) {
  let html = `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}" />
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${product.color}</p>
        <p>${product.price} €</p>
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

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

main();
