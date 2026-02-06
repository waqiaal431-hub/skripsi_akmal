// Dashboard Pimpinan Logic
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    
    // Listen for data updates
    window.addEventListener('dataUpdated', function(event) {
        updateDashboard(event.detail);
    });
});

function initializeDashboard() {
    const data = dataSimulation.getCurrentData();
    updateDashboard(data);
    initializeCharts();
}

function updateDashboard(data) {
    // Update stat cards
    document.getElementById('temperature').textContent = data.temperature.toFixed(1);
    document.getElementById('humidity').textContent = data.humidity.toFixed(1);
    document.getElementById('rainfall').textContent = data.rainfall.toFixed(1);
    document.getElementById('windSpeed').textContent = data.windSpeed.toFixed(1);
    
    // Update timestamps
    document.getElementById('temp-time').textContent = data.time;
    document.getElementById('humidity-time').textContent = data.time;
    document.getElementById('rainfall-time').textContent = data.time;
    document.getElementById('wind-time').textContent = data.time;
    
    // Update gauge charts
    chartManager.createGaugeChart('gaugeTemp', data.temperature, 40, '°C', CONFIG.colors.chart.temperature);
    chartManager.createGaugeChart('gaugeHumidity', data.humidity, 100, '%', CONFIG.colors.chart.humidity);
    chartManager.createGaugeChart('gaugePressure', data.pressure, 1050, 'hPa', CONFIG.colors.chart.pressure);
    
    // Update comparison data
    updateComparisonData();
    updateMonthlyRainfallComparison();
}

function initializeCharts() {
    // Line Chart
    const lineData = dataSimulation.getChartData('line', 7);
    chartManager.createLineChart('lineChart', lineData);
    
    // Bar Chart
    const barData = dataSimulation.getChartData('bar', 7);
    chartManager.createBarChart('barChart', barData);
    
    // Pie Chart
    const pieData = dataSimulation.getChartData('pie');
    chartManager.createPieChart('pieChart', pieData);
    
    // Comparison Chart
    updateComparisonChart();
}

function updateComparisonData() {
    const comparison = dataSimulation.getComparisonData();
    
    // Update temperature comparison
    updateComparisonBadge('temp', comparison.temperature);
    document.getElementById('temp-normal').textContent = comparison.temperature.normal.toFixed(1);
    
    // Update humidity comparison
    updateComparisonBadge('humidity', comparison.humidity);
    document.getElementById('humidity-normal').textContent = comparison.humidity.normal.toFixed(1);
    
    // Update rainfall comparison
    updateComparisonBadge('rainfall', comparison.rainfall);
    document.getElementById('rainfall-normal').textContent = comparison.rainfall.normal.toFixed(1);
    
    // Update comparison chart
    updateComparisonChart();
}

function updateComparisonBadge(prefix, data) {
    const badge = document.getElementById(`${prefix}-comparison-badge`);
    if (!badge) return;
    
    let text = '';
    let bgColor = '';
    let textColor = '';
    
    if (data.status === 'above') {
        text = `+${data.percent}%`;
        bgColor = 'bg-red-500/20';
        textColor = 'text-red-400';
    } else if (data.status === 'below') {
        text = `${data.percent}%`;
        bgColor = 'bg-blue-500/20';
        textColor = 'text-blue-400';
    } else {
        text = 'Normal';
        bgColor = 'bg-green-500/20';
        textColor = 'text-green-400';
    }
    
    badge.textContent = text;
    badge.className = `text-xs px-2 py-1 rounded-full ${bgColor} ${textColor}`;
}

function updateComparisonChart() {
    const comparison = dataSimulation.getComparisonData();
    
    const chartData = {
        labels: ['Suhu (°C)', 'Kelembaban (%)', 'Curah Hujan (mm)', 'Kecepatan Angin (km/jam)', 'Tekanan (hPa)'],
        datasets: [
            {
                label: 'Normal',
                data: [
                    comparison.temperature.normal,
                    comparison.humidity.normal,
                    comparison.rainfall.normal,
                    comparison.windSpeed.normal,
                    comparison.pressure.normal
                ],
                backgroundColor: 'rgba(148, 163, 184, 0.5)',
                borderColor: '#94a3b8',
                borderWidth: 2
            },
            {
                label: 'Saat Ini',
                data: [
                    comparison.temperature.current,
                    comparison.humidity.current,
                    comparison.rainfall.current,
                    comparison.windSpeed.current,
                    comparison.pressure.current
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: '#3b82f6',
                borderWidth: 2
            }
        ]
    };
    
    chartManager.createBarChart('comparisonChart', chartData);
}

function updateMonthlyRainfallComparison() {
    const monthly = dataSimulation.getMonthlyRainfallComparison();
    
    document.getElementById('monthly-rainfall-current').textContent = `${monthly.projected} mm`;
    document.getElementById('monthly-rainfall-normal').textContent = `${monthly.normal} mm`;
    document.getElementById('monthly-rainfall-diff').textContent = `${monthly.difference > 0 ? '+' : ''}${monthly.difference} mm (${monthly.percent > 0 ? '+' : ''}${monthly.percent}%)`;
    document.getElementById('days-elapsed').textContent = monthly.daysElapsed;
    document.getElementById('days-in-month').textContent = monthly.daysInMonth;
    
    // Update progress bar
    const percentage = Math.min((parseFloat(monthly.projected) / monthly.normal) * 100, 150);
    const bar = document.getElementById('monthly-rainfall-bar');
    if (bar) {
        bar.style.width = `${percentage}%`;
        if (percentage > 100) {
            bar.className = 'h-2 rounded-full bg-red-500';
        } else if (percentage < 80) {
            bar.className = 'h-2 rounded-full bg-blue-500';
        } else {
            bar.className = 'h-2 rounded-full bg-green-500';
        }
    }
}


