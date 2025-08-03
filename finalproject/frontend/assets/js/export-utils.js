/**
 * Universal Export Utilities
 * PT. Topline Evergreen Manufacturing
 * Common export functions for all modules
 */

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Base filename (without extension)
 * @param {Array} headers - Optional custom headers array
 */
function exportToCSV(data, filename, headers = null) {
    try {
        if (!data || data.length === 0) {
            showMessage('No data available to export', 'warning');
            return;
        }

        // Get headers from first object or use provided headers
        const csvHeaders = headers || Object.keys(data[0]);
        
        // Create CSV content
        let csvContent = csvHeaders.join(',') + '\n';
        
        // Add data rows
        data.forEach(row => {
            const values = csvHeaders.map(header => {
                let value = row[header] || '';
                
                // Handle different data types
                if (typeof value === 'string') {
                    // Escape quotes and wrap in quotes if contains comma
                    value = value.replace(/"/g, '""');
                    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                        value = `"${value}"`;
                    }
                } else if (typeof value === 'object' && value !== null) {
                    // Convert objects to string
                    value = JSON.stringify(value).replace(/"/g, '""');
                    value = `"${value}"`;
                }
                
                return value;
            });
            csvContent += values.join(',') + '\n';
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (navigator.msSaveBlob) {
            // For IE
            navigator.msSaveBlob(blob, `${filename}-${getCurrentDateString()}.csv`);
        } else {
            // For other browsers
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `${filename}-${getCurrentDateString()}.csv`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        showMessage(`Data exported successfully to ${filename}-${getCurrentDateString()}.csv`, 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showMessage('Export failed: ' + error.message, 'error');
    }
}

/**
 * Export filtered table data to CSV
 * @param {String} tableId - ID of the table element
 * @param {String} filename - Base filename
 * @param {Array} data - Optional data array, if not provided will extract from table
 */
function exportTableToCSV(tableId, filename, data = null) {
    try {
        const table = document.getElementById(tableId);
        if (!table) {
            showMessage('Table not found for export', 'error');
            return;
        }

        if (data && data.length > 0) {
            // Use provided data
            exportToCSV(data, filename);
        } else {
            // Extract data from table
            const headers = [];
            const rows = [];

            // Get headers
            const headerRow = table.querySelector('thead tr');
            if (headerRow) {
                headerRow.querySelectorAll('th').forEach(th => {
                    headers.push(th.textContent.trim());
                });
            }

            // Get data rows
            const dataRows = table.querySelectorAll('tbody tr');
            dataRows.forEach(tr => {
                const rowData = {};
                const cells = tr.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (headers[index]) {
                        // Clean cell content (remove buttons, etc.)
                        let cellText = cell.textContent.trim();
                        
                        // Skip action columns that contain buttons
                        if (!cell.querySelector('button') && !cell.querySelector('a.btn')) {
                            rowData[headers[index]] = cellText;
                        }
                    }
                });
                
                if (Object.keys(rowData).length > 0) {
                    rows.push(rowData);
                }
            });

            if (rows.length === 0) {
                showMessage('No data found in table to export', 'warning');
                return;
            }

            exportToCSV(rows, filename);
        }
    } catch (error) {
        console.error('Table export error:', error);
        showMessage('Table export failed: ' + error.message, 'error');
    }
}

/**
 * Export data to Excel format (XLSX)
 * Requires SheetJS library to be loaded
 */
function exportToExcel(data, filename, sheetName = 'Sheet1') {
    try {
        if (typeof XLSX === 'undefined') {
            console.warn('SheetJS library not loaded, falling back to CSV export');
            exportToCSV(data, filename);
            return;
        }

        if (!data || data.length === 0) {
            showMessage('No data available to export', 'warning');
            return;
        }

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        // Save file
        XLSX.writeFile(wb, `${filename}-${getCurrentDateString()}.xlsx`);
        
        showMessage(`Data exported successfully to Excel: ${filename}-${getCurrentDateString()}.xlsx`, 'success');
        
    } catch (error) {
        console.error('Excel export error:', error);
        showMessage('Excel export failed: ' + error.message, 'error');
    }
}

/**
 * Get current date string for filename
 */
function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get current datetime string for filename
 */
function getCurrentDateTimeString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}`;
}

/**
 * Show message to user
 * @param {String} message - Message text
 * @param {String} type - Type: success, error, warning, info
 */
function showMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#10b981';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#f59e0b';
            break;
        default:
            messageDiv.style.backgroundColor = '#3b82f6';
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

/**
 * Export with progress indicator for large datasets
 */
async function exportLargeDataToCSV(data, filename, chunkSize = 1000) {
    try {
        if (!data || data.length === 0) {
            showMessage('No data available to export', 'warning');
            return;
        }

        // Show progress for large datasets
        if (data.length > chunkSize) {
            const progressDiv = document.createElement('div');
            progressDiv.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                            background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10001;">
                    <div>Exporting data...</div>
                    <div style="width: 200px; height: 20px; background: #f3f4f6; border-radius: 10px; margin: 10px 0; overflow: hidden;">
                        <div id="progress-bar" style="width: 0%; height: 100%; background: #3b82f6; transition: width 0.3s ease;"></div>
                    </div>
                    <div id="progress-text">0%</div>
                </div>
            `;
            document.body.appendChild(progressDiv);

            // Process in chunks
            const headers = Object.keys(data[0]);
            let csvContent = headers.join(',') + '\n';
            
            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);
                
                chunk.forEach(row => {
                    const values = headers.map(header => {
                        let value = row[header] || '';
                        if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
                            value = `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    });
                    csvContent += values.join(',') + '\n';
                });

                // Update progress
                const progress = Math.round(((i + chunkSize) / data.length) * 100);
                document.getElementById('progress-bar').style.width = progress + '%';
                document.getElementById('progress-text').textContent = progress + '%';
                
                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            // Download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}-${getCurrentDateString()}.csv`;
            link.click();
            URL.revokeObjectURL(url);

            // Remove progress indicator
            document.body.removeChild(progressDiv);
            showMessage(`Large dataset exported successfully (${data.length} records)`, 'success');
        } else {
            // Use regular export for smaller datasets
            exportToCSV(data, filename);
        }
    } catch (error) {
        console.error('Large export error:', error);
        showMessage('Export failed: ' + error.message, 'error');
    }
}

// Make functions globally available
window.exportToCSV = exportToCSV;
window.exportTableToCSV = exportTableToCSV;
window.exportToExcel = exportToExcel;
window.exportLargeDataToCSV = exportLargeDataToCSV;
window.showMessage = showMessage;
