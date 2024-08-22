(function () {
    var paymentSectionAdded = false;

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

    function updateDisplayValue(input) {
        var displayInput = input.value;
        var centsInput = displayInput.replace(/\D/g, '');
        var hiddenInput = input.parentNode.querySelector('.prefillValueCents');
        hiddenInput.value = centsInput;
        input.value = formatCurrency(centsInput);
    }

    function formatCurrency(valueInCents) {
        var valueInDollars = (parseFloat(valueInCents) / 100).toFixed(2);
        return '$' + valueInDollars;
    }

    function removeSection(button) {
        var section = button.parentNode;

        if (section.classList.contains('payment-section')) {
            paymentSectionAdded = false;
        }

        section.parentNode.removeChild(section);
    }

    function isValidURL(url) {
        var urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(url);
    }

    function generateLink() {
        var copyButton = document.getElementById('copyButton');
        if (copyButton.textContent === 'Copied') {
            copyButton.textContent = 'Copy';
            copyButton.disabled = false;
        }

        var formLink = document.getElementById('formLink').value.trim();
        if (formLink === '') {
            alert('Please enter the Form Link.');
            return;
        }

        if (!isValidURL(formLink)) {
            alert('Please enter a valid URL for the Form Link.');
            return;
        }

        var fieldSections = Array.from(document.querySelectorAll('.section:not(#formSection)'));
        var allFieldsFilled = fieldSections.every(function (section) {
            var fieldID = section.querySelector('.fieldID').value;
            var prefillValue = section.querySelector('.prefillValue').value;

            if (section.classList.contains('payment-section')) {
                var numericValue = parseFloat(prefillValue.replace(/[^\d.]/g, ''), 10);
                section.querySelector('.prefillValueCents').value = isNaN(numericValue) ? 0 : numericValue * 100;

                if (numericValue < 0.5 || numericValue > 200000) {
                    alert('Payment amount must be between $0.50 and $200000.');
                    return false;
                }
            }

            return fieldID && prefillValue;
        });

        if (!allFieldsFilled) {
            alert('Please fill in all the required fields.');
            return;
        }

        var link = formLink;

        fieldSections.forEach(function (section, index) {
            var fieldIDInput = section.querySelector('.fieldID');
            var fieldID = fieldIDInput.value;

            if (!section.classList.contains('payment-section')) {
                sanitizeFieldID(fieldIDInput);
            }

            var prefillValue = section.querySelector('.prefillValue').value;

            if (index === 0) {
                link += '?';
            } else {
                link += '&';
            }

            var valueToAppend = section.classList.contains('payment-section') ? section.querySelector('.prefillValueCents').value : prefillValue;
            link += fieldID + '=' + valueToAppend;
        });

        var resultSection = document.getElementById('resultSection').querySelector('p');
        resultSection.textContent = link;

        document.getElementById('resultSection').style.display = 'flex';

        if (copyButton.textContent === 'Copied') {
            copyButton.textContent = 'Copy';
            copyButton.disabled = false;
        }

        console.log('Generated Link:', link);
    }

    function copyLink() {
        var linkText = document.getElementById('resultSection').querySelector('p');
        var copyButton = document.getElementById('copyButton');
        clearTimeout(copyButton.timer);

        var tempInput = document.createElement('input');
        tempInput.value = linkText.textContent;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        copyButton.textContent = 'Copied';
        copyButton.disabled = true;
    }

})();
