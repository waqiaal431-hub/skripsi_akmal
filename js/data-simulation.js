// Simulasi Data Observasi Meteorologi
class DataSimulation {
    constructor() {
        this.data = this.generateInitialData();
        this.startAutoUpdate();
    }
    
    // Generate data awal
    generateInitialData() {
        const now = new Date();
        return {
            temperature: this.randomFloat(20, 35),
            humidity: this.randomFloat(40, 90),
            rainfall: this.randomFloat(0, 50),
            windSpeed: this.randomFloat(5, 25),
            windDirection: this.randomInt(0, 360),
            pressure: this.randomFloat(980, 1020),
            timestamp: now.toISOString(),
            date: now.toLocaleDateString('id-ID'),
            time: now.toLocaleTimeString('id-ID')
        };
    }
    
    // Generate data historis untuk chart
    generateHistoricalData(days = 7) {
        const data = [];
        const now = new Date();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Generate 24 data per hari (per jam)
            for (let hour = 0; hour < 24; hour++) {
                const timestamp = new Date(date);
                timestamp.setHours(hour, 0, 0, 0);
                
                data.push({
                    timestamp: timestamp.toISOString(),
                    temperature: this.randomFloat(20, 35),
                    humidity: this.randomFloat(40, 90),
                    rainfall: this.randomFloat(0, 50),
                    windSpeed: this.randomFloat(5, 25),
                    pressure: this.randomFloat(980, 1020)
                });
            }
        }
        
