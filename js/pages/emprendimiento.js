import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { cart } from '../services/cart.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderFooter();

  // Sincronizar badge de carrito
  const updateCartBadge = (count) => {
    const badge = document.getElementById('nav-cart-badge');
    if (badge) {
      badge.textContent = count;
      if (count > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }
  };
  updateCartBadge(cart.getCount());
  cart.onChange((_, count) => updateCartBadge(count));

  // Menú opciones
  document.getElementById('btn-options-menu')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Enlace del emprendimiento copiado al portapapeles', 'info');
  });

  const container = document.getElementById('merchant-container');
  const urlParams = new URLSearchParams(window.location.search);
  const merchantId = urlParams.get('id') || 'emp-feriando-ando';

  const merchant = dataService.getMerchantById(merchantId);

  if (!merchant) {
    container.innerHTML = `
      <div class="p-12 text-center space-y-4 max-w-md mx-auto">
        <h2 class="text-2xl font-bold text-ink dark:text-white">Emprendimiento no encontrado</h2>
        <a href="./catalogo.html" class="btn-accent inline-block text-sm">Ver catálogo general</a>
      </div>
    `;
    return;
  }

  // ==============================================
  // LÓGICA DE COLOR DE MARCA BASADO EN EL LOGO
  // Adapta el fondo, la cabecera, los textos y los acentos
  // en perfecta armonía con el logo del feriante.
  // ==============================================
  const theme = merchant.theme || {
    bgBanner: '#FDF0DC', // Fondo del banner
    bgBody: '#BFE0E2',   // Fondo del cuerpo (Figma)
    headerBg: '#BFE0E2', // Fondo de la barra superior
    accent: '#3D6675',   // Acento principal
    textPrimary: '#1E2E38', // Color de títulos
    textMuted: '#2D4552'    // Color de descripción
  };

  // 1. Aplicar dinámicamente el color de marca al fondo general de la página
  document.body.style.backgroundColor = theme.bgBody;

  // 2. Aplicar color dinámico a la barra superior
  const header = document.getElementById('emprendimiento-header');
  if (header) {
    header.style.backgroundColor = theme.headerBg || theme.bgBody;
  }

  // Resolver rutas de imágenes locales o remotas
  const coverSrc = merchant.coverImage.startsWith('http') 
    ? merchant.coverImage 
    : `../${merchant.coverImage.replace(/^\.\//, '')}`;

  // Obtener productos asociados a este emprendimiento
  let merchantProducts = dataService.getProducts().filter(p => p.merchantId === merchant.id);

  // Si no tiene productos cargados, fallback a productos de joyería artesanal
  if (merchantProducts.length === 0) {
    merchantProducts = dataService.getProducts().slice(0, 4);
  }

  // Generar HTML de las tarjetas de producto en grilla 2x2 (Figma)
  const productsHtml = merchantProducts.map(p => {
    const pImg = p.image.startsWith('http') ? p.image : `../${p.image.replace(/^\.\//, '')}`;
    return `
      <div class="product-card rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
        
        <!-- Imagen Cuadrada Superior -->
        <div class="aspect-square w-full overflow-hidden bg-sand/10">
          <img 
            src="${pImg}" 
            alt="${p.name}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          >
        </div>

        <!-- Barra Inferior de Información y Carrito -->
        <div class="p-3 bg-white dark:bg-slate-800 flex items-center justify-between">
          <div class="pr-1 overflow-hidden">
            <h3 class="font-bold text-xs sm:text-sm text-ink dark:text-white truncate block">
              ${p.name}
            </h3>
            <span class="font-black text-xs sm:text-sm text-ink dark:text-white block mt-0.5">
              $${p.price}
            </span>
          </div>

          <!-- Botón Carrito con Icono SVG (0 emojis) -->
          <button 
            type="button"
            class="add-to-cart-btn flex-shrink-0 p-2 rounded-xl text-ink dark:text-white hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            data-product-id="${p.id}"
            aria-label="Agregar ${p.name} al carrito"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>

      </div>
    `;
  }).join('');

  // Limpiar número de teléfono para enlace de WhatsApp
  const cleanPhone = (merchant.phone || '+54 9 358 412-3456').replace(/[^0-9]/g, '');
  const cleanInstagram = (merchant.instagram || '@feriandoando').replace('@', '');

  container.innerHTML = `
    <!-- ============================================== -->
    <!-- 1. BANNER ILUSTRADO SUPERIOR                   -->
    <!-- Color de fondo en conjunto con la ilustración  -->
    <!-- ============================================== -->
    <div class="w-full flex items-center justify-center overflow-hidden transition-colors" style="background-color: ${theme.bgBanner};">
      <div class="w-full max-w-md sm:max-w-xl h-60 sm:h-72 md:h-80 flex items-center justify-center p-2">
        <img 
          src="${coverSrc}" 
          alt="${merchant.name}" 
          class="w-full h-full object-contain select-none"
        >
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 2. CUERPO DEL PERFIL EN CONJUNTO CON EL LOGO   -->
    <!-- Fondo y textos adaptados a la paleta de marca  -->
    <!-- ============================================== -->
    <div class="w-full pt-5 pb-16 transition-colors" style="background-color: ${theme.bgBody};">
      
      <!-- Bloque de Identidad -->
      <div class="max-w-md mx-auto text-center px-4 space-y-2">
        <h1 class="text-2xl sm:text-3xl font-black font-heading tracking-tight leading-tight" style="color: ${theme.textPrimary};">
          ${merchant.name}
        </h1>
        <p class="text-xs sm:text-sm font-medium leading-relaxed max-w-xs mx-auto" style="color: ${theme.textMuted};">
          ${merchant.bio}
        </p>

        <!-- Iconos Sociales SVG (WhatsApp y Instagram) - 0 Emojis -->
        <div class="flex items-center justify-center gap-3.5 pt-3 pb-6">
          
          <!-- Botón SVG WhatsApp -->
          <a 
            href="https://wa.me/${cleanPhone}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs"
            aria-label="Contactar por WhatsApp"
          >
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.769-5.769-5.769zm3.39 8.163c-.143.404-.73.74-1.02.778-.29.038-.636.088-2.074-.509-1.724-.716-2.827-2.483-2.913-2.599-.086-.116-.7-1.018-.7-1.942 0-.924.475-1.381.65-1.571.175-.19.382-.238.51-.238.128 0 .257 0 .37.006.12.006.277-.046.434.331.157.377.538 1.312.585 1.408.047.095.078.209.016.333-.063.124-.094.201-.188.312-.094.111-.198.248-.282.333-.095.095-.194.199-.083.39.111.19.493.813 1.057 1.315.727.647 1.341.848 1.531.943.19.095.302.08.414-.047.112-.128.477-.557.604-.748.127-.19.255-.158.428-.095.174.064 1.103.52 1.293.616.19.095.318.143.365.222.047.08.047.461-.096.865z"/>
            </svg>
          </a>

          <!-- Botón SVG Instagram -->
          <a 
            href="https://instagram.com/${cleanInstagram}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs"
            aria-label="Ver perfil de Instagram"
          >
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

        </div>
      </div>

      <!-- ============================================== -->
      <!-- 3. GRILLA DE PRODUCTOS 2X2                     -->
      <!-- ============================================== -->
      <div class="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          ${productsHtml}
        </div>
      </div>

    </div>
  `;

  // Asignar listeners a los botones de agregar al carrito (SVG)
  const cartButtons = container.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-product-id');
      const prod = merchantProducts.find(p => p.id === pId);
      if (prod) {
        cart.addItem(prod, 1);
        showToast(`"${prod.name}" agregado al carrito`, 'success');
      }
    });
  });
});
