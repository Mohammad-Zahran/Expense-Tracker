const transactions = [
    {
        id: 1,
        name: 'salary',
        amount: 5000,
        date: new Date(),
        type: 'income'
    },
    {
        id: 2,
        name: 'haircut',
        amount: 20,
        date: new Date(),
        type: 'expense'
    },
    {
        id: 3,
        name: 'ticket',
        amount: 350,
        date: new Date(),
        type: 'expense'
    },
];

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

    balance.textContent = formatter.format(balanceTotal).substring(1);
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
}

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
