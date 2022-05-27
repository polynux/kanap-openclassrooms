// call api
function main() {
  fetch("http://grossebeut.eu:3000/api/products/" + getId())
    .then(handleErrors)
    .then(response => response.json().then(createProduct))
    .catch(() => (location.href = "./index.html"));
}

// get current procut id from query args
function getId() {
  return new URLSearchParams(location.search).get("id");
}

// modify page to add product info
function createProduct(product) {
  let img = document.createElement("img");
  img.setAttribute("src", product.imageUrl);
  img.setAttribute("alt", product.altTxt);

  document.getElementsByClassName("item__img")[0].appendChild(img);

  document.getElementById("title").innerText = product.name;
  document.getElementById("price").innerText = product.price;
  document.getElementById("description").innerText = product.description;
  document.getElementById("addToCart").onclick = addToCart;

  product.colors.forEach(color => {
    let option = document.createElement("option");
    option.setAttribute("value", color);
    option.innerText = color;
    document.getElementById("colors").appendChild(option);
  });
}

// check if correct values selected
function checkValues(values) {
  if (values.color === "") {
    alert("Séléctionnez une couleur!");
    return false;
  }
  return true;
}

// add selected values to localstorage cart
function addToCart() {
  let values = {
    id: getId(),
    quantity: document.getElementById("quantity").value,
    color: document.getElementById("colors").value
  };

  if (checkValues(values)) {
    let cart;
    if (!(cart = JSON.parse(localStorage.getItem("cart")))) {
      cart = [];
    }

    cart.push(values);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

// handle fetch error
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

main();
