        // Global variables
        let selectedColor = '';
        let selectedSize = '';
        let quantity = 1;
        let cart = [];
        const WHATSAPP_NUMBER = '+201157299077'; // Updated WhatsApp number
        
        // Base product settings (will be updated from localStorage if available)
        const baseProductSettings = {
            enableColorSelection: true,
            enabledColors: ["Red", "White", "Black", "Gray", "Green", "Blue"],
            sizes: ["S", "M", "L", "XL", "XXL"]
        };

        // Product Variants Data - Including stock for each color
        const productVariants = [
            { name: "Red", imageSrc: "assets/red.png", colorCode: "#dc3545", stock: 10, price: 19.99 },
            { name: "White", imageSrc: "assets/white.png", colorCode: "#ffffff", stock: 5, price: 19.99, border: "2px solid #ddd" },
            { name: "Black", imageSrc: "assets/black.jpeg", colorCode: "#000000", stock: 15, price: 19.99 },
            { name: "Gray", imageSrc: "assets/gray.png", colorCode: "#6c757d", stock: 20, price: 19.99 },
            { name: "Green", imageSrc: "assets/green.png", colorCode: "#198754", stock: 2, price: 19.99 },
            { name: "Blue", imageSrc: "assets/blue.png", colorCode: "#0d6efd", stock: 15, price: 19.99 }
        ];

        // --- Toast Notification System ---
        function showToast(message, type = 'error', duration = 4000) {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast-notification ${type}`;
            toast.textContent = message;

            container.appendChild(toast);

            // Trigger the animation
            setTimeout(() => {
                toast.classList.add('show');
            }, 100); // Short delay to allow CSS transition

            // Remove the toast after duration
            setTimeout(() => {
                toast.classList.remove('show');
                // Remove from DOM after transition out
                toast.addEventListener('transitionend', () => {
                    if (toast.parentElement) {
                        toast.parentElement.removeChild(toast);
                    }
                });
            }, duration);
        }
        // --- End Toast Notification System ---

        const productImages = {
            "Red": "assets/red.png",
            "White": "assets/white.png",
            "Black": "assets/black.jpeg",
            "Gray": "assets/gray.png",
            "Green": "assets/green.png",
            "Blue": "assets/blue.png"
        };

        // Function to change the main product image and active thumbnail
        function changeMainImage(colorName, newSrc) {
            const mainImage = document.getElementById('productImage');
            if (mainImage) {
                // Store current dimensions
                const currentWidth = mainImage.width;
                const currentHeight = mainImage.height;
                
                // Update the source
                mainImage.src = newSrc;
                mainImage.alt = `Premium T-Shirt - ${colorName}`;
                
                // Ensure image maintains consistent dimensions
                mainImage.style.maxHeight = "100%";
                mainImage.style.maxWidth = "100%";
            }

            document.querySelectorAll('.thumbnail-images .img-thumbnail').forEach(img => {
                img.classList.remove('active-thumbnail');
            });
            // Try to find thumbnail by alt text containing colorName
            const activeThumb = document.querySelector(`.thumbnail-images img[alt*='${colorName}']`);
            if (activeThumb) {
                activeThumb.classList.add('active-thumbnail');
            }
        }

        // Function to render color options dynamically with stock status
        function renderColorOptions() {
            const colorOptionsContainer = document.getElementById('colorOptionsContainer'); // Assuming a container with this ID in index.html
            if (!colorOptionsContainer) return;

            colorOptionsContainer.innerHTML = ''; // Clear existing options

            productVariants.forEach(variant => {
                // Skip disabled colors if color selection is enabled
                if (baseProductSettings.enableColorSelection && !baseProductSettings.enabledColors.includes(variant.name)) {
                    return;
                }
                
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('color-option-wrapper', 'text-center', 'mb-2');
                optionDiv.style.width = '70px'; // Adjust as needed

                const colorSwatch = document.createElement('div');
                colorSwatch.classList.add('color-option');
                colorSwatch.style.backgroundColor = variant.colorCode;
                if (variant.border) {
                    colorSwatch.style.border = variant.border;
                }
                colorSwatch.dataset.color = variant.name;
                colorSwatch.title = variant.name;
                colorSwatch.onclick = () => selectColor(variant.name);

                const stockStatusP = document.createElement('p');
                stockStatusP.classList.add('stock-status', 'mt-1', 'mb-0');
                stockStatusP.style.fontSize = '0.75rem';

                if (variant.stock > 5) {
                    stockStatusP.textContent = 'In Stock';
                    stockStatusP.style.color = 'green';
                } else if (variant.stock > 0) {
                    stockStatusP.textContent = `Low: ${variant.stock} left`;
                    stockStatusP.style.color = 'orange';
                } else {
                    stockStatusP.textContent = 'Out of Stock';
                    stockStatusP.style.color = 'red';
                    colorSwatch.classList.add('disabled'); // Add a class for styling disabled swatches
                }

                optionDiv.appendChild(colorSwatch);
                optionDiv.appendChild(stockStatusP);
                colorOptionsContainer.appendChild(optionDiv);
            });
        }

        // Combined function to update product view (image and color selection)
        function updateProductView(colorName, thumbnailElement) {
            selectColor(colorName); 
            // Active state for thumbnail is handled by changeMainImage now
        }

        // Color selection
        function selectColor(colorName) {
            const selectedVariant = productVariants.find(v => v.name === colorName);
            if (!selectedVariant) return;

            selectedColor = colorName;
            document.getElementById('selectedColor').textContent = colorName;
            
            // Update visual selection for color swatches
            document.querySelectorAll('#colorOptionsContainer .color-option').forEach(el => el.classList.remove('selected'));
            const selectedSwatch = document.querySelector(`#colorOptionsContainer .color-option[data-color="${colorName}"]`);
            if (selectedSwatch) {
                 selectedSwatch.classList.add('selected');
            }

            changeMainImage(selectedVariant.name, selectedVariant.imageSrc); // Update main image and its active thumbnail

            // Update stock status display and Add to Cart button
            const stockInfoEl = document.getElementById('selectedColorStockStatus');
            const addToCartBtn = document.querySelector('.btn-primary[onclick="addToCart()"]'); // More specific selector

            if (stockInfoEl) {
                if (selectedVariant.stock > 5) {
                    stockInfoEl.textContent = 'Status: In Stock';
                    stockInfoEl.className = 'text-success fw-bold';
                } else if (selectedVariant.stock > 0) {
                    stockInfoEl.textContent = `Status: Low Stock (${selectedVariant.stock} left)`;
                    stockInfoEl.className = 'text-warning fw-bold';
                } else {
                    stockInfoEl.textContent = 'Status: Out of Stock';
                    stockInfoEl.className = 'text-danger fw-bold';
                }
            }

            if (addToCartBtn) {
                if (selectedVariant.stock <= 0) {
                    addToCartBtn.disabled = true;
                    addToCartBtn.innerHTML = '<i class="fas fa-times-circle me-2"></i>Out of Stock';
                } else {
                    addToCartBtn.disabled = false;
                    addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>Add to Cart';
                }
            }
        }

        // Size selection
        function selectSize(size) {
            console.log('Selecting size:', size);
            selectedSize = size;
            
            const selectedSizeElement = document.getElementById('selectedSize');
            if (selectedSizeElement) {
                selectedSizeElement.textContent = size;
            } else {
                console.error('Selected size element not found in the DOM');
            }
            
            // Update visual selection
            const sizeOptions = document.querySelectorAll('.size-option');
            if (sizeOptions.length > 0) {
                sizeOptions.forEach(el => el.classList.remove('selected'));
                
                const selectedOption = document.querySelector(`.size-option[data-size="${size}"]`);
                if (selectedOption) {
                    selectedOption.classList.add('selected');
                } else {
                    console.error(`Size option element for size ${size} not found`);
                }
            } else {
                console.error('No size option elements found in the DOM');
            }
        }

        // Quantity change
        function changeQuantity(change) {
            quantity = Math.max(1, quantity + change);
            document.getElementById('quantity').textContent = quantity;
        }

        // Add to cart
        function addToCart() {
            console.log('Adding to cart with color:', selectedColor, 'size:', selectedSize, 'quantity:', quantity);
            
            if (!selectedColor || !selectedSize) {
                console.error('Missing color or size selection');
                showToast('Please select both color and size first.', 'error');
                return;
            }

            const selectedVariant = productVariants.find(v => v.name === selectedColor);
            if (!selectedVariant) {
                console.error('Selected color variant not found:', selectedColor);
                showToast('Selected color variant not found. Please try again.', 'error');
                return;
            }

            if (selectedVariant.stock <= 0) {
                console.error('Selected variant out of stock:', selectedColor);
                showToast('This item is currently out of stock.', 'error');
                return;
            }
            
            if (quantity > selectedVariant.stock) {
                console.error('Quantity exceeds stock. Requested:', quantity, 'Available:', selectedVariant.stock);
                showToast(`Only ${selectedVariant.stock} item(s) in stock for the selected color. Please reduce quantity.`, 'error');
                return;
            }

            const item = {
                id: Date.now(),
                name: "Premium T-Shirt", 
                imageSrc: selectedVariant.imageSrc, // Use image of the selected variant
                color: selectedColor,
                size: selectedSize,
                quantity: quantity,
                price: selectedVariant.price // Use price from variant, in case it differs
            };

            console.log('Adding item to cart:', item);
            cart.push(item);
            updateCartDisplay();
            localStorage.setItem('cart', JSON.stringify(cart)); // Save cart after adding item
            console.log('Cart saved to localStorage. Current cart:', cart);
            
            // Reset selections
            selectedColor = '';
            selectedSize = '';
            quantity = 1;
            
            const selectedColorElement = document.getElementById('selectedColor');
            const selectedSizeElement = document.getElementById('selectedSize');
            const quantityElement = document.getElementById('quantity');
            
            if (selectedColorElement) selectedColorElement.textContent = 'None';
            if (selectedSizeElement) selectedSizeElement.textContent = 'None';
            if (quantityElement) quantityElement.textContent = '1';
            
            document.querySelectorAll('.color-option, .size-option').forEach(el => el.classList.remove('selected'));

            showToast('Item added to cart!', 'success');
        }
        
        // Function to save cart to localStorage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart saved to localStorage:', cart);
        }

        // Update cart display
        function updateCartDisplay() {
            console.log('Updating cart display with cart:', cart);
            
            const cartCount = document.getElementById('cart-count');
            const cartItemsContainer = document.getElementById('cartItems');
            const cartTotalEl = document.getElementById('cartTotal');
            
            if (!cartCount || !cartItemsContainer || !cartTotalEl) {
                console.error('Cart elements not found in the DOM');
                return;
            }

            if (cart.length > 0) {
                cartCount.style.display = 'inline';
                cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0); // Sum of quantities
                
                let total = 0;
                cartItemsContainer.innerHTML = ''; // Clear previous items
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    cartItemsContainer.innerHTML += `
                        <div class="cart-item">
                            <img src="${item.imageSrc}" alt="${item.name} - ${item.color}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h5>${item.name}</h5>
                                <div class="item-meta">Color: ${item.color} | Size: ${item.size}</div>
                                <div class="item-price">Price: $${item.price.toFixed(2)}</div>
                            </div>
                            <div class="cart-item-actions">
                                <div class="cart-item-quantity d-flex align-items-center">
                                    <button class="btn btn-outline-secondary btn-sm" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                                    <span class="mx-2 fw-bold">${item.quantity}</span>
                                    <button class="btn btn-outline-secondary btn-sm" onclick="updateCartItemQuantity(${index}, 1)">+</button>
                                </div>
                                <div class="cart-item-subtotal">$${itemTotal.toFixed(2)}</div>
                                <button class="btn btn-sm btn-outline-danger cart-item-delete-btn" onclick="removeFromCart(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                cartTotalEl.textContent = `$${total.toFixed(2)}`;
                console.log('Cart updated with items, total:', total.toFixed(2));
                
                // Order section visibility: Show if cart is visible AND has items
                const cartSection = document.getElementById('cartSection');
                const orderSection = document.getElementById('orderSection');
                
                if (cartSection && cartSection.style.display !== 'none' && orderSection) {
                    orderSection.style.display = 'block';
                } else if (orderSection) {
                    // If cart is not visible, order section should also not be (e.g. if cart was closed)
                    orderSection.style.display = 'none';
                }
            } else {
                cartCount.style.display = 'none';
                cartItemsContainer.innerHTML = '<p class="text-center text-muted py-4">Your cart is empty. Add some items!</p>';
                cartTotalEl.textContent = '$0.00';
                
                const orderSection = document.getElementById('orderSection');
                if (orderSection) {
                    orderSection.style.display = 'none'; // Hide order section if cart is empty
                }
                
                console.log('Cart is empty, display updated');
            }
        }

        // Update cart item quantity
        function updateCartItemQuantity(index, change) {
            if (cart[index]) {
                cart[index].quantity += change;
                if (cart[index].quantity <= 0) {
                    removeFromCart(index); // This will trigger updateCartDisplay, which handles orderSection
                } else {
                    updateCartDisplay();
                    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart after updating quantity
                }
            }
        }

        // Remove from cart
        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartDisplay(); // This will hide orderSection if cart becomes empty
            localStorage.setItem('cart', JSON.stringify(cart)); // Save cart after removing item
        }

        // Toggle cart visibility
        function toggleCart() {
            const cartSection = document.getElementById('cartSection');
            const orderSection = document.getElementById('orderSection');
            
            // Cart is always visible, so this button will now primarily scroll to it
            // and ensure the order section visibility is correct.
            cartSection.scrollIntoView({ behavior: 'smooth' });

            if (cart.length > 0) { 
                orderSection.style.display = 'block';
            } else {
                orderSection.style.display = 'none';
            }
        }

        // Proceed to Order (scrolls to order form)
        function proceedToOrder() {
            console.log('Proceeding to order with cart:', cart);
            
            const orderSection = document.getElementById('orderSection');
            if (!orderSection) {
                console.error('Order section not found in the DOM');
                return;
            }
            
            if (cart.length > 0) { 
                orderSection.style.display = 'block';
                orderSection.scrollIntoView({ behavior: 'smooth' });
                console.log('Order section displayed and scrolled into view');
            } else {
                showToast('Your cart is empty. Add items first.', 'error');
                console.log('Cannot proceed to order: cart is empty');
            }
        }

        // Get current location
        document.getElementById('useCurrentLocation').addEventListener('change', function() {
            const deliveryAddressInput = document.getElementById('deliveryAddress');
            if (this.checked) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
                        deliveryAddressInput.value = `Approx. Location: Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}. (Map: ${mapLink} )`;
                        deliveryAddressInput.readOnly = true; 
                    }, function() {
                        // alert('Unable to get your location. Please enter address manually.');
                        showToast('Unable to get your location. Please enter address manually.', 'info');
                        document.getElementById('useCurrentLocation').checked = false;
                        deliveryAddressInput.value = '';
                        deliveryAddressInput.readOnly = false;
                    });
                } else {
                    // alert('Geolocation is not supported by this browser.');
                    showToast('Geolocation is not supported by this browser.', 'info');
                    this.checked = false;
                    deliveryAddressInput.value = '';
                    deliveryAddressInput.readOnly = false;
                }
            } else {
                deliveryAddressInput.value = ''; // Clear if unchecked
                deliveryAddressInput.readOnly = false;
            }
        });

        // Handle order form submission
        document.addEventListener('DOMContentLoaded', function() {
            const orderForm = document.getElementById('orderForm');
            if (!orderForm) {
                console.error('Order form not found in the DOM');
                return;
            }
            
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Order form submitted');
                
                if (cart.length === 0) {
                    showToast('Your cart is empty! Cannot submit order.', 'error');
                    console.error('Cannot submit order: cart is empty');
                    return;
                }

                const customerNameEl = document.getElementById('customerName');
                const customerPhoneEl = document.getElementById('customerPhone');
                const deliveryAddressEl = document.getElementById('deliveryAddress');
                
                if (!customerNameEl || !customerPhoneEl || !deliveryAddressEl) {
                    console.error('Required form elements not found');
                    showToast('Form error: Required fields not found', 'error');
                    return;
                }
                
                const name = customerNameEl.value;
                const phone = customerPhoneEl.value;
                const address = deliveryAddressEl.value;
                
                // Get selected payment method
                let paymentMethod = 'Not specified';
                const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
                if (selectedPaymentMethod) {
                    paymentMethod = selectedPaymentMethod.value;
                } else {
                    console.warn('No payment method selected, using default');
                }

                console.log('Order details:', { name, phone, address, paymentMethod });

                let plainAddress = address;
                // Extract just the core address part if it includes the map link for cleaner display in message
                if (address.includes("(Map:")) {
                    plainAddress = address.substring(0, address.indexOf("(Map:")).trim();
                }

                // Create order summary
                let orderText = `🛍️ *NEW ORDER RECEIVED* 🛍️\n\n`;
                orderText += `👤 *Customer Details:*\n`;
                orderText += `   - Name: ${name}\n`;
                orderText += `   - Phone: ${phone}\n`;
                orderText += `   - Address: ${plainAddress}\n`;
                if (address.includes("https://www.google.com/maps?q=")) {
                    const mapUrl = address.substring(address.indexOf("https://www.google.com/maps?q="), address.lastIndexOf(")")).trim();
                    orderText += `   - Map Link: ${mapUrl}\n`;
                }
                orderText += `   - Payment Method: ${paymentMethod}\n`;
                orderText += `\n🛒 *Order Summary:*\n`;
                orderText += `-------------------------------------\n`;
                
                let total = 0;
                let totalQuantity = 0;
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    totalQuantity += item.quantity;
                    orderText += `*Item ${index + 1}: ${item.name}*\n`;
                    orderText += `   - Color: ${item.color}\n`;
                    orderText += `   - Size: ${item.size}\n`;
                    orderText += `   - Quantity: ${item.quantity}\n`;
                    orderText += `   - Subtotal: $${itemTotal.toFixed(2)}\n`;
                    orderText += `-------------------------------------\n`;
                });
                
                orderText += `\n📦 *Total Items: ${totalQuantity}*\n`;
                orderText += `💰 *GRAND TOTAL: $${total.toFixed(2)}*\n\n`;
                orderText += `Please confirm this order and provide payment details.\n`;
                orderText += `Thank you! 🙏`;

                // Log the formatted order text
                console.log('Formatted order message:', orderText);
                
                // Check that WhatsApp number is set
                if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER === '+') {
                    console.error('WhatsApp number not set or invalid:', WHATSAPP_NUMBER);
                    showToast('Error: WhatsApp number not configured', 'error');
                    return;
                }

                // Create WhatsApp URL
                const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;
                console.log('Opening WhatsApp with URL:', whatsappUrl);
                
                try {
                    // Open WhatsApp
                    window.open(whatsappUrl, '_blank');
                    
                    // Clear cart after order
                    cart = [];
                    localStorage.removeItem('cart'); // Clear cart from localStorage
                    updateCartDisplay();
                    orderForm.reset();
                    
                    showToast('Order details sent to WhatsApp! We will contact you soon.', 'success', 5000);
                    console.log('Order completed and cart cleared');
                } catch (error) {
                    console.error('Error opening WhatsApp:', error);
                    showToast('Error sending order to WhatsApp. Please try again.', 'error');
                }
            });
        });

        // --- Rain Effect ---
        function initRainEffect() {
            const canvas = document.getElementById('rainCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const drops = [];
            const maxDrops = 100;
            
            // Resize canvas to match hero section size
            function resizeCanvas() {
                const heroSection = document.querySelector('.hero-section');
                canvas.width = heroSection.offsetWidth;
                canvas.height = heroSection.offsetHeight;
            }
            
            // Create initial drops
            function createDrops() {
                for (let i = 0; i < maxDrops; i++) {
                    drops.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        length: Math.random() * 15 + 5,
                        speed: Math.random() * 5 + 2
                    });
                }
            }
            
            // Draw animation
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
                ctx.lineWidth = 1;
                
                for (let i = 0; i < drops.length; i++) {
                    const drop = drops[i];
                    
                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x, drop.y + drop.length);
                    ctx.stroke();
                    
                    drop.y += drop.speed;
                    
                    // Reset drop when it goes out of canvas
                    if (drop.y > canvas.height) {
                        drop.y = 0 - drop.length;
                        drop.x = Math.random() * canvas.width;
                    }
                }
                
                requestAnimationFrame(draw);
            }
            
            // Initialize
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            createDrops();
            draw();
        }
        // --- End Rain Effect ---

        // Function to load base product settings from localStorage
        function loadBaseProductSettings() {
            const savedBaseProduct = localStorage.getItem('baseProduct');
            if (savedBaseProduct) {
                try {
                    const parsedSettings = JSON.parse(savedBaseProduct);
                    
                    // Update base product settings
                    if (parsedSettings.enableColorSelection !== undefined) {
                        baseProductSettings.enableColorSelection = parsedSettings.enableColorSelection;
                    }
                    
                    if (parsedSettings.enabledColors && Array.isArray(parsedSettings.enabledColors)) {
                        baseProductSettings.enabledColors = parsedSettings.enabledColors;
                    }
                    
                    if (parsedSettings.sizes && Array.isArray(parsedSettings.sizes)) {
                        baseProductSettings.sizes = parsedSettings.sizes;
                    }
                    
                    // Update sizes in the size selection UI
                    updateSizeOptions();
                    
                    // Filter product variants based on enabled colors
                    filterProductVariants();
                    
                } catch (e) {
                    console.error('Error parsing base product settings:', e);
                }
            }
        }
        
        // Function to update size options based on baseProductSettings
        function updateSizeOptions() {
            const sizeContainer = document.getElementById('sizeOptionsContainer');
            if (!sizeContainer) {
                console.error('Size options container not found in the DOM');
                return;
            }
            
            // Check if there are already size options (static fallback)
            const existingSizeOptions = sizeContainer.querySelectorAll('.size-option');
            if (existingSizeOptions.length > 0) {
                console.log('Static size options found, checking if update needed');
                
                // If the sizes in baseProductSettings are the same as the existing ones, keep them
                const existingSizes = Array.from(existingSizeOptions).map(el => el.dataset.size);
                const sizesMatch = baseProductSettings.sizes.length === existingSizes.length && 
                                  baseProductSettings.sizes.every(size => existingSizes.includes(size));
                
                if (sizesMatch) {
                    console.log('Existing size options match settings, keeping them');
                    return; // No need to update
                }
            }
            
            // Clear and recreate size options
            console.log('Updating size options with:', baseProductSettings.sizes);
            sizeContainer.innerHTML = '';
            
            baseProductSettings.sizes.forEach(size => {
                const sizeOption = document.createElement('div');
                sizeOption.className = 'size-option';
                sizeOption.dataset.size = size;
                sizeOption.textContent = size;
                sizeOption.onclick = () => selectSize(size);
                sizeContainer.appendChild(sizeOption);
            });
        }
        
        // Function to filter product variants based on enabled colors
        function filterProductVariants() {
            // If color selection is disabled, show all variants
            if (!baseProductSettings.enableColorSelection) {
                return;
            }
            
            // Filter out disabled colors from thumbnails
            const thumbnailContainer = document.querySelector('.thumbnail-images');
            if (thumbnailContainer) {
                const thumbnails = thumbnailContainer.querySelectorAll('.img-thumbnail');
                thumbnails.forEach(thumb => {
                    const colorName = thumb.alt.split(' ').pop();
                    if (baseProductSettings.enabledColors.includes(colorName)) {
                        thumb.style.display = '';
                    } else {
                        thumb.style.display = 'none';
                    }
                });
            }
        }

        // Apply site settings from localStorage
        function applySiteSettings() {
            const savedSettings = localStorage.getItem('siteSettings');
            if (!savedSettings) return;
            
            try {
                const siteSettings = JSON.parse(savedSettings);
                
                // Apply logo settings
                if (siteSettings.logo) {
                    const logoImg = document.getElementById('site-logo');
                    const siteTitle = document.getElementById('site-title');
                    
                    if (logoImg && siteSettings.logo.url && siteSettings.logo.url.trim() !== '') {
                        logoImg.src = siteSettings.logo.url;
                        logoImg.style.display = 'inline-block';
                    }
                    
                    if (siteTitle && siteSettings.logo.title) {
                        siteTitle.textContent = siteSettings.logo.title;
                    }
                }
                
                // Apply WhatsApp number
                if (siteSettings.contact && siteSettings.contact.whatsappNumber) {
                    // Update the global WhatsApp number
                    window.WHATSAPP_NUMBER = '+' + siteSettings.contact.whatsappNumber;
                    
                    // Update any WhatsApp links in the page
                    const whatsappBtn = document.getElementById('whatsappNavButton');
                    if (whatsappBtn) {
                        whatsappBtn.href = `https://wa.me/${siteSettings.contact.whatsappNumber}`;
                    }
                }
                
                // Apply hero section settings
                if (siteSettings.hero) {
                    // Update hero heading
                    const heroHeading = document.querySelector('.hero-section h1');
                    if (heroHeading && siteSettings.hero.heading) {
                        heroHeading.textContent = siteSettings.hero.heading;
                    }
                    
                    // Update hero subheading
                    const heroSubheading = document.querySelector('.hero-section p.lead');
                    if (heroSubheading && siteSettings.hero.subheading) {
                        heroSubheading.textContent = siteSettings.hero.subheading;
                    }
                    
                    // Update sale badge
                    const saleBadge = document.querySelector('.sale-badge');
                    if (saleBadge) {
                        if (siteSettings.hero.showSaleBadge && siteSettings.hero.saleText) {
                            saleBadge.innerHTML = `<i class="fas fa-tags me-2"></i> ${siteSettings.hero.saleText}`;
                            saleBadge.parentElement.style.display = 'block';
                        } else {
                            saleBadge.parentElement.style.display = 'none';
                        }
                    }
                    
                    // Apply discount to product price
                    if (siteSettings.hero.discountPercentage > 0) {
                        const discount = siteSettings.hero.discountPercentage / 100;
                        const originalPrice = 28.99; // Hardcoded original price
                        const discountedPrice = (originalPrice * (1 - discount)).toFixed(2);
                        
                        // Update price display in the product details section
                        const priceElement = document.querySelector('.price-section .h2');
                        const originalPriceElement = document.querySelector('.price-section .h5');
                        const savingsElement = document.querySelector('.price-section .text-success');
                        
                        if (priceElement) {
                            priceElement.textContent = `$${discountedPrice}`;
                        }
                        
                        if (originalPriceElement) {
                            originalPriceElement.textContent = `$${originalPrice}`;
                        }
                        
                        if (savingsElement) {
                            const savings = (originalPrice - discountedPrice).toFixed(2);
                            savingsElement.textContent = `✨ You save $${savings}!`;
                        }
                        
                        // Update product variants prices
                        productVariants.forEach(variant => {
                            variant.price = parseFloat(discountedPrice);
                        });
                    }
                }
                
            } catch (e) {
                console.error('Error applying site settings:', e);
            }
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM fully loaded and parsed');
            
            // Make sure size options are loaded from the baseProductSettings
            baseProductSettings.sizes = ["S", "M", "L", "XL", "XXL"]; // Default sizes
            
            // Load base product settings
            loadBaseProductSettings();
            console.log('Base product settings loaded:', baseProductSettings);
            
            // Update size options directly (separate from loadBaseProductSettings)
            updateSizeOptions();
            console.log('Size options updated');
        
            // Apply site settings from localStorage
            applySiteSettings();
            
            // Render color options
            renderColorOptions();
            
            // Set default selected color (first available)
            const firstAvailableVariant = productVariants.find(v => {
                return v.stock > 0 && 
                       (!baseProductSettings.enableColorSelection || 
                        baseProductSettings.enabledColors.includes(v.name));
            });
            
            if (firstAvailableVariant) {
                selectColor(firstAvailableVariant.name);
                console.log('Selected default color:', firstAvailableVariant.name);
            }
            
            // Initialize rain effect for hero section
            initRainEffect();
            
            // Initialize cart from localStorage
            const savedCart = localStorage.getItem('cart');
            console.log('Saved cart from localStorage:', savedCart);
            
            if (savedCart) {
                try {
                    cart = JSON.parse(savedCart);
                    console.log('Cart loaded successfully:', cart);
                    updateCartDisplay();
                    document.getElementById('cart-count').textContent = cart.length;
                    document.getElementById('cart-count').style.display = cart.length > 0 ? 'inline' : 'none';
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            } else {
                // Initialize empty cart display
                console.log('No saved cart found, initializing empty cart');
                updateCartDisplay();
            }
            
            // Make sure order section is hidden on initial load
            document.getElementById('orderSection').style.display = 'none';
            
            // --- Custom Modal Logic --- START
            const namePromptModal = document.getElementById('namePromptModal');
            const userNameInput = document.getElementById('userNameInput');
            const submitNameBtn = document.getElementById('submitNameBtn');
            const cancelNameBtn = document.getElementById('cancelNameBtn');

            function showNamePromptModal() {
                if (namePromptModal) {
                    namePromptModal.style.display = 'flex'; // Use flex for centering
                    setTimeout(() => namePromptModal.classList.add('show'), 10); // For CSS transition
                    userNameInput.focus(); // Focus the input field
                }
            }

            function hideNamePromptModal() {
                if (namePromptModal) {
                    namePromptModal.classList.remove('show');
                    setTimeout(() => namePromptModal.style.display = 'none', 300); // Wait for transition
                }
            }

            if (submitNameBtn) {
                submitNameBtn.addEventListener('click', () => {
                    const userName = userNameInput.value.trim();
                    if (userName !== "") {
                        localStorage.setItem('chatUserName', userName);
                        window.location.href = "chat.html";
                        hideNamePromptModal();
                    } else {
                        showToast("Please enter your name.", "error");
                    }
                });
            }
            
            // Allow submitting with Enter key in the input field
            if (userNameInput) {
                userNameInput.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault(); // Prevent default form submission if it were in a form
                        submitNameBtn.click(); // Trigger the submit button click
                    }
                });
            }
            
            if (cancelNameBtn) {
                cancelNameBtn.addEventListener('click', hideNamePromptModal);
            }
            // --- Custom Modal Logic --- END

            // Event listener for WhatsApp button in Navbar
            const whatsappNavButton = document.getElementById('whatsappNavButton');
            if (whatsappNavButton) { 
                whatsappNavButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello! I have a question.')}`;
                    window.open(whatsappUrl, '_blank');
                });
            }
            
            // Event listener for Floating Support Button
            const floatingSupportBtn = document.querySelector('.floating-support-btn');
            if (floatingSupportBtn) {
                floatingSupportBtn.addEventListener('click', function(e) {
                    e.preventDefault(); // Prevent default link navigation
                    showNamePromptModal(); // Show custom modal
                });
            }
            
            // Save cart to localStorage when it changes
            window.addEventListener('beforeunload', function() {
                localStorage.setItem('cart', JSON.stringify(cart));
            });
        });