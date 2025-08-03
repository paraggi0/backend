# CLEANUP SCRIPT - HAPUS FILE DUPLIKAT & LEGACY
# Jalankan script ini untuk membersihkan file yang tidak terpakai

Write-Host "🧹 Memulai cleanup file duplikat dan legacy..." -ForegroundColor Green

# Frontend JavaScript Cleanup
Write-Host "📁 Membersihkan frontend JavaScript files..." -ForegroundColor Yellow

$frontendCleanup = @(
    "frontend/assets/js/js-produksi/invwip.js",
    "frontend/assets/js/js-produksi/invwip-new.js", 
    "frontend/assets/js/js-produksi/invwip-demo.js",
    "frontend/assets/js/js-produksi/mcoutput.js",
    "frontend/assets/js/js-produksi/mcoutput-new.js",
    "frontend/assets/js/js-produksi/tfqc.js",
    "frontend/assets/js/js-produksi/wipsecond.js",
    "frontend/assets/js/js-produksi/mcstatus.js",
    "frontend/assets/js/js-produksi/dashboard-produksi-new.js"
)

foreach ($file in $frontendCleanup) {
    $fullPath = "c:\Users\SOLIT\finalproject\$file"
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "  ✅ Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Not found: $file" -ForegroundColor Gray
    }
}

# Backend Testing Files Cleanup
Write-Host "📁 Membersihkan backend testing files..." -ForegroundColor Yellow

$backendCleanup = @(
    "backend/test-connection.js",
    "backend/test-endpoints.js", 
    "backend/test-all-endpoints.js",
    "backend/test-passwords.js",
    "backend/check-wip-structure.js",
    "backend/check-wip-table.js",
    "backend/quick-test-db.js",
    "backend/setup-wip-customer.js",
    "backend/update-wip-table.js",
    "backend/create-production-tables.js",
    "backend/check-wip-structure.js",
    "backend/check-wip-table.js"
)

foreach ($file in $backendCleanup) {
    $fullPath = "c:\Users\SOLIT\finalproject\$file"
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "  ✅ Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Not found: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎯 CLEANUP SELESAI!" -ForegroundColor Green
Write-Host "📊 File yang tersisa adalah working files yang aktif digunakan" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔄 LANGKAH SELANJUTNYA:" -ForegroundColor Yellow
Write-Host "  1. Test semua halaman produksi masih berfungsi" -ForegroundColor White
Write-Host "  2. Pastikan tidak ada error 404 di console browser" -ForegroundColor White
Write-Host "  3. Verifikasi API endpoints masih working" -ForegroundColor White
Write-Host ""
Write-Host "📁 WORKING FILES YANG TERSISA:" -ForegroundColor Cyan
Write-Host "  ✅ invwip-simple.js (WIP Inventory)" -ForegroundColor Green
Write-Host "  ✅ mcstatus-real.js (Machine Status)" -ForegroundColor Green  
Write-Host "  ✅ mcoutput-real.js (Machine Output)" -ForegroundColor Green
Write-Host "  ✅ tfqc-real.js (Transfer QC)" -ForegroundColor Green
Write-Host "  ✅ wipsecond-real.js (WIP Second Process)" -ForegroundColor Green
Write-Host "  ✅ dashboard-produksi.js (Main Dashboard)" -ForegroundColor Green
Write-Host "  ✅ cascading-dropdown.js (Shared Utility)" -ForegroundColor Green
Write-Host "  ✅ notification-system.js (Shared Utility)" -ForegroundColor Green
Write-Host "  ✅ universal-export.js (Shared Utility)" -ForegroundColor Green
Write-Host "  ✅ mcstatus-utils.js (Machine Status Utils)" -ForegroundColor Green
Write-Host "  ✅ admin-dashboard.js (Admin Functions)" -ForegroundColor Green
