document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    // Same product variant data as in scripts.js
    const productVariants = [
        { name: "Red", imageSrc: "assets/red.png", colorCode: "#dc3545", stock: 10, price: 19.99 },
        { name: "White", imageSrc: "assets/white.png", colorCode: "#ffffff", stock: 5, price: 19.99, border: "2px solid #ddd" },
        { name: "Black", imageSrc: "assets/black.jpeg", colorCode: "#212529", stock: 0, price: 19.99 },
        { name: "Gray", imageSrc: "assets/gray.png", colorCode: "#6c757d", stock: 20, price: 19.99 },
        { name: "Green", imageSrc: "assets/green.png", colorCode: "#198754", stock: 2, price: 19.99 },
        { name: "Blue", imageSrc: "assets/blue.png", colorCode: "#0d6efd", stock: 15, price: 19.99 }
    ];

    // Base product data
    const baseProduct = {
        name: "Premium Cotton T-Shirt",
        description: "Made from 100% premium cotton, our t-shirts offer unmatched comfort and durability. Perfect for casual wear or as a wardrobe staple.",
        sizes: ["S", "M", "L", "XL", "XXL"]
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
                document.getElementById('productName').value = baseProduct.name; // Set default product name
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
            document.getElementById('productName').value = baseProduct.name; // Reset to default
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
            document.getElementById('baseProductSizes').value = baseProduct.sizes.join(', ');
            
            bsModal.show();
        });
    }

    // Save base product changes
    if (saveBaseProductBtn) {
        saveBaseProductBtn.addEventListener('click', () => {
            // In a real app, this would save to an API
            baseProduct.name = document.getElementById('baseProductName').value;
            baseProduct.description = document.getElementById('baseProductDescription').value;
            baseProduct.sizes = document.getElementById('baseProductSizes').value.split(',').map(size => size.trim());
            
            // Update product name in the variant form
            document.getElementById('productName').value = baseProduct.name;
            
            // Update product name in the table
            const productNameCells = document.querySelectorAll('#productList td:nth-child(2)');
            productNameCells.forEach(cell => {
                cell.textContent = baseProduct.name;
            });
            
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
}); 