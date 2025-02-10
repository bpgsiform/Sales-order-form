document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the first page
    if (document.getElementById('sales-form')) {
      // Load saved data from Local Storage
      const formData = JSON.parse(localStorage.getItem('formData')) || {};
      Object.keys(formData).forEach(key => {
        const field = document.getElementById(key);
        if (field) field.value = formData[key];
      });
  
      // Event listener for form submission on the first page
      document.getElementById('next-page-button').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the form from submitting traditionally
  
        // Get form values
        const requiredFields = [
          "transaction-date",
          "delivery-date",
          "account-name",
          "contact-person",
          "contact-number",
          "delivery-address",
          "order-transmitted",
          "confirmation-attachment",
          "delivery-method",
          "terms-of-payment",
          "payment-transfer-mode",
          "buyer-type"
        ];
  
        let allFilled = true;
  
        requiredFields.forEach((id) => {
          const field = document.getElementById(id);
          if (!field.value.trim()) {
            allFilled = false;
            field.style.border = "2px solid red"; // Highlight empty fields
          } else {
            field.style.border = ""; // Reset border if filled
          }
        });
  
        if (!allFilled) {
          alert("Please fill in all required fields before proceeding.");
        } else {
          // Save form data to localStorage
          const formData = {};
          requiredFields.forEach((id) => {
            formData[id] = document.getElementById(id).value;
          });
          localStorage.setItem('formData', JSON.stringify(formData));
  
          // Redirect to Page 2
          window.location.href = "page2.html";
        }
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
          <td data-label="ITEM CODE"><textarea></textarea></td>
          <td data-label="QUANTITY"><input type="number" class="quantity"></td>
          <td data-label="SIZE"><textarea></textarea></td>
          <td data-label="TYPE"><textarea></textarea></td>
          <td data-label="UNIT PRICE"><input type="number" class="unit-price"></td>
          <td data-label="TOTAL PRICE"><input type="text" readonly value="0.00"></td>
          <td><button type="button" class="remove-row-button">Remove</button></td>
        `;
  
        newRow.innerHTML = newRowHTML;
        tableBody.appendChild(newRow);
  
        // Add event listeners for the new row
        newRow.querySelector('.quantity').addEventListener('input', calculateTotalPrice);
        newRow.querySelector('.unit-price').addEventListener('input', calculateTotalPrice);
        newRow.querySelector('.remove-row-button').addEventListener('click', function () {
          newRow.remove();
        });
      });
  
      // Function to calculate total price
      function calculateTotalPrice() {
        const row = this.closest('tr');
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
        const totalPriceField = row.querySelector('[data-label="TOTAL PRICE"] input');
        totalPriceField.value = (quantity * unitPrice).toFixed(2);
      }
  
      // Add event listeners for the first row
      const firstRow = document.querySelector('#order-table tbody tr');
      if (firstRow) {
        firstRow.querySelector('.quantity').addEventListener('input', calculateTotalPrice);
        firstRow.querySelector('.unit-price').addEventListener('input', calculateTotalPrice);
      }
  
      // Function to save table data and redirect to Page 3
      document.getElementById('generate-invoice-button').addEventListener('click', function () {
        const orderDetails = [];
        document.querySelectorAll('#order-table tbody tr').forEach(row => {
          const itemDescription = row.querySelector('[data-label="ITEM DESCRIPTION"] textarea').value;
          const itemCode = row.querySelector('[data-label="ITEM CODE"] textarea').value;
          const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
          const size = row.querySelector('[data-label="SIZE"] textarea').value;
          const type = row.querySelector('[data-label="TYPE"] textarea').value;
          const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
          const totalPrice = parseFloat(row.querySelector('[data-label="TOTAL PRICE"] input').value) || 0;
  
          orderDetails.push({
            itemDescription,
            itemCode,
            quantity,
            size,
            type,
            unitPrice,
            totalPrice
          });
        });
  
        // Save order details to localStorage
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        localStorage.setItem('remarks', document.getElementById('remarks').value);
  
        // Redirect to Page 3
        window.location.href = 'page3.html';
      });
    }
  
    // Check if we're on the third page
    if (window.location.pathname.includes('page3.html')) {
      // Retrieve data from localStorage
      const formData = JSON.parse(localStorage.getItem('formData'));
      const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
      const remarks = localStorage.getItem('remarks');
  
      // Populate invoice fields
      if (formData) {
        document.getElementById('transaction-date').textContent = formData['transaction-date'];
        document.getElementById('delivery-date').textContent = formData['delivery-date'];
        document.getElementById('invoice-to-name').textContent = formData['account-name'];
        document.getElementById('invoice-to-contact-person').textContent = formData['contact-person'];
        document.getElementById('invoice-to-contact-number').textContent = formData['contact-number'];
        document.getElementById('invoice-to-address').textContent = formData['delivery-address'];
        document.getElementById('order-transmitted').textContent = `Order Transmitted Through: ${formData['order-transmitted']}`;
        document.getElementById('confirmation-attachment').textContent = `Confirmation Attachment: ${formData['confirmation-attachment']}`;
        document.getElementById('delivery-method').textContent = `Delivery Method: ${formData['delivery-method']}`;
        document.getElementById('terms-of-payment').textContent = `Terms of Payment: ${formData['terms-of-payment']}`;
        document.getElementById('payment-transfer-mode').textContent = `Payment Transfer Mode: ${formData['payment-transfer-mode']}`;
        document.getElementById('buyer-type').textContent = `Buyer Type: ${formData['buyer-type']}`;
        document.getElementById('remarks').textContent = remarks;
  
        // Set the generated date and time
        const now = new Date();
        const formattedDateTime = now.toISOString().replace('T', ' ').split('.')[0];
        document.getElementById('generated-on').textContent = formattedDateTime;
      }
  
      // Populate order details
      const invoiceItemsContainer = document.getElementById('invoice-items');
      if (orderDetails) {
        orderDetails.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.itemDescription}</td>
            <td>${item.itemCode}</td>
            <td>${item.quantity}</td>
            <td>${item.size}</td>
            <td>${item.type}</td>
            <td>${item.unitPrice}</td>
            <td>${item.totalPrice.toFixed(2)}</td>
          `;
          invoiceItemsContainer.appendChild(row);
        });
      }
    }
  });
  
  // Function to handle the "Download" button click and download the page as an image
  function downloadInvoiceAsImage() {
    const invoiceElement = document.querySelector('.invoice');
    document.querySelector('.invoice-btns').style.display = 'none'; // Hide buttons
    html2canvas(invoiceElement).then(canvas => {
      document.querySelector('.invoice-btns').style.display = 'flex'; // Show buttons again
      const link = document.createElement('a');
      link.download = 'invoice.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }
  
  // Function to go back
  function goBack() {
    window.history.back();
  }
  
  // Function to submit another invoice
  function submitAnother() {
    localStorage.clear();
    window.location.href = 'index.html';
  }
