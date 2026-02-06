// Papan Informasi Dashboard Logic
let currentSlide = 0;
const totalSlides = 5;
let slideInterval;

document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeSlideshow();
    initializeDashboard();
    
    // Listen for data updates
    window.addEventListener('dataUpdated', function(event) {
        updateAllSlides(event.detail);
    });
});

function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('digitalClock').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clockDate').textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function initializeSlideshow() {
    slideInterval = setInterval(() => {
        nextSlide();
    }, CONFIG.slideshowInterval);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
}

function goToSlide(index) {
    // Hide all slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show selected slide
    document.querySelectorAll('.slide')[index].classList.add('active');
    
    // Update indicators
    document.querySelectorAll('.slide-indicator').forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
            indicator.classList.remove('bg-gray-600');
            indicator.classList.add('bg-blue-400');
        } else {
            indicator.classList.remove('active');
            indicator.classList.remove('bg-blue-400');
            indicator.classList.add('bg-gray-600');
        }
    });
    
    currentSlide = index;
    
    // Reinitialize charts for the active slide
    if (index === 1) {
        initializeSlide2Charts();
    } else if (index === 2) {
        initializeSlide3Gauges();
        updateSlide3Comparison();
    } else if (index === 4) {
        initializeSlide5Charts();
        updateSlide5MonthlyComparison();
    }
}

function initializeDashboard() {
    const data = dataSimulation.getCurrentData();
    updateAllSlides(data);
    initializeSlide2Charts();
    initializeSlide3Gauges();
    updateSlide3Comparison();
    initializeSlide5Charts();
    updateSlide5MonthlyComparison();
}

function updateAllSlides(data) {
    // Slide 1: Overview Stats
    document.getElementById('slide1-temp').textContent = data.temperature.toFixed(1);
    document.getElementById('slide1-humidity').textContent = data.humidity.toFixed(1);
    document.getElementById('slide1-rainfall').textContent = data.rainfall.toFixed(1);
    document.getElementById('slide1-wind').textContent = data.windSpeed.toFixed(1);
    
    // Update comparison for Slide 1
    updateSlide1Comparison();
    
    // Slide 4: Wind & Pressure
    document.getElementById('slide4-windDir').textContent = `${Math.round(data.windDirection)}°`;
    document.getElementById('slide4-windDirText').textContent = UIComponents.getWindDirection(data.windDirection);
    document.getElementById('slide4-windSpeed').textContent = data.windSpeed.toFixed(1);
    document.getElementById('slide4-pressure').textContent = data.pressure.toFixed(1);
    
    // Update pressure comparison
    updateSlide4Comparison();
    
    // Pressure status
    let pressureStatus = 'Normal';
    let pressureColor = 'text-green-400';
    if (data.pressure < 1000) {
        pressureStatus = 'Rendah';
        pressureColor = 'text-yellow-400';
    } else if (data.pressure > 1020) {
        pressureStatus = 'Tinggi';
        pressureColor = 'text-blue-400';
    }
    document.getElementById('slide4-pressureStatus').textContent = pressureStatus;
    document.getElementById('slide4-pressureStatus').className = `text-xl ${pressureColor}`;
    
    // Slide 5: Summary
    document.getElementById('slide5-lastUpdate').textContent = data.time;
    
    const storedData = localStorage.getItem('inputData');
    const inputData = storedData ? JSON.parse(storedData) : [];
    document.getElementById('slide5-totalData').textContent = inputData.length;
    
    // Update monthly rainfall comparison for Slide 5
    updateSlide5MonthlyComparison();
    
    // Update running text
    updateRunningText(data);
}

function updateSlide1Comparison() {
    const comparison = dataSimulation.getComparisonData();
    
    // Temperature
    document.getElementById('slide1-temp-normal').textContent = comparison.temperature.normal.toFixed(1);
    updateComparisonBadgeLarge('slide1-temp-badge', comparison.temperature);
    
    // Humidity
    document.getElementById('slide1-humidity-normal').textContent = comparison.humidity.normal.toFixed(1);
    updateComparisonBadgeLarge('slide1-humidity-badge', comparison.humidity);
    
    // Rainfall
    document.getElementById('slide1-rainfall-normal').textContent = comparison.rainfall.normal.toFixed(1);
    updateComparisonBadgeLarge('slide1-rainfall-badge', comparison.rainfall);
    
    // Wind Speed
    document.getElementById('slide1-wind-normal').textContent = comparison.windSpeed.normal.toFixed(1);
    updateComparisonBadgeLarge('slide1-wind-badge', comparison.windSpeed);
}

function updateSlide4Comparison() {
    const comparison = dataSimulation.getComparisonData();
    
    // Wind Speed
    document.getElementById('slide4-wind-normal').textContent = comparison.windSpeed.normal.toFixed(1);
    updateComparisonBadgeLarge('slide4-wind-badge', comparison.windSpeed);
    
    // Pressure
    document.getElementById('slide4-pressure-normal').textContent = comparison.pressure.normal.toFixed(1);
    updateComparisonBadgeLarge('slide4-pressure-badge', comparison.pressure);
}

