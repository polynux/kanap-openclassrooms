// get order id from query args
function getOrderId() {
    let urlParams = new URLSearchParams(location.search);
    return urlParams.get("orderId");
}

document.querySelector("#orderId").innerText = getOrderId();
