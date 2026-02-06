// Dashboard Data Input Logic
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeCharts();
});

function loadDashboardData() {
    // Load from localStorage if available
    const storedData = localStorage.getItem('inputData');
    const inputData = storedData ? JSON.parse(storedData) : [];
    
    // Calculate statistics
    const today = new Date().toDateString();
    const todayInputs = inputData.filter(d => new Date(d.timestamp).toDateString() === today);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekInputs = inputData.filter(d => new Date(d.timestamp) >= weekAgo);
    
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthInputs = inputData.filter(d => new Date(d.timestamp) >= monthAgo);
    
    // Update UI
    document.getElementById('todayInput').textContent = todayInputs.length;
    document.getElementById('weekInput').textContent = weekInputs.length;
    document.getElementById('monthInput').textContent = monthInputs.length;
    
    if (inputData.length > 0) {
        const lastInput = inputData[inputData.length - 1];
        document.getElementById('lastInput').textContent = new Date(lastInput.timestamp).toLocaleString('id-ID');
    }
    
    // Load recent inputs
    loadRecentInputs(inputData.slice(-10).reverse());
}

function loadRecentInputs(data) {
    const tbody = document.getElementById('recentInputsBody');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-gray-400">Belum ada data input</td></tr>';
        return;
    }
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-800 hover:bg-gray-800/50 transition-colors';
        row.innerHTML = `
            <td class="py-4 text-gray-300">${new Date(item.timestamp).toLocaleString('id-ID')}</td>
            <td class="py-4 text-white font-semibold">${item.temperature.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${item.humidity.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${item.rainfall.toFixed(1)}</td>
            <td class="py-4">
                <span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">Tersimpan</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function initializeCharts() {
    const storedData = localStorage.getItem('inputData');
    const inputData = storedData ? JSON.parse(storedData) : [];
    
    // Daily Input Chart
    const dailyData = generateDailyInputData(inputData);
    chartManager.createBarChart('dailyInputChart', {
        labels: dailyData.map(d => d.date),
        datasets: [{
            label: 'Jumlah Input',
            data: dailyData.map(d => d.count),
            backgroundColor: CONFIG.colors.chart.humidity,
            borderRadius: 8
        }]
    });
    
    // Hourly Input Chart
    const hourlyData = generateHourlyInputData(inputData);
    chartManager.createLineChart('hourlyInputChart', {
        labels: hourlyData.map(d => d.hour + ':00'),
        datasets: [{
            label: 'Input per Jam',
            data: hourlyData.map(d => d.count),
            borderColor: CONFIG.colors.chart.temperature,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
        }]
    });
}

function generateDailyInputData(inputData) {
    const daily = {};
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        daily[dateKey] = 0;
        last7Days.push(dateKey);
    }
    
    inputData.forEach(item => {
        const date = new Date(item.timestamp);
        const dateKey = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        if (daily.hasOwnProperty(dateKey)) {
            daily[dateKey]++;
        }
    });
    
    return last7Days.map(date => ({
        date: date,
        count: daily[date]
    }));
}

function generateHourlyInputData(inputData) {
    const hourly = {};
    
    for (let i = 0; i < 24; i++) {
        hourly[i] = 0;
    }
    
    inputData.forEach(item => {
        const hour = new Date(item.timestamp).getHours();
        hourly[hour]++;
    });
    
    return Object.keys(hourly).map(hour => ({
        hour: parseInt(hour),
        count: hourly[hour]
    }));
}


