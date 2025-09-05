
async function loadOrders() {
    try {
        
        const customerName = "Sandip Maity";
        console.log("Fetching orders for:", customerName);

        const response = await fetch(`/get-orders?name=${encodeURIComponent(customerName)}`);

        if (!response.ok) {
            console.error("Failed to fetch orders:", response.status);
            return;
        }

        const orders = await response.json();
        const ordersContainer = document.getElementById('orders-container');

        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = '<p>You have no orders yet.</p>';
            return;
        }

        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>Order #${order._id}</h3>
                        <p class="order-date">${new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <span class="order-status status-${(order.status || "Pending").toLowerCase()}">
                        ${order.status || "Pending"}
                    </span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    Total: $${order.total.toFixed(2)}
                </div>
                <div class="customer-info">
                    <p><strong>Customer:</strong> ${order.customer.name}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    <p><strong>Address:</strong> ${order.customer.address}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading orders:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});
