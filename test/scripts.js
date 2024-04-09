let products = [
    { id: 1, name: 'Product 1', price: 20 },
    { id: 2, name: 'Product 2', price: 30 },
    { id: 3, name: 'Product 3', price: 40 }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const productsSection = document.getElementById('products');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    // Display products
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button data-id="${product.id}" class="add-to-cart">Add to Cart</button>
        `;
        productsSection.appendChild(productElement);
    });

    // Add to cart
    productsSection.addEventListener('click', e => {
        if (e.target && e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);

            if (product) {
                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }

                updateCart();
            }
        }
    });

    // Update cart
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
            cartItems.appendChild(cartItem);

            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // Checkout
    checkoutButton.addEventListener('click', () => {
        const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');

        stripe.redirectToCheckout({
            lineItems: cart.map(item => ({
                price: item.price * 100,
                quantity: item.quantity
            })),
            mode: 'payment',
            successUrl: 'https://your-website.com/success',
            cancelUrl: 'https://your-website.com/cancel',
        });
    });
});
