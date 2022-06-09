//waiting for DOM
document.addEventListener('DOMContentLoaded', getItemsFromCart);
//on click or change run function
[ 'click', 'change' ].forEach(e => document.addEventListener(e, findClass));

const order = document.querySelector('.cart__order__form');
order.addEventListener('submit', checkForm);
const cart__items = document.querySelector('#cart__items');

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


/* const test = {
    contact: {
        firstName: 'test',
        lastName: 'test',
        address: 'test',
        city: 'test',
        email: 'test'
    },
    products: [ 'a6ec5b49bd164d7fbe10f37b6363f9fb', '034707184e8e4eefb46400b5a3774b5f' ]
} */

async function bla(test) {
    const reponse = await fetch('http://127.0.0.1:3000/api/products/order', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(test)
    });
    const data = await reponse.json();
    console.log(data);
}

// bla(test);

function checkForm(event) {
    event.preventDefault();
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName');
    const address = document.querySelector('#address');
    const city = document.querySelector('#city');
    const email = document.querySelector('#email');
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart) {
        console.log('error');
    } else {
        const test = {};
        test.contact[ 'firstName2' ] = firstName;
        console.log(test);
    }

}