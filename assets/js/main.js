let categoriesList = document.querySelector("#categoriesList");

function productCardMaker(url_image, name, price, discount) {
  let content = `
  <div class="col-md-3 my-2">
          <div class="card">
              <img src="${url_image}" class="card-img-top img-fluid resize" alt="...">
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">$${price}</p>
                <p class="card-text">Descuento${discount}%</p>

                <div class="text-center">
                <a href="#" class="btn btn-primary">Agregar</a>
                </div>
                
              </div>
            </div>
        </div>`;

  return content;
}

const listProductsOffers = async () => {
  try {
    response = await fetch("http://localhost:4000/api/products/offers");
    const products = await response.json();

    // send error if status is not 200
    if (response.status !== 200) {
      throw new Error(response.statusText);
    } else {
      let content = ``;

      products.forEach((product, index) => {
        content += productCardMaker(
          product.url_image,
          product.name,
          product.price,
          product.discount
        );
        document.querySelector("#productsRowContainer").innerHTML = content;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const listProductsByCategory = async (id) => {
  try {
    response = await fetch(`http://localhost:4000/api/products/category/${id}`);
    const products = await response.json();

    // send error if status is not 200
    if (response.status !== 200) {
      throw new Error(response.statusText);
    } else {
      document.querySelector("#productsRowContainer").innerHTML = " ";

      let content = ``;

      products.forEach((product, index) => {
        //set default image to product if no image is provided
        if (product.url_image == null || product.url_image == "") {
          product.url_image = "assets/img/no-image.png";
        }

        // create card for each product
        content += productCardMaker(
          product.url_image,
          product.name,
          product.price,
          product.discount
        );

        // append card to container
        document.querySelector("#productsRowContainer").innerHTML = content;
      });
    }
  } catch (error) {
    // send error if failed to fetch
    console.log(error);
  }
};

categoriesList.addEventListener("click", (e) => {
  let categoryId = e.target.dataset.categoryid;
  // togle active class to the clicked element
  e.target.classList.toggle("active");
  // remove active class from all other elements
  categoriesList.querySelectorAll(".active").forEach((element) => {
    if (element !== e.target) {
      element.classList.remove("active");
    }
  });

  listProductsByCategory(categoryId);
});

window.addEventListener("load", function () {
  console.log("documento cargado");
  listProductsOffers();
});
