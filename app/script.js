const transactions = JSON.parse(localStorage.getItem("transactions")) || [];


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
});

const list = document.getElementById("transactionList");
const status = document.getElementById('status');
const form = document.getElementById('transactionForm');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const filterForm = document.getElementById('filterForm');

form.addEventListener('submit', addTransaction);
filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    filterTransactions();
});

function updateTotal() {
    const incomeTotal = transactions
        .filter((trx) => trx.type === 'income')
        .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
        .filter((trx) => trx.type === 'expense')
        .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    // Format the balance based on whether it's positive or negative
    balance.textContent = formatter.format(balanceTotal);

    // If balanceTotal is negative, set the text color to red for visibility
    if (balanceTotal < 0) {
        balance.classList.add('negative');
    } else {
        balance.classList.remove('negative');
    }

    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(expenseTotal * -1);
}


function renderList() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        status.textContent = 'No transactions.';
        return;
    } else {
        status.textContent = "";
    }

    transactions.forEach(({ id, name, amount, date, type }) => {
        const sign = 'income' === type ? 1 : -1;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="name">
                <h4>${name}</h4>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="amount ${type}">
                <span>${formatter.format(amount * sign)}</span>
            </div>
            <div class="action">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="deleteTransaction(${id})">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        `;
        list.appendChild(li);
    });
}

renderList();
updateTotal();

function deleteTransaction(id) {
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index, 1);

    updateTotal();
    saveTransactions();
    renderList();
}

function addTransaction(e) {
    e.preventDefault();

    const formData = new FormData(this);

    transactions.push({
        id: transactions.length + 1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get('date')),
        type: formData.get("type") ? "income" : "expense"
    });

    this.reset();
    updateTotal();
    saveTransactions();
    renderList();
}

function filterTransactions() {
    const minAmount = parseFloat(filterForm.minAmount.value) || 0;
    const maxAmount = parseFloat(filterForm.maxAmount.value) || Infinity;
    const type = filterForm.type.value;
    const date = new Date(filterForm.date.value);
    const note = filterForm.note.value.toLowerCase();

    const filteredTransactions = transactions.filter(trx => {
        const matchesAmount = trx.amount >= minAmount && trx.amount <= maxAmount;
        const matchesType = type ? trx.type === type : true;
        const matchesDate = date.toString() !== "Invalid Date" ? new Date(trx.date).toDateString() === date.toDateString() : true;
        const matchesNote = trx.name.toLowerCase().includes(note);
        
        return matchesAmount && matchesType && matchesDate && matchesNote;
    });

    renderFilteredList(filteredTransactions);
    saveTransactions();

}

// Render the filtered transaction list
function renderFilteredList(filteredTransactions) {
    list.innerHTML = "";
    
    if (filteredTransactions.length === 0) {
        status.textContent = 'No transactions match the filter criteria.';
        return;
    } else {
        status.textContent = "";
    }

    filteredTransactions.forEach(({ id, name, amount, date, type }) => {
        const sign = 'income' === type ? 1 : -1;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="name">
                <h4>${name}</h4>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="amount ${type}">
                <span>${formatter.format(amount * sign)}</span>
            </div>
            <div class="action">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="deleteTransaction(${id})">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        `;
        list.appendChild(li);
    });
}


function saveTransactions() {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }