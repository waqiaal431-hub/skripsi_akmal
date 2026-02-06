// Manajemen Pengguna Logic
const users = [
    { id: 1, name: 'Dr. Ahmad Hidayat', email: 'ahmad@meteo.id', role: 'Pimpinan', status: 'Aktif', lastLogin: '2024-01-15 10:30' },
    { id: 2, name: 'Budi Santoso', email: 'budi@meteo.id', role: 'Pimpinan', status: 'Aktif', lastLogin: '2024-01-15 09:15' },
    { id: 3, name: 'Siti Nurhaliza', email: 'siti@meteo.id', role: 'Pimpinan', status: 'Aktif', lastLogin: '2024-01-14 16:45' },
    { id: 4, name: 'Rina Wati', email: 'rina@meteo.id', role: 'Data Input', status: 'Aktif', lastLogin: '2024-01-15 11:20' },
    { id: 5, name: 'Joko Widodo', email: 'joko@meteo.id', role: 'Data Input', status: 'Aktif', lastLogin: '2024-01-15 08:00' },
    { id: 6, name: 'Dewi Sartika', email: 'dewi@meteo.id', role: 'Data Input', status: 'Aktif', lastLogin: '2024-01-15 07:30' },
    { id: 7, name: 'Andi Pratama', email: 'andi@meteo.id', role: 'Data Input', status: 'Aktif', lastLogin: '2024-01-14 15:10' },
    { id: 8, name: 'Maya Sari', email: 'maya@meteo.id', role: 'Data Input', status: 'Aktif', lastLogin: '2024-01-14 14:25' },
    { id: 9, name: 'Rudi Hartono', email: 'rudi@meteo.id', role: 'Data Input', status: 'Aktif', lastLogin: '2024-01-14 13:40' },
    { id: 10, name: 'Lina Kurnia', email: 'lina@meteo.id', role: 'Data Input', status: 'Nonaktif', lastLogin: '2024-01-10 12:00' },
    { id: 11, name: 'Bambang S', email: 'bambang@meteo.id', role: 'Data Input', status: 'Aktif', lastLogin: '2024-01-13 11:15' },
    { id: 12, name: 'Sari Indah', email: 'sari@meteo.id', role: 'Data Input', status: 'Nonaktif', lastLogin: '2024-01-08 09:30' }
];

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
});

function loadUsers() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-800 hover:bg-gray-800/50 transition-colors';
        
        const statusColor = user.status === 'Aktif' ? 'text-green-400' : 'text-red-400';
        const statusBg = user.status === 'Aktif' ? 'bg-green-500/20' : 'bg-red-500/20';
        const roleColor = user.role === 'Pimpinan' ? 'text-purple-400' : 'text-green-400';
        
        row.innerHTML = `
            <td class="py-4 text-white font-semibold">${user.name}</td>
            <td class="py-4 text-gray-300">${user.email}</td>
            <td class="py-4"><span class="${roleColor} font-semibold">${user.role}</span></td>
            <td class="py-4">
                <span class="${statusColor} ${statusBg} px-3 py-1 rounded-full text-xs font-semibold">${user.status}</span>
            </td>
            <td class="py-4 text-gray-300">${user.lastLogin}</td>
            <td class="py-4">
                <div class="flex gap-2">
                    <button onclick="editUser(${user.id})" class="text-blue-400 hover:text-blue-300">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="text-red-400 hover:text-red-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchUsers() {
    const searchTerm = document.getElementById('searchUser').value.toLowerCase();
    const rows = document.querySelectorAll('#userTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function openAddUserModal() {
    document.getElementById('addUserModal').classList.remove('hidden');
    document.getElementById('addUserModal').classList.add('flex');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.add('hidden');
    document.getElementById('addUserModal').classList.remove('flex');
    document.getElementById('addUserForm').reset();
}

function addUser(event) {
    event.preventDefault();
    UIComponents.showToast('Pengguna berhasil ditambahkan', 'success');
    closeAddUserModal();
    // In real app, would add to users array and reload
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    UIComponents.showToast(`Edit pengguna: ${user.name}`, 'info');
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (confirm(`Apakah Anda yakin ingin menghapus ${user.name}?`)) {
        UIComponents.showToast('Pengguna berhasil dihapus', 'success');
        // In real app, would remove from users array and reload
    }
}


