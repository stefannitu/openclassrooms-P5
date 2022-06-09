//waiting for DOM
document.addEventListener('DOMContentLoaded', getItemsFromCart);
//on click or change run function
[ 'click', 'change' ].forEach(e => document.addEventListener(e, findClass));

const order = document.querySelector('.cart__order__form');
const cart__items = document.querySelector('#cart__items');

order.addEventListener('submit', validateForm);

// let cart;
let apiResponseData;

//check if localstorage  has items
function getItemsFromCart() {
    if (!localStorage.getItem('cart')) {
        cart__items.innerHTML = "<p style='color:red;font-size:1.4rem;font-weight:bold;text-align:center'>There are no items in your cart</p>";
    } else {
        getDataFromApi()
    }
}

//get data from API and call createHTML
async function getDataFromApi() {
    const api = 'http://127.0.0.1:3000/api/products/';
    const response = await fetch(api);
    apiResponseData = await response.json();
    createHTML(apiResponseData);
}
//create HTML forEach item in cart
function createHTML(apiData) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let articleHTML = '';

    cart.forEach(cartElement => {
        const apiProductIndex = apiData.findIndex(data => data._id == cartElement.productId);
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

    //HTML for cart TOTAL
    getPriceQuantity();
}

//check if click/change events target is delete button or quantity input
function findClass(event) {
    if (event.target.classList.contains('deleteItem')) {
        const currentArticle = event.target.closest('article');
        changeQuantity(currentArticle, 'DELETE');
    } else if (event.target.classList.contains('itemQuantity')) {
        const currentArticle = event.target.closest('article');
        const currentItemQuantity = parseInt(event.target.value);
        if (currentItemQuantity <= 0) {
            changeQuantity(currentArticle, 'DELETE');
        } else {
            changeQuantity(currentArticle, 'MODIFY', currentItemQuantity);
        }

    }
}


function changeQuantity(parentArticle, action, currentItemQuantity) {
    const currentProductId = parentArticle.dataset[ 'id' ]
    const currentProductColor = parentArticle.dataset[ 'color' ];
    let cart = JSON.parse(localStorage.getItem('cart'));
    let productIndex = cart.findIndex(element => element.productId == currentProductId && element.productColor == currentProductColor);
    // in case user click delete button or quantity = 0
    //remove item from cart
    //if we delete last item from cart then remove cart from localstorage
    //else replace old localstorage cart with modified localstorage cart
    if (action == 'DELETE') {
        cart.splice(productIndex, 1);
        if (cart.length == 0) {
            localStorage.removeItem('cart');
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        //remove item from HTML
        parentArticle.remove();

    } else if (action == 'MODIFY') {
        cart[ productIndex ].productQuantity = currentItemQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    getPriceQuantity();
}

function getPriceQuantity() {
    const totalQuantity = document.querySelector('#totalQuantity');
    const totalPrice = document.querySelector('#totalPrice');
    let modifiedCart = JSON.parse(localStorage.getItem('cart'));
    let totalCartArticles = 0;
    let totalCartPrice = 0;
    if (!modifiedCart) {
        cart__items.innerHTML = "<p style='color:red;font-size:1.4rem;font-weight:bold;text-align:center'>There are no items in your cart</p>";
        totalQuantity.textContent = totalCartArticles;
        totalPrice.textContent = totalCartPrice;
        return;
    }

    modifiedCart.forEach(cartElement => {
        totalCartArticles += cartElement.productQuantity;
        apiProductId = apiResponseData.findIndex(element => element._id == cartElement.productId)
        totalCartPrice += apiResponseData[ apiProductId ].price * cartElement.productQuantity;

    })
    totalQuantity.textContent = totalCartArticles;
    totalPrice.textContent = totalCartPrice;
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

    //text fields not address
    let textInputs = document.querySelectorAll('[type=text]:not(#address)');
    textInputs.forEach((element => {
        if (INPUTPATTERN.test(element.value)) {
            console.log(element.value);
        }
        else {
            element.nextElementSibling.textContent = "Text should start with letter"
            formValidated = 0;
        }
    }))
    if (EMAILPATTERN.test(email.value)) {
    } else {
        email.nextElementSibling.textContent = "Text should start with letter"
        formValidated = 0;
    }
    if (ADRESSPATTERN.test(address.value)) {
    } else {
        address.nextElementSibling.textContent = "Text should start with letter"
        formValidated = 0;
    }
    if (formValidated) {
        checkForm()
    } else {
        console.log("form not validated");
    }
}


function checkForm(event) {
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const address = document.querySelector('#address').value;
    const city = document.querySelector('#city').value;
    const email = document.querySelector('#email').value;
    const form = document.querySelector('.cart__order__form');
    const textError = document.querySelectorAll('[id*=ErrorMsg]')


    //create produt array using cart element id
    const cart = JSON.parse(localStorage.getItem('cart'));
    let products = [];
    if (!cart) {
        console.log('error');
    } else {
        cart.forEach(element => {
            products.push(element.productId);
        })
    }

    //create contact object from input fields (ex: contact = {firstName:firstName,lastName:lastName} )
    const contact = {
        firstName, lastName, address, city, email
    };

    //create object to POST to API
    const orderData = {
        contact, products
    }


    //delete form error messages and reset form fields
    textError.forEach(element => element.textContent = '')
    form.reset();

    // console.log(orderData);
    postToAPI(orderData);
}


async function postToAPI(orderData) {

    const reponse = await fetch('http://127.0.0.1:3000/api/products/order', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });
    const data = await reponse.json();
    console.log(data);

    confirmationPage(data);
}

function confirmationPage(data) {
    window.location.href = `./confirmation.html?orderId=${data.orderId}`
}
