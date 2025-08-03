/**
 * Index Dashboard JavaScript
 * PT. Topline Evergreen Manufacturing
 * Real-time Manufacturing Dashboard
 */

// Global variables
let dashboardData = {
    wip: [],
    finishedGood: [],
    materials: [],
    machines: []
};

let refreshInterval;
let isOnline = true;

/**
 * Initialize Dashboard
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Index Dashboard loaded');
    initializeDashboard();
    startRealTimeUpdates();
    setupEventListeners();
});

/**
 * Initialize dashboard components
 */
function initializeDashboard() {
    loadAllData();
    updateConnectionStatus();
    console.log('Dashboard initialized successfully');
}

/**
 * Load all dashboard data
 */
async function loadAllData() {
    try {
        showLoadingStates();
        
        // Load data concurrently
        await Promise.allSettled([
            loadWipData(),
            loadFinishedGoodData(),
            loadMaterialData(),
            loadMachineData()
        ]);
        
        updateStatistics();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showErrorMessage('Failed to load dashboard data');
    } finally {
        hideLoadingStates();
    }
}

/**
 * Load WIP Stock data
 */
async function loadWipData() {
    try {
        // Replace with actual API endpoint
        const response = await fetch('/api/stock/wip');
        if (response.ok) {
            dashboardData.wip = await response.json();
        } else {
            throw new Error('Failed to load WIP data');
        }
    } catch (error) {
        console.error('Error loading WIP data:', error);
        // Load dummy data for demo
        dashboardData.wip = generateDummyWipData();
    }
    renderWipTable();
}

/**
 * Load Finished Good data
 */
async function loadFinishedGoodData() {
    try {
        const response = await fetch('/api/stock/finished-good');
        if (response.ok) {
            dashboardData.finishedGood = await response.json();
        } else {
            throw new Error('Failed to load Finished Good data');
        }
    } catch (error) {
        console.error('Error loading Finished Good data:', error);
        dashboardData.finishedGood = generateDummyFgData();
    }
    renderFinishedGoodTable();
}

/**
 * Load Material data
 */
async function loadMaterialData() {
    try {
        const response = await fetch('/api/stock/materials');
        if (response.ok) {
            dashboardData.materials = await response.json();
        } else {
            throw new Error('Failed to load Material data');
        }
    } catch (error) {
        console.error('Error loading Material data:', error);
        dashboardData.materials = generateDummyMaterialData();
    }
    renderMaterialTable();
}

/**
 * Load Machine Status data
 */
async function loadMachineData() {
    try {
        const response = await fetch('/api/machines/status');
        if (response.ok) {
            dashboardData.machines = await response.json();
        } else {
            throw new Error('Failed to load Machine data');
        }
    } catch (error) {
        console.error('Error loading Machine data:', error);
        dashboardData.machines = generateDummyMachineData();
    }
    renderMachineTable();
}

/**
 * Generate dummy WIP data
 */
function generateDummyWipData() {
    return [
        {
            itemCode: 'WIP-001',
            description: 'Steel Bracket WIP',
            qty: 1250,
            unit: 'PCS',
            location: 'PROD-LINE-01',
            lastUpdate: new Date().toISOString(),
            status: 'In Process'
        },
        {
            itemCode: 'WIP-002',
            description: 'Aluminum Housing WIP',
            qty: 850,
            unit: 'PCS',
            location: 'PROD-LINE-02',
            lastUpdate: new Date().toISOString(),
            status: 'In Process'
        },
        {
            itemCode: 'WIP-003',
            description: 'Plastic Cover WIP',
            qty: 2100,
            unit: 'PCS',
            location: 'PROD-LINE-03',
            lastUpdate: new Date().toISOString(),
            status: 'In Process'
        }
    ];
}

/**
 * Generate dummy Finished Good data
 */
