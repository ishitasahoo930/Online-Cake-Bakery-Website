
let cart = JSON.parse(localStorage.getItem('cart')) || [];


function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}


function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('place-order-btn').style.display = 'none';
        cartTotalElement.textContent = "0.00";
    } else {
        let total = 0;

        cartItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1"
                            onchange="updateQuantity(${item.id}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <p class="cart-item-total">$${itemTotal.toFixed(2)}</p>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
        }).join('');

        cartTotalElement.textContent = total.toFixed(2);
        document.getElementById('place-order-btn').style.display = 'inline-block';
    }
}


function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity = newQuantity;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}


function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}


function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    document.getElementById('order-form').style.display = 'block';
}


function confirmOrder(event) {
    event.preventDefault();

    const customer = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    fetch("/order-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customer,
            items: cart,
            total
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Order saved:", data);
            alert("✅ Order placed successfully!");


            cart = [];
            localStorage.removeItem("cart");
            loadCart();
            updateCartCount();


            document.getElementById('order-form').style.display = 'none';
            document.getElementById('delivery-form').reset();
        })
        .catch(err => {
            console.error("Error placing order:", err);
            alert("❌ Failed to place order. Please try again.");
        });
}


document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    loadCart();

    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
    document.getElementById('delivery-form').addEventListener('submit', confirmOrder);
});
