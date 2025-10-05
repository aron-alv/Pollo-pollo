document.addEventListener('DOMContentLoaded', () => {
    // 🔑 CLAVE: Verificación de IDs
    const cartItemsContainer = document.getElementById('cart-items-page');
    const cartFooter = document.getElementById('cart-footer-page');
    const cartTotalPriceEl = document.getElementById('cart-total-price-page');

    // Si alguno de los elementos críticos no existe, detenemos la ejecución.
    if (!cartItemsContainer || !cartFooter || !cartTotalPriceEl) {
        console.error("ERROR CRÍTICO: No se encontraron todos los IDs necesarios en el HTML (cart-items-page, cart-footer-page, cart-total-price-page). Revisa tu HTML.");
        return; 
    }

    // Carga el carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Función dummy para el badge (el badge se actualiza realmente en PaginaWeb.html)
    const updateCartBadge = () => {
        // console.log('Badge actualizado desde la página de carrito.');
    };

    // Función para guardar el estado actual del carrito
    const saveCart = () => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartBadge(); 
    };

    // Calcula y actualiza el precio total en la página
    const updateCartTotal = () => {
        // La verificación de cartTotalPriceEl ya se hizo al inicio
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPriceEl.textContent = `$${total.toFixed(2)}`;
    };

    // Función principal para dibujar/renderizar el carrito en la página
    const renderCart = () => {
        cartItemsContainer.innerHTML = ''; // Limpia la vista

        if (cart.length === 0) {
            cartItemsContainer.classList.remove('cart-items-list'); 
            // Ruta a PaginaWeb.html (asumiendo que está en el directorio padre o raíz)
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Tu carrito está vacío. <a href="../PaginaWeb.html">¡Ve a por algo delicioso!</a></p>';
            cartFooter.style.display = 'none'; // Oculta el pie si no hay productos
        } else {
            cartItemsContainer.classList.add('cart-items-list');
            cartFooter.style.display = 'block'; // Muestra el pie
            
            cart.forEach(item => {
                const itemTotalPrice = (item.price * item.quantity).toFixed(2);
                const description = item.description || 'Delicioso pollo, caliente y listo.'; 

                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item-page'); 
                
                // HTML inyectado que usa las clases CSS Grid
                cartItemEl.innerHTML = `
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${description}</p>
                    </div>

                    <div class="item-quantity-controls">
                        <button class="btn-decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn-increase" data-id="${item.id}">+</button>
                    </div>

                    <span class="item-price-page">$${itemTotalPrice}</span>
                    
                    <button class="remove-item-btn" data-id="${item.id}">🗑️</button>
                `;
                cartItemsContainer.appendChild(cartItemEl);
            });
            updateCartTotal();
        }
    };

    // Manejador de eventos para los botones (+, -, 🗑️)
    cartItemsContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        const productIndex = cart.findIndex(item => item.id === id);
        if (productIndex === -1) return;

        if (e.target.classList.contains('btn-increase')) {
            cart[productIndex].quantity++;
        } else if (e.target.classList.contains('btn-decrease')) {
            cart[productIndex].quantity--;
            if (cart[productIndex].quantity === 0) {
                cart.splice(productIndex, 1);
            }
        } else if (e.target.classList.contains('remove-item-btn')) { 
            cart.splice(productIndex, 1);
        }
        
        saveCart();  
        renderCart(); 
    });

    // Dibuja el carrito al cargar
    renderCart();
});