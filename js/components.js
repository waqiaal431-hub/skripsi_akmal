// Reusable UI Components
class UIComponents {
    // Show toast notification
    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Format number with unit
    static formatNumber(value, unit = '') {
        return `${parseFloat(value).toFixed(1)}${unit ? ' ' + unit : ''}`;
    }
    
    // Format date
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Format time
    static formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    // Get wind direction name
    static getWindDirection(degrees) {
        const directions = ['U', 'UTL', 'TL', 'T', 'TG', 'G', 'BTL', 'B'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    }
    
    // Create loading spinner
    static createLoader() {
        return `
            <div class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        `;
    }
    
    // Animate number counter
    static animateCounter(element, targetValue, duration = 1000) {
        const startValue = parseFloat(element.textContent) || 0;
        const increment = (targetValue - startValue) / (duration / 16);
        let current = startValue;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = current.toFixed(1);
        }, 16);
    }
}


