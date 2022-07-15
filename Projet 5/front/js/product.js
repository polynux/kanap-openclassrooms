const url = "http://grossebeut.eu:3000/api";

// call api
function main() {
    fetch(url + "/products/" + getId())
        .then(handleErrors)
        .then(response => response.json().then(createProduct))
        .catch(() => (location.href = "./index.html"));
}

// get current procut id from query args
function getId() {
    let urlParams = new URLSearchParams(location.search);
    return urlParams.get("id");
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

function getCart() {
    let cart;
    if (!(cart = JSON.parse(localStorage.getItem("cart")))) {
        cart = [];
    }
    return cart;
}

// add selected values to localstorage cart
function addToCart() {
    let values = {
        id: getId(),
        quantity: document.getElementById("quantity").value,
        color: document.getElementById("colors").value
    };

    if (!checkValues(values)) return;

    let cart = getCart();
    let index = cart.findIndex(item => item.id === values.id && item.color === values.color);

    if (index !== -1) {
        cart[index].quantity = parseInt(cart[index].quantity) + parseInt(values.quantity);
    }
    else {
        cart.push(values);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Produit ajouté au panier!");
}

// handle fetch error
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

main();
