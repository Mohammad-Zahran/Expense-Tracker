let transactions = [];

const list = document.getElementById("transactionList");
const status = document.getElementById("status");
const form = document.getElementById("transactionForm");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

// Get the user ID from localStorage
const userId = localStorage.getItem("userId");

if (!userId) {
    // If no user_id is found in localStorage, redirect to login page
    window.location.href = "login.html";
} else {
    document.addEventListener("DOMContentLoaded", fetchTransactions);
}

// Fetch transactions from the server using the user ID
async function fetchTransactions() {
    try {
        // Send the GET request with the user ID as a query parameter
        const response = await axios.get(`http://localhost/Expense%20Tracker/server/getTransactions.php?user_id=${userId}`);
        
        // Check if the response has a successful structure and contains transactions
        if (response.data && response.data.status === 'success' && Array.isArray(response.data.transactions)) {
            transactions = response.data.transactions;  // Extract transactions array
            renderList();
            updateTotal();
            status.textContent = "";  // Clear any previous status message
        } else {
            console.error("Unexpected response format:", response.data);
            status.textContent = response.data.message || "Error fetching transactions.";
            transactions = [];  // Set an empty array to avoid further errors
            renderList();
            updateTotal();
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        status.textContent = "Failed to load transactions.";
        transactions = [];  // Set an empty array to avoid further errors
        renderList();
        updateTotal();
    }
}


// Add a new transaction
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const transactionData = {
        user_id: userId, 
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: formData.get("date"),
        type: formData.get("type") ? "income" : "expense"
    };

    try {
        const response = await axios.post("http://localhost/Expense%20Tracker/server/addTransactions.php", transactionData);
        if (response.data.success) {
            transactions.push(response.data.transaction);
            renderList();
            updateTotal();
            form.reset();
        } else {
            status.textContent = "Error adding transaction.";
        }
    } catch (error) {
        console.error("Error adding transaction:", error);
        status.textContent = "Failed to add transaction.";
    }
});

// Delete a transaction
async function deleteTransaction(id) {
    try {
        const response = await axios.post("http://localhost/Expense%20Tracker/server/deleteTransactions.php", { id });
        if (response.data.success) {
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

// Render the transaction list
function renderList() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        status.textContent = 'No transactions.';
        return;
    }

    transactions.forEach(({ id, name, amount, date, type }) => {
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

// Update totals for income, expense, and balance
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
