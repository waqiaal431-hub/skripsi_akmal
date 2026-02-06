// Input Data Logic
document.addEventListener('DOMContentLoaded', function() {
    // Set default datetime to now
    const now = new Date();
    const datetimeLocal = now.toISOString().slice(0, 16);
    document.getElementById('observationDateTime').value = datetimeLocal;
    
    // Update wind direction text
    document.getElementById('windDirection').addEventListener('input', function() {
        const degrees = parseInt(this.value);
        if (!isNaN(degrees) && degrees >= 0 && degrees <= 360) {
            const direction = UIComponents.getWindDirection(degrees);
            document.getElementById('windDirectionText').textContent = `Arah: ${direction} (${degrees}°)`;
        }
    });
});

function submitData(event) {
    event.preventDefault();
    
    const formData = {
        timestamp: document.getElementById('observationDateTime').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        humidity: parseFloat(document.getElementById('humidity').value),
        rainfall: parseFloat(document.getElementById('rainfall').value),
        windSpeed: parseFloat(document.getElementById('windSpeed').value),
        windDirection: parseInt(document.getElementById('windDirection').value),
        pressure: parseFloat(document.getElementById('pressure').value),
        notes: document.getElementById('notes').value || ''
    };
    
    // Save to localStorage
    const storedData = localStorage.getItem('inputData');
    const inputData = storedData ? JSON.parse(storedData) : [];
    inputData.push({
        ...formData,
        timestamp: new Date(formData.timestamp).toISOString(),
        id: Date.now()
    });
    localStorage.setItem('inputData', JSON.stringify(inputData));
    
    UIComponents.showToast('Data berhasil disimpan!', 'success');
    
    // Reset form
    setTimeout(() => {
        resetForm();
    }, 1000);
}

function resetForm() {
    document.getElementById('inputForm').reset();
    const now = new Date();
    const datetimeLocal = now.toISOString().slice(0, 16);
    document.getElementById('observationDateTime').value = datetimeLocal;
    document.getElementById('windDirectionText').textContent = '-';
}

function fillWithCurrentData() {
    const currentData = dataSimulation.getCurrentData();
    
    const now = new Date();
    const datetimeLocal = now.toISOString().slice(0, 16);
    document.getElementById('observationDateTime').value = datetimeLocal;
    document.getElementById('temperature').value = currentData.temperature.toFixed(1);
    document.getElementById('humidity').value = currentData.humidity.toFixed(1);
    document.getElementById('rainfall').value = currentData.rainfall.toFixed(1);
    document.getElementById('windSpeed').value = currentData.windSpeed.toFixed(1);
    document.getElementById('windDirection').value = Math.round(currentData.windDirection);
    document.getElementById('pressure').value = currentData.pressure.toFixed(1);
    
    // Update wind direction text
    const direction = UIComponents.getWindDirection(currentData.windDirection);
    document.getElementById('windDirectionText').textContent = `Arah: ${direction} (${Math.round(currentData.windDirection)}°)`;
    
    UIComponents.showToast('Form diisi dengan data simulasi saat ini', 'info');
}


