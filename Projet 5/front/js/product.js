async function main() {
  let id = new URLSearchParams(window.location.search).get("id");
  let product = await (await fetch("http://grossebeut.eu:3000/api/products/" + id)).json();

  createProduct(product);
}

function createProduct(product) {
  let img = document.createElement("img");
  img.setAttribute("src", product.imageUrl);
  img.setAttribute("alt", product.altTxt);

  document.getElementsByClassName("item__img")[0].appendChild(img);

  document.getElementById("title").innerText = product.name;
  document.getElementById("price").innerText = product.price;
  document.getElementById("description").innerText = product.description;

  product.colors.forEach(color => {
    let option = document.createElement("option");
    option.setAttribute("value", color);
    option.innerText = color;
    document.getElementById("colors").appendChild(option);
  });
}

main();
