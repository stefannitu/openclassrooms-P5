//get order id from url
function getOrderId() {
    const url = window.location.search;
    const urlObj = new URLSearchParams(url);
    return urlObj.get('orderId');
}

//display orderid in page and remove cart from localstorage
function showOrderId() {
    document.querySelector('#orderId').textContent = getOrderId();
    localStorage.removeItem('cart');
}

showOrderId();

