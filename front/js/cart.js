document.addEventListener('DOMContentLoaded', getItemsFromCart);
document.addEventListener('click', changeQuantity);
document.addEventListener('change', changeQuantity);
const cart__items = document.querySelector('#cart__items');
let totalCartPrice = 0;
let totalCartArticles = 0;
const api = 'http://127.0.0.1:3000/api/products/';
let cart;

function getItemsFromCart() {
    if (!localStorage.getItem('cart')) {
        cart__items.innerHTML = "<p style='color:red;font-size:1.4rem;font-weight:bold;text-align:center'>There are no items in your cart</p>";
    } else {
        getDataFromApi()
    }
}

async function getDataFromApi() {
    const response = await fetch(api);
    const data = await response.json();
    createHTML(data);
}

function createHTML(apiData) {
    cart = JSON.parse(localStorage.getItem('cart'));
    let articleHTML = '';

    cart.forEach(cartElement => {
        const apiProductIndex = apiData.findIndex(data => data._id == cartElement.productId);
        totalCartArticles += cartElement.productQuantity;
        totalCartPrice += cartElement.productQuantity * apiData[ apiProductIndex ].price;
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
    console.log(`totalCartPrice = ${totalCartPrice} , 
     totalCartArticles = ${totalCartArticles}`);
}

function changeQuantity(event) {
    if (event.target.classList.contains('deleteItem')) {
        const currentArticle = event.target.closest('article');
        newFunc(currentArticle, 'DELETE');
    } else if (event.target.classList.contains('itemQuantity')) {
        const currentArticle = event.target.closest('article');
        const currentItemQuantity = parseInt(event.target.value);
        if (currentItemQuantity <= 0) {
            newFunc(currentArticle, 'DELETE');
        } else {
            newFunc(currentArticle, 'MODIFY', currentItemQuantity);
        }

    }
}


function newFunc(parentArticle, action, currentItemQuantity) {
    const currentProductId = parentArticle.dataset[ 'id' ]
    const currentProductColor = parentArticle.dataset[ 'color' ];
    cart = JSON.parse(localStorage.getItem('cart'));
    let productIndex = cart.findIndex(element => element.productId == currentProductId && element.productColor == currentProductColor);


    if (action == 'DELETE') {
        cart.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        parentArticle.remove();
    } else if (action == 'MODIFY') {
        cart[ productIndex ].productQuantity = currentItemQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}