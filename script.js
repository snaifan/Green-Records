// Data storage
let plants = JSON.parse(localStorage.getItem('gardenTrackerPlants')) || [
    {
        id: 1,
        name: 'MoneyMaker Tomatoes',
        type: 'Vegetable',
        seedVariety: 'MoneyMaker',
        seedSource: 'Local Market',
        seedCost: 200,
        germinationRate: 80,
        datePlanted: '2025-06-12',
        sproutingDate: '2025-06-20',
        sproutingSuccess: 75,
        expectedHarvestDate: '2025-09-01',
        location: 'Raised Bed 1',
        wateringSchedule: 'Daily',
        sunlight: 'full',
        soilType: 'Loamy',
        soilPh: 6.5,
        mulchType: 'Straw',
        mulchDate: '2025-06-25',
        mulchThickness: 5,
        mulchCost: 100,
        plantStage: 'Vegetative',
        actualHarvestDate: '',
        yieldAmount: '',
        weatherConditions: 'Temp: 25°C, Rainfall: 5mm',
        pestsDiseases: '',
        treatments: '',
        observations: 'Healthy growth, no pests'
    },
    {
        id: 2,
        name: 'Kales',
        type: 'Vegetable',
        seedVariety: 'Sukuma Wiki',
        seedSource: 'Agro Shop',
        seedCost: 150,
        germinationRate: 85,
        datePlanted: '2025-05-10',
        sproutingDate: '2025-05-18',
        sproutingSuccess: 80,
        expectedHarvestDate: '2025-07-20',
        location: 'Raised Bed 2',
        wateringSchedule: 'Every 2 days',
        sunlight: 'partial',
        soilType: 'Sandy Loam',
        soilPh: 6.8,
        mulchType: 'Grass Clippings',
        mulchDate: '2025-05-25',
        mulchThickness: 4,
        mulchCost: 50,
        plantStage: 'Harvested',
        actualHarvestDate: '2025-07-10',
        yieldAmount: '3 kg',
        weatherConditions: 'Temp: 22°C, Rainfall: 8mm',
        pestsDiseases: 'Aphids',
        treatments: 'Neem oil applied',
        observations: 'Good yield'
    }
];
let expenses = JSON.parse(localStorage.getItem('gardenTrackerExpenses')) || [
    { id: 1, date: '2025-06-10', category: 'Seeds', amount: 200, description: 'MoneyMaker Tomato seeds' },
    { id: 2, date: '2025-05-10', category: 'Mulch', amount: 50, description: 'Grass clippings' }
];
let income = JSON.parse(localStorage.getItem('gardenTrackerIncome')) || [
    { id: 1, date: '2025-07-05', source: 'Market Sales', amount: 800, cropSold: 'Spinach', description: 'Sold to neighbor' },
    { id: 2, date: '2025-07-10', source: 'Market Sales', amount: 600, cropSold: 'Kales', description: 'Market stall' }
];
let editingId = null;
let charts = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
    updateTabs();
    renderDashboard();
    switchTab('dashboard');
    // Toggle sidebar on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && e.target.closest('.sidebar') === null && !e.target.closest('header') && !e.target.closest('.modal')) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateCharts();
}

