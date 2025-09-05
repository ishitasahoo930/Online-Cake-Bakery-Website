
let sessionId = localStorage.getItem('sessionId') || generateSessionId();
localStorage.setItem('sessionId', sessionId);

function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}


async function updateCartCount() {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${sessionId}`);
        const cart = await response.json();
        const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}


async function loadFeaturedProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        
    
        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer) {
            featuredContainer.innerHTML = products.slice(0, 4).map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <p class="product-description">${product.description}</p>
                        <button class="add-to-cart" onclick="addToCart('${product._id}')">Add to Cart</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}


async function addToCart(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${sessionId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });
        
        if (response.ok) {
            alert('Product added to cart!');
            updateCartCount();
        } else {
            alert('Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
});