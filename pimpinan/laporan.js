// Laporan Logic
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
    
    // Set default dates
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    document.getElementById('startDate').value = lastWeek.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
});

function loadReports() {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';
    
    // Generate dummy report data
    const reports = generateReportData(30);
    
    reports.forEach(report => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-800 hover:bg-gray-800/50 transition-colors';
        row.innerHTML = `
            <td class="py-4 text-gray-300">${report.date} ${report.time}</td>
            <td class="py-4 text-white font-semibold">${report.temperature.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${report.humidity.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${report.rainfall.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${report.windSpeed.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${report.windDirection}° (${UIComponents.getWindDirection(report.windDirection)})</td>
            <td class="py-4 text-white font-semibold">${report.pressure.toFixed(1)}</td>
        `;
        tbody.appendChild(row);
    });
}

function generateReportData(count) {
    const reports = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        const date = new Date(now);
        date.setHours(date.getHours() - i);
        
        const data = {
            date: date.toLocaleDateString('id-ID'),
            time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            temperature: Math.random() * 15 + 20,
            humidity: Math.random() * 50 + 40,
            rainfall: Math.random() * 50,
            windSpeed: Math.random() * 20 + 5,
            windDirection: Math.floor(Math.random() * 360),
            pressure: Math.random() * 40 + 980
        };
        
        reports.push(data);
    }
    
    return reports;
}

function filterReports() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const dataType = document.getElementById('dataType').value;
    
    UIComponents.showToast('Filter diterapkan', 'success');
    loadReports();
}

function exportReport() {
    UIComponents.showToast('Fitur export PDF akan tersedia setelah integrasi backend', 'info');
}


