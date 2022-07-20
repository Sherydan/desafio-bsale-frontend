let categoriesList = document.querySelector("#categoriesList");
let inputSearch = document.querySelector("#inputSearch");
let sortProductSelect = document.querySelector("#sortProductSelect");
let res = document.getElementById("result");

/**
 * Create a card for each product
 * @param {string} url_image
 * @param {string} name
 * @param {number} price
 * @param {number} discount
 * @returns {string}
 * 
 */
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



/***************************************************************
 * 
 * API CALLS SECTION
 * 
 ****************************************************************/


/**
 * Show predicted results when user types in search bar
 * @param {string} name
 * @returns {string}
 */
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

/**
 * Show results when user types in search bar
 * @param {string} name
 * @returns {string}
 * 
 */

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

/** 
 * Show products offers
 * @returns {string}
 * 
 */
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
      // make the card for each product
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

/**
 * List products by category
 * @param {string} category
 * @returns {string}
 */
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

/***************************************************************
 * 
 * EVENT LISTENERS SECTION
 * 
 ****************************************************************/

/**
 * Event listener for categories list
 * @param {event} event
 * calls api function to get products by category
 * toggles active class on category
 * removes active class from other categories
 */
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


/**
 * Event listener for search bar
 * @param {event} event
 * calls api function to get products by name
 * show predicted results on list 
 * show results when enter key is pressed
 */
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

/**
 * Event listener for search bar on focus out
 * @param {event} event
 * hides <p> tag when search bar is empty
 * shows what you are searching for in <p> tag
 */
inputSearch.addEventListener("focusout", (e) => {
  if (e.target.value == "" || e.target.value == null) {
    searchingFor.innerHTML = "";
    searchingFor.style.display = "none";
  } else {
    searchingFor.style.display = "block";
    searchingFor.innerHTML = `Estas buscando: "${e.target.value}"`;
  }
});

/**
 * Event listener for search bar on focus in
 * @param {event} event
 * hides <p> tag when search bar is empty
 * shows what you are searching for in <p> tag
 * 
 */
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

/**
 * res event listener on click
 * @param {event} event
 * changes inputSearch value to the clicked result
 * hides <p> tag when search bar is empty
 * 
 */
res.addEventListener("click", (e) => {
  
  inputSearch.value = e.target.innerHTML;
  searchingFor.innerHTML = "";
  searchingFor.style.display = "none";
  res.innerHTML = "";
  showResults(inputSearch.value);
});

/**\
 * Shows products offers when document is loaded\
 * @param {event} event
 * calls api function to get products offers
 */
window.addEventListener("load", function () {
  listProductsOffers();
});
