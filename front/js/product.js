const colors = document.querySelector('#colors');
const quantity = document.querySelector('#quantity');
const addToCartButton = document.querySelector('#addToCart');
let currentId;


//get product id from URL
function getUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    return currentId = searchParams.get('id');
}


//get data from API
async function getProductData() {
    const productId = getUrl();
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${productId}`);
        if (response.status == 404) {
            throw new Error('Product not found')
        }
        const data = await response.json();
        createHTML(data);
    } catch (error) {
        document.querySelector('article').innerHTML = `<p style=color:red;font-size:1.6rem;font-weight:bold>${error}</p>`
    }

}

// insert in page data from api. 
const createHTML = (data) => {

    const item__img = document.querySelector('.item__img');
    const img = document.createElement('img');
    img.src = data.imageUrl;
    img.alt = data.alt;
    item__img.appendChild(img);

    const title = document.querySelector('#title');
    title.textContent = data.name;

    const price = document.querySelector('#price');
    price.textContent = data.price;

    const description = document.querySelector('#description');
    description.textContent = data.description;

    data.colors.forEach(elem => {
        const option = document.createElement('option');
        option.value = elem;
        option.textContent = elem;
        colors.insertAdjacentElement('beforeend', option)
    })
}


function createProductToStore() {
    if (!colors.value) {
        alert("Please select color")
    } else if (quantity.value == '0') {
        alert("Please select quantity")
    } else {
        const product = {
            productId: getUrl(),
            productColor: colors.value,
            productQuantity: parseInt(quantity.value)
        }
        addDataToStorage(product);
    }
}

function addDataToStorage(product) {
    let cart = localStorage.getItem('cart');

    //if products in cart
    if (localStorage.getItem('cart')) {

        let cart = JSON.parse(localStorage.getItem('cart'))


        //if productid and color same as current then
        //quantity change its value

        const cartIndex = cart.findIndex((element) => (element.productId == currentId && element.productColor == colors.value));

        if (cartIndex == -1) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            cart[ cartIndex ].productQuantity += parseInt(quantity.value);
            localStorage.setItem('cart', JSON.stringify(cart));
        }

    } else {
        let cart = [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));

    }
    alert("Product added to cart")
    colors.selectedIndex = 0;
    quantity.value = 0;

}

getProductData();
addToCartButton.addEventListener('click', createProductToStore);

