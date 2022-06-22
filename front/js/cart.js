//store data from API 
let apiResponseData;

//waiting for DOM
document.addEventListener('DOMContentLoaded', getItemsFromCart);
//on click or change run function
document.addEventListener('click', findClass);
document.addEventListener('change', findClass);

//on submit form
document.querySelector('.cart__order__form').addEventListener('submit', validateForm);

//ENTRY POINT
//check if localstorage  has items
function getItemsFromCart() {
    if (!localStorage.getItem('cart')) {
        document.querySelector('.cart').innerHTML = "<p style='color:red;font-size:1.4rem;font-weight:bold;text-align:center'>There are no items in your cart</p>";
    } else {
        getDataFromApi()
    }
}

//get data from API and call createHTML
async function getDataFromApi() {
    try {
        const api = 'http://127.0.0.1:3000/api/products/';
        const response = await fetch(api);
        apiResponseData = await response.json();
        createHTML(apiResponseData);
    } catch (error) {
        document.querySelector('.cart').innerHTML = `<p style=color:red;font-size:1.6rem;font-weight:bold;text-align:center>There was an error in API request</p>`
    }

}
//create HTML with data from both localstorage(cart) and API (apiData)
function createHTML(apiData) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cart__items = document.querySelector('#cart__items');

    let articleHTML = '';

    cart.forEach(cartElement => {
        //find the index of each cartElement.productId  has in json retrieved from server
        const apiProductIndex = apiData.findIndex(data => data._id === cartElement.productId);
        articleHTML += `
        <article class="cart__item" data-id="${cartElement.productId}" data-color="${cartElement.productColor}">
                <div class="cart__item__img">
                  <img src="${apiData[ apiProductIndex ].imageUrl}" alt="${apiData[ apiProductIndex ].alt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${apiData[ apiProductIndex ].name}</h2>
                    <p>${cartElement.productColor}</p>
                    <p>€${apiData[ apiProductIndex ].price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartElement.productQuantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Delete</p>
                    </div>
                  </div>
                </div>
                </article>
                `
    })
    cart__items.innerHTML = articleHTML;

    //create HTML for cart TOTAL
    getPriceQuantity();
}

//get data from cart and do the maths for items total quantity an price
function getPriceQuantity() {
    const totalQuantity = document.querySelector('#totalQuantity');
    const totalPrice = document.querySelector('#totalPrice');
    const modifiedCart = JSON.parse(localStorage.getItem('cart'));
    let totalCartArticles = 0;
    let totalCartPrice = 0;

    //Find out how many items are in localstorage cart and their total value (from apiResponseData)    
    modifiedCart.forEach(cartElement => {
        //find cart product index in apiResponseData
        apiProductId = apiResponseData.findIndex(element => element._id === cartElement.productId)
        totalCartArticles += cartElement.productQuantity;
        totalCartPrice += apiResponseData[ apiProductId ].price * cartElement.productQuantity;
    })

    totalQuantity.textContent = totalCartArticles;
    totalPrice.textContent = totalCartPrice;
}

//when user performs click or change event run function
function findClass(event) {
    //if the element clicked is the Delete button
    if (event.target.classList.contains('deleteItem')) {
        const currentArticle = event.target.closest('article');
        changeQuantity(currentArticle, 'DELETE');
    } else if (event.type === 'change' && event.target.classList.contains('itemQuantity')) {
        const currentArticle = event.target.closest('article');
        const currentItemQuantity = parseInt(event.target.value);
        if (currentItemQuantity <= 0) {
            changeQuantity(currentArticle, 'DELETE');
        } else {
            changeQuantity(currentArticle, 'MODIFY', currentItemQuantity);
        }
    }
}
//change quantity or remove item from localstorage and from HTML
function changeQuantity(parentArticle, action, currentItemQuantity) {
    //get current product id from HTML using data_id and data_color attributes
    const currentProductId = parentArticle.dataset[ 'id' ]
    const currentProductColor = parentArticle.dataset[ 'color' ];
    //get data from localstorage 
    const cart = JSON.parse(localStorage.getItem('cart'));
    //find what index has in localstorage the element with current product id and current color 
    let productIndex = cart.findIndex(element => {
        return element.productId === currentProductId && element.productColor === currentProductColor
    });
    // if user click "delete button" or set field "Qte" to zero
    //then remove corensponding item from cart
    if (action === 'DELETE') {
        //remove current item from cart Array
        const newCart = cart.filter((element, index) => index !== productIndex);
        // cart.splice(productIndex, 1);
        //if last item is removed from cart then remove cart from localstorage
        if (newCart.length == 0) {
            localStorage.removeItem('cart');
            document.querySelector('.cart').innerHTML = "<p style='color:red;font-size:1.4rem;font-weight:bold;text-align:center'>There are no items in your cart</p>";

        } else {
            //else replace old localstorage cart with modified localstorage cart
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
        //remove item from HTML
        parentArticle.remove();

    } else if (action === 'MODIFY') {
        cart[ productIndex ].productQuantity = currentItemQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    //run again TOTALS for number of items in cart and for total price
    getPriceQuantity();
}

//validate form fields
function validateForm(event) {
    event.preventDefault();

    const INPUTPATTERN = /^[a-zA-Z]+[\--]*[a-zA-Z]*(\s\w+)*[^\_|\s|\--]$/;
    const EMAILPATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const ADRESSPATTERN = /^[\w]+[a-zA-Z]*(\s\w+)*[^\_|\s|\-]$/;

    let email = document.querySelector('#email');
    let address = document.querySelector('#address');
    let formValidated = 1;

    //create a nodelist with input fields except the one for address
    let textInputs = document.querySelectorAll('[type=text]:not(#address)');
    //check if pattern is valid
    textInputs.forEach((element => {
        if (!INPUTPATTERN.test(element.value.trim())) {
            element.nextElementSibling.textContent = "Text should start with letter"
            formValidated = 0;
        }
    }))

    if (!EMAILPATTERN.test(email.value.trim()) || !ADRESSPATTERN.test(address.value.trim())) {
        email.nextElementSibling.textContent = "Text should start with letter"
        formValidated = 0;
    }

    if (formValidated) {
        dataForApi()
    }
}

// if form passed regex validation create object to POST
function dataForApi(event) {
    const firstName = document.querySelector('#firstName').value.trim();
    const lastName = document.querySelector('#lastName').value.trim();
    const address = document.querySelector('#address').value.trim();
    const city = document.querySelector('#city').value.trim();
    const email = document.querySelector('#email').value.trim();
    // const form = document.querySelector('.cart__order__form');
    // const textError = document.querySelectorAll('[id*=ErrorMsg]')

    //create produts array using cart element id
    let products = [];
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.forEach(element => {
        products.push(element.productId);
    })

    //create contact object from input fields (ex: contact = {firstName:firstName,lastName:lastName} )
    const contact = {
        firstName, lastName, address, city, email
    };

    //create object to POST to API
    const orderData = {
        contact, products
    }

    postToAPI(orderData);
}

//POST to API
async function postToAPI(orderData) {
    const reponse = await fetch('http://127.0.0.1:3000/api/products/order', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });
    const data = await reponse.json();
    confirmationPage(data);
}

// create URL with data from POST and redirect to new page
function confirmationPage(data) {
    window.location.href = `./confirmation.html?orderId=${data.orderId}`
}
