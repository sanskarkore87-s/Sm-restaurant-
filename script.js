// Exact Menu Data
const menuData = {
    "SOUP": [
        { name: "Veg Manchurian Soup", price: "70/100" },
        { name: "Veg Noodle Soup", price: "70/100" },
        { name: "Veg Hot and Sour Soup", price: "70/100" },
        { name: "Clear Soup", price: "70/100" }
    ],
    "NONVEG SOUP": [
        { name: "Nonveg Manchurian Soup", price: "70/100" },
        { name: "Nonveg Noodle Soup", price: "70/100" },
        { name: "Nonveg Hot and Sour Soup", price: "70/100" },
        { name: "Clear Soup", price: "70/100" }
    ],
    "VEG STARTERS": [
        { name: "Veg Crispy", price: "150" },
        { name: "Veg Manchurian (Dry)", price: "130/140" },
        { name: "Paneer Chilli", price: "170/180" },
        { name: "Chinese Bhel", price: "100" }
    ],
    "NONVEG STARTERS": [
        { name: "Chicken Lolipop", price: "100/160" },
        { name: "Chicken Chilli", price: "190" },
        { name: "Chicken 65", price: "190" }
    ],
    "BIRYANI": [
        { name: "Chicken Hydrabadi Biryani", price: "80/130" },
        { name: "Chicken Tandoor Biryani", price: "120/160" },
        { name: "Veg Hyderabadi Biryani", price: "80/120" }
    ],
    "RICE & NOODLE": [
        { name: "Veg Fried Rice", price: "90/140" },
        { name: "Chicken Fried Rice", price: "100/160" },
        { name: "Veg Hakka Noodle", price: "90/140" },
        { name: "Chicken Hakka Noodle", price: "100/160" }
    ],
    "TANDOOR SPECIAL": [
        { name: "Chicken Tandoor Half", price: "180" },
        { name: "Chicken Tandoor Full", price: "350" },
        { name: "Chicken Tikka", price: "140" }
    ]
};

// 1. Loader & AOS
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            const isMobile = window.innerWidth < 768;
            AOS.init({ once: true, offset: 50, disable: isMobile });
        }, 800);
    }, 1200);
});

// 2. Render Menu & Build Category Slider
const menuContainer = document.getElementById('menu-container');
const categorySlider = document.getElementById('categorySlider');

Object.keys(menuData).forEach((category, index) => {
    const catId = "cat-" + category.replace(/\s+/g, '-');
    
    // Build Slider Button
    categorySlider.innerHTML += `<button class="cat-slider-btn" onclick="scrollToCategory('${catId}')">${category}</button>`;

    // Build Menu Category Div
    let categoryHTML = `
        <div class="menu-category" id="${catId}">
            <h3 class="cat-title">${category}</h3>
            <div class="menu-list">
    `;
    
    menuData[category].forEach(item => {
        categoryHTML += `<div class="menu-item"><h4>${item.name}</h4>`;
        
        // Split Half/Full logic
        if (item.price.includes('/')) {
            let prices = item.price.split('/');
            let nameHalf = `${item.name} (Half)`;
            let nameFull = `${item.name} (Full)`;
            
            categoryHTML += `
                <div class="variant-row">
                    <span>Half - ₹${prices[0]}</span>
                    <div class="qty-container" data-name="${nameHalf}" data-price="${prices[0]}">
                        <button class="add-btn init-add" data-name="${nameHalf}" data-price="${prices[0]}">ADD</button>
                    </div>
                </div>
                <div class="variant-row">
                    <span>Full - ₹${prices[1]}</span>
                    <div class="qty-container" data-name="${nameFull}" data-price="${prices[1]}">
                        <button class="add-btn init-add" data-name="${nameFull}" data-price="${prices[1]}">ADD</button>
                    </div>
                </div>
            `;
        } else {
            let cleanPrice = item.price.replace(' Rs', '');
            categoryHTML += `
                <div class="variant-row">
                    <span>₹${cleanPrice}</span>
                    <div class="qty-container" data-name="${item.name}" data-price="${cleanPrice}">
                        <button class="add-btn init-add" data-name="${item.name}" data-price="${cleanPrice}">ADD</button>
                    </div>
                </div>
            `;
        }
        categoryHTML += `</div>`;
    });

    categoryHTML += `</div></div>`;
    menuContainer.innerHTML += categoryHTML;
});

