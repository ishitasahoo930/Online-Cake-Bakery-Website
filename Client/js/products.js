
const products = [
    {
        id: 1,
        name: "Chocolate Cake",
        price: 25.99,
        description: "Rich and moist chocolate cake with chocolate frosting",
        image: "https://cruff.in/cdn/shop/files/Allindiacake_anniversary.jpg?v=1746448233&width=1946"
    },
    {
        id: 2,
        name: "Vanilla Cake",
        price: 22.99,
        description: "Classic vanilla cake with buttercream frosting",
        image: "https://theoven.in/wp-content/uploads/2023/02/Choco-Vanilla.png"
    },
    {
        id: 3,
        name: "Red Velvet Cake",
        price: 28.99,
        description: "Velvety red cake with cream cheese frosting",
        image: "https://bkmedia.bakingo.com/sq-round-shaped-red-velvet-cake-cake1208redvl-CC.jpg"
    },
    {
        id: 4,
        name: "Carrot Cake",
        price: 24.99,
        description: "Moist carrot cake with cream cheese frosting and walnuts",
        image: "https://www.rainbownourishments.com/wp-content/uploads/2023/03/vegan-carrot-cake-1.jpg"
    },
    {
        id: 5,
        name: "Strawberry Shortcake",
        price: 26.99,
        description: "Light sponge cake with fresh strawberries and whipped cream",
        image: "https://teakandthyme.com/wp-content/uploads/2024/04/strawberry-chocolate-cake-DSC_9202-1x1-1200.jpg"
    },
    {
        id: 6,
        name: "Lemon Cake",
        price: 23.99,
        description: "Zesty lemon cake with lemon glaze",
        image: "https://patisserie-valerie.co.uk/cdn/shop/files/lemon-meringue-magic-cake-659961.jpg?v=1741611412"
    },
    {
        id: 7,
        name: "Cheesecake",
        price: 29.99,
        description: "Creamy New York-style cheesecake with graham cracker crust",
        image: "https://theloopywhisk.com/wp-content/uploads/2021/05/White-Chocolate-Cheesecake_730px-featured.jpg"
    },
    {
        id: 8,
        name: "Tiramisu",
        price: 27.99,
        description: "Italian coffee-flavored dessert with mascarpone cheese",
        image: "https://simshomekitchen.com/wp-content/uploads/2023/08/Tiramisu-birthday-cake-recipe.jpg"
    }
];


let cart = JSON.parse(localStorage.getItem('cart')) || [];


function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;


    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }


    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();

  
    alert(`${product.name} added to cart!`);
}


function displayProducts() {
    const productsContainer = document.getElementById('products-container');

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width:100%; height:200px; object-fit:cover;">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}


document.addEventListener('DOMContentLoaded', function () {
    displayProducts();
    updateCartCount();
});
