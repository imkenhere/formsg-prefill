// Function definitions
function addSection() {
    var sections = document.querySelectorAll('.section');
    var lastSection = sections[sections.length - 1];

    var newSection = document.createElement('div');
    newSection.className = 'section';
    newSection.innerHTML = `
        <input type="text" class="fieldID" placeholder="Enter Field ID" oninput="sanitizeFieldID(this)">
        <input type="text" class="prefillValue" placeholder="Enter Prefill Value">
        <button onclick="removeSection(this)" class="removeButton">−</button>
    `;

    lastSection.insertAdjacentElement('afterend', newSection);
}

function sanitizeFieldID(input) {
    // Replace non-alphanumeric characters with an empty string
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
}

function updatePaymentValue(input) {
    var numericValue = input.value.replace(/\D/g, '');
    input.value = numericValue === '' ? '$0' : '$' + parseInt(numericValue, 10);
}

function addPaymentSection() {
    if (paymentSectionAdded) {
        alert('Only one payment prefill is allowed.');
        return;
    }

    var sections = document.querySelectorAll('.section');
    var lastSection = sections[sections.length - 1];

    var newSection = document.createElement('div');
    newSection.className = 'section';
    newSection.innerHTML = `
        <div class="section-content">
            <input type="text" class="fieldID" value="payment_variable_input_amount_field_id" disabled>
            <input type="text" class="prefillValue paymentInput" placeholder="Enter amount in cents" value="$0.00" oninput="updateDisplayValue(this)">
            <input type="hidden" class="prefillValueCents" name="payment_variable_input_amount_field_id" value="0">
        </div>
        <button onclick="removeSection(this)" class="removeButton">−</button>
    `;

    newSection.classList.add('payment-section');

    lastSection.insertAdjacentElement('afterend', newSection);

    paymentSectionAdded = true;
}

// Add other function definitions here

// Attach event handlers after the page has fully loaded
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addButton").addEventListener("click", addSection);
    document.getElementById("paymentButton").addEventListener("click", addPaymentSection);
    document.getElementById("generateButton").addEventListener("click", generateLink);
    document.getElementById("copyButton").addEventListener("click", copyLink);
});
