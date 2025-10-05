document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTOS DEL CHECKOUT/RESUMEN ===
    const cartItemsSummaryEl = document.getElementById('cart-items-summary'); 
    const summaryProductsCostEl = document.getElementById('summary-products-cost'); 
    const summaryDeliveryCostEl = document.getElementById('summary-delivery-cost');
    const summaryTipCostEl = document.getElementById('summary-tip-cost');
    const tipLineEl = document.querySelector('.tip-line');
    const summaryTotalPriceEl = document.getElementById('summary-total-price'); 
    const btnHacerPedido = document.getElementById('btn-hacer-pedido');         
    const tipOptions = document.querySelectorAll('.tip-btn');

    // === ELEMENTOS DEL MODAL ===
    const btnOpenModal = document.getElementById('btn-open-cart-modal');
    const modalOverlay = document.getElementById('cart-modal-overlay');
    const modalContent = document.getElementById('cart-modal-content');
    const btnCloseModal = document.getElementById('cart-modal-close');
    const btnConfirmModal = document.getElementById('cart-modal-confirm');
    const modalSubtotalEl = document.getElementById('modal-subtotal');

    // === CONSTANTES & ESTADO ===
    const DELIVERY_COST = 15.00; 
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let currentTipAmount = 0.00;

    // ===============================================
    // 1. LÓGICA DE MANIPULACIÓN DEL CARRITO
    // ===============================================
    const calculateSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Función para actualizar la VISTA DENTRO DEL MODAL
    const updateModalItemDisplay = (item, itemElement) => {
        const newTotal = item.price * item.quantity;
        
        // 1. Actualiza el precio total por ítem
        itemElement.querySelector('.item-price-total').textContent = `$${newTotal.toFixed(2)}`;
        
        // 2. Actualiza la cantidad en el control
        itemElement.querySelector('.item-quantity-display').textContent = item.quantity;
        
        // 3. Actualiza el prefijo de la cantidad (e.g., de '1 Pollo' a '2 Pollo')
        itemElement.querySelector('.item-quantity-prefix').textContent = item.quantity;
        
        // 4. Actualiza el subtotal del modal
        modalSubtotalEl.textContent = `$${calculateSubtotal().toFixed(2)}`;
    };

    const saveCart = (productId = null) => {
        // Asegura que los ítems con cantidad 0 sean eliminados
        cart = cart.filter(item => item.quantity > 0);
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        
        // Actualiza el resumen principal
        renderCartSummary(); 
        
        // Si estamos en el modal, no re-renderizamos todo el modal, 
        // ya que la actualización visual se maneja dentro de updateQuantity/removeItem
        if(cart.length === 0 && modalOverlay.classList.contains('active')) {
            renderCartModal(); // Forzamos re-renderizado solo si el carrito queda vacío
        }
    };

    const updateQuantity = (productId, change) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            const itemElement = modalContent.querySelector(`.modal-cart-item[data-id="${productId}"]`);

            if (item.quantity < 1) {
                // Si la cantidad llega a 0, lo eliminamos y re-renderizamos todo el modal
                removeItem(productId);
            } else {
                // Actualiza la visualización INMEDIATAMENTE
                if (itemElement) {
                    updateModalItemDisplay(item, itemElement);
                }
                // Guarda y actualiza el resumen
                saveCart(productId); 
            }
        }
    };

    const removeItem = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        
        // CORRECCIÓN: Si el modal está abierto, eliminamos el elemento del DOM inmediatamente
        const itemElement = modalContent.querySelector(`.modal-cart-item[data-id="${productId}"]`);
        if (itemElement) {
            itemElement.remove();
        }

        // Guarda y actualiza el resumen/modal
        saveCart();
    };

    // ===============================================
    // 2. RENDERIZADO DEL MODAL (Detalle para Modificar)
    // ===============================================
    const renderCartModal = () => {
        modalContent.innerHTML = '';
        let subtotal = calculateSubtotal();

        if (cart.length === 0) {
            modalContent.innerHTML = '<p class="cart-empty-msg" style="text-align: center;">Tu carrito está vacío.</p>';
            modalSubtotalEl.textContent = `$0.00`;
            btnConfirmModal.disabled = true;
            return;
        }

        btnConfirmModal.disabled = false;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('modal-cart-item');
            itemDiv.setAttribute('data-id', item.id);
            // Se utiliza item-quantity-prefix para el '1' grande y item-quantity-display para el '1' pequeño en el control
            itemDiv.innerHTML = `
                <div class="item-info">
                    <span class="item-quantity-prefix">${item.quantity}</span>
                    <span class="item-name">${item.name}</span>
                    <span class="item-price-unit">$${item.price.toFixed(2)} c/u</span>
                </div>
                <div class="item-controls">
                    <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
                    <span class="item-quantity-display">${item.quantity}</span>
                    <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
                    <span class="item-price-total">$${itemTotal.toFixed(2)}</span>
                    <button class="btn-remove" data-id="${item.id}">❌</button>
                </div>
            `;
            modalContent.appendChild(itemDiv);
        });
        
        modalSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    };

    // ===============================================
    // 3. RENDERIZADO DEL RESUMEN (Vista de Checkout)
    // ===============================================
    const renderCartSummary = () => {
        cartItemsSummaryEl.innerHTML = ''; 
        const subtotal = calculateSubtotal();
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Calcular total
        const finalTotal = subtotal + DELIVERY_COST + currentTipAmount;
        const totalProductsText = `${totalItemsCount} producto${totalItemsCount !== 1 ? 's' : ''}`;
        
        // --- Lógica del Resumen (Columna Izquierda) ---
        
        // 1. Limpieza y Carga de Productos
        if (cart.length === 0) {
            cartItemsSummaryEl.innerHTML = '<p class="cart-empty-msg">No hay productos en tu carrito.</p>';
            
            // Revisa si existe el span de conteo en el resumen
            const storeSummaryEl = document.querySelector('.card-item-summary');
            const countSpan = storeSummaryEl.querySelector('#product-count-summary');
            if (countSpan) countSpan.textContent = ''; 
            
            // ... (Costos a Cero y Deshabilitar botón)
            summaryProductsCostEl.textContent = `$0.00`;
            summaryDeliveryCostEl.textContent = `$0.00`;
            summaryTipCostEl.textContent = `$0.00`;
            summaryTotalPriceEl.textContent = `$0.00`;
            tipLineEl.classList.add('hidden');
            btnHacerPedido.disabled = true;
            btnHacerPedido.style.backgroundColor = '#ccc'; 
        } else {
            // Renderizar la lista de productos en el resumen izquierdo
            cart.forEach(item => {
                const productLineEl = document.createElement('p');
                productLineEl.classList.add('summary-product-line');
                productLineEl.textContent = `${item.quantity}x ${item.name}`; 
                cartItemsSummaryEl.appendChild(productLineEl);
            });

            // 2. Actualizar el conteo de productos en la tarjeta de resumen (izquierda)
            const storeSummaryEl = document.querySelector('.card-item-summary');
            let countSpan = storeSummaryEl.querySelector('#product-count-summary');
            if (!countSpan) {
                countSpan = document.createElement('span');
                countSpan.id = 'product-count-summary';
                storeSummaryEl.prepend(countSpan); // Agregamos el conteo al inicio o donde sea apropiado
            }
            countSpan.textContent = totalProductsText;

            // 3. Lógica de Costos (Columna Derecha)
            summaryProductsCostEl.textContent = `$${subtotal.toFixed(2)}`;
            summaryDeliveryCostEl.textContent = `$${DELIVERY_COST.toFixed(2)}`;
            summaryTipCostEl.textContent = `$${currentTipAmount.toFixed(2)}`;
            summaryTotalPriceEl.textContent = `$${finalTotal.toFixed(2)}`;
            
            tipLineEl.classList.toggle('hidden', currentTipAmount === 0);

            btnHacerPedido.disabled = false;
            btnHacerPedido.style.backgroundColor = '#1abc9c';
        }
    };

    // ===============================================
    // 4. MANEJO DE EVENTOS
    // ===============================================

    // --- Abrir/Cerrar Modal ---
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        renderCartSummary(); // Asegura que el resumen finaliza actualizado
    };

    btnOpenModal.addEventListener('click', () => {
        renderCartModal(); 
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Asocia el botón de "Ver detalle"
    const verDetalleBtn = document.getElementById('ver-detalle-btn');
    if (verDetalleBtn) {
        verDetalleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            btnOpenModal.click();
        });
    }

    btnCloseModal.addEventListener('click', closeModal);
    btnConfirmModal.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // --- Controladores dentro del Modal (Delegación de eventos) ---
    modalContent.addEventListener('click', (e) => {
        const target = e.target;
        const productId = target.getAttribute('data-id');

        if (!productId) return;

        if (target.classList.contains('btn-plus')) {
            updateQuantity(productId, 1);
        } else if (target.classList.contains('btn-minus')) {
            updateQuantity(productId, -1);
        } else if (target.classList.contains('btn-remove')) {
            removeItem(productId);
        }
    });

    // --- Control de Propina y Pedido (Se mantiene igual) ---
    tipOptions.forEach(button => {
        button.addEventListener('click', (e) => {
            tipOptions.forEach(btn => btn.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            // ... (Lógica de propina) ...
            const tipValue = e.currentTarget.getAttribute('data-tip');
            const subtotal = calculateSubtotal();
            currentTipAmount = (tipValue === 'custom') ? 0.00 : Math.round(subtotal * parseFloat(tipValue) * 100) / 100; 
            renderCartSummary(); 
        });
    });

    btnHacerPedido.addEventListener('click', () => {
        if (!btnHacerPedido.disabled && cart.length > 0) {
            alert(`¡Procesando tu pedido! Total: $${summaryTotalPriceEl.textContent.replace('$', '').trim()}. Gracias por tu compra en Pollo Express.`);
        } else {
            alert("Tu carrito está vacío. ¡Añade productos!");
        }
    });
    
    // Carga inicial
    renderCartSummary();
});