// Switch tabs
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tab}-tab`).classList.add('active');
    document.getElementById(tab).classList.add('active');
    if (tab === 'plants') renderPlants();
    else if (tab === 'watering') renderWatering();
    else if (tab === 'harvests') renderHarvests();
    else if (tab === 'expenses') renderExpenses();
    else if (tab === 'income') renderIncome();
    else if (tab === 'tasks') renderTasks();
    else if (tab === 'dashboard') renderDashboard();
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

// Show form
function showForm(type) {
    document.querySelectorAll('.form').forEach(f => f.classList.add('hidden'));
    document.getElementById(`${type}-form`).classList.remove('hidden');
    if (type === 'plant') resetPlantForm();
    else if (type === 'expense') resetExpenseForm();
    else if (type === 'income') resetIncomeForm();
}

// Cancel form
function cancelForm(type) {
    document.getElementById(`${type}-form`).classList.add('hidden');
    editingId = null;
}

// Save plant
function savePlant() {
    const plant = {
        id: editingId || Date.now(),
        name: document.getElementById('plant-name').value,
        type: document.getElementById('plant-type').value,
        seedVariety: document.getElementById('seed-variety').value,
        seedSource: document.getElementById('seed-source').value,
        seedCost: parseFloat(document.getElementById('seed-cost').value) || 0,
        germinationRate: parseInt(document.getElementById('germination-rate').value) || 0,
        datePlanted: document.getElementById('date-planted').value,
        sproutingDate: document.getElementById('sprouting-date').value,
        sproutingSuccess: parseInt(document.getElementById('sprouting-success').value) || 0,
        expectedHarvestDate: document.getElementById('expected-harvest').value,
        location: document.getElementById('location').value,
        wateringSchedule: document.getElementById('watering-schedule').value,
        sunlight: document.getElementById('sunlight').value,
        soilType: document.getElementById('soil-type').value,
        soilPh: parseFloat(document.getElementById('soil-ph').value) || 0,
        mulchType: document.getElementById('mulch-type').value,
        mulchDate: document.getElementById('mulch-date').value,
        mulchThickness: parseFloat(document.getElementById('mulch-thickness').value) || 0,
        mulchCost: parseFloat(document.getElementById('mulch-cost').value) || 0,
        plantStage: document.getElementById('plant-stage').value,
        actualHarvestDate: document.getElementById('actual-harvest-date').value,
        yieldAmount: document.getElementById('yield-amount').value,
        weatherConditions: document.getElementById('weather-conditions').value,
        pestsDiseases: document.getElementById('pests-diseases').value,
        treatments: document.getElementById('treatments').value,
        observations: document.getElementById('observations').value
    };
    if (editingId) {
        plants = plants.map(p => p.id === editingId ? plant : p);
    } else {
        plants.push(plant);
    }
    localStorage.setItem('gardenTrackerPlants', JSON.stringify(plants));
    editingId = null;
    document.getElementById('plant-form').classList.add('hidden');
    updateTabs();
    renderPlants();
    renderDashboard();
    renderPlantsTable();
}

// Save expense
function saveExpense() {
    const expense = {
        id: editingId || Date.now(),
        date: document.getElementById('expense-date').value,
        category: document.getElementById('expense-category').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        description: document.getElementById('expense-description').value
    };
    if (editingId) {
        expenses = expenses.map(e => e.id === editingId ? expense : e);
    } else {
        expenses.push(expense);
    }
    localStorage.setItem('gardenTrackerExpenses', JSON.stringify(expenses));
    editingId = null;
    document.getElementById('expense-form').classList.add('hidden');
    updateSummary();
    updateTabs();
    renderExpenses();
}

// Save income
function saveIncome() {
    const incomeItem = {
        id: editingId || Date.now(),
        date: document.getElementById('income-date').value,
        source: document.getElementById('income-source').value,
        amount: parseFloat(document.getElementById('income-amount').value),
        cropSold: document.getElementById('income-crop-sold').value,
        description: document.getElementById('income-description').value
    };
    if (editingId) {
        income = income.map(i => i.id === editingId ? incomeItem : i);
    } else {
        income.push(incomeItem);
    }
    localStorage.setItem('gardenTrackerIncome', JSON.stringify(income));
    editingId = null;
    document.getElementById('income-form').classList.add('hidden');
    updateSummary();
    updateTabs();
    renderIncome();
}

// Reset forms
function resetPlantForm(plant = {}) {
    document.getElementById('plant-form-title').textContent = editingId ? 'Edit Plant' : 'Add New Plant';
    document.getElementById('plant-name').value = plant.name || '';
    document.getElementById('plant-type').value = plant.type || '';
    document.getElementById('seed-variety').value = plant.seedVariety || '';
    document.getElementById('seed-source').value = plant.seedSource || '';
    document.getElementById('seed-cost').value = plant.seedCost || '';
    document.getElementById('germination-rate').value = plant.germinationRate || '';
    document.getElementById('date-planted').value = plant.datePlanted || '';
    document.getElementById('sprouting-date').value = plant.sproutingDate || '';
    document.getElementById('sprouting-success').value = plant.sproutingSuccess || '';
    document.getElementById('expected-harvest').value = plant.expectedHarvestDate || '';
    document.getElementById('location').value = plant.location || '';
    document.getElementById('watering-schedule').value = plant.wateringSchedule || '';
    document.getElementById('sunlight').value = plant.sunlight || 'full';
    document.getElementById('soil-type').value = plant.soilType || '';
    document.getElementById('soil-ph').value = plant.soilPh || '';
    document.getElementById('mulch-type').value = plant.mulchType || '';
    document.getElementById('mulch-date').value = plant.mulchDate || '';
    document.getElementById('mulch-thickness').value = plant.mulchThickness || '';
    document.getElementById('mulch-cost').value = plant.mulchCost || '';
    document.getElementById('plant-stage').value = plant.plantStage || 'Seedling';
    document.getElementById('actual-harvest-date').value = plant.actualHarvestDate || '';
    document.getElementById('yield-amount').value = plant.yieldAmount || '';
    document.getElementById('weather-conditions').value = plant.weatherConditions || '';
    document.getElementById('pests-diseases').value = plant.pestsDiseases || '';
    document.getElementById('treatments').value = plant.treatments || '';
    document.getElementById('observations').value = plant.observations || '';
}

function resetExpenseForm(expense = {}) {
    document.getElementById('expense-form-title').textContent = editingId ? 'Edit Expense' : 'Add New Expense';
    document.getElementById('expense-date').value = expense.date || '';
    document.getElementById('expense-category').value = expense.category || '';
    document.getElementById('expense-amount').value = expense.amount || '';
    document.getElementById('expense-description').value = expense.description || '';
}

function resetIncomeForm(incomeItem = {}) {
    document.getElementById('income-form-title').textContent = editingId ? 'Edit Income' : 'Add New Income';
    document.getElementById('income-date').value = incomeItem.date || '';
    document.getElementById('income-source').value = incomeItem.source || '';
    document.getElementById('income-amount').value = incomeItem.amount || '';
    document.getElementById('income-crop-sold').value = incomeItem.cropSold || '';
    document.getElementById('income-description').value = incomeItem.description || '';
}


// Show plants modal
function showPlantsModal() {
    document.getElementById('plants-modal').classList.remove('hidden');
    renderPlantsTable();
}

// Close plants modal
function closePlantsModal() {
    document.getElementById('plants-modal').classList.add('hidden');
}

// Close modal when clicking outside modal-content
function closeModalOnOutsideClick(event) {
    if (event.target.classList.contains('modal')) {
        closePlantsModal();
    }
}

// Render plants table
function renderPlantsTable() {
    const tableContainer = document.getElementById('plants-table');
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Stage</th>
                    <th>Planted</th>
                    <th>Yield</th>
                    <th>Weather</th>
                    <th>Mulch</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${plants.length ? plants.map(plant => `
                    <tr>
                        <td>${plant.name}</td>
                        <td>${plant.type}</td>
                        <td>${plant.plantStage}</td>
                        <td>${plant.datePlanted ? new Date(plant.datePlanted).toLocaleDateString() : 'N/A'}</td>
                        <td>${plant.yieldAmount || 'N/A'}</td>
                        <td>${plant.weatherConditions || 'N/A'}</td>
                        <td>${plant.mulchType || 'N/A'}${plant.mulchDate ? ` (${new Date(plant.mulchDate).toLocaleDateString()})` : ''}</td>
                        <td>${plant.location || 'N/A'}</td>
                        <td>
                            <button class="edit" onclick="editPlant(${plant.id})"><i class="fas fa-edit"></i></button>
                            <button class="delete" onclick="deletePlant(${plant.id})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('') : '<tr><td colspan="9">No plants added yet.</td></tr>'}
            </tbody>
        </table>
    `;
}

// Update the mobile click handler in the initialization block
document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
    updateTabs();
    renderDashboard();
    switchTab('dashboard');
    // Toggle sidebar on mobile, but exclude modal clicks
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            e.target.closest('.sidebar') === null && 
            e.target.closest('header') === null && 
            e.target.closest('.modal') === null) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});

// Existing code below...

// Render functions
function renderDashboard() {
    updateSummary();
    // Plant Stages Chart
    const stages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvested'];
    const stageCounts = stages.map(stage => plants.filter(p => p.plantStage === stage).length);
    if (charts.plantStages) charts.plantStages.destroy();
    charts.plantStages = new Chart(document.getElementById('plant-stages-chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: stages,
            datasets: [{
                label: 'Plants by Stage',
                data: stageCounts,
                backgroundColor: ['#27ae60', '#3498db', '#e67e22', '#e74c3c', '#7f8c8d'],
                borderColor: ['#219653', '#2980b9', '#d35400', '#c0392b', '#6c7a89'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, precision: 0 }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Plants by Stage', font: { size: 16 } }
            }
        }
    });

    // Yield Over Time Chart
    const months = [];
    const yields = [];
    const startDate = new Date(Math.min(...plants.filter(p => p.actualHarvestDate).map(p => new Date(p.actualHarvestDate))));
    const endDate = new Date();
    for (let d = new Date(startDate.getFullYear(), startDate.getMonth()); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months.push(month);
        const totalYield = plants
            .filter(p => p.actualHarvestDate && p.actualHarvestDate.startsWith(month))
            .reduce((sum, p) => sum + (parseFloat(p.yieldAmount) || 0), 0);
        yields.push(totalYield);
    }
    if (charts.yieldChart) charts.yieldChart.destroy();
    charts.yieldChart = new Chart(document.getElementById('yield-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Yield (kg)',
                data: yields,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Yield (kg)' } }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Yield Over Time', font: { size: 16 } }
            }
        }
    });

    // Expenses by Category Chart
    const expenseCategories = ['Seeds', 'Fertilizer', 'Mulch', 'Tools', 'Pesticides', 'Other'];
    const expenseAmounts = expenseCategories.map(cat => 
        expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    );
    if (charts.expensesChart) charts.expensesChart.destroy();
    charts.expensesChart = new Chart(document.getElementById('expenses-chart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: expenseCategories,
            datasets: [{
                data: expenseAmounts,
                backgroundColor: ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#e67e22', '#7f8c8d'],
                borderColor: ['#c0392b', '#2980b9', '#f39c12', '#8e44ad', '#d35400', '#6c7a89'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Expenses by Category', font: { size: 16 } }
            }
        }
    });

    // Income vs. Expenses Over Time Chart
    const incomeData = months.map(month => 
        income.filter(i => i.date.startsWith(month)).reduce((sum, i) => sum + i.amount, 0)
    );
    const expenseData = months.map(month => 
        expenses.filter(e => e.date.startsWith(month)).reduce((sum, e) => sum + e.amount, 0)
    );
    if (charts.incomeExpensesChart) charts.incomeExpensesChart.destroy();
    charts.incomeExpensesChart = new Chart(document.getElementById('income-expenses-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income (KES)',
                    data: incomeData,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses (KES)',
                    data: expenseData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Amount (KES)' } }
            },
            plugins: {
                legend: { display: true },
                title: { display: true, text: 'Income vs. Expenses Over Time', font: { size: 16 } }
            }
        }
    });

    // Weather Impact Chart (Average Temperature by Plant Stage)
    const avgTemps = stages.map(stage => {
        const relevantPlants = plants.filter(p => p.plantStage === stage && p.weatherConditions);
        const temps = relevantPlants.map(p => {
            const match = p.weatherConditions.match(/Temp: (\d+\.?\d*)°C/);
            return match ? parseFloat(match[1]) : 0;
        });
        return temps.length ? temps.reduce((sum, t) => sum + t, 0) / temps.length : 0;
    });
    if (charts.weatherChart) charts.weatherChart.destroy();
    charts.weatherChart = new Chart(document.getElementById('weather-chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: stages,
            datasets: [{
                label: 'Avg Temperature (°C)',
                data: avgTemps,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Temperature (°C)' } }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Average Temperature by Plant Stage', font: { size: 16 } }
            }
        }
    });
}

function updateCharts() {
    renderDashboard(); // Re-render all charts to update colors for dark/light mode
}

function renderPlants() {
    const list = document.getElementById('plants-list');
    list.innerHTML = plants.length ? '' : '<div class="card"><p>No plants added yet.</p></div>';
    plants.forEach(plant => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${plant.name} (${plant.type})</h3>
            <p>Seed: ${plant.seedVariety || 'N/A'} from ${plant.seedSource || 'N/A'} (KES ${plant.seedCost || 0})</p>
            <p>Germination: ${plant.germinationRate || 0}%${plant.sproutingDate ? `, Sprouted: ${new Date(plant.sproutingDate).toLocaleDateString()} (${plant.sproutingSuccess || 0}%)` : ''}</p>
            <p>Planted: ${new Date(plant.datePlanted).toLocaleDateString()}</p>
            <p>Stage: ${plant.plantStage}</p>
            <p>Location: ${plant.location || 'N/A'}</p>
            <p>Watering: ${plant.wateringSchedule}</p>
            <p>Soil: ${plant.soilType || 'N/A'}, pH ${plant.soilPh || 'N/A'}</p>
            <p>Mulch: ${plant.mulchType || 'N/A'}${plant.mulchDate ? `, Applied: ${new Date(plant.mulchDate).toLocaleDateString()}` : ''}${plant.mulchThickness ? `, ${plant.mulchThickness}cm` : ''}</p>
            ${plant.expectedHarvestDate ? `<p>Harvest: ${new Date(plant.expectedHarvestDate).toLocaleDateString()}</p>` : ''}
            ${plant.weatherConditions ? `<p>Weather: ${plant.weatherConditions}</p>` : ''}
            ${plant.pestsDiseases ? `<p>Pests/Diseases: ${plant.pestsDiseases}</p>` : ''}
            ${plant.observations ? `<p>Observations: ${plant.observations}</p>` : ''}
            <div class="actions">
                <button onclick="editPlant(${plant.id})" class="edit"><i class="fas fa-edit"></i></button>
                <button onclick="deletePlant(${plant.id})" class="delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

function renderWatering() {
    const list = document.getElementById('watering-list');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = plants.filter(plant => {
        if (!plant.wateringSchedule || !plant.datePlanted) return false;
        const planted = new Date(plant.datePlanted);
        const days = Math.floor((today - planted) / (1000 * 60 * 60 * 24));
        return plant.wateringSchedule === 'Daily' || 
               (plant.wateringSchedule === 'Every 2 days' && days % 2 === 0) ||
               (plant.wateringSchedule === 'Weekly' && days % 7 === 0) ||
               (plant.wateringSchedule === 'Bi-weekly' && days % 14 === 0);
    });
    list.innerHTML = due.length ? '' : '<div class="card"><p>No plants need watering today.</p></div>';
    due.forEach(plant => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${plant.name}</h3>
            <p>Schedule: ${plant.wateringSchedule}</p>
            <p>Location: ${plant.location || 'N/A'}</p>
            <p>Stage: ${plant.plantStage}</p>
        `;
        list.appendChild(div);
    });
    document.getElementById('watering-count').textContent = due.length;
}

