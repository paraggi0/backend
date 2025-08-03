/**
 * QC Dashboard JavaScript
 * PT. Topline Evergreen Manufacturing
 * Quality Control Management System
 */

// Global variables
let qcData = {
    iqc: [],
    oqc: [], 
    rqc: [],
    ngqc: []
};

let isOnline = true;
let autoRefreshInterval;

/**
 * Initialize QC Dashboard
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('QC Dashboard loaded');
    
    // Initialize dashboard
    initializeDashboard();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize dashboard components
 */
function initializeDashboard() {
    // Load QC data
    loadQCData();
    
    // Update statistics
    updateQCStatistics();
    
    // Initialize connection indicator
    updateConnectionStatus();
    
    console.log('QC Dashboard initialized successfully');
}

/**
 * Load QC data from API
 */
async function loadQCData() {
    try {
        showLoading();
        
        // Simulate API calls - replace with actual API endpoints
        const responses = await Promise.allSettled([
            fetch('/api/qc/iqc'),
            fetch('/api/qc/oqc'),
            fetch('/api/qc/rqc'),
            fetch('/api/qc/ng-qc')
        ]);
        
        // Process responses
        if (responses[0].status === 'fulfilled') {
            qcData.iqc = await responses[0].value.json();
        }
        if (responses[1].status === 'fulfilled') {
            qcData.oqc = await responses[1].value.json();
        }
        if (responses[2].status === 'fulfilled') {
            qcData.rqc = await responses[2].value.json();
        }
        if (responses[3].status === 'fulfilled') {
            qcData.ngqc = await responses[3].value.json();
        }
        
        updateQCStatistics();
        
    } catch (error) {
        console.error('Error loading QC data:', error);
        // Use dummy data for demo
        loadDummyData();
    } finally {
        hideLoading();
    }
}

/**
 * Load dummy data for demonstration
 */
function loadDummyData() {
    qcData = {
        iqc: generateDummyIQCData(),
        oqc: generateDummyOQCData(),
        rqc: generateDummyRQCData(),
        ngqc: generateDummyNGQCData()
    };
    
    updateQCStatistics();
}

/**
 * Generate dummy IQC data
 */
function generateDummyIQCData() {
    return [
        { id: 'IQC001', item: 'RAW-MAT-001', status: 'Passed', date: new Date().toISOString() },
        { id: 'IQC002', item: 'RAW-MAT-002', status: 'Pending', date: new Date().toISOString() },
        { id: 'IQC003', item: 'RAW-MAT-003', status: 'Rejected', date: new Date().toISOString() }
    ];
}

/**
 * Generate dummy OQC data
 */
function generateDummyOQCData() {
    return [
        { id: 'OQC001', product: 'PROD-001', status: 'Passed', date: new Date().toISOString() },
        { id: 'OQC002', product: 'PROD-002', status: 'Passed', date: new Date().toISOString() },
        { id: 'OQC003', product: 'PROD-003', status: 'Pending', date: new Date().toISOString() }
    ];
}

/**
 * Generate dummy RQC data
 */
function generateDummyRQCData() {
    return [
        { id: 'RQC001', product: 'PROD-001', reason: 'Customer complaint', status: 'Analyzing', date: new Date().toISOString() },
        { id: 'RQC002', product: 'PROD-002', reason: 'Defect found', status: 'Completed', date: new Date().toISOString() }
    ];
}

/**
 * Generate dummy NG QC data
 */
function generateDummyNGQCData() {
    return [
        { id: 'NG001', product: 'PROD-001', defect: 'Surface defect', status: 'Rework', date: new Date().toISOString() },
        { id: 'NG002', product: 'PROD-002', defect: 'Dimension issue', status: 'Scrap', date: new Date().toISOString() }
    ];
}

/**
 * Update QC statistics
 */
function updateQCStatistics() {
    // This would typically come from the actual data
    // For now, using simulated values
    updateStatCard('total-inspections', Math.floor(Math.random() * 100) + 1200);
    updateStatCard('pass-rate', (Math.random() * 2 + 96).toFixed(1) + '%');
    updateStatCard('reject-count', Math.floor(Math.random() * 20) + 20);
    updateStatCard('pending-count', Math.floor(Math.random() * 10) + 10);
}

/**
 * Update individual stat card
 */
function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Module navigation
    setupModuleNavigation();
    
    // Refresh button
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadQCData();
        });
    }
}

/**
 * Setup module navigation
 */
function setupModuleNavigation() {
    const moduleLinks = document.querySelectorAll('a[href*=".html"]');
    moduleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add any navigation logic here if needed
            console.log('Navigating to:', link.href);
        });
    });
}

/**
 * Start real-time updates
 */
function startRealTimeUpdates() {
    // Update every 30 seconds
    autoRefreshInterval = setInterval(() => {
        if (isOnline) {
            updateQCStatistics();
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
        if (statusDot) statusDot.style.background = '#10b981';
        if (statusText) statusText.classList.add('online');
    } else {
        if (statusDot) statusDot.style.background = '#ef4444';
        if (statusText) statusText.classList.add('offline');
    }
}

/**
 * Show loading indicator
 */
function showLoading() {
    // Add loading spinner or indicator
    console.log('Loading QC data...');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    // Remove loading spinner or indicator
    console.log('QC data loaded');
}

/**
 * Export data to CSV
 */
function exportCSV() {
    console.log('Exporting QC data to CSV...');
    // Implement CSV export functionality
}

/**
 * Refresh all data
 */
function refreshData() {
    loadQCData();
}

/**
 * Navigate to specific module
 */
function navigateToModule(page) {
    window.location.href = page;
}

/**
 * Open module in new tab
 */
function openModule(page) {
    window.open(page, '_blank');
}

/**
 * View module report
 */
function viewReport(module) {
    console.log(`Opening ${module.toUpperCase()} report...`);
    // Implement report viewing functionality
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});

// Export functions for global access
window.navigateToModule = navigateToModule;
window.openModule = openModule;
window.viewReport = viewReport;
window.exportCSV = exportCSV;
window.refreshData = refreshData;
