document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    // Same product variant data as in scripts.js
    const productVariants = [
        { name: "Red", imageSrc: "assets/red.png", colorCode: "#dc3545", stock: 10, price: 19.99 },
        { name: "White", imageSrc: "assets/white.png", colorCode: "#ffffff", stock: 5, price: 19.99, border: "2px solid #ddd" },
        { name: "Black", imageSrc: "assets/black.jpeg", colorCode: "#000000", stock: 15, price: 19.99 },
        { name: "Gray", imageSrc: "assets/gray.png", colorCode: "#6c757d", stock: 20, price: 19.99 },
        { name: "Green", imageSrc: "assets/green.png", colorCode: "#198754", stock: 2, price: 19.99 },
        { name: "Blue", imageSrc: "assets/blue.png", colorCode: "#0d6efd", stock: 15, price: 19.99 }
    ];

    // Base product data
    const baseProduct = {
        name: "Premium Cotton T-Shirt",
        description: "Made from 100% premium cotton, our t-shirts offer unmatched comfort and durability. Perfect for casual wear or as a wardrobe staple.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        enableColorSelection: true,
        enabledColors: ["Red", "White", "Black", "Gray", "Green", "Blue"]
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and hide all sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            adminSections.forEach(s => s.classList.add('d-none'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show target section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('d-none');
            }
        });
    });

    // --- Product Management UI Interactions ---
    const addVariantBtn = document.getElementById('addVariantBtn');
    const editProductDetailsBtn = document.getElementById('editProductDetailsBtn');
    const addProductFormCard = document.getElementById('addProductFormCard');
    const productForm = document.getElementById('productForm');
    const productFormTitle = document.getElementById('productFormTitle');
    const cancelProductFormBtn = document.getElementById('cancelProductFormBtn');
    const productIdField = document.getElementById('productId');
    const variantIdField = document.getElementById('variantId');
    const variantImageUpload = document.getElementById('variantImageUpload');
    const variantImagePreview = document.getElementById('variantImagePreview');
    const variantColorCode = document.getElementById('variantColorCode');
    const colorPreview = document.getElementById('colorPreview');
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const productListTableBody = document.getElementById('productList');
    const baseProductModal = document.getElementById('baseProductModal');
    const saveBaseProductBtn = document.getElementById('saveBaseProductBtn');

    // Function to toggle variant form visibility
    function toggleVariantForm(show = true, isEdit = false, variantData = null) {
        if (show) {
            productFormTitle.textContent = isEdit ? 'Edit Variant' : 'Add New Variant';
            if (isEdit && variantData) {
                // Populate form with variant data
                document.getElementById('variantColor').value = variantData.name || '';
                document.getElementById('variantColorCode').value = (variantData.colorCode || '').replace('#', '');
                document.getElementById('variantPrice').value = variantData.price || 19.99;
                document.getElementById('variantStock').value = variantData.stock || 0;
                variantIdField.value = variantData.name || '';
                
                // Update color preview
                updateColorPreview(variantData.colorCode || '#000000');
                
                // If we had image preview capability, we'd set it here
                variantImagePreview.style.display = 'none';
            } else {
                productForm.reset();
                variantIdField.value = '';
                variantImagePreview.style.display = 'none';
                updateColorPreview('#000000'); // Default black
            }
            addProductFormCard.style.display = 'block';
            addVariantBtn.textContent = 'Hide Form';
            addVariantBtn.classList.replace('btn-success', 'btn-warning');
        } else {
            addProductFormCard.style.display = 'none';
            productForm.reset();
            variantIdField.value = '';
            addVariantBtn.textContent = 'Add New Variant';
            addVariantBtn.classList.replace('btn-warning', 'btn-success');
            variantImagePreview.style.display = 'none';
        }
    }

    // Function to update color preview
    function updateColorPreview(colorCode) {
        if (colorCode && colorCode.trim() !== '') {
            const color = colorCode.startsWith('#') ? colorCode : `#${colorCode}`;
            if (colorPreview) {
                colorPreview.style.backgroundColor = color;
            }
        }
    }

    // Event listeners for buttons
    if (addVariantBtn) {
        addVariantBtn.addEventListener('click', () => {
            const isFormVisible = addProductFormCard.style.display === 'block';
            toggleVariantForm(!isFormVisible);
        });
    }

    if (cancelProductFormBtn) {
        cancelProductFormBtn.addEventListener('click', () => toggleVariantForm(false));
    }

    // Handle color code input change
    if (variantColorCode) {
        variantColorCode.addEventListener('input', function() {
            updateColorPreview(this.value);
        });
    }

    // Color picker button (placeholder - in a real app would open a color picker)
    if (colorPickerBtn) {
        colorPickerBtn.addEventListener('click', function() {
            alert('In a real implementation, this would open a color picker dialog.');
            // For now, let's just set a random color as an example
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            variantColorCode.value = randomColor.replace('#', '');
            updateColorPreview(randomColor);
        });
    }

    // Image preview for variant image
    if (variantImageUpload && variantImagePreview) {
        variantImageUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    variantImagePreview.src = e.target.result;
                    variantImagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                variantImagePreview.style.display = 'none';
            }
        });
    }

    // Edit base product button
    if (editProductDetailsBtn && baseProductModal) {
        const bsModal = new bootstrap.Modal(baseProductModal);
        
        editProductDetailsBtn.addEventListener('click', () => {
            // Populate modal with base product data
            document.getElementById('baseProductName').value = baseProduct.name;
            document.getElementById('baseProductDescription').value = baseProduct.description;
            
            // Populate sizes
            renderSizes();
            
            // Setup color selection
            setupColorSelection();
            
            bsModal.show();
        });
    }

    // Function to render size badges
    function renderSizes() {
        const sizesContainer = document.getElementById('sizesContainer');
        if (!sizesContainer) return;
        
        sizesContainer.innerHTML = '';
        
        baseProduct.sizes.forEach(size => {
            const sizeTag = document.createElement('div');
            sizeTag.className = 'badge bg-secondary p-2 position-relative';
            sizeTag.innerHTML = `
                ${size}
                <button type="button" class="btn-close btn-close-white ms-2" 
                        style="font-size: 0.5rem;" 
                        data-size="${size}"></button>
            `;
            sizesContainer.appendChild(sizeTag);
            
            // Add event listener to delete button
            const deleteBtn = sizeTag.querySelector('.btn-close');
            deleteBtn.addEventListener('click', function() {
                const sizeToRemove = this.getAttribute('data-size');
                baseProduct.sizes = baseProduct.sizes.filter(s => s !== sizeToRemove);
                renderSizes();
            });
        });
    }
    
    // Function to setup color selection
    function setupColorSelection() {
        const enableColorSelection = document.getElementById('enableColorSelection');
        const colorSelectionControls = document.getElementById('colorSelectionControls');
        const availableColorsContainer = document.getElementById('availableColorsContainer');
        
        if (!enableColorSelection || !colorSelectionControls || !availableColorsContainer) return;
        
        // Set initial state
        enableColorSelection.checked = baseProduct.enableColorSelection;
        colorSelectionControls.style.display = baseProduct.enableColorSelection ? 'block' : 'none';
        
        // Event listener for enable/disable toggle
        enableColorSelection.addEventListener('change', function() {
            baseProduct.enableColorSelection = this.checked;
            colorSelectionControls.style.display = this.checked ? 'block' : 'none';
        });
        
        // Render available colors
        availableColorsContainer.innerHTML = '';
        
        productVariants.forEach(variant => {
            const colorName = variant.name;
            const colorDiv = document.createElement('div');
            colorDiv.className = 'form-check form-check-inline align-items-center';
            colorDiv.innerHTML = `
                <input class="form-check-input" type="checkbox" id="color-${colorName}" 
                       ${baseProduct.enabledColors.includes(colorName) ? 'checked' : ''} 
                       value="${colorName}">
                <label class="form-check-label d-flex align-items-center" for="color-${colorName}">
                    <span class="color-swatch" style="
                        display: inline-block; 
                        width: 20px; 
                        height: 20px; 
                        border-radius: 50%; 
                        background-color: ${variant.colorCode};
                        ${variant.border ? variant.border : ''}
                        margin-right: 5px;"></span>
                    ${colorName}
                </label>
            `;
            availableColorsContainer.appendChild(colorDiv);
            
            // Add event listener for checkbox
            const checkbox = colorDiv.querySelector(`#color-${colorName}`);
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    if (!baseProduct.enabledColors.includes(colorName)) {
                        baseProduct.enabledColors.push(colorName);
                    }
                } else {
                    baseProduct.enabledColors = baseProduct.enabledColors.filter(c => c !== colorName);
                }
            });
        });
    }
    
    // Add new size button
    document.addEventListener('DOMContentLoaded', () => {
        const addSizeBtn = document.getElementById('addSizeBtn');
        const newSizeInput = document.getElementById('newSizeInput');
        
        if (addSizeBtn && newSizeInput) {
            addSizeBtn.addEventListener('click', () => {
                const newSize = newSizeInput.value.trim().toUpperCase();
                if (newSize && !baseProduct.sizes.includes(newSize)) {
                    baseProduct.sizes.push(newSize);
                    renderSizes();
                    newSizeInput.value = '';
                } else if (baseProduct.sizes.includes(newSize)) {
                    alert('This size already exists!');
                }
            });
            
            // Allow adding with Enter key
            newSizeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addSizeBtn.click();
                }
            });
        }
    });

    // Save base product changes
    if (saveBaseProductBtn) {
        saveBaseProductBtn.addEventListener('click', () => {
            // In a real app, this would save to an API
            baseProduct.name = document.getElementById('baseProductName').value;
            baseProduct.description = document.getElementById('baseProductDescription').value;
            
            // Get color selection settings
            baseProduct.enableColorSelection = document.getElementById('enableColorSelection').checked;
            baseProduct.enabledColors = [];
            
            // Get all checked color checkboxes
            document.querySelectorAll('#availableColorsContainer input[type="checkbox"]:checked').forEach(checkbox => {
                baseProduct.enabledColors.push(checkbox.value);
            });
            
            // Update product name in the variant form
            document.getElementById('productName').value = baseProduct.name;
            
            // Update product name in the table
            const productNameCells = document.querySelectorAll('#productList td:nth-child(2)');
            productNameCells.forEach(cell => {
                cell.textContent = baseProduct.name;
            });
            
            // Update UI based on enabled colors
            if (!baseProduct.enableColorSelection) {
                // If color selection is disabled, show all variants
                document.querySelectorAll('#productList tr').forEach(row => {
                    row.style.display = '';
                });
            } else {
                // Hide disabled color variants
                document.querySelectorAll('#productList tr').forEach(row => {
                    const colorCell = row.querySelector('td:nth-child(3)');
                    if (colorCell) {
                        const colorName = colorCell.textContent.trim().split(' ').pop(); // Get color name
                        if (!baseProduct.enabledColors.includes(colorName)) {
                            row.style.display = 'none';
                        } else {
                            row.style.display = '';
                        }
                    }
                });
            }
            
            // Save to localStorage
            localStorage.setItem('baseProduct', JSON.stringify(baseProduct));
            
            alert('Base product details updated successfully!');
            
            // Close modal
            const bsModal = bootstrap.Modal.getInstance(baseProductModal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }

    // Handle Product Form Submission
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const variantId = variantIdField.value;
            const isEdit = variantId !== '';
            
            // Collect form data
            const variantData = {
                name: document.getElementById('variantColor').value,
                colorCode: '#' + document.getElementById('variantColorCode').value,
                price: parseFloat(document.getElementById('variantPrice').value),
                stock: parseInt(document.getElementById('variantStock').value, 10),
                // In a real app, we'd handle the image upload here
            };
            
            // In a real app, this would be an API call
            alert(`${isEdit ? 'Updated' : 'Added'} variant: ${JSON.stringify(variantData)}`);
            
            // Simulate updating the table with the new/updated variant
            if (isEdit) {
                // Find the row with this variant and update it
                const variantRow = document.querySelector(`#productList button[data-variant="${variantId}"]`).closest('tr');
                if (variantRow) {
                    updateVariantRow(variantRow, variantData);
                }
            } else {
                // Add a new row
                addVariantRow(variantData);
            }
            
            toggleVariantForm(false);
        });
    }

    // Function to update a variant row with new data
    function updateVariantRow(row, variantData) {
        // Update stock cell
        const stockCell = row.querySelector('td:nth-child(5)');
        if (stockCell) {
            stockCell.textContent = variantData.stock;
        }
        
        // Update status badge
        const statusCell = row.querySelector('td:nth-child(6)');
        if (statusCell) {
            let badgeHtml = '';
            if (variantData.stock > 5) {
                badgeHtml = '<span class="badge bg-success">In Stock</span>';
            } else if (variantData.stock > 0) {
                badgeHtml = '<span class="badge bg-warning text-dark">Low Stock</span>';
            } else {
                badgeHtml = '<span class="badge bg-danger">Out of Stock</span>';
            }
            statusCell.innerHTML = badgeHtml;
        }
        
        // Update price
        const priceCell = row.querySelector('td:nth-child(4)');
        if (priceCell) {
            priceCell.textContent = `$${variantData.price.toFixed(2)}`;
        }
        
        // Update color swatch if color code changed
        const colorCell = row.querySelector('td:nth-child(3) .color-swatch');
        if (colorCell) {
            colorCell.style.backgroundColor = variantData.colorCode;
        }
    }

    // Function to add a new variant row
    function addVariantRow(variantData) {
        if (!productListTableBody) return;
        
        const row = document.createElement('tr');
        
        // Determine status badge
        let statusBadge = '';
        if (variantData.stock > 5) {
            statusBadge = '<span class="badge bg-success">In Stock</span>';
        } else if (variantData.stock > 0) {
            statusBadge = '<span class="badge bg-warning text-dark">Low Stock</span>';
        } else {
            statusBadge = '<span class="badge bg-danger">Out of Stock</span>';
        }
        
        // For a real app, we'd use the uploaded image. For now, use a placeholder
        const imageSrc = 'assets/placeholder.png';
        
        row.innerHTML = `
            <td><img src="${imageSrc}" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
            <td>${baseProduct.name}</td>
            <td><span class="color-swatch" style="background-color: ${variantData.colorCode}; display: inline-block; width: 20px; height: 20px; border-radius: 50%; vertical-align: middle; margin-right: 5px;"></span> ${variantData.name}</td>
            <td>$${variantData.price.toFixed(2)}</td>
            <td>${variantData.stock}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" title="Edit" data-variant="${variantData.name}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger" title="Delete" data-variant="${variantData.name}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        productListTableBody.appendChild(row);
    }

    // Handle clicks on product list actions (Edit/Delete)
    if (productListTableBody) {
        productListTableBody.addEventListener('click', (e) => {
            const editButton = e.target.closest('.btn-outline-primary');
            const deleteButton = e.target.closest('.btn-outline-danger');
            
            if (editButton) {
                const variantName = editButton.getAttribute('data-variant');
                const variant = productVariants.find(v => v.name === variantName);
                
                if (variant) {
                    toggleVariantForm(true, true, variant);
                } else {
                    alert(`Variant "${variantName}" not found in data.`);
                }
            }
            
            if (deleteButton) {
                const variantName = deleteButton.getAttribute('data-variant');
                if (confirm(`Are you sure you want to delete the ${variantName} variant?`)) {
                    // In a real app, this would be an API call
                    alert(`Delete variant "${variantName}" (API call would go here)`);
                    
                    // Optimistically remove the row
                    const row = deleteButton.closest('tr');
                    if (row) {
                        row.remove();
                    }
                }
            }
        });
    }

    // --- Site Settings Functionality ---
    
    // Default site settings
    const siteSettings = {
        logo: {
            url: '',
            title: 'StyleShop'
        },
        contact: {
            whatsappNumber: '201157299077'
        },
        hero: {
            heading: 'Elevate Your Style with Our Premium T-Shirt Collection',
            subheading: 'Experience unparalleled comfort and sophisticated design. Crafted for the modern individual.',
            saleText: 'Limited Time: 30% OFF!',
            discountPercentage: 30,
            showSaleBadge: true
        }
    };
    
    // Load settings from localStorage if available
    function loadSiteSettings() {
        const savedSettings = localStorage.getItem('siteSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                Object.assign(siteSettings, parsedSettings);
            } catch (e) {
                console.error('Error parsing saved settings:', e);
            }
        }
        
        // Populate form fields with current settings
        populateSiteSettingsForms();
    }
    
    // Save settings to localStorage
    function saveSiteSettings() {
        localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
        alert('Settings saved successfully!');
    }
    
    // Populate all site settings forms with current values
    function populateSiteSettingsForms() {
        // Logo & Brand Settings
        const logoForm = document.getElementById('logoSettingsForm');
        if (logoForm) {
            document.getElementById('siteLogo').value = siteSettings.logo.url || '';
            document.getElementById('siteTitle').value = siteSettings.logo.title || 'StyleShop';
            updateLogoPreview();
        }
        
        // Contact Settings
        const contactForm = document.getElementById('contactSettingsForm');
        if (contactForm) {
            document.getElementById('whatsappNumber').value = siteSettings.contact.whatsappNumber || '';
        }
        
        // Hero Settings
        const heroForm = document.getElementById('heroSettingsForm');
        if (heroForm) {
            document.getElementById('heroHeading').value = siteSettings.hero.heading || '';
            document.getElementById('heroSubheading').value = siteSettings.hero.subheading || '';
            document.getElementById('saleText').value = siteSettings.hero.saleText || '';
            document.getElementById('discountPercentage').value = siteSettings.hero.discountPercentage || '';
            document.getElementById('showSaleBadge').checked = siteSettings.hero.showSaleBadge;
        }
    }
    
    // Update logo preview
    function updateLogoPreview() {
        const logoPreview = document.getElementById('logoPreview');
        const logoUrl = document.getElementById('siteLogo').value;
        
        if (logoPreview) {
            if (logoUrl && logoUrl.trim() !== '') {
                logoPreview.innerHTML = `<img src="${logoUrl}" alt="Logo Preview" style="max-height: 100%; max-width: 100%;">`;
            } else {
                logoPreview.innerHTML = `<div class="alert alert-secondary">No logo image URL provided</div>`;
            }
        }
    }
    
    // Event listeners for site settings forms
    document.addEventListener('DOMContentLoaded', () => {
        // ... existing code ...
        
        // Load site settings from localStorage
        loadSiteSettings();
        
        // Logo Settings Form
        const logoSettingsForm = document.getElementById('logoSettingsForm');
        if (logoSettingsForm) {
            const siteLogoInput = document.getElementById('siteLogo');
            if (siteLogoInput) {
                siteLogoInput.addEventListener('input', updateLogoPreview);
            }
            
            logoSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                siteSettings.logo.url = document.getElementById('siteLogo').value;
                siteSettings.logo.title = document.getElementById('siteTitle').value;
                
                saveSiteSettings();
            });
        }
        
        // Contact Settings Form
        const contactSettingsForm = document.getElementById('contactSettingsForm');
        if (contactSettingsForm) {
            contactSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                siteSettings.contact.whatsappNumber = document.getElementById('whatsappNumber').value;
                
                saveSiteSettings();
            });
        }
        
        // Hero Settings Form
        const heroSettingsForm = document.getElementById('heroSettingsForm');
        if (heroSettingsForm) {
            heroSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                siteSettings.hero.heading = document.getElementById('heroHeading').value;
                siteSettings.hero.subheading = document.getElementById('heroSubheading').value;
                siteSettings.hero.saleText = document.getElementById('saleText').value;
                siteSettings.hero.discountPercentage = document.getElementById('discountPercentage').value;
                siteSettings.hero.showSaleBadge = document.getElementById('showSaleBadge').checked;
                
                // Calculate and update product prices based on discount
                if (siteSettings.hero.discountPercentage > 0) {
                    // In a real app, this would update the database
                    // Here we're just updating the UI
                    const discount = siteSettings.hero.discountPercentage / 100;
                    
                    // Update product prices in UI
                    const priceElements = document.querySelectorAll('#productList td:nth-child(4)');
                    if (priceElements.length > 0) {
                        priceElements.forEach(cell => {
                            const originalPrice = 28.99; // Hardcoded original price
                            const discountedPrice = (originalPrice * (1 - discount)).toFixed(2);
                            cell.textContent = `$${discountedPrice}`;
                        });
                    }
                }
                
                saveSiteSettings();
            });
        }
    });
}); 