function updateSlide5MonthlyComparison() {
    const monthly = dataSimulation.getMonthlyRainfallComparison();
    
    document.getElementById('slide5-monthly-current').textContent = `${monthly.projected} mm`;
    document.getElementById('slide5-monthly-normal').textContent = `${monthly.normal} mm`;
    
    // Format selisih dengan text lebih pendek dan tidak wrap
    const diffText = `${monthly.difference > 0 ? '+' : ''}${monthly.difference} mm`;
    const percentText = `${monthly.percent > 0 ? '+' : ''}${monthly.percent}%`;
    document.getElementById('slide5-monthly-diff').textContent = `${diffText} ${percentText}`;
    
    // Update progress bar - batasi maksimal 100% untuk menghindari overflow
    const percentage = Math.min((parseFloat(monthly.projected) / monthly.normal) * 100, 100);
    const bar = document.getElementById('slide5-monthly-bar');
    if (bar) {
        // Pastikan tidak melebihi 100%
        const finalPercentage = Math.min(percentage, 100);
        bar.style.width = `${finalPercentage}%`;
        bar.style.maxWidth = '100%';
        
        if (parseFloat(monthly.projected) > monthly.normal) {
            bar.className = 'h-2 rounded-full bg-red-500 transition-all duration-500';
        } else if (parseFloat(monthly.projected) < monthly.normal * 0.8) {
            bar.className = 'h-2 rounded-full bg-blue-500 transition-all duration-500';
        } else {
            bar.className = 'h-2 rounded-full bg-green-500 transition-all duration-500';
        }
    }
}

function updateComparisonBadgeLarge(elementId, data) {
    const badge = document.getElementById(elementId);
    if (!badge) return;
    
    let text = '';
    let bgColor = '';
    let textColor = '';
    
    if (data.status === 'above') {
        text = `+${data.percent}% Di Atas Normal`;
        bgColor = 'bg-red-500/30';
        textColor = 'text-red-300';
    } else if (data.status === 'below') {
        text = `${data.percent}% Di Bawah Normal`;
        bgColor = 'bg-blue-500/30';
        textColor = 'text-blue-300';
    } else {
        text = 'Normal';
        bgColor = 'bg-green-500/30';
        textColor = 'text-green-300';
    }
    
    badge.textContent = text;
    badge.className = `inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`;
}

function updateRunningText(data) {
    const messages = [
        `Suhu: ${data.temperature.toFixed(1)}°C | Kelembaban: ${data.humidity.toFixed(1)}% | Curah Hujan: ${data.rainfall.toFixed(1)}mm | Angin: ${data.windSpeed.toFixed(1)} km/jam dari ${UIComponents.getWindDirection(data.windDirection)}`,
        `Sistem Monitoring Meteorologi - Data diperbarui setiap 5 detik - Informasi real-time cuaca dan iklim`,
        `Tekanan Udara: ${data.pressure.toFixed(1)} hPa | Waktu Observasi: ${data.time}`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('runningText').innerHTML = `<i class="fas fa-info-circle mr-3"></i>${randomMessage}`;
}

function initializeSlide2Charts() {
    // Line Chart
    const lineData = dataSimulation.getChartData('line', 7);
    chartManager.createLineChart('slide2-lineChart', lineData);
    
    // Bar Chart (dengan perbandingan normal)
    const barData = dataSimulation.getChartData('bar', 7);
    chartManager.createBarChart('slide2-barChart', barData);
    
    // Update normal values
    const normal = dataSimulation.getNormalData();
    document.getElementById('slide2-temp-normal').textContent = normal.temperature.toFixed(1);
    document.getElementById('slide2-humidity-normal').textContent = normal.humidity.toFixed(1);
    document.getElementById('slide2-rainfall-normal').textContent = normal.rainfall.toFixed(1);
}

function initializeSlide3Gauges() {
    const data = dataSimulation.getCurrentData();
    chartManager.createGaugeChart('slide3-gaugeTemp', data.temperature, 40, '°C', CONFIG.colors.chart.temperature);
    chartManager.createGaugeChart('slide3-gaugeHumidity', data.humidity, 100, '%', CONFIG.colors.chart.humidity);
    chartManager.createGaugeChart('slide3-gaugePressure', data.pressure, 1050, 'hPa', CONFIG.colors.chart.pressure);
    
    // Update comparison for Slide 3
    updateSlide3Comparison();
}

function updateSlide3Comparison() {
    const comparison = dataSimulation.getComparisonData();
    
    // Temperature
    document.getElementById('slide3-temp-normal').textContent = comparison.temperature.normal.toFixed(1);
    updateComparisonBadgeLarge('slide3-temp-badge', comparison.temperature);
    
    // Humidity
    document.getElementById('slide3-humidity-normal').textContent = comparison.humidity.normal.toFixed(1);
    updateComparisonBadgeLarge('slide3-humidity-badge', comparison.humidity);
    
    // Pressure
    document.getElementById('slide3-pressure-normal').textContent = comparison.pressure.normal.toFixed(1);
    updateComparisonBadgeLarge('slide3-pressure-badge', comparison.pressure);
}

function initializeSlide5Charts() {
    const pieData = dataSimulation.getChartData('pie');
    chartManager.createPieChart('slide5-pieChart', pieData);
}

// Pause slideshow on hover
document.querySelector('.info-board').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

document.querySelector('.info-board').addEventListener('mouseleave', () => {
    initializeSlideshow();
});