// Smooth Scroll for Category Buttons
window.scrollToCategory = function(id) {
    const el = document.getElementById(id);
    if(el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}

// 3. Mobile Nav & Cart Toggle
document.getElementById('mobileMenuBtn').addEventListener('click', () => document.getElementById('mobileNav').classList.add('active'));
document.getElementById('closeMenuBtn').addEventListener('click', () => document.getElementById('mobileNav').classList.remove('active'));
document.querySelectorAll('.mob-link').forEach(link => link.addEventListener('click', () => document.getElementById('mobileNav').classList.remove('active')));

let cart = {};
function toggleCart(show) {
    document.getElementById('cartDrawer').classList.toggle('active', show);
    document.getElementById('cartOverlay').classList.toggle('active', show);
    document.body.style.overflow = show ? 'hidden' : '';
}
document.getElementById('cartButton').addEventListener('click', () => toggleCart(true));
document.getElementById('closeCartBtn').addEventListener('click', () => toggleCart(false));
document.getElementById('cartOverlay').addEventListener('click', () => toggleCart(false));

const orderRadios = document.querySelectorAll('input[name="orderType"]');
const addressBox = document.getElementById('deliveryAddress');
orderRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if(e.target.value === 'Home Delivery') addressBox.classList.remove('hidden');
        else addressBox.classList.add('hidden');
    });
});

// 4. Update UI Function (Sync Cart Drawer & Menu Buttons)
let totalAmountGlobal = 0;
function updateCartUI() {
    let totalItems = 0;
    totalAmountGlobal = 0;
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    const keys = Object.keys(cart);
    if (keys.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        keys.forEach(name => {
            const item = cart[name];
            const subtotal = item.price * item.quantity;
            totalItems += item.quantity;
            totalAmountGlobal += subtotal;

            cartItems.innerHTML += `
                <div class="cart-item-row">
                    <div style="flex: 1;">
                        <strong style="color: #fff; font-size:14px;">${name}</strong><br>
                        <strong class="gold-text">₹${subtotal}</strong>
                    </div>
                    <div class="cart-qty-control">
                        <button class="cart-qty-btn cart-minus" data-name="${name}">−</button>
                        <span style="color: #fff; width: 16px; text-align: center;">${item.quantity}</span>
                        <button class="cart-qty-btn cart-plus" data-name="${name}">+</button>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('cartCount').textContent = totalItems;
    document.getElementById('cartTotal').textContent = `₹${totalAmountGlobal}`;
    
    // Call the magic function to sync buttons on the main menu
    syncMenuButtons();
}

// THE MAGIC FUNCTION: Converts "ADD" to "[-] 1 [+]" dynamically
function syncMenuButtons() {
    document.querySelectorAll('.qty-container').forEach(container => {
        const name = container.getAttribute('data-name');
        const price = container.getAttribute('data-price');
        
        if (cart[name]) {
            // Item is in cart, show [-] qty [+]
            container.innerHTML = `
                <div class="inline-qty-control">
                    <button class="menu-minus" data-name="${name}">−</button>
                    <span class="menu-qty">${cart[name].quantity}</span>
                    <button class="menu-plus" data-name="${name}">+</button>
                </div>
            `;
        } else {
            // Item not in cart, show normal ADD button
            container.innerHTML = `<button class="add-btn init-add" data-name="${name}" data-price="${price}">ADD</button>`;
        }
    });
}

// 5. Global Event Listener for ALL Add/Minus clicks
document.addEventListener('click', function(e) {
    // 1. Initial ADD button click
    if(e.target.classList.contains('init-add')) {
        const name = e.target.getAttribute('data-name');
        const price = parseInt(e.target.getAttribute('data-price'));
        if (!cart[name]) cart[name] = { price: price, quantity: 1 };
        updateCartUI();
    }
    
    // 2. Plus button (in Menu OR Cart)
    if(e.target.classList.contains('menu-plus') || e.target.classList.contains('cart-plus')) {
        const name = e.target.getAttribute('data-name');
        if(cart[name]) cart[name].quantity++;
        updateCartUI();
    }
    
    // 3. Minus button (in Menu OR Cart)
    if(e.target.classList.contains('menu-minus') || e.target.classList.contains('cart-minus')) {
        const name = e.target.getAttribute('data-name');
        if(cart[name]) {
            cart[name].quantity--;
            if(cart[name].quantity <= 0) delete cart[name];
        }
        updateCartUI();
    }
});

// 6. WhatsApp Checkout Logic
document.getElementById('whatsappCheckoutBtn').addEventListener('click', function () {
    const name = document.getElementById('customerName').value.trim();
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const address = document.getElementById('deliveryAddress').value.trim();
    
    if (name === '') { alert("Please enter your name!"); return; }
    if (Object.keys(cart).length === 0) { alert("Your cart is empty!"); return; }
    if (orderType === 'Home Delivery' && address === '') { alert("Please enter your Delivery Address for Home Delivery."); return; }

    const orderID = "ORD-" + Math.floor(1000 + Math.random() * 9000); 
    const phoneNumber = "919372549949"; 

    let message = `🍽️ *SM Restaurant Order*\n\n`;
    message += `🆔 *Order ID:* ${orderID}\n`;
    message += `👤 *Name:* ${name}\n`;
    message += `📦 *Type:* ${orderType}\n`;
    if(orderType === 'Home Delivery') message += `📍 *Address:* ${address}\n`;
    
    message += `\n*Order Details:*\n`;
    Object.keys(cart).forEach(itemName => {
        const item = cart[itemName];
        message += `• ${itemName} x${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    message += `\n💰 *Total Bill: ₹${totalAmountGlobal}*`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
});
