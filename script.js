document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the first page
    if (document.getElementById('sales-form')) {
        // Load saved data from Local Storage
        document.getElementById('transaction-date').value = localStorage.getItem('transactionDate') || '';
        document.getElementById('delivery-date').value = localStorage.getItem('deliveryDate') || '';
        document.getElementById('account-executive').value = localStorage.getItem('accountExecutive') || '';
        document.getElementById('account-name').value = localStorage.getItem('accountName') || '';
        document.getElementById('contact-person').value = localStorage.getItem('contactPerson') || '';
        document.getElementById('designation').value = localStorage.getItem('designation') || '';
        document.getElementById('contact-number').value = localStorage.getItem('contactNumber') || '';
        document.getElementById('delivery-address').value = localStorage.getItem('deliveryAddress') || '';
        document.getElementById('billing-address').value = localStorage.getItem('billingAddress') || '';
        document.getElementById('order-transmitted').value = localStorage.getItem('orderTransmitted') || '';
        document.getElementById('confirmation-attachment').value = localStorage.getItem('confirmationAttachment') || '';
        document.getElementById('delivery-method').value = localStorage.getItem('deliveryMethod') || '';
        document.getElementById('terms-of-payment').value = localStorage.getItem('termsOfPayment') || '';
        document.getElementById('payment-transfer-mode').value = localStorage.getItem('paymentTransferMode') || '';
        document.getElementById('buyer-type').value = localStorage.getItem('buyerType') || '';

        // Event listener for form submission on the first page
        document.getElementById('next-page-button').addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the form from submitting traditionally

            // Get form values
            const transactionDate = document.getElementById('transaction-date').value;
            const deliveryDate = document.getElementById('delivery-date').value;
            const accountExecutive = document.getElementById('account-executive').value;
            const accountName = document.getElementById('account-name').value;
            const contactPerson = document.getElementById('contact-person').value;
            const designation = document.getElementById('designation').value;
            const contactNumber = document.getElementById('contact-number').value;
            const deliveryAddress = document.getElementById('delivery-address').value;
            const billingAddress = document.getElementById('billing-address').value;
            const orderTransmitted = document.getElementById('order-transmitted').value;
            const confirmationAttachment = document.getElementById('confirmation-attachment').value;
            const deliveryMethod = document.getElementById('delivery-method').value;
            const termsOfPayment = document.getElementById('terms-of-payment').value;
            const paymentTransferMode = document.getElementById('payment-transfer-mode').value;
            const buyerType = document.getElementById('buyer-type').value;

            // Save form values to Local Storage
            localStorage.setItem('transactionDate', transactionDate);
            localStorage.setItem('deliveryDate', deliveryDate);
            localStorage.setItem('accountExecutive', accountExecutive);
            localStorage.setItem('accountName', accountName);
            localStorage.setItem('contactPerson', contactPerson);
            localStorage.setItem('designation', designation);
            localStorage.setItem('contactNumber', contactNumber);
            localStorage.setItem('deliveryAddress', deliveryAddress);
            localStorage.setItem('billingAddress', billingAddress);
            localStorage.setItem('orderTransmitted', orderTransmitted);
            localStorage.setItem('confirmationAttachment', confirmationAttachment);
            localStorage.setItem('deliveryMethod', deliveryMethod);
            localStorage.setItem('termsOfPayment', termsOfPayment);
            localStorage.setItem('paymentTransferMode', paymentTransferMode);
            localStorage.setItem('buyerType', buyerType);

            // Redirect to the second page
            window.location.href = 'page2.html';
        });
    }

    // Check if we're on the second page
    if (window.location.pathname.includes('page2.html')) {
        // Event listener for adding new rows
        document.getElementById('add-row-button').addEventListener('click', function () {
            const tableBody = document.querySelector('#order-table tbody');
            const newRow = document.createElement('tr');

            const newRowHTML = `
                <td data-label="ITEM DESCRIPTION"><textarea></textarea></td>
                <td data-label="QUANTITY"><input type="number" class="quantity"></td>
                <td data-label="SIZE"><textarea></textarea></td>
                <td data-label="TYPE"><textarea></textarea></td>
                <td data-label="UNIT PRICE"><input type="number" class="unit-price"></td>
                <td data-label="TOTAL PRICE"><input type="text" readonly value="0.00"></td>
                <td><button type="button" class="remove-row-button">Remove</button></td>
            `;

            newRow.innerHTML = newRowHTML;
            tableBody.appendChild(newRow);

            newRow.querySelector('.remove-row-button').addEventListener('click', function () {
                newRow.remove();
            });

            newRow.querySelectorAll('textarea').forEach(textarea => {
                textarea.addEventListener('input', autoResizeTextarea);
            });

            newRow.querySelector('.quantity').addEventListener('input', calculateTotalPrice);
            newRow.querySelector('.unit-price').addEventListener('input', calculateTotalPrice);
        });

        document.querySelectorAll('.remove-row-button').forEach(button => {
            button.addEventListener('click', function () {
                this.closest('tr').remove();
            });
        });

        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', autoResizeTextarea);
        });

        document.querySelectorAll('.quantity').forEach(input => {
            input.addEventListener('input', calculateTotalPrice);
        });

        document.querySelectorAll('.unit-price').forEach(input => {
            input.addEventListener('input', calculateTotalPrice);
        });

        function autoResizeTextarea(event) {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        }

        function calculateTotalPrice(event) {
            const row = this.closest('tr');
            const quantity = row.querySelector('.quantity').value;
            const unitPrice = row.querySelector('.unit-price').value;
            const totalPriceField = row.querySelector('[data-label="TOTAL PRICE"] input');

            const totalPrice = quantity * unitPrice;
            totalPriceField.value = totalPrice.toFixed(2);
        }

        document.getElementById('generate-invoice-button').addEventListener('click', function (event) {
            event.preventDefault();

            const orderDetails = [];
            document.querySelectorAll('#order-table tbody tr').forEach(row => {
                const itemDescription = row.querySelector('[data-label="ITEM DESCRIPTION"] textarea').value;
                const quantity = row.querySelector('[data-label="QUANTITY"] input').value;
                const size = row.querySelector('[data-label="SIZE"] textarea').value;
                const type = row.querySelector('[data-label="TYPE"] textarea').value;
                const unitPrice = row.querySelector('[data-label="UNIT PRICE"] input').value;
                const totalPrice = row.querySelector('[data-label="TOTAL PRICE"] input').value;

                orderDetails.push({
                    itemDescription,
                    quantity,
                    size,
                    type,
                    unitPrice,
                    totalPrice: parseFloat(totalPrice)
                });
            });

            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

            window.location.href = 'page3.html';
        });
    }

    // Check if we're on the third page
    if (window.location.pathname.includes('page3.html')) {
        const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
        const transactionDate = localStorage.getItem('transactionDate');
        const deliveryDate = localStorage.getItem('deliveryDate');
        const accountName = localStorage.getItem('accountName');
        const contactPerson = localStorage.getItem('contactPerson');
        const designation = localStorage.getItem('designation');
        const contactNumber = localStorage.getItem('contactNumber');
        const deliveryAddress = localStorage.getItem('deliveryAddress');
        const orderTransmitted = localStorage.getItem('orderTransmitted');
        const confirmationAttachment = localStorage.getItem('confirmationAttachment');
        const deliveryMethod = localStorage.getItem('deliveryMethod');
        const termsOfPayment = localStorage.getItem('termsOfPayment');
        const paymentTransferMode = localStorage.getItem('paymentTransferMode');
        const buyerType = localStorage.getItem('buyerType');

        if (orderDetails) {
            const invoiceItemsContainer = document.getElementById('invoice-items');

            orderDetails.forEach(item => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${item.itemDescription}</td>
                    <td>${item.quantity}</td>
                    <td>${item.size}</td>
                    <td>${item.type}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.totalPrice.toFixed(2)}</td>
                `;

                invoiceItemsContainer.appendChild(row);
            });
        }

        // Populate "Invoiced To" section
        document.getElementById('transaction-date').textContent = transactionDate;
        document.getElementById('delivery-date').textContent = deliveryDate;
        document.getElementById('invoice-to-name').textContent = accountName;
        document.getElementById('invoice-to-contact-person').textContent = contactPerson;
        document.getElementById('invoice-to-designation').textContent = designation;
        document.getElementById('invoice-to-contact-number').textContent = contactNumber;
        document.getElementById('invoice-to-address').textContent = deliveryAddress;

        // Populate "Order Details" section
        document.getElementById('order-transmitted').textContent = `Order Transmitted Through: ${orderTransmitted}`;
        document.getElementById('confirmation-attachment').textContent = `Confirmation Attachment: ${confirmationAttachment}`;
        document.getElementById('delivery-method').textContent = `Delivery Method: ${deliveryMethod}`;
        document.getElementById('terms-of-payment').textContent = `Terms of Payment: ${termsOfPayment}`;
        document.getElementById('payment-transfer-mode').textContent = `Payment Transfer Mode: ${paymentTransferMode}`;
        document.getElementById('buyer-type').textContent = `Buyer Type: ${buyerType}`;
    }
});

// Function to handle the "Back" button click
function goBack() {
    window.history.back();
}

// Function to handle the "Submit" button click
function submitInvoice() {
    // Hide the invoice content
    document.getElementById('print-area').style.display = 'none';

    // Show the "after submit" message
    document.getElementById('after-submit-message').style.display = 'block';
}

// Function to handle the "Submit Another" button click
function submitAnother() {
    // Clear localStorage if needed
    localStorage.clear();

    // Redirect to the first page
    window.location.href = 'index.html';
}