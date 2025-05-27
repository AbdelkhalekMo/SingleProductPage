        // Global variables
        let selectedColor = '';
        let selectedSize = '';
        let quantity = 1;
        let cart = [];
        const WHATSAPP_NUMBER = '+201157299077'; // Updated WhatsApp number

        // Product Variants Data - Including stock for each color
        const productVariants = [
            { name: "Red", imageSrc: "assets/red.png", colorCode: "#dc3545", stock: 10, price: 19.99 },
            { name: "White", imageSrc: "assets/white.png", colorCode: "#ffffff", stock: 5, price: 19.99, border: "2px solid #ddd" },
            { name: "Black", imageSrc: "assets/black.jpeg", colorCode: "#212529", stock: 0, price: 19.99 },
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
            selectedSize = size;
            document.getElementById('selectedSize').textContent = size;
            
            // Update visual selection
            document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
            document.querySelector(`[data-size="${size}"]`).classList.add('selected');
        }

        // Quantity change
        function changeQuantity(change) {
            quantity = Math.max(1, quantity + change);
            document.getElementById('quantity').textContent = quantity;
        }

        // Add to cart
        function addToCart() {
            if (!selectedColor || !selectedSize) {
                showToast('Please select both color and size first.', 'error');
                return;
            }

            const selectedVariant = productVariants.find(v => v.name === selectedColor);
            if (!selectedVariant) {
                showToast('Selected color variant not found. Please try again.', 'error');
                return;
            }

            if (selectedVariant.stock <= 0) {
                showToast('This item is currently out of stock.', 'error');
                return;
            }
            if (quantity > selectedVariant.stock) {
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

            cart.push(item);
            updateCartDisplay();
            
            // Reset selections
            selectedColor = '';
            selectedSize = '';
            quantity = 1;
            document.getElementById('selectedColor').textContent = 'None';
            document.getElementById('selectedSize').textContent = 'None';
            document.getElementById('quantity').textContent = '1';
            document.querySelectorAll('.color-option, .size-option').forEach(el => el.classList.remove('selected'));

            // alert('Item added to cart!');
            showToast('Item added to cart!', 'success');
        }

        // Update cart display
        function updateCartDisplay() {
            const cartCount = document.getElementById('cart-count');
            const cartItemsContainer = document.getElementById('cartItems');
            const cartTotalEl = document.getElementById('cartTotal');

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
                
                // Order section visibility: Show if cart is visible AND has items
                if (document.getElementById('cartSection').style.display === 'block') {
                    document.getElementById('orderSection').style.display = 'block';
                } else {
                    // If cart is not visible, order section should also not be (e.g. if cart was closed)
                     document.getElementById('orderSection').style.display = 'none';
                }
            } else {
                cartCount.style.display = 'none';
                cartItemsContainer.innerHTML = '<p class="text-center text-muted py-4">Your cart is empty. Add some items!</p>';
                cartTotalEl.textContent = '$0.00';
                document.getElementById('orderSection').style.display = 'none'; // Hide order section if cart is empty
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
                }
            }
        }

        // Remove from cart
        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartDisplay(); // This will hide orderSection if cart becomes empty
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
            const orderSection = document.getElementById('orderSection');
            if (cart.length > 0) { 
                orderSection.style.display = 'block';
                orderSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // alert('Your cart is empty. Please add items before proceeding to order.');
                showToast('Your cart is empty. Add items first.', 'error');
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
        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                // alert('Your cart is empty!');
                showToast('Your cart is empty! Cannot submit order.', 'error');
                return;
            }

            const name = document.getElementById('customerName').value;
            const phone = document.getElementById('customerPhone').value;
            const address = document.getElementById('deliveryAddress').value;
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked') ? document.querySelector('input[name="paymentMethod"]:checked').value : 'Not specified';

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

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Clear cart after order
            cart = [];
            updateCartDisplay();
            this.reset();
            
            // alert('Order sent to WhatsApp! We will contact you soon.');
            showToast('Order details sent to WhatsApp! We will contact you soon.', 'success', 5000);
        });

        // Initialize
        // updateCartDisplay(); // Call this to set initial state (cart empty, order form hidden)
        // Ensure order section is hidden on initial load, regardless of cart items (which should be 0)
        document.addEventListener('DOMContentLoaded', () => {
            // document.getElementById('cartSection').style.display = 'none'; // Cart is now visible by default
            document.getElementById('orderSection').style.display = 'none'; // Order form starts hidden
            
            renderColorOptions(); // Render color options with stock status
            if (productVariants.length > 0) { // Select the first available color by default
                const firstAvailableVariant = productVariants.find(v => v.stock > 0) || productVariants[0];
                 selectColor(firstAvailableVariant.name);
            }
            
            updateCartDisplay(); // Initialize cart display (will show empty message)
            initRainEffect(); // Initialize rain effect

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
                    showNamePromptModal(); // NEW: Show custom modal
                });
            }
        });

        // --- Rain Effect for Hero Section ---
        function initRainEffect() {
            const canvas = document.getElementById('rainCanvas');
            if (!canvas) return;
            const heroSection = document.querySelector('.hero-section');
            if (!heroSection) return;

            const ctx = canvas.getContext('2d');
            let drops = [];

            function resizeCanvas() {
                canvas.width = heroSection.offsetWidth;
                canvas.height = heroSection.offsetHeight;
                createDrops(); // Recreate drops on resize for new dimensions
            }

            function createDrops() {
                drops = [];
                const numberOfDrops = 100; // Adjust for density
                for (let i = 0; i < numberOfDrops; i++) {
                    drops.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height, // Start at random y positions
                        radius: Math.random() * 2 + 1, // Random radius (1 to 3px)
                        speed: Math.random() * 2 + 1,  // Random speed (1 to 3)
                        opacity: Math.random() * 0.5 + 0.3 // Random opacity (0.3 to 0.8)
                    });
                }
            }

            function draw() {
                if (!ctx || !canvas) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                drops.forEach(drop => {
                    ctx.beginPath();
                    ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
                    // Use off-white/gray color
                    ctx.fillStyle = `rgba(220, 220, 220, ${drop.opacity})`; 
                    ctx.fill();

                    drop.y += drop.speed;

                    // Reset drop to top if it goes off screen
                    if (drop.y - drop.radius > canvas.height) {
                        drop.y = 0 - drop.radius; // Start just above the screen
                        drop.x = Math.random() * canvas.width; // New random x position
                        // Optionally, slightly change radius/speed/opacity for variety on reset
                        drop.radius = Math.random() * 2 + 1;
                        drop.speed = Math.random() * 2 + 1;
                        drop.opacity = Math.random() * 0.5 + 0.3;
                    }
                });

                requestAnimationFrame(draw);
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas(); // Initial setup
            draw(); // Start animation
        }
        // --- End Rain Effect --- 