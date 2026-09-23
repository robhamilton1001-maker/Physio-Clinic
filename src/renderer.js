// Global Navigation Logic
function navigate(viewId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('hidden');
    });

    // Show selected view
    const view = document.getElementById(`view-${viewId}`);
    if (view) {
        view.classList.remove('hidden');
    }

    // Update nav styling
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-gray-800', 'text-blue-400');
    });

    // Assuming the button that called this has the view name in its text or onclick
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.getAttribute('onclick') === `navigate('${viewId}')`);
    if (activeBtn) {
        activeBtn.classList.add('bg-gray-800', 'text-blue-400');
    }
}

// Global Search Logic
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        try {
            const patients = await window.api.searchPatients(query);
            searchResults.innerHTML = '';

            if (patients.length === 0) {
                searchResults.innerHTML = '<div class="p-3 text-sm text-gray-500">No patients found.</div>';
            } else {
                patients.forEach(p => {
                    const div = document.createElement('div');
                    div.className = 'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center';
                    div.innerHTML = `
                        <div class="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                            ${p.first_name[0]}${p.last_name[0]}
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">${p.first_name} ${p.last_name}</div>
                            <div class="text-xs text-gray-500">${p.phone || 'No phone'}</div>
                        </div>
                    `;
                    div.onclick = () => {
                        // For now just alert, later we navigate to patient portfolio
                        alert(`Selected patient: ${p.first_name} ${p.last_name}`);
                        searchInput.value = '';
                        searchResults.classList.add('hidden');
                    };
                    searchResults.appendChild(div);
                });
            }
            searchResults.classList.remove('hidden');
        } catch (error) {
            console.error('Search error:', error);
        }
    });

    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
});
