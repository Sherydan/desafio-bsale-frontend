let categoriesList = document.querySelector("#categoriesList");
let inputSearch = document.querySelector("#inputSearch");
let sortProductSelect = document.querySelector("#sortProductSelect");
let res = document.getElementById("result");

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
                <a href="#" class="btn ">Agregar</a>
                </div>
                
              </div>
            </div>
        </div>`;

  return content;
}

// sanitize string function to remove / and spaces
const sanitizeString = (string) => {
  return string.replace(/\s/g, "").replace(/\//g, "");
};

const showPredictedResults = async (name) => {
  res.innerHTML = "";
  let list = "";
  if (name == "") {
    return;
  }

  try {
    response = await fetch(
      `https://desafio-bsale-backend.herokuapp.com/api/products/search/${name}`
    );
    const names = await response.json();

    let stopLoop;
    // send error if status is not 200
    if (response.status !== 200) {
      throw new Error(response.statusText);
    } else {
      names.forEach((name) => {
        list += `<li> <a class="dropdown-item" href="#">  ${name.name} </a></li>`;
      });

      res.innerHTML = '<ul id="autocompleteList">' + list + "</ul>";
    }
  } catch (error) {
    // send error if failed to fetch
    console.log(error);
  }
};

const showResults = async (name) => {
  res.innerHTML = "";
  let content = ``;
  let list = "";
  if (name == "") {
    return;
  }

  try {
    response = await fetch(
      `https://desafio-bsale-backend.herokuapp.com/api/products/search/${name}`
    );
    const products = await response.json();

    // check if products are empty
    if (products.length == 0) {
      content.innerHTML = "No se encontraron resultados";
      res.innerHTML = "No se encontraron resultados";
      return;
    } else {
      // send error if status is not 200
      if (response.status !== 200) {
        throw new Error(response.statusText);
      } else {
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
          document.querySelector("#productsRowContainer").innerHTML = content;
        });
      }
    }
  } catch (error) {
    // send error if failed to fetch
    console.log(error);
  }
};

const listProductsOffers = async () => {
  try {
    response = await fetch(
      "https://desafio-bsale-backend.herokuapp.com/api/products/offers"
    );
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
    response = await fetch(
      `https://desafio-bsale-backend.herokuapp.com/api/products/category/${id}`
    );
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
  searchingFor.innerHTML = "";
  searchingFor.style.display = "none";
  // list offers if id=listOffers
  if (categoryId == "listOffers") {
    
    listProductsOffers();
  } else {
    listProductsByCategory(categoryId);
  }
  // togle active class to the clicked element
  e.target.classList.toggle("active");
  // remove active class from all other elements
  categoriesList.querySelectorAll(".active").forEach((element) => {
    if (element !== e.target) {
      element.classList.remove("active");
    }
  });
});

inputSearch.addEventListener("keydown", (e) => {
  
  let searchingFor = document.querySelector("#searchingFor");

  showPredictedResults(e.target.value);
  if (e.target.value == "" || e.target.value == null) {
    searchingFor.innerHTML = "";
    searchingFor.style.display = "none";
  } else {
    searchingFor.style.display = "block";
    searchingFor.innerHTML = `Estas buscando: "${e.target.value}"`;
    showResults(inputSearch.value);
    if (e.key === "Enter") {
      showResults(inputSearch.value);
    }
  }
});

inputSearch.addEventListener("focusout", (e) => {
  if (e.target.value == "" || e.target.value == null) {
    searchingFor.innerHTML = "";
    searchingFor.style.display = "none";
  } else {
    searchingFor.style.display = "block";
    searchingFor.innerHTML = `Estas buscando: "${e.target.value}"`;
  }
});

inputSearch.addEventListener("onfocus", (e) => {
  alert("focus");
  if (e.target.value == "" || e.target.value == null) {
    searchingFor.innerHTML = "";
    searchingFor.style.display = "none";
  } else {
    showPredictedResults(e.target.value);
    searchingFor.style.display = "block";
    searchingFor.innerHTML = `Estas buscando: "${e.target.value}"`;
  }
});

// change inputSearch value when user clicks on res
res.addEventListener("click", (e) => {
  
  inputSearch.value = e.target.innerHTML;
  searchingFor.innerHTML = "";
  searchingFor.style.display = "none";
  res.innerHTML = "";
  showResults(inputSearch.value);
});

window.addEventListener("load", function () {
  listProductsOffers();
});
