document.addEventListener('DOMContentLoaded', () => {
    const cartItemsBody = document.getElementById('cart-items-body');
    const summarySubtotalEl = document.getElementById('summary-subtotal');
    const summaryShippingEl = document.getElementById('summary-shipping');
    const summaryTaxEl = document.getElementById('summary-tax');
    const summaryTotalEl = document.getElementById('summary-total');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTableContainer = document.getElementById('cart-table-container');
    const couponForm = document.getElementById('coupon-form');
    const couponMessageEl = document.getElementById('coupon-message');

    const SHIPPING_COST = 5.00; // Example shipping
    const TAX_RATE = 0.06; // Example tax rate (6%)

    // --- Helper Functions ---
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    function updateRowSubtotal(row) {
        const price = parseFloat(row.getAttribute('data-price'));
        const quantityInput = row.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value);
        const subtotalEl = row.querySelector('.item-subtotal');

        if (isNaN(price) || isNaN(quantity) || quantity < 1) {
            // Handle invalid input if necessary, maybe reset quantity to 1
            quantityInput.value = 1;
            subtotalEl.textContent = formatCurrency(price);
            updateOrderSummary(); // Recalculate summary if quantity was invalid
            return;
        }

        const subtotal = price * quantity;
        subtotalEl.textContent = formatCurrency(subtotal);
    }

    function updateOrderSummary() {
        let subtotal = 0;
        const rows = cartItemsBody.querySelectorAll('tr');

        rows.forEach(row => {
            const price = parseFloat(row.getAttribute('data-price'));
            const quantity = parseInt(row.querySelector('.quantity-input').value);
            if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
                subtotal += price * quantity;
            }
        });

        const tax = subtotal * TAX_RATE;
        // Apply coupon discount if applicable (add logic here if needed)
        const total = subtotal + SHIPPING_COST + tax; // Adjust if coupon is applied

        summarySubtotalEl.textContent = formatCurrency(subtotal);
        summaryShippingEl.textContent = formatCurrency(SHIPPING_COST); // Or make dynamic
        summaryTaxEl.textContent = formatCurrency(tax);
        summaryTotalEl.textContent = formatCurrency(total);

        updateCartVisibility(rows.length);
    }

    function updateCartVisibility(itemCount) {
         // Update cart count badge
        cartCountBadge.textContent = itemCount;

        if (itemCount === 0) {
            emptyCartMessage.style.display = 'block';
            cartTableContainer.style.display = 'none';
            // Optionally disable checkout button etc.
            document.getElementById('checkout-btn').classList.add('disabled');
        } else {
            emptyCartMessage.style.display = 'none';
            cartTableContainer.style.display = 'block';
            document.getElementById('checkout-btn').classList.remove('disabled');
        }
    }


    // --- Event Listeners ---

    cartItemsBody.addEventListener('click', (event) => {
        const target = event.target;
        const row = target.closest('tr'); // Find the parent table row

        if (!row) return; // Exit if click wasn't inside a row

        // Quantity Decrease
        if (target.classList.contains('quantity-decrease')) {
            const quantityInput = row.querySelector('.quantity-input');
            let currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1;
                updateRowSubtotal(row);
                updateOrderSummary();
            }
        }

        // Quantity Increase
        if (target.classList.contains('quantity-increase')) {
            const quantityInput = row.querySelector('.quantity-input');
            let currentQuantity = parseInt(quantityInput.value);
            // Add check for max quantity if needed
            quantityInput.value = currentQuantity + 1;
            updateRowSubtotal(row);
            updateOrderSummary();
        }

        // Remove Item
        if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
             // Add confirmation dialog (optional)
             if (confirm('Are you sure you want to remove this item?')) {
                row.remove(); // Remove the row from the table
                updateOrderSummary(); // Recalculate totals
             }
        }
    });

    // Update summary if quantity is manually changed
    cartItemsBody.addEventListener('change', (event) => {
         if (event.target.classList.contains('quantity-input')) {
             const row = event.target.closest('tr');
             if (row) {
                 // Validate input - ensure it's at least 1
                 if (parseInt(event.target.value) < 1 || isNaN(parseInt(event.target.value))) {
                     event.target.value = 1;
                 }
                 updateRowSubtotal(row);
                 updateOrderSummary();
             }
         }
    });

    // Coupon Form Submission (Basic Example)
    if (couponForm) {
        couponForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent page reload
            const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
            couponMessageEl.textContent = ''; // Clear previous message
            couponMessageEl.classList.remove('text-success', 'text-danger');

            // **IMPORTANT**: Real coupon validation needs backend logic
            if (couponCode === 'SAVE10') {
                 couponMessageEl.textContent = 'Coupon "SAVE10" applied! (Demo - calculation not updated)';
                 couponMessageEl.classList.add('text-success');
                 // TODO: Add logic here to recalculate totals with discount
                 // updateOrderSummary(0.10); // Pass discount rate for example
            } else if (couponCode === '') {
                 couponMessageEl.textContent = 'Please enter a coupon code.';
                 couponMessageEl.classList.add('text-danger');
            }
            else {
                 couponMessageEl.textContent = 'Invalid coupon code.';
                 couponMessageEl.classList.add('text-danger');
            }
        });
    }


    // --- Initial Calculation ---
    // Add data-label attributes for mobile view if using that CSS approach
     if (window.innerWidth < 576) {
        cartItemsBody.querySelectorAll('td').forEach(td => {
            const th = cartItemsBody.closest('table').querySelector(`th:nth-child(${td.cellIndex + 1})`);
             if (th) {
                td.setAttribute('data-label', th.textContent.trim());
                // Add specific classes based on column for styling override if needed
                if (td.cellIndex === 0) td.classList.add('product-column-data');
                if (td.cellIndex === 4) td.classList.add('remove-column-data'); // index for remove button cell
             }
        });
     }


    updateOrderSummary(); // Calculate totals on page load

}); // End DOMContentLoaded

        // Basic JS Example to switch active state (real switching needs more logic)
        const accountNavLinks = document.querySelectorAll('.account-nav .list-group-item-action');

        accountNavLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior

                // Remove active class from all links
                accountNavLinks.forEach(l => l.classList.remove('active'));

                // Add active class to the clicked link
                this.classList.add('active');
                this.setAttribute('aria-current', 'true');

                // **IMPORTANT**: In a real application, you would now either:
                // 1. Make an AJAX call to load the content for the clicked section
                //    into the <section class="col-lg-9 account-content"> area.
                // OR
                // 2. Navigate to a new URL (e.g., /account/orders, /account/profile)
                //    where the backend serves the correct page content.

                console.log('Clicked:', this.textContent.trim());
                // Add logic here to show/hide corresponding content sections
                 // e.g., document.getElementById('profile-section').style.display = 'none';
                 //      document.getElementById('order-history-section').style.display = 'block';
            });
        });

         // Optional: Basic form submission handling example
         const profileForm = document.getElementById('profileForm');
         if (profileForm) {
             profileForm.addEventListener('submit', function(event) {
                 event.preventDefault();
                 console.log('Profile form submitted (prevented default)');
                 // Add AJAX submission logic here
                 // Example: Show a temporary message
                 const msgDiv = document.getElementById('profileMessage');
                 msgDiv.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">Profile updated successfully! (Demo)<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
             });
         }