function renderHarvests() {
    const list = document.getElementById('harvests-list');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = plants.filter(plant => {
        if (!plant.expectedHarvestDate) return false;
        const harvest = new Date(plant.expectedHarvestDate);
        return harvest >= today && harvest <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    });
    list.innerHTML = upcoming.length ? '' : '<div class="card"><p>No upcoming harvests.</p></div>';
    upcoming.forEach(plant => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${plant.name}</h3>
            <p>Type: ${plant.type}</p>
            <p>Location: ${plant.location || 'N/A'}</p>
            <p>Harvest by: ${new Date(plant.expectedHarvestDate).toLocaleDateString()}</p>
            <p>Stage: ${plant.plantStage}</p>
        `;
        list.appendChild(div);
    });
    document.getElementById('harvests-count').textContent = upcoming.length;
}

function renderExpenses() {
    const list = document.getElementById('expenses-list');
    list.innerHTML = expenses.length ? '' : '<div class="card"><p>No expenses recorded.</p></div>';
    expenses.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>KES ${exp.amount.toFixed(2)}</h3>
            <p>Category: ${exp.category}</p>
            <p>Date: ${new Date(exp.date).toLocaleDateString()}</p>
            ${exp.description ? `<p>Description: ${exp.description}</p>` : ''}
            <div class="actions">
                <button onclick="editExpense(${exp.id})" class="edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteExpense(${exp.id})" class="delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

function renderIncome() {
    const list = document.getElementById('income-list');
    list.innerHTML = income.length ? '' : '<div class="card"><p>No income recorded.</p></div>';
    income.forEach(inc => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>KES ${inc.amount.toFixed(2)}</h3>
            <p>Source: ${inc.source}</p>
            <p>Date: ${new Date(inc.date).toLocaleDateString()}</p>
            ${inc.cropSold ? `<p>Crop Sold: ${inc.cropSold}</p>` : ''}
            ${inc.description ? `<p>Description: ${inc.description}</p>` : ''}
            <div class="actions">
                <button onclick="editIncome(${inc.id})" class="edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteIncome(${inc.id})" class="delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

function renderTasks() {
    const list = document.getElementById('tasks-list');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasks = [];
    plants.forEach(plant => {
        if (plant.wateringSchedule) {
            const planted = new Date(plant.datePlanted);
            const days = Math.floor((today - planted) / (1000 * 60 * 60 * 24));
            if (plant.wateringSchedule === 'Daily' || 
                (plant.wateringSchedule === 'Every 2 days' && days % 2 === 0) ||
                (plant.wateringSchedule === 'Weekly' && days % 7 === 0) ||
                (plant.wateringSchedule === 'Bi-weekly' && days % 14 === 0)) {
                tasks.push({ type: 'Watering', name: plant.name, location: plant.location });
            }
        }
        if (plant.expectedHarvestDate) {
            const harvest = new Date(plant.expectedHarvestDate);
            if (harvest >= today && harvest <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
                tasks.push({ type: 'Harvest', name: plant.name, location: plant.location, due: plant.expectedHarvestDate });
            }
        }
        if (plant.mulchDate && new Date(plant.mulchDate) <= today) {
            tasks.push({ type: 'Check Mulch', name: plant.name, location: plant.location });
        }
    });
    list.innerHTML = tasks.length ? '' : '<div class="card"><p>No tasks due.</p></div>';
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${task.type}: ${task.name}</h3>
            <p>Location: ${task.location || 'N/A'}</p>
            ${task.due ? `<p>Due: ${new Date(task.due).toLocaleDateString()}</p>` : ''}
        `;
        list.appendChild(div);
    });
    document.getElementById('tasks-count').textContent = tasks.length;
}

