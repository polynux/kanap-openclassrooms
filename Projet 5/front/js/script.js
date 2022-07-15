const url = "http://grossebeut.eu:3000/api";

async function main() {
  let products = await (await fetch(url + "/products")).json();

  let items = document.getElementById("items");

  products.forEach(product => {
    items.appendChild(createProduct(product));
  });
}

function createProduct(product) {
  let html = `<a href="./product?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}" />
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">
        ${product.description}
      </p>
    </article>
  </a>`;
  return createElementFromHTML(html);
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

main();
