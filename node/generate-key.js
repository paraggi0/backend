const crypto = require('crypto');
const bcrypt = require('bcrypt');
const readline = require('readline');

// --- Konfigurasi ---
const SALT_ROUNDS = 10; // Standar keamanan untuk Bcrypt

// --- Fungsi ---
const generateApiKey = () => {
    // Menghasilkan key acak yang panjang untuk keamanan
    return `skt-prod-${crypto.randomBytes(32).toString('hex')}`;
};

const hashValue = (plainTextValue) => {
    // Melakukan hashing pada nilai teks biasa (password atau API Key)
    return bcrypt.hashSync(plainTextValue, SALT_ROUNDS);
};

// --- Antarmuka Terminal ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("--- Credential Generator ---");

rl.question('Masukkan password teks biasa untuk di-hash: ', (password) => {
    // 1. Buat API Key baru
    const apiKey = generateApiKey();

    // 2. Buat hash untuk password dan API Key
    const passwordHash = hashValue(password);
    const apiKeyHash = hashValue(apiKey);

    // 3. Tampilkan hasilnya
    console.log("\n=========================================================");
    console.log("✅ Kredensial berhasil dibuat!");
    console.log("=========================================================\n");

    console.log("🔑 API Key (Berikan ini ke Klien/Aplikasi Android):");
    console.log(apiKey);
    console.log("\n---------------------------------------------------------");

    console.log("🔒 Password Hash (Simpan di kolom 'password_hash' DB):");
    console.log(passwordHash);
    console.log("\n---------------------------------------------------------");
    
    console.log("🔒 API Key Hash (Simpan di kolom 'api_key_hash' DB):");
    console.log(apiKeyHash);
    console.log("\n=========================================================");

    rl.close();
});
