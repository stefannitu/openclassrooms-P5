//get order id from url
function getOrderId() {
    const url = window.location.search;
    const urlObj = new URLSearchParams(url);
    return urlObj.get('orderId');
}

//display orderid in page and remove cart from localstorage
function showOrderId() {
    let orderId = '';
    const orderIdField = document.querySelector('#orderId');
    orderId = getOrderId();
    orderIdField.textContent = orderId;
    if (orderId) {
        // localStorage.removeItem('cart');
    }
}
showOrderId();

