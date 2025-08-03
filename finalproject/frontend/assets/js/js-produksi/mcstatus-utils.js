// Utility functions for MC Status

// Show loading indicator
function showLoadingIndicator() {
    const loadingHtml = `
        <div id="loading-indicator" class="loading-overlay">
            <div class="loading-content">
                <div class="spinner"></div>
                <p>Loading data from database...</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
}

// Hide loading indicator
function hideLoadingIndicator() {
    const loading = document.getElementById('loading-indicator');
    if (loading) loading.remove();
}

// Show error message
function showErrorMessage(message) {
    const errorHtml = `
        <div id="error-message" class="alert alert-warning" style="margin: 20px;">
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        </div>
    `;
    const container = document.querySelector('.container-fluid');
    if (container) {
        container.insertAdjacentHTML('afterbegin', errorHtml);
        setTimeout(() => {
            const errorEl = document.getElementById('error-message');
            if (errorEl) errorEl.remove();
        }, 5000);
    }
}

// Refresh data from database
async function refreshData() {
    try {
        await loadDataFromDatabase();
        renderMachineCards();
        updateSummaryStats();
        updateLastUpdate();
        console.log('🔄 Data refreshed successfully');
    } catch (error) {
        console.error('❌ Error refreshing data:', error);
    }
}

// Enhanced data submission with database integration
async function submitMachineData() {
    const form = document.getElementById('machineForm');
    const formData = new FormData(form);
    
    const outputData = {
        machine_id: parseInt(formData.get('machine')),
        product_id: parseInt(formData.get('product')),
        operator_id: parseInt(formData.get('operator')),
        quantity_produced: parseInt(formData.get('output')),
        quality_score: parseFloat(formData.get('quality')) || 100,
        status: 'completed',
        shift: parseInt(formData.get('shift')) || 1,
        notes: formData.get('notes') || ''
    };
    
    try {
        showLoadingIndicator();
        
        const result = await dbAPI.createMachineOutput(outputData);
        
        if (result.success) {
            // Refresh data and UI
            await refreshData();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addDataModal'));
            modal.hide();
            
            // Reset form
            form.reset();
            
            showSuccessMessage('Machine output data saved successfully!');
        } else {
            throw new Error(result.error || 'Failed to save data');
        }
    } catch (error) {
        console.error('Error submitting data:', error);
        showErrorMessage('Failed to save data: ' + error.message);
    } finally {
        hideLoadingIndicator();
    }
}

// Show success message
function showSuccessMessage(message) {
    const successHtml = `
        <div id="success-message" class="alert alert-success" style="margin: 20px;">
            <i class="fas fa-check-circle"></i>
            ${message}
        </div>
    `;
    const container = document.querySelector('.container-fluid');
    if (container) {
        container.insertAdjacentHTML('afterbegin', successHtml);
        setTimeout(() => {
            const successEl = document.getElementById('success-message');
            if (successEl) successEl.remove();
        }, 3000);
    }
}
