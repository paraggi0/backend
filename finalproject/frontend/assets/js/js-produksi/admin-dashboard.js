/**
 * Admin Dashboard JavaScript
 * PT. Topline Evergreen Manufacturing - Complete CRUD Operations
 */

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';
const MOBILE_API_URL = 'http://localhost:3001/api/mobile';

// Global variables
let currentTab = 'machines';
let currentEditId = null;
let currentEditType = null;

// Data storage
let machinesData = [];
let productsData = [];
let operatorsData = [];
let outputsData = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Dashboard initializing...');
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load initial data
    loadAllData();
    
    // Set up auto-refresh every 30 seconds
    setInterval(loadAllData, 30000);
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Load all data
async function loadAllData() {
    try {
        showLoading();
        
        // Load data from APIs
        const [machinesResult, productsResult, operatorsResult, outputsResult] = await Promise.all([
            fetch(`${API_BASE_URL}/v1/production/machines`).then(r => r.json()),
            fetch(`${API_BASE_URL}/v1/production/products`).then(r => r.json()),
            fetch(`${API_BASE_URL}/v1/production/operators`).then(r => r.json()),
            fetch(`${API_BASE_URL}/v1/production/outputs`).then(r => r.json())
        ]);
        
        // Store data
        machinesData = machinesResult?.data || [];
        productsData = productsResult?.data || [];
        operatorsData = operatorsResult?.data || [];
        outputsData = outputsResult?.data || [];
        
        // Update statistics
        updateStatistics();
        
        // Render current tab
        renderCurrentTab();
        
        hideLoading();
        console.log('✅ All data loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        hideLoading();
        showNotification('Error loading data: ' + error.message, 'error');
    }
}

// Update statistics
function updateStatistics() {
    document.getElementById('totalMachines').textContent = machinesData.length;
    document.getElementById('totalProducts').textContent = productsData.length;
    document.getElementById('totalOperators').textContent = operatorsData.length;
    document.getElementById('mobileUsers').textContent = Math.floor(Math.random() * 25) + 5; // Simulated
}

// Tab management
function showTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
    
    currentTab = tabName;
    renderCurrentTab();
}

// Render current tab content
function renderCurrentTab() {
    switch(currentTab) {
        case 'machines':
            renderMachinesTable();
            break;
        case 'products':
            renderProductsTable();
            break;
        case 'operators':
            renderOperatorsTable();
            break;
        case 'outputs':
            renderOutputsTable();
            break;
        case 'mobile':
            renderMobileStats();
            break;
    }
}