function generateDummyFgData() {
    return [
        {
            productCode: 'FG-001',
            description: 'Steel Bracket Complete',
            currentStock: 5500,
            minimumStock: 2000,
            deliverySchedule: '2025-02-05',
            status: 'Normal',
            lastUpdate: new Date().toISOString()
        },
        {
            productCode: 'FG-002',
            description: 'Aluminum Housing Complete',
            currentStock: 1200,
            minimumStock: 1500,
            deliverySchedule: '2025-02-04',
            status: 'Low',
            lastUpdate: new Date().toISOString()
        },
        {
            productCode: 'FG-003',
            description: 'Plastic Cover Complete',
            currentStock: 800,
            minimumStock: 1000,
            deliverySchedule: '2025-02-03',
            status: 'Critical',
            lastUpdate: new Date().toISOString()
        }
    ];
}

/**
 * Generate dummy Material data
 */
function generateDummyMaterialData() {
    return [
        {
            materialCode: 'MAT-001',
            description: 'Steel Sheet 1.5mm',
            type: 'Raw Material',
            currentStock: 15000,
            minimumStock: 5000,
            arrivalSchedule: '2025-02-06',
            supplier: 'Steel Corp Indonesia',
            status: 'Normal'
        },
        {
            materialCode: 'COM-001',
            description: 'Bolts M6x20',
            type: 'Component',
            currentStock: 2500,
            minimumStock: 3000,
            arrivalSchedule: '2025-02-04',
            supplier: 'Fastener Ltd',
            status: 'Low'
        }
    ];
}

/**
 * Generate dummy Machine data
 */
function generateDummyMachineData() {
    return [
        {
            machineId: 'INJ-001',
            machineName: 'Injection Machine #1',
            status: 'Running',
            currentProduct: 'Steel Bracket',
            operator: 'John Doe',
            startTime: '07:00',
            targetOutput: 500,
            actualOutput: 420,
            efficiency: 84
        },
        {
            machineId: 'INJ-002',
            machineName: 'Injection Machine #2',
            status: 'Running',
            currentProduct: 'Aluminum Housing',
            operator: 'Jane Smith',
            startTime: '07:00',
            targetOutput: 300,
            actualOutput: 285,
            efficiency: 95
        },
        {
            machineId: 'INJ-003',
            machineName: 'Injection Machine #3',
            status: 'Maintenance',
            currentProduct: '-',
            operator: 'Bob Wilson',
            startTime: '-',
            targetOutput: 0,
            actualOutput: 0,
            efficiency: 0
        }
    ];
}

/**
 * Render WIP table
 */
