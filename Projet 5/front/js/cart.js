function getCart() {
    let cart;
    if (!(cart = JSON.parse(localStorage.getItem("cart")))) {
        cart = [];
    }
    return cart;
}

function removeItemFromCart(id, color) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id && item.color !== color);
    localStorage.setItem("cart", JSON.stringify(cart));
}

async function main() {
    let cart = getCart();

    let productList = document.getElementById("cart__items");

    if (!cart) {
        productList.appendChild(createElementFromHTML("<p>Votre panier est vide!</p>"));
        return;
    }

    const originalProducts = await (await fetch("http://grossebeut.eu:3000/api/products")).json();

    let price = 0;

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

        let productElement = createProduct(product);

        productElement.addEventListener("click", e => {
            if (e.target.className === "deleteItem") {
                removeItemFromCart(product.id, product.color);
                productElement.remove();
            }
        })

        productList.appendChild(productElement);
    });

    document.getElementById("totalQuantity").innerText = getTotalQuantity();
    document.getElementById("totalPrice").innerText = getTotalPrice();
}

function getProduct(id, products) {
    let product;
    products.forEach(element => {
        if (element._id === id) product = element;
    });

    return product;
}

function getTotalPrice() {
    let price = 0;
    let prices = document.getElementsByClassName("itemPrice");
    let quantities = document.getElementsByClassName("itemQuantity");
    for (let i = 0; i < prices.length; i++) {
        price += parseInt(prices[i].innerText) * parseInt(quantities[i].value);
    }
    return price;
}

function getTotalQuantity() {
    let quantity = 0;
    let items = document.getElementsByClassName("itemQuantity");
    for (let i = 0; i < items.length; i++) {
        quantity += Number(items[i].value);
    }
    return quantity;
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

function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

main();
