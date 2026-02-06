// Laporan Data Input Logic
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
    
    const storedData = localStorage.getItem('inputData');
    const inputData = storedData ? JSON.parse(storedData) : [];
    
    if (inputData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="py-8 text-center text-gray-400">Belum ada data input</td></tr>';
        return;
    }
    
    // Sort by timestamp descending
    inputData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    inputData.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-800 hover:bg-gray-800/50 transition-colors';
        const date = new Date(item.timestamp);
        row.innerHTML = `
            <td class="py-4 text-gray-300">${date.toLocaleString('id-ID')}</td>
            <td class="py-4 text-white font-semibold">${item.temperature.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${item.humidity.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${item.rainfall.toFixed(1)}</td>
            <td class="py-4 text-white font-semibold">${item.windSpeed.toFixed(1)} km/jam</td>
            <td class="py-4 text-white font-semibold">${item.windDirection}° (${UIComponents.getWindDirection(item.windDirection)})</td>
            <td class="py-4 text-white font-semibold">${item.pressure.toFixed(1)}</td>
            <td class="py-4">
                <button onclick="deleteData(${item.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    UIComponents.showToast('Filter diterapkan', 'success');
    loadReports();
}

function deleteData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        const storedData = localStorage.getItem('inputData');
        const inputData = storedData ? JSON.parse(storedData) : [];
        const filtered = inputData.filter(item => item.id !== id);
        localStorage.setItem('inputData', JSON.stringify(filtered));
        UIComponents.showToast('Data berhasil dihapus', 'success');
        loadReports();
    }
}

function exportData() {
    const storedData = localStorage.getItem('inputData');
    const inputData = storedData ? JSON.parse(storedData) : [];
    
    if (inputData.length === 0) {
        UIComponents.showToast('Tidak ada data untuk diexport', 'warning');
        return;
    }
    
    // Convert to CSV
    const headers = ['Tanggal', 'Suhu (°C)', 'Kelembaban (%)', 'Curah Hujan (mm)', 'Kecepatan Angin (km/jam)', 'Arah Angin (°)', 'Tekanan (hPa)'];
    const rows = inputData.map(item => {
        const date = new Date(item.timestamp);
        return [
            date.toLocaleString('id-ID'),
            item.temperature.toFixed(1),
            item.humidity.toFixed(1),
            item.rainfall.toFixed(1),
            item.windSpeed.toFixed(1),
            item.windDirection,
            item.pressure.toFixed(1)
        ];
    });
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    UIComponents.showToast('Data berhasil diexport', 'success');
}


