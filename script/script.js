document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        });

    // Load cart from local storage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length > 0) {
        cart = savedCart;
        updateCart();
    }

    // Add event listeners for tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });
});

let cart = [];

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

function addToCart(productId) {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const existingProductIndex = cart.findIndex(p => p.id === productId);
                if (existingProductIndex !== -1) {
                    cart[existingProductIndex].quantity += 1;
                } else {
                    product.quantity = 1;
                    cart.push(product);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        });
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const subtotalPriceElem = document.getElementById('subtotal-price');
    const taxPriceElem = document.getElementById('tax-price');
    const totalPriceElem = document.getElementById('total-price');
    cartItems.innerHTML = '';
    let subtotalPrice = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</span>
            <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        subtotalPrice += item.price * item.quantity;
    });

    const taxPrice = subtotalPrice * 0.13;
    const totalPrice = subtotalPrice + taxPrice;

    subtotalPriceElem.textContent = subtotalPrice.toFixed(2);
    taxPriceElem.textContent = taxPrice.toFixed(2);
    totalPriceElem.textContent = totalPrice.toFixed(2);
}

function removeFromCart(productId) {
    const existingProductIndex = cart.findIndex(p => p.id === productId);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity -= 1;
        if (cart[existingProductIndex].quantity <= 0) {
            cart.splice(existingProductIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

function switchTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
}