// Render machines table
function renderMachinesTable() {
    const tbody = document.getElementById('machinesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = machinesData.map(machine => `
        <tr>
            <td>${machine.id}</td>
            <td><strong>${machine.machine_code}</strong></td>
            <td>${machine.machine_type}</td>
            <td><span class="status-badge ${machine.status}">${machine.status}</span></td>
            <td>${machine.capacity_per_hour} pcs/h</td>
            <td>${machine.location || 'Production Floor'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editMachine(${machine.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete" onclick="deleteMachine(${machine.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render products table
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = productsData.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><strong>${product.product_code}</strong></td>
            <td>${product.product_name}</td>
            <td>${product.product_type}</td>
            <td><span class="status-badge ${product.status}">${product.status}</span></td>
            <td>${new Date(product.created_at).toLocaleDateString('id-ID')}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render operators table
function renderOperatorsTable() {
    const tbody = document.getElementById('operatorsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = operatorsData.map(operator => `
        <tr>
            <td>${operator.id}</td>
            <td><strong>${operator.operator_code}</strong></td>
            <td>${operator.operator_name}</td>
            <td>${operator.department}</td>
            <td>${operator.shift}</td>
            <td><span class="status-badge ${operator.status}">${operator.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editOperator(${operator.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete" onclick="deleteOperator(${operator.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render outputs table
function renderOutputsTable() {
    const tbody = document.getElementById('outputsTableBody');
    if (!tbody) return;
    
    const displayOutputs = outputsData.slice(0, 50); // Show latest 50
    
    tbody.innerHTML = displayOutputs.map(output => {
        const machine = machinesData.find(m => m.id === output.machine_id);
        const product = productsData.find(p => p.id === output.product_id);
        const operator = operatorsData.find(o => o.id === output.operator_id);
        const efficiency = output.target_quantity > 0 ? 
            Math.round((output.actual_quantity / output.target_quantity) * 100) : 0;
        
        return `
            <tr>
                <td>${output.id}</td>
                <td>${machine?.machine_code || 'N/A'}</td>
                <td>${product?.product_name || 'N/A'}</td>
                <td>${operator?.operator_name || 'N/A'}</td>
                <td><strong>${output.actual_quantity}</strong></td>
                <td>${output.target_quantity}</td>
                <td><span class="status-badge ${efficiency >= 90 ? 'active' : efficiency >= 70 ? 'maintenance' : 'inactive'}">${efficiency}%</span></td>
                <td>${new Date(output.created_at).toLocaleDateString('id-ID')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewOutput(${output.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="action-btn delete" onclick="deleteOutput(${output.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Render mobile stats
function renderMobileStats() {
    // Update mobile API statistics
    document.getElementById('apiCallsToday').textContent = Math.floor(Math.random() * 500) + 100;
    document.getElementById('activeSessions').textContent = Math.floor(Math.random() * 15) + 5;
    document.getElementById('lastMobileUpdate').textContent = new Date().toLocaleTimeString('id-ID');
}

// Modal management
function openMachineModal(machineId = null) {
    const modal = document.getElementById('crudModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    currentEditType = 'machine';
    currentEditId = machineId;
    
    modalTitle.textContent = machineId ? 'Edit Machine' : 'Add New Machine';
    
    const machine = machineId ? machinesData.find(m => m.id === machineId) : {};
    
    modalBody.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="machineCode">Machine Code *</label>
                <input type="text" id="machineCode" value="${machine.machine_code || ''}" required>
            </div>
            <div class="form-group">
                <label for="machineType">Machine Type *</label>
                <select id="machineType" required>
                    <option value="">Select Type</option>
                    <option value="CNC" ${machine.machine_type === 'CNC' ? 'selected' : ''}>CNC</option>
                    <option value="Assembly" ${machine.machine_type === 'Assembly' ? 'selected' : ''}>Assembly</option>
                    <option value="Packaging" ${machine.machine_type === 'Packaging' ? 'selected' : ''}>Packaging</option>
                    <option value="QC" ${machine.machine_type === 'QC' ? 'selected' : ''}>Quality Control</option>
                </select>
            </div>
            <div class="form-group">
                <label for="capacity">Capacity per Hour *</label>
                <input type="number" id="capacity" value="${machine.capacity_per_hour || ''}" required>
            </div>
            <div class="form-group">
                <label for="status">Status *</label>
                <select id="status" required>
                    <option value="running" ${machine.status === 'running' ? 'selected' : ''}>Running</option>
                    <option value="maintenance" ${machine.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                    <option value="stopped" ${machine.status === 'stopped' ? 'selected' : ''}>Stopped</option>
                </select>
            </div>
            <div class="form-group">
                <label for="location">Location</label>
                <input type="text" id="location" value="${machine.location || 'Production Floor'}">
            </div>
            <div class="form-group">
                <label for="notes">Notes</label>
                <textarea id="notes" rows="3">${machine.notes || ''}</textarea>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('crudModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    currentEditType = 'product';
    currentEditId = productId;
    
    modalTitle.textContent = productId ? 'Edit Product' : 'Add New Product';
    
    const product = productId ? productsData.find(p => p.id === productId) : {};
    
    modalBody.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="productCode">Product Code *</label>
                <input type="text" id="productCode" value="${product.product_code || ''}" required>
            </div>
            <div class="form-group">
                <label for="productName">Product Name *</label>
                <input type="text" id="productName" value="${product.product_name || ''}" required>
            </div>
            <div class="form-group">
                <label for="productType">Product Type *</label>
                <select id="productType" required>
                    <option value="">Select Type</option>
                    <option value="Raw Material" ${product.product_type === 'Raw Material' ? 'selected' : ''}>Raw Material</option>
                    <option value="Semi Finished" ${product.product_type === 'Semi Finished' ? 'selected' : ''}>Semi Finished</option>
                    <option value="Finished Product" ${product.product_type === 'Finished Product' ? 'selected' : ''}>Finished Product</option>
                </select>
            </div>
            <div class="form-group">
                <label for="productStatus">Status *</label>
                <select id="productStatus" required>
                    <option value="active" ${product.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${product.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                </select>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" rows="3">${product.description || ''}</textarea>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function openOperatorModal(operatorId = null) {
    const modal = document.getElementById('crudModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    currentEditType = 'operator';
    currentEditId = operatorId;
    
    modalTitle.textContent = operatorId ? 'Edit Operator' : 'Add New Operator';
    
    const operator = operatorId ? operatorsData.find(o => o.id === operatorId) : {};
    
    modalBody.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="operatorCode">Operator Code *</label>
                <input type="text" id="operatorCode" value="${operator.operator_code || ''}" required>
            </div>
            <div class="form-group">
                <label for="operatorName">Operator Name *</label>
                <input type="text" id="operatorName" value="${operator.operator_name || ''}" required>
            </div>
            <div class="form-group">
                <label for="department">Department *</label>
                <select id="department" required>
                    <option value="">Select Department</option>
                    <option value="Production" ${operator.department === 'Production' ? 'selected' : ''}>Production</option>
                    <option value="Quality Control" ${operator.department === 'Quality Control' ? 'selected' : ''}>Quality Control</option>
                    <option value="Maintenance" ${operator.department === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                    <option value="Packaging" ${operator.department === 'Packaging' ? 'selected' : ''}>Packaging</option>
                </select>
            </div>
            <div class="form-group">
                <label for="shift">Shift *</label>
                <select id="shift" required>
                    <option value="shift_1" ${operator.shift === 'shift_1' ? 'selected' : ''}>Shift 1</option>
                    <option value="shift_2" ${operator.shift === 'shift_2' ? 'selected' : ''}>Shift 2</option>
                    <option value="shift_3" ${operator.shift === 'shift_3' ? 'selected' : ''}>Shift 3</option>
                </select>
            </div>
            <div class="form-group">
                <label for="operatorStatus">Status *</label>
                <select id="operatorStatus" required>
                    <option value="active" ${operator.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${operator.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                </select>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Edit functions
function editMachine(machineId) {
    openMachineModal(machineId);
}

function editProduct(productId) {
    openProductModal(productId);
}

function editOperator(operatorId) {
    openOperatorModal(operatorId);
}

// Delete functions
async function deleteMachine(machineId) {
    if (!confirm('Are you sure you want to delete this machine?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/v1/production/machines/${machineId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Machine deleted successfully', 'success');
            loadAllData();
        } else {
            throw new Error('Failed to delete machine');
        }
    } catch (error) {
        showNotification('Error deleting machine: ' + error.message, 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/v1/production/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Product deleted successfully', 'success');
            loadAllData();
        } else {
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        showNotification('Error deleting product: ' + error.message, 'error');
    }
}

async function deleteOperator(operatorId) {
    if (!confirm('Are you sure you want to delete this operator?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/v1/production/operators/${operatorId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Operator deleted successfully', 'success');
            loadAllData();
        } else {
            throw new Error('Failed to delete operator');
        }
    } catch (error) {
        showNotification('Error deleting operator: ' + error.message, 'error');
    }
}

// Save record
async function saveRecord() {
    try {
        let data = {};
        let url = '';
        let method = 'POST';
        
        if (currentEditType === 'machine') {
            data = {
                machine_code: document.getElementById('machineCode').value,
                machine_type: document.getElementById('machineType').value,
                capacity_per_hour: parseInt(document.getElementById('capacity').value),
                status: document.getElementById('status').value,
                location: document.getElementById('location').value,
                notes: document.getElementById('notes').value
            };
            
            if (currentEditId) {
                url = `${API_BASE_URL}/v1/production/machines/${currentEditId}`;
                method = 'PUT';
            } else {
                url = `${API_BASE_URL}/v1/production/machines`;
            }
        } else if (currentEditType === 'product') {
            data = {
                product_code: document.getElementById('productCode').value,
                product_name: document.getElementById('productName').value,
                product_type: document.getElementById('productType').value,
                status: document.getElementById('productStatus').value,
                description: document.getElementById('description').value
            };
            
            if (currentEditId) {
                url = `${API_BASE_URL}/v1/production/products/${currentEditId}`;
                method = 'PUT';
            } else {
                url = `${API_BASE_URL}/v1/production/products`;
            }
        } else if (currentEditType === 'operator') {
            data = {
                operator_code: document.getElementById('operatorCode').value,
                operator_name: document.getElementById('operatorName').value,
                department: document.getElementById('department').value,
                shift: document.getElementById('shift').value,
                status: document.getElementById('operatorStatus').value
            };
            
            if (currentEditId) {
                url = `${API_BASE_URL}/v1/production/operators/${currentEditId}`;
                method = 'PUT';
            } else {
                url = `${API_BASE_URL}/v1/production/operators`;
            }
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification(`${currentEditType} ${currentEditId ? 'updated' : 'created'} successfully`, 'success');
            closeModal();
            loadAllData();
        } else {
            throw new Error(`Failed to ${currentEditId ? 'update' : 'create'} ${currentEditType}`);
        }
        
    } catch (error) {
        showNotification(`Error saving ${currentEditType}: ` + error.message, 'error');
    }
}

// Modal functions
function closeModal() {
    document.getElementById('crudModal').classList.remove('show');
    currentEditId = null;
    currentEditType = null;
}

// Utility functions
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Test mobile API
async function testMobileAPI() {
    try {
        showLoading();
        
        const response = await fetch(`${MOBILE_API_URL}/dashboard`, {
            headers: {
                'x-api-key': 'mobile-android-2025'
            }
        });
        
        const result = await response.json();
        
        hideLoading();
        
        if (response.ok) {
            showNotification('Mobile API test successful!', 'success');
            console.log('Mobile API Response:', result);
        } else {
            throw new Error(result.message || 'API test failed');
        }
        
    } catch (error) {
        hideLoading();
        showNotification('Mobile API test failed: ' + error.message, 'error');
    }
}

// Refresh all data
function refreshAllData() {
    loadAllData();
    showNotification('Data refreshed successfully', 'success');
}

// Export outputs
function exportOutputs() {
    const csvData = [
        ['ID', 'Machine', 'Product', 'Operator', 'Actual Qty', 'Target Qty', 'Efficiency', 'Date'],
        ...outputsData.map(output => {
            const machine = machinesData.find(m => m.id === output.machine_id);
            const product = productsData.find(p => p.id === output.product_id);
            const operator = operatorsData.find(o => o.id === output.operator_id);
            const efficiency = output.target_quantity > 0 ? 
                Math.round((output.actual_quantity / output.target_quantity) * 100) : 0;
            
            return [
                output.id,
                machine?.machine_code || 'N/A',
                product?.product_name || 'N/A',
                operator?.operator_name || 'N/A',
                output.actual_quantity,
                output.target_quantity,
                efficiency + '%',
                new Date(output.created_at).toLocaleDateString('id-ID')
            ];
        })
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `machine_outputs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Output data exported successfully', 'success');
}
