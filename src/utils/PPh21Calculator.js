/**
 * PPh 21 Calculator Module
 * Menghitung Pajak Penghasilan Pasal 21 sesuai tarif progresif Indonesia 2024
 * Berdasarkan PER-32/PJ/2015 dan UU HPP
 */

// ============================================
// PTKP (Penghasilan Tidak Kena Pajak) 2024
// ============================================
const PTKP = {
    TK0: 54000000,   // Tidak Kawin, 0 anak
    K0: 58500000,    // Kawin, 0 anak
    K1: 63000000,    // Kawin, 1 anak
    K2: 67500000,    // Kawin, 2 anak
    K3: 72000000,    // Kawin, 3 anak (maksimal)
};

// ============================================
// Tarif Progresif PPh 21 (UU HPP)
// ============================================
const TAX_BRACKETS = [
    { max: 60000000, rate: 0.05 },           // 0 - 60 juta: 5%
    { max: 250000000, rate: 0.15 },          // 60 - 250 juta: 15%
    { max: 500000000, rate: 0.25 },          // 250 - 500 juta: 25%
    { max: 5000000000, rate: 0.30 },         // 500 juta - 5 miliar: 30%
    { max: Infinity, rate: 0.35 },           // > 5 miliar: 35%
];

// ============================================
// Biaya Jabatan (5% dari penghasilan bruto, max 6jt/thn)
// ============================================
const BIAYA_JABATAN_PERCENT = 0.05;
const BIAYA_JABATAN_MAX_PER_YEAR = 6000000;

// ============================================
// Helper: Tentukan status PTKP
// ============================================
const getPTKPStatus = (statusPernikahan, jumlahAnak) => {
    const status = (statusPernikahan || '').toUpperCase();
    const anakCount = parseInt(jumlahAnak) || 0;
    
    // Batasi maksimal 3 anak untuk PTKP
    const anakForPTKP = Math.min(anakCount, 3);
    
    if (status === 'KAWIN' || status === 'K') {
        if (anakForPTKP === 0) return 'K0';
        if (anakForPTKP === 1) return 'K1';
        if (anakForPTKP === 2) return 'K2';
        return 'K3';
    } else {
        return 'TK0';
    }
};

// ============================================
// Helper: Hitung PTKP berdasarkan status
// ============================================
const hitungPTKP = (statusPernikahan, jumlahAnak) => {
    const ptkpStatus = getPTKPStatus(statusPernikahan, jumlahAnak);
    return PTKP[ptkpStatus];
};

// ============================================
// Helper: Hitung Biaya Jabatan setahun
// ============================================
const hitungBiayaJabatan = (penghasilanBrutoPerTahun) => {
    const biayaJabatan = penghasilanBrutoPerTahun * BIAYA_JABATAN_PERCENT;
    return Math.min(biayaJabatan, BIAYA_JABATAN_MAX_PER_YEAR);
};

// ============================================
// Helper: Hitung PPh terutang berdasarkan PKP
// ============================================
const hitungPPhDariPKP = (pkp) => {
    if (pkp <= 0) return 0;
    
    let pph = 0;
    let remainingPKP = pkp;
    let previousMax = 0;
    
    for (const bracket of TAX_BRACKETS) {
        if (remainingPKP <= 0) break;
        
        const taxableInBracket = Math.min(remainingPKP, bracket.max - previousMax);
        pph += taxableInBracket * bracket.rate;
        
        remainingPKP -= taxableInBracket;
        previousMax = bracket.max;
    }
    
    return pph;
};

// ============================================
// MAIN FUNCTION: Hitung PPh 21 Bulanan
// ============================================
/**
 * @param {Object} params - Parameter perhitungan
 * @param {number} params.gajiPokok - Gaji pokok per bulan
 * @param {number} params.tunjangan - Total tunjangan per bulan (opsional)
 * @param {number} params.bonus - Bonus per bulan (opsional, dibagi 12 jika tahunan)
 * @param {number} params.thr - THR per bulan (opsional, dibagi 12 jika tahunan)
 * @param {number} params.iuranPensiun - Iuran pensiun per bulan (opsional)
 * @param {number} params.iuranBPJS - Iuran BPJS (JHT+JP) per bulan (opsional)
 * @param {string} params.statusPernikahan - Status: 'KAWIN' atau 'TIDAK_KAWIN'
 * @param {number} params.jumlahAnak - Jumlah anak (maksimal 3 untuk PTKP)
 * @returns {Object} Hasil perhitungan
 */
const hitungPPh21Bulanan = (params) => {
    // 1. Hitung Penghasilan Bruto Setahun
    const gajiPokok = parseFloat(params.gajiPokok) || 0;
    const tunjangan = parseFloat(params.tunjangan) || 0;
    const bonus = parseFloat(params.bonus) || 0;
    const thr = parseFloat(params.thr) || 0;
    const iuranPensiun = parseFloat(params.iuranPensiun) || 0;
    const iuranBPJS = parseFloat(params.iuranBPJS) || 0;
    const statusPernikahan = params.statusPernikahan || 'TIDAK_KAWIN';
    const jumlahAnak = parseInt(params.jumlahAnak) || 0;
    
    const penghasilanBrutoPerBulan = gajiPokok + tunjangan + bonus + thr;
    const penghasilanBrutoPerTahun = penghasilanBrutoPerBulan * 12;
    
    // 2. Hitung Pengurangan Setahun
    const biayaJabatan = hitungBiayaJabatan(penghasilanBrutoPerTahun);
    const totalIuranPerTahun = (iuranPensiun + iuranBPJS) * 12;
    const totalPengurangan = biayaJabatan + totalIuranPerTahun;
    
    // 3. Hitung Penghasilan Netto Setahun
    const penghasilanNettoPerTahun = penghasilanBrutoPerTahun - totalPengurangan;
    
    // 4. Hitung PTKP
    const ptkp = hitungPTKP(statusPernikahan, jumlahAnak);
    
    // 5. Hitung PKP (Penghasilan Kena Pajak)
    const pkp = Math.max(0, penghasilanNettoPerTahun - ptkp);
    
    // 6. Hitung PPh Terutang Setahun
    const pphTerutangSetahun = hitungPPhDariPKP(pkp);
    
    // 7. Hitung PPh 21 Bulanan
    const pph21Bulanan = pphTerutangSetahun / 12;
    
    return {
        penghasilanBrutoPerBulan,
        penghasilanBrutoPerTahun,
        biayaJabatan,
        totalIuranPerTahun,
        totalPengurangan,
        penghasilanNettoPerTahun,
        ptkp,
        pkp,
        pphTerutangSetahun,
        pph21Bulanan: Math.round(pph21Bulanan),
        statusPTKP: getPTKPStatus(statusPernikahan, jumlahAnak),
    };
};

// ============================================
// Helper: Format Rupiah
// ============================================
const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// ============================================
// Export
// ============================================
export {
    hitungPPh21Bulanan,
    hitungPTKP,
    hitungBiayaJabatan,
    hitungPPhDariPKP,
    getPTKPStatus,
    formatRupiah,
    PTKP,
    TAX_BRACKETS,
};

export default {
    hitungPPh21Bulanan,
    hitungPTKP,
    hitungBiayaJabatan,
    hitungPPhDariPKP,
    getPTKPStatus,
    formatRupiah,
    PTKP,
    TAX_BRACKETS,
};
