let transactions = [];

const list = document.getElementById("transactionList");
const status = document.getElementById("status");
const form = document.getElementById("transactionForm");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "login.html";
} else {
    document.addEventListener("DOMContentLoaded", fetchTransactions);
}

async function fetchTransactions() {
    try {
        const response = await axios.get(`http://localhost/Expense%20Tracker/server/getTransactions.php?user_id=${userId}`);
        
        console.log('Fetch Response:', response.data); // Debug: Log response data

        if (response.data && response.data.status === 'success' && Array.isArray(response.data.transactions)) {
            transactions = response.data.transactions;  
            renderList();
            updateTotal();
            status.textContent = "";  
        } else if (response.data.status === 'no_transactions') {
            transactions = [];
            renderList();
            updateTotal();
            status.textContent = response.data.message; 
        } else {
            console.error("Unexpected response format:", response.data);
            status.textContent = response.data.message || "Error fetching transactions.";
            transactions = []; 
            renderList();
            updateTotal();
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        status.textContent = "Failed to load transactions.";
        transactions = [];  
        renderList();
        updateTotal();
    }
}

function renderList() {
    list.innerHTML = "";


    if (transactions.length === 0) {
        status.textContent = 'No transactions.';
        return;
    }

    transactions.forEach(({ id, name, amount, date, type }) => {
        if (typeof id !== 'number') {
            console.error('Invalid ID:', id); // Debug: Log invalid ID
            return;
        }

        const sign = type === 'income' ? 1 : -1;
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

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); 

    const transactionData = {
        user_id: userId,
        name: form.name.value,
        amount: parseFloat(form.amount.value),
        date: form.date.value,
        type: form.type.value
    };


    try {
        const response = await axios.post("http://localhost/Expense%20Tracker/server/addTransactions.php", transactionData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.status === 'success') {
            transactions.push({
                id: response.data.id,
                ...transactionData
            });
            renderList();
            updateTotal();
            form.reset();
        } else {
            status.textContent = response.data.message || "Error adding transaction.";
        }
    } catch (error) {
        console.error("Error adding transaction:", error);
        status.textContent = "Failed to add transaction.";
    }
});


async function deleteTransaction(id) {
    try {
        const response = await axios.get(`http://localhost/Expense%20Tracker/server/deleteTransactions.php?id=${id}`);

        if (response.data.status === 'success') {
            transactions = transactions.filter(trx => trx.id !== id);
            renderList();  
            updateTotal();  
        } else {
            status.textContent = "Error deleting transaction.";
        }
    } catch (error) {
        console.error("Error deleting transaction:", error);
        status.textContent = "Failed to delete transaction.";
    }
}

function updateTotal() {
    const incomeTotal = transactions
        .filter((trx) => trx.type === 'income')
        .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
        .filter((trx) => trx.type === 'expense')
        .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    balance.textContent = formatter.format(balanceTotal);
    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(expenseTotal * -1);

    balance.classList.toggle('negative', balanceTotal < 0);
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
});

