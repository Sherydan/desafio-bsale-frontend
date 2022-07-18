const listProductsOffers= async () => {
    response = await fetch("http://localhost:4000/api/products/offers");
    const products = await response.json();

    let content = ``;

    products.forEach( (product, index) => {
        content += `
        <div class="col-md-3 my-2">
          <div class="card">
              <img src="${product.url_image}" class="card-img-top img-fluid resize" alt="...">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price}</p>
                <p class="card-text">Descuento${product.discount}%</p>

                <div class="text-center">
                <a href="#" class="btn btn-primary">Agregar</a>
                </div>
                
              </div>
            </div>
        </div>`;

    document.querySelector("#productsRowContainer").innerHTML = content;
    });
}

window.addEventListener("load", function () {
    console.log("documento cargado");
    listProductsOffers();
});