// Edit and delete functions
function editPlant(id) {
    editingId = id;
    const plant = plants.find(p => p.id === id);
    resetPlantForm(plant);
    showForm('plant');
    closePlantsModal();
}

function deletePlant(id) {
    if (confirm('Delete this plant?')) {
        plants = plants.filter(p => p.id !== id);
        localStorage.setItem('gardenTrackerPlants', JSON.stringify(plants));
        updateTabs();
        renderPlants();
        renderDashboard();
        renderPlantsTable();
    }
}

function editExpense(id) {
    editingId = id;
    const expense = expenses.find(e => e.id === id);
    resetExpenseForm(expense);
    showForm('expense');
}

function deleteExpense(id) {
    if (confirm('Delete this expense?')) {
        expenses = expenses.filter(e => e.id !== id);
        localStorage.setItem('gardenTrackerExpenses', JSON.stringify(expenses));
        updateSummary();
        updateTabs();
        renderExpenses();
    }
}

function editIncome(id) {
    editingId = id;
    const incomeItem = income.find(i => i.id === id);
    resetIncomeForm(incomeItem);
    showForm('income');
}

function deleteIncome(id) {
    if (confirm('Delete this income?')) {
        income = income.filter(i => i.id !== id);
        localStorage.setItem('gardenTrackerIncome', JSON.stringify(income));
        updateSummary();
        updateTabs();
        renderIncome();
    }
}

// Export and import data
function exportData() {
    const data = { plants, expenses, income };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'garden-tracker-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const data = JSON.parse(reader.result);
        plants = data.plants || [];
        expenses = data.expenses || [];
        income = data.income || [];
        localStorage.setItem('gardenTrackerPlants', JSON.stringify(plants));
        localStorage.setItem('gardenTrackerExpenses', JSON.stringify(expenses));
        localStorage.setItem('gardenTrackerIncome', JSON.stringify(income));
        updateSummary();
        updateTabs();
        renderDashboard();
        renderPlantsTable();
    };
    reader.readAsText(file);
}

// Update summary and tabs
function updateSummary() {
    const totalIncome = income.reduce((sum, inc) => sum + (inc.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    document.getElementById('total-income').textContent = `KES ${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `KES ${totalExpenses.toFixed(2)}`;
    document.getElementById('net-profit').textContent = `KES ${netProfit.toFixed(2)}`;
}

function updateTabs() {
    document.getElementById('plants-count').textContent = plants.length;
    document.getElementById('expenses-count').textContent = expenses.length;
    document.getElementById('income-count').textContent = income.length;
    renderWatering();
    renderHarvests();
    renderTasks();
}

// Load theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}