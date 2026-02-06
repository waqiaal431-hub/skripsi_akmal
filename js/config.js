// Konfigurasi Aplikasi
const CONFIG = {
    // Warna tema
    colors: {
        primary: {
            dark: '#1e3a8a',
            light: '#3b82f6',
        },
        secondary: {
            white: '#ffffff',
            gray: '#94a3b8',
        },
        chart: {
            temperature: '#ef4444',
            humidity: '#3b82f6',
            rainfall: '#06b6d4',
            wind: '#10b981',
            pressure: '#8b5cf6',
        }
    },
    
    // Interval update data (dalam milidetik)
    updateInterval: 5000, // 5 detik
    
    // Interval slideshow untuk papan informasi (dalam milidetik)
    slideshowInterval: 10000, // 10 detik
    
    // Konfigurasi chart
    chart: {
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        },
        responsive: true,
        maintainAspectRatio: false
    },
    
    // Data Normal (Baseline) untuk perbandingan
    // Data ini mewakili nilai normal/rata-rata jangka panjang
    normal: {
        temperature: 27.5,      // Rata-rata suhu normal (°C)
        humidity: 75.0,         // Rata-rata kelembaban normal (%)
        rainfall: {
            daily: 15.0,        // Rata-rata curah hujan harian (mm)
            monthly: 450.0      // Rata-rata curah hujan bulanan (mm)
        },
        windSpeed: 12.0,        // Rata-rata kecepatan angin normal (km/jam)
        pressure: 1013.25       // Tekanan udara normal (hPa)
    }
};

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}