function renderWipTable() {
    const tableBody = document.getElementById('wipTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = dashboardData.wip.map(item => `
        <tr>
            <td><strong>${item.itemCode}</strong></td>
            <td>${item.description}</td>
            <td><strong>${item.qty.toLocaleString()}</strong></td>
            <td>${item.unit}</td>
            <td>${item.location}</td>
            <td>${formatDateTime(item.lastUpdate)}</td>
            <td><span class="status-badge status-normal">${item.status}</span></td>
        </tr>
    `).join('');
}

/**
 * Render Finished Good table
 */
function renderFinishedGoodTable() {
    const tableBody = document.getElementById('fgTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = dashboardData.finishedGood.map(item => `
        <tr>
            <td><strong>${item.productCode}</strong></td>
            <td>${item.description}</td>
            <td><strong>${item.currentStock.toLocaleString()}</strong></td>
            <td>${item.minimumStock.toLocaleString()}</td>
            <td>${formatDate(item.deliverySchedule)}</td>
            <td>${getStockAlert(item.currentStock, item.minimumStock, item.status)}</td>
            <td>${formatDateTime(item.lastUpdate)}</td>
        </tr>
    `).join('');
}

/**
 * Render Material table
 */
function renderMaterialTable() {
    const tableBody = document.getElementById('materialTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = dashboardData.materials.map(item => `
        <tr>
            <td><strong>${item.materialCode}</strong></td>
            <td>${item.description}</td>
            <td><span class="status-badge status-normal">${item.type}</span></td>
            <td><strong>${item.currentStock.toLocaleString()}</strong></td>
            <td>${item.minimumStock.toLocaleString()}</td>
            <td>${formatDate(item.arrivalSchedule)}</td>
            <td>${item.supplier}</td>
            <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
        </tr>
    `).join('');
}

/**
 * Render Machine table
 */
function renderMachineTable() {
    const tableBody = document.getElementById('machineTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = dashboardData.machines.map(item => `
        <tr>
            <td><strong>${item.machineId}</strong></td>
            <td>${item.machineName}</td>
            <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
            <td>${item.currentProduct}</td>
            <td>${item.operator}</td>
            <td>${item.startTime}</td>
            <td>${item.targetOutput.toLocaleString()}</td>
            <td><strong>${item.actualOutput.toLocaleString()}</strong></td>
            <td><strong>${item.efficiency}%</strong></td>
        </tr>
    `).join('');
}

/**
 * Update statistics cards
 */
function updateStatistics() {
    // WIP Stock
    const totalWip = dashboardData.wip.reduce((sum, item) => sum + item.qty, 0);
    updateStatElement('totalWipStock', totalWip.toLocaleString());

    // FG Stock
    const totalFg = dashboardData.finishedGood.reduce((sum, item) => sum + item.currentStock, 0);
    updateStatElement('totalFgStock', totalFg.toLocaleString());

    // Material Stock
    const totalMaterial = dashboardData.materials.reduce((sum, item) => sum + item.currentStock, 0);
    updateStatElement('totalMaterialStock', totalMaterial.toLocaleString());

    // Running Machines
    const runningMachines = dashboardData.machines.filter(machine => machine.status === 'Running').length;
    const totalMachines = dashboardData.machines.length;
    updateStatElement('runningMachines', `${runningMachines}/${totalMachines}`);
}

/**
 * Update stat element
 */
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Get stock alert
 */
function getStockAlert(current, minimum, status) {
    if (status === 'Critical' || current < minimum * 0.5) {
        return '<span class="alert-low">🚨 Critical Low</span>';
    } else if (status === 'Low' || current <= minimum) {
        return '<span class="alert-low">⚠️ Low Stock</span>';
    }
    return '<span class="alert-normal">✅ Normal</span>';
}

/**
 * Format date
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID');
}

/**
 * Format date time
 */
function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('id-ID');
}

/**
 * Show loading states
 */
function showLoadingStates() {
    const tables = ['wipTableBody', 'fgTableBody', 'materialTableBody', 'machineTableBody'];
    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (table) {
            table.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 2rem;"><div class="loading"></div> Loading data...</td></tr>';
        }
    });
}

/**
 * Hide loading states
 */
function hideLoadingStates() {
    // Loading akan hilang saat data dirender
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Department cards hover effects
    setupDepartmentCards();
    
    // Refresh buttons
    setupRefreshButtons();
}

/**
 * Setup department cards
 */
function setupDepartmentCards() {
    const departmentCards = document.querySelectorAll('.department-card');
    departmentCards.forEach(card => {
        card.addEventListener('click', (e) => {
            console.log('Navigating to:', card.href);
        });
    });
}

/**
 * Setup refresh buttons
 */
function setupRefreshButtons() {
    // Auto-bind refresh functions to global scope if needed
    window.refreshWipData = () => loadWipData();
    window.refreshFgData = () => loadFinishedGoodData();
    window.refreshMaterialData = () => loadMaterialData();
    window.refreshMachineData = () => loadMachineData();
    
    // Export functions
    window.exportWipCSV = () => exportToCSV(dashboardData.wip, 'wip-stock');
    window.exportFgCSV = () => exportToCSV(dashboardData.finishedGood, 'finished-good-stock');
    window.exportMaterialCSV = () => exportToCSV(dashboardData.materials, 'material-stock');
    window.exportMachineCSV = () => exportToCSV(dashboardData.machines, 'machine-status');
}

/**
 * Start real-time updates
 */
function startRealTimeUpdates() {
    // Update every 30 seconds
    refreshInterval = setInterval(() => {
        if (isOnline) {
            loadAllData();
        }
    }, 30000);
}

/**
 * Update connection status
 */
function updateConnectionStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-indicator');
    
    if (isOnline) {
        if (statusDot) statusDot.style.background = '#22c55e';
        if (statusText) statusText.classList.add('online');
    } else {
        if (statusDot) statusDot.style.background = '#ef4444';
        if (statusText) statusText.classList.add('offline');
    }
}

/**
 * Export to CSV
 */
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        });
        csvContent += values.join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Exported ${filename} to CSV`);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    console.error(message);
    // You can implement a toast or notification system here
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});

// Export main functions for global access
window.loadAllData = loadAllData;
