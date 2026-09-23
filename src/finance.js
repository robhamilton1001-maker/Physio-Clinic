// Finance & Invoicing Logic

let financeSettings = {
    clinic_name: 'My Physio Clinic',
    tax_rate: 0,
    default_service_price: 100
};

document.addEventListener('DOMContentLoaded', async () => {
    // Load Settings
    try {
        const settings = await window.api.getSettings();
        if (settings) {
            financeSettings = settings;
            populateSettingsForm();
        }
    } catch (error) {
        console.error("Error loading settings in finance", error);
    }

    // Settings form submission
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newSettings = {
                clinic_name: document.getElementById('set-clinic-name').value,
                logo_path: document.getElementById('set-logo-path').value,
                default_service_price: parseFloat(document.getElementById('set-default-price').value),
                tax_rate: parseFloat(document.getElementById('set-tax-rate').value)
            };

            try {
                await window.api.updateSettings(newSettings);
                financeSettings = newSettings;
                alert("Settings saved successfully.");
            } catch (error) {
                console.error("Failed to save settings", error);
                alert("Failed to save settings.");
            }
        });
    }

    // Auto calculate totals on input
    const basePriceInput = document.getElementById('inv-base-price');
    if (basePriceInput) {
        basePriceInput.addEventListener('input', calculateInvoiceTotals);
    }
});

async function createNewInvoice() {
    document.getElementById('finance-empty-state').classList.add('hidden');
    document.getElementById('invoice-builder').classList.remove('hidden');
    document.getElementById('invoice-builder').classList.add('flex');

    // Populate Clinic Name
    document.getElementById('inv-clinic-name').innerText = financeSettings.clinic_name;

    // Set Default Date to Today
    document.getElementById('inv-date').valueAsDate = new Date();

    // Populate Default Price
    document.getElementById('inv-base-price').value = financeSettings.default_service_price;
    document.getElementById('inv-tax-rate').innerText = financeSettings.tax_rate;

    // Populate Patients
    try {
        const select = document.getElementById('inv-patient-select');
        select.innerHTML = '<option value="">Select a patient...</option>';
        const patients = await window.api.getPatients();
        patients.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = `${p.first_name} ${p.last_name}`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Error loading patients for invoice", error);
    }

    calculateInvoiceTotals();
}

function calculateInvoiceTotals() {
    const subtotal = parseFloat(document.getElementById('inv-base-price').value || 0);
    const taxRate = parseFloat(financeSettings.tax_rate || 0);

    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    document.getElementById('inv-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('inv-tax-amount').innerText = `$${taxAmount.toFixed(2)}`;
    document.getElementById('inv-total').innerText = `$${total.toFixed(2)}`;
}

function populateSettingsForm() {
    if (document.getElementById('set-clinic-name')) {
        document.getElementById('set-clinic-name').value = financeSettings.clinic_name || '';
        document.getElementById('set-logo-path').value = financeSettings.logo_path || '';
        document.getElementById('set-default-price').value = financeSettings.default_service_price || 0;
        document.getElementById('set-tax-rate').value = financeSettings.tax_rate || 0;
    }
}

function cancelInvoice() {
    document.getElementById('finance-empty-state').classList.remove('hidden');
    document.getElementById('invoice-builder').classList.add('hidden');
    document.getElementById('invoice-builder').classList.remove('flex');
}

async function saveAndPrintInvoice() {
    const patientId = document.getElementById('inv-patient-select').value;
    const date = document.getElementById('inv-date').value;
    const totalStr = document.getElementById('inv-total').innerText.replace('$', '');
    const amount = parseFloat(totalStr);

    if (!patientId) {
        alert("Please select a patient.");
        return;
    }

    if (!date) {
        alert("Please select a date.");
        return;
    }

    try {
        await window.api.createInvoice({
            patient_id: patientId,
            date: date,
            amount: amount,
            status: 'paid'
        });

        // Generate PDF
        const patientName = document.getElementById('inv-patient-select').options[document.getElementById('inv-patient-select').selectedIndex].text;
        const subtotal = document.getElementById('inv-subtotal').innerText;
        const tax = document.getElementById('inv-tax-amount').innerText;
        const total = document.getElementById('inv-total').innerText;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
                    h1 { color: #1a56db; margin: 0; }
                    .details { margin-bottom: 40px; line-height: 1.6; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    th { text-align: left; padding: 10px; background: #f9fafb; border-bottom: 1px solid #ddd; }
                    td { padding: 10px; border-bottom: 1px solid #eee; }
                    .totals { text-align: right; width: 300px; float: right; }
                    .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
                    .totals .total-line { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>${financeSettings.clinic_name}</h1>
                        <p>Invoice</p>
                    </div>
                    <div style="text-align: right;">
                        <p>Date: ${date}</p>
                    </div>
                </div>

                <div class="details">
                    <strong>Bill To:</strong><br>
                    ${patientName}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Physiotherapy Consultation</td>
                            <td style="text-align: right;">$${document.getElementById('inv-base-price').value}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="totals">
                    <div><span>Subtotal:</span> <span>${subtotal}</span></div>
                    <div><span>Tax (${financeSettings.tax_rate}%):</span> <span>${tax}</span></div>
                    <div class="total-line"><span>Total:</span> <span>${total}</span></div>
                </div>
            </body>
            </html>
        `;

        const result = await window.api.generatePDF(htmlContent, `Invoice_${patientName.replace(' ', '_')}`);

        if (result.success) {
            alert(`Invoice saved successfully and PDF generated at:\n${result.path}`);
        } else {
            alert("Invoice saved, but PDF generation failed: " + result.error);
        }

        cancelInvoice();
    } catch (error) {
        console.error("Error saving invoice", error);
        alert("Failed to save invoice.");
    }
}
