function getOrderId() {
    const url = window.location.search;
    const urlObj = new URLSearchParams(url);
    return urlObj.get('orderId');
}

function showOrderId() {
    const orderIdField = document.querySelector('#orderId');
    const orderId = getOrderId();
    orderIdField.textContent = orderId;
}
showOrderId();