        return data;
    }
    
    // Update data dengan perubahan gradual
    updateData() {
        const change = (current, min, max, variance = 2) => {
            const newValue = current + this.randomFloat(-variance, variance);
            return Math.max(min, Math.min(max, newValue));
        };
        
        this.data.temperature = change(this.data.temperature, 20, 35, 1);
        this.data.humidity = change(this.data.humidity, 40, 90, 2);
        this.data.rainfall = change(this.data.rainfall, 0, 100, 1);
        this.data.windSpeed = change(this.data.windSpeed, 5, 25, 1);
        this.data.windDirection = (this.data.windDirection + this.randomInt(-10, 10)) % 360;
        this.data.pressure = change(this.data.pressure, 980, 1020, 0.5);
        
        const now = new Date();
        this.data.timestamp = now.toISOString();
        this.data.date = now.toLocaleDateString('id-ID');
        this.data.time = now.toLocaleTimeString('id-ID');
        
        return this.data;
    }
    
    // Get data saat ini
    getCurrentData() {
        return { ...this.data };
    }
    
    // Get data normal (baseline)
    getNormalData() {
        return {
            temperature: CONFIG.normal.temperature,
            humidity: CONFIG.normal.humidity,
            rainfall: CONFIG.normal.rainfall.daily,
            windSpeed: CONFIG.normal.windSpeed,
            pressure: CONFIG.normal.pressure
        };
    }
    
    // Get perbandingan data saat ini vs normal
    getComparisonData() {
        const current = this.getCurrentData();
        const normal = this.getNormalData();
        
        const calculateDifference = (current, normal) => {
            const diff = current - normal;
            const percent = ((diff / normal) * 100).toFixed(1);
            return {
                value: diff,
                percent: parseFloat(percent),
                status: diff > 0 ? 'above' : diff < 0 ? 'below' : 'normal'
            };
        };
        
        return {
            temperature: {
                current: current.temperature,
                normal: normal.temperature,
                ...calculateDifference(current.temperature, normal.temperature)
            },
            humidity: {
                current: current.humidity,
                normal: normal.humidity,
                ...calculateDifference(current.humidity, normal.humidity)
            },
            rainfall: {
                current: current.rainfall,
                normal: normal.rainfall,
                ...calculateDifference(current.rainfall, normal.rainfall)
            },
            windSpeed: {
                current: current.windSpeed,
                normal: normal.windSpeed,
                ...calculateDifference(current.windSpeed, normal.windSpeed)
            },
            pressure: {
                current: current.pressure,
                normal: normal.pressure,
                ...calculateDifference(current.pressure, normal.pressure)
            }
        };
    }
    
    // Get data bulanan untuk perbandingan curah hujan
    getMonthlyRainfallComparison() {
        const currentMonth = new Date().getMonth();
        const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
        const currentDay = new Date().getDate();
        
        // Simulasi total curah hujan bulan ini (berdasarkan rata-rata harian)
        const avgDailyRainfall = this.data.rainfall;
        const estimatedMonthlyTotal = avgDailyRainfall * daysInMonth;
        
        // Normal bulanan
        const normalMonthly = CONFIG.normal.rainfall.monthly;
        
        return {
            current: estimatedMonthlyTotal.toFixed(1),
            normal: normalMonthly,
            difference: (estimatedMonthlyTotal - normalMonthly).toFixed(1),
            percent: (((estimatedMonthlyTotal - normalMonthly) / normalMonthly) * 100).toFixed(1),
            daysElapsed: currentDay,
            daysInMonth: daysInMonth,
            projected: estimatedMonthlyTotal.toFixed(1)
        };
    }
    
    // Get data untuk chart (dalam format yang dibutuhkan)
    getChartData(type = 'line', days = 7) {
        const historical = this.generateHistoricalData(days);
        
        if (type === 'line') {
            return {
                labels: historical.map((d, i) => {
                    const date = new Date(d.timestamp);
                    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
                }).filter((_, i) => i % 6 === 0), // Ambil setiap 6 jam
                datasets: [
                    {
                        label: 'Suhu (°C)',
                        data: historical.filter((_, i) => i % 6 === 0).map(d => d.temperature),
                        borderColor: CONFIG.colors.chart.temperature,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Kelembaban (%)',
                        data: historical.filter((_, i) => i % 6 === 0).map(d => d.humidity),
                        borderColor: CONFIG.colors.chart.humidity,
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }
                ]
            };
        }
        
        if (type === 'bar') {
            const dailyData = this.aggregateDaily(historical);
            return {
                labels: dailyData.map(d => d.date),
                datasets: [
                    {
                        label: 'Normal (mm)',
                        data: dailyData.map(() => CONFIG.normal.rainfall.daily),
                        backgroundColor: 'rgba(148, 163, 184, 0.5)',
                        borderColor: '#94a3b8',
                        borderRadius: 8
                    },
                    {
                        label: 'Curah Hujan (mm)',
                        data: dailyData.map(d => d.rainfall),
                        backgroundColor: CONFIG.colors.chart.rainfall,
                        borderRadius: 8
                    }
                ]
            };
        }
        
        if (type === 'pie') {
            return {
                labels: ['Normal', 'Tinggi', 'Sangat Tinggi'],
                datasets: [{
                    data: [
                        this.randomInt(40, 60),
                        this.randomInt(20, 35),
                        this.randomInt(10, 20)
                    ],
                    backgroundColor: [
                        CONFIG.colors.chart.temperature,
                        CONFIG.colors.chart.humidity,
                        CONFIG.colors.chart.rainfall
                    ]
                }]
            };
        }
    }
    
    // Aggregate data per hari
    aggregateDaily(historical) {
        const daily = {};
        
        historical.forEach(d => {
            const date = new Date(d.timestamp);
            const dateKey = `${date.getDate()}/${date.getMonth() + 1}`;
            
            if (!daily[dateKey]) {
                daily[dateKey] = {
                    date: dateKey,
                    temperature: [],
                    humidity: [],
                    rainfall: [],
                    windSpeed: [],
                    pressure: []
                };
            }
            
            daily[dateKey].temperature.push(d.temperature);
            daily[dateKey].humidity.push(d.humidity);
            daily[dateKey].rainfall.push(d.rainfall);
            daily[dateKey].windSpeed.push(d.windSpeed);
            daily[dateKey].pressure.push(d.pressure);
        });
        
        return Object.values(daily).map(day => ({
            date: day.date,
            temperature: (day.temperature.reduce((a, b) => a + b, 0) / day.temperature.length).toFixed(1),
            humidity: (day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length).toFixed(1),
            rainfall: day.rainfall.reduce((a, b) => a + b, 0).toFixed(1),
            windSpeed: (day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length).toFixed(1),
            pressure: (day.pressure.reduce((a, b) => a + b, 0) / day.pressure.length).toFixed(1)
        }));
    }
    
    // Start auto update
    startAutoUpdate() {
        setInterval(() => {
            this.updateData();
            // Trigger custom event untuk update UI
            window.dispatchEvent(new CustomEvent('dataUpdated', { 
                detail: this.getCurrentData() 
            }));
        }, CONFIG.updateInterval);
    }
    
    // Helper functions
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Initialize data simulation
const dataSimulation = new DataSimulation();


