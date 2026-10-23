/**
 * FRUTOS SECOS LAM - LÓGICA INTERACTIVA DEL CATÁLOGO Y COTIZADOR WHATSAPP
 * Permite alternar entre precios minoristas y mayoristas, filtrar, buscar,
 * agregar al pedido y generar el mensaje automático para WhatsApp.
 */

// =====================================================================
// CONFIGURACIÓN PRINCIPAL (Fácil de actualizar cuando el cliente pase los datos)
// =====================================================================
const APP_CONFIG = {
  // Teléfono de WhatsApp (2634761151 -> formato intl: 5492634761151)
  whatsappNumber: '5492634761151', 
  businessName: 'Frutos Secos LAM',
  pickupAddress: '9 de Julio 1189, Mendoza Ciudad',
  instagramUser: '@frutossecoslam',
  instagramUrl: 'https://www.instagram.com/frutossecoslam/'
};

// =====================================================================
// BASE DE DATOS DE PRODUCTOS CON PRECIOS MINORISTAS Y MAYORISTAS
// =====================================================================
const PRODUCTS_DATA = [
  {
    id: 'nuez-mariposa-extra-light',
    name: 'Nuez Mariposa Extra Light',
    category: 'Nueces',
    badge: 'Más Vendido',
    description: 'Nuez mariposa blanca seleccionada de primera calidad. Mitades enteras, sabor suave y crocante.',
    image: 'assets/nueces.jpg',
    // Precios Minoristas (x Kilo)
    retailPrice: 13500,
    retailUnit: 'kg',
    // Precios Mayoristas (Caja cerrada)
    wholesalePricePerUnit: 11800,
    wholesalePackageSize: 10, // 10 kg por caja
    wholesalePackageUnit: 'Caja x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'almendra-non-pareil',
    name: 'Almendra Non Pareil 23/25',
    category: 'Almendras',
    badge: 'Calidad Premium',
    description: 'Almendra natural de calibre parejo, piel fina, sin amargor. Ideal para consumo directo y repostería.',
    image: 'assets/almendras.jpg',
    retailPrice: 25500,
    retailUnit: 'kg',
    wholesalePricePerUnit: 22900,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Caja x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'castanas-caju-w1',
    name: 'Castañas de Cajú Tostadas W1',
    category: 'Castañas & Pistachos',
    badge: 'Importación',
    description: 'Castañas de cajú enteras grado W1, tostadas al punto justo sin sal. Textura mantecosa incomparable.',
    image: 'assets/castanas-caju.jpg',
    retailPrice: 16800,
    retailUnit: 'kg',
    wholesalePricePerUnit: 14500,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Caja x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'pistacho-tostado-salado',
    name: 'Pistacho Tostado y Salado con Cáscara',
    category: 'Castañas & Pistachos',
    badge: 'Favorito',
    description: 'Pistachos abiertos de excelente calibre, tostados artesanalmente con sal fina. Gran rotación.',
    image: 'assets/pistachos.jpg',
    retailPrice: 28000,
    retailUnit: 'kg',
    wholesalePricePerUnit: 24800,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Caja x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'mix-premium-sin-mani',
    name: 'Mix Premium sin Maní (4 Frutos)',
    category: 'Mixes',
    badge: '100% Frutos',
    description: 'Combinación gourmet: Nueces mariposa, almendras non pareil, castañas de cajú y avellanas. Cero relleno.',
    image: 'assets/mix-frutos.jpg',
    retailPrice: 18500,
    retailUnit: 'kg',
    wholesalePricePerUnit: 16200,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Caja x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'mix-energia-clasico',
    name: 'Mix Energía Clásico (Con Maní y Pasas)',
    category: 'Mixes',
    badge: 'Alta Rotación',
    description: 'Maní tostado sin sal, pasas morochas flame mendocinas, almendras y nueces. Excelente relación precio-calidad.',
    image: 'assets/mix-frutos.jpg',
    retailPrice: 9800,
    retailUnit: 'kg',
    wholesalePricePerUnit: 7900,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Bolsón x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'pasas-uva-morena-flame',
    name: 'Pasas de Uva Morena Flame (Mendoza)',
    category: 'Frutas Desecadas',
    badge: 'Origen Mendoza',
    description: 'Pasas de uva flame de producción mendocina, carnosas, dulces y seleccionadas sin semillas.',
    image: 'assets/pasas-uva.jpg',
    retailPrice: 3900,
    retailUnit: 'kg',
    wholesalePricePerUnit: 3100,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Caja x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'avellana-pelada-entera',
    name: 'Avellana Pelada Entera',
    category: 'Castañas & Pistachos',
    badge: 'Selección',
    description: 'Avellana europea descascarada, crocante y aromática. Indispensable para pastelería y bombonería.',
    image: 'assets/avellanas.jpg',
    retailPrice: 29000,
    retailUnit: 'kg',
    wholesalePricePerUnit: 25900,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Caja x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'mani-tostado-sin-sal',
    name: 'Maní Tostado sin Sal Repelado',
    category: 'Maní & Semillas',
    badge: 'Económico',
    description: 'Maní cordobés seleccionado, tostado uniforme sin agregado de sal ni aceites. Calibre parejo.',
    image: 'assets/mani.jpg',
    retailPrice: 3600,
    retailUnit: 'kg',
    wholesalePricePerUnit: 2950,
    wholesalePackageSize: 25,
    wholesalePackageUnit: 'Bolsa x 25 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  },
  {
    id: 'mix-semillas-vital',
    name: 'Mix de Semillas Vital (4 Variedades)',
    category: 'Maní & Semillas',
    badge: 'Saludable',
    description: 'Mix balanceado de sésamo integral, lino dorado, chía y girasol pelado. Fuente de omega 3 y fibra.',
    image: 'assets/semillas.jpg',
    retailPrice: 5200,
    retailUnit: 'kg',
    wholesalePricePerUnit: 4100,
    wholesalePackageSize: 10,
    wholesalePackageUnit: 'Bolsa x 10 kg',
    get wholesaleTotalPrice() { return this.wholesalePricePerUnit * this.wholesalePackageSize; }
  }
];

// =====================================================================
// ESTADO DE LA APLICACIÓN
// =====================================================================
const state = {
  pricingMode: 'minorista', // 'minorista' | 'mayorista'
  activeCategory: 'all',
  searchQuery: '',
  cart: [] // { id, name, mode, unitPrice, packageDesc, qty, image }
};

// =====================================================================
// UTILIDADES
// =====================================================================
function formatARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// =====================================================================
// RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
// =====================================================================
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  if (!grid) return;

  // Filtrado por categoría y búsqueda
  const filtered = PRODUCTS_DATA.filter(product => {
    const matchCategory = state.activeCategory === 'all' || product.category === state.activeCategory;
    const q = state.searchQuery.trim().toLowerCase();
    const matchSearch = !q || 
      product.name.toLowerCase().includes(q) || 
      product.category.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q);
    
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  const isWholesale = state.pricingMode === 'mayorista';

  grid.innerHTML = filtered.map(product => {
    let mainPriceText = '';
    let mainPriceUnit = '';
    let subPriceInfo = '';

    if (isWholesale) {
      mainPriceText = formatARS(product.wholesaleTotalPrice);
      mainPriceUnit = `x ${product.wholesalePackageUnit}`;
      subPriceInfo = `Equivale a <strong>${formatARS(product.wholesalePricePerUnit)}</strong> / kg en bulto cerrado`;
    } else {
      mainPriceText = formatARS(product.retailPrice);
      mainPriceUnit = `/ kg`;
      subPriceInfo = `Opcional mayorista: <strong>${formatARS(product.wholesaleTotalPrice)}</strong> (${product.wholesalePackageUnit})`;
    }

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-img-box">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-badge-corner">${product.badge}</span>
        </div>

        <div class="product-body">
          <span class="product-category-tag">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>

          <div class="product-pricing-box">
            <div class="primary-price-line">
              <span class="primary-price">${mainPriceText}</span>
              <span class="price-unit">${mainPriceUnit}</span>
            </div>
            <div class="secondary-price-line">
              ${subPriceInfo}
            </div>
          </div>

          <div class="product-actions-row">
            <div class="qty-control" aria-label="Cantidad">
              <button type="button" class="qty-btn btn-minus" data-id="${product.id}">-</button>
              <input type="text" class="qty-input" id="qty-${product.id}" value="1" readonly>
              <button type="button" class="qty-btn btn-plus" data-id="${product.id}">+</button>
            </div>

            <button type="button" class="btn-add-cart" data-id="${product.id}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// =====================================================================
// GESTIÓN DEL CARRITO / COTIZADOR
// =====================================================================
function addToCart(productId, quantity) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const mode = state.pricingMode;
  const isWholesale = mode === 'mayorista';
  
  const unitPrice = isWholesale ? product.wholesaleTotalPrice : product.retailPrice;
  const packageDesc = isWholesale ? product.wholesalePackageUnit : '1 kg';

  const cartItemId = `${productId}-${mode}`;
  const existing = state.cart.find(item => item.cartItemId === cartItemId);

  if (existing) {
    existing.qty += quantity;
  } else {
    state.cart.push({
      cartItemId,
      productId: product.id,
      name: product.name,
      mode,
      unitPrice,
      packageDesc,
      qty: quantity,
      image: product.image
    });
  }

  updateCartUI();
  showToast(`¡${product.name} agregado a tu pedido!`);
}

function updateCartItemQty(cartItemId, delta) {
  const item = state.cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(i => i.cartItemId !== cartItemId);
  }

  updateCartUI();
}

function removeCartItem(cartItemId) {
  state.cart = state.cart.filter(i => i.cartItemId !== cartItemId);
  updateCartUI();
}

function clearCart() {
  state.cart = [];
  updateCartUI();
  showToast('El pedido ha sido vaciado.');
}

function updateCartUI() {
  const badge = document.getElementById('cartCount');
  const itemsContainer = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmptyState');
  const footer = document.getElementById('cartDrawerFooter');
  const totalPriceElem = document.getElementById('cartTotalPrice');

  const totalItemsCount = state.cart.reduce((acc, item) => acc + item.qty, 0);
  if (badge) badge.textContent = totalItemsCount;

  if (state.cart.length === 0) {
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (footer) footer.style.display = 'flex';

  let totalEstimated = 0;

  if (itemsContainer) {
    itemsContainer.innerHTML = state.cart.map(item => {
      const itemSubtotal = item.unitPrice * item.qty;
      totalEstimated += itemSubtotal;

      return `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price-desc">
              ${item.packageDesc} · <strong>${formatARS(item.unitPrice)}</strong>
            </div>
            <div style="font-size:0.8rem; color:var(--color-accent); font-weight:700; margin-top:2px;">
              Subtotal: ${formatARS(itemSubtotal)}
            </div>
          </div>

          <div class="cart-item-actions">
            <div class="qty-control">
              <button type="button" class="qty-btn" onclick="updateCartItemQty('${item.cartItemId}', -1)">-</button>
              <span class="cart-item-qty">${item.qty}</span>
              <button type="button" class="qty-btn" onclick="updateCartItemQty('${item.cartItemId}', 1)">+</button>
            </div>
            <button type="button" class="btn-remove-item" onclick="removeCartItem('${item.cartItemId}')" aria-label="Eliminar">&times;</button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (totalPriceElem) {
    totalPriceElem.textContent = formatARS(totalEstimated);
  }
}

// =====================================================================
// GENERADOR DE MENSAJE Y ENVÍO A WHATSAPP
// =====================================================================
function sendOrderToWhatsApp() {
  if (state.cart.length === 0) {
    alert('Tu pedido está vacío. Agregá productos antes de enviar.');
    return;
  }

  const customerName = document.getElementById('cartCustomerName')?.value.trim() || 'Cliente Web';
  const deliverySelect = document.getElementById('cartDeliverySelect')?.value || 'Retiro en Mendoza (9 de Julio 1189)';

  let totalSum = 0;
  const itemsText = state.cart.map(item => {
    const sub = item.unitPrice * item.qty;
    totalSum += sub;
    const modeBadge = item.mode === 'mayorista' ? '[MAYORISTA]' : '[MINORISTA]';
    return `• ${item.qty}x ${item.name} (${item.packageDesc}) ${modeBadge} -> ${formatARS(sub)}`;
  }).join('\n');

  const message = 
`👋 *HOLA FRUTOS SECOS LAM!*
Quiero realizar la siguiente consulta/pedido desde la web:

👤 *Nombre / Negocio:* ${customerName}
📍 *Forma de Entrega:* ${deliverySelect}

📝 *DETALLE DEL PEDIDO:*
${itemsText}

💰 *TOTAL ESTIMADO:* ${formatARS(totalSum)}

¿Tienen disponibilidad de stock para coordinar la entrega o el despacho? ¡Muchas gracias!`;

  const waUrl = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// =====================================================================
// FORMULARIO DE CONTACTO RÁPIDO A WHATSAPP
// =====================================================================
function handleContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('contactName')?.value.trim() || '';
  const city = document.getElementById('contactCity')?.value.trim() || '';
  const type = document.getElementById('contactType')?.value || '';
  const text = document.getElementById('contactMessage')?.value.trim() || '';

  const msg = 
`👋 *HOLA FRUTOS SECOS LAM!*
Te contacto desde el sitio web con la siguiente consulta:

👤 *Nombre / Comercio:* ${name}
📍 *Ubicación:* ${city}
🎯 *Interés:* ${type}

💬 *Mensaje:*
${text}`;

  const waUrl = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

// =====================================================================
// MANEJO DEL DRAWER / MODAL DEL CARRITO
// =====================================================================
function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// =====================================================================
// INICIALIZACIÓN DE EVENTOS DEL DOM
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {

  // 1. Render inicial
  renderProducts();
  updateCartUI();

  // 2. Switch de Modalidad de Precios (Minorista vs Mayorista)
  const btnMinorista = document.getElementById('btnModeMinorista');
  const btnMayorista = document.getElementById('btnModeMayorista');
  const modeBanner = document.getElementById('modeInfoBanner');
  const modeInfoText = document.getElementById('modeInfoText');

  function setPricingMode(mode) {
    state.pricingMode = mode;
    if (mode === 'mayorista') {
      btnMayorista?.classList.add('active');
      btnMinorista?.classList.remove('active');
      modeBanner?.classList.add('wholesale-active');
      if (modeInfoText) {
        modeInfoText.innerHTML = 'Mostrando <strong>Precios Mayoristas</strong> por bulto/caja cerrada con descuento especial. ¡Aprovechá para abastecer tu negocio!';
      }
    } else {
      btnMinorista?.classList.add('active');
      btnMayorista?.classList.remove('active');
      modeBanner?.classList.remove('wholesale-active');
      if (modeInfoText) {
        modeInfoText.innerHTML = 'Mostrando <strong>Precios Minoristas</strong> por kilo fraccionado. Cambiá a <strong>Mayorista</strong> para comprar por caja cerrada.';
      }
    }
    renderProducts();
  }

  btnMinorista?.addEventListener('click', () => setPricingMode('minorista'));
  btnMayorista?.addEventListener('click', () => setPricingMode('mayorista'));

  // Switch dentro del Carrito
  const cartTypeMin = document.getElementById('cartTypeMinorista');
  const cartTypeMay = document.getElementById('cartTypeMayorista');

  cartTypeMin?.addEventListener('click', () => {
    cartTypeMin.classList.add('active');
    cartTypeMay?.classList.remove('active');
    setPricingMode('minorista');
  });

  cartTypeMay?.addEventListener('click', () => {
    cartTypeMay.classList.add('active');
    cartTypeMin?.classList.remove('active');
    setPricingMode('mayorista');
  });

  // 3. Filtros por Categoría
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.dataset.filter;
      renderProducts();
    });
  });

  // Category Cards superiores
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      state.activeCategory = cat;
      filterTabs.forEach(t => {
        if (t.dataset.filter === cat) t.classList.add('active');
        else t.classList.remove('active');
      });
      renderProducts();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 4. Buscador
  const searchInput = document.getElementById('productSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');

  searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (clearBtn) clearBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderProducts();
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    state.searchQuery = '';
    clearBtn.style.display = 'none';
    renderProducts();
  });

  document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
    state.searchQuery = '';
    state.activeCategory = 'all';
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    filterTabs.forEach(t => {
      if (t.dataset.filter === 'all') t.classList.add('active');
      else t.classList.remove('active');
    });
    renderProducts();
  });

  // 5. Delegación de eventos para la grilla de productos (+ / - / Agregar)
  const productsGrid = document.getElementById('productsGrid');
  productsGrid?.addEventListener('click', (e) => {
    const btnPlus = e.target.closest('.btn-plus');
    const btnMinus = e.target.closest('.btn-minus');
    const btnAdd = e.target.closest('.btn-add-cart');

    if (btnPlus) {
      const id = btnPlus.dataset.id;
      const input = document.getElementById(`qty-${id}`);
      if (input) input.value = parseInt(input.value || 1, 10) + 1;
    }

    if (btnMinus) {
      const id = btnMinus.dataset.id;
      const input = document.getElementById(`qty-${id}`);
      if (input && parseInt(input.value, 10) > 1) {
        input.value = parseInt(input.value, 10) - 1;
      }
    }

    if (btnAdd) {
      const id = btnAdd.dataset.id;
      const input = document.getElementById(`qty-${id}`);
      const qty = parseInt(input?.value || 1, 10);
      addToCart(id, qty);
      if (input) input.value = 1; // Reset counter
    }
  });

  // 6. Apertura y cierre del carrito
  document.getElementById('openCartBtn')?.addEventListener('click', openCart);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartBackdrop')?.addEventListener('click', closeCart);
  document.getElementById('btnClearCart')?.addEventListener('click', clearCart);
  document.getElementById('btnSendWhatsAppOrder')?.addEventListener('click', sendOrderToWhatsApp);

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  // 7. Formulario de Contacto
  document.getElementById('contactForm')?.addEventListener('submit', handleContactForm);

  // 8. Menú Mobile Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobilePanel = document.getElementById('mobileNavPanel');
  mobileBtn?.addEventListener('click', () => {
    const isOpen = mobilePanel?.classList.toggle('open');
    mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Cerrar menú mobile al hacer clic en un link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobilePanel?.classList.remove('open');
      mobileBtn?.setAttribute('aria-expanded', 'false');
    });
  });

});
