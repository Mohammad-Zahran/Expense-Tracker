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

// The formatter variable is an instance of Intl.NumberFormat, which is part of JavaScript's Intl (Internationalization) API. It’s used to format numbers as currency, in this case, US dollars. Here’s what each option does:

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
})

const list = document.getElementById("transactionList");
const status = document.getElementById('status');
const form = document.getElementById('transactionForm');
const budget = document.getElementById('budget');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

form.addEventListener('submit', addTransaction);

function renderList() {
    list.innerHTML = "";

    // this condition will check if the dummy transaction is empty
    if (transactions.length === 0) {
        status.textContent = 'No transactions.'
        return;
    }
    else{
        status.textContent = "";
    }

    // The for each here is taking the data and creating new elements when fetching them
    transactions.forEach(({ id, name, amount, date, type }) => {

        const sign = 'income' === type ? 1: -1;

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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="size-6" onclick="deleteTransaction(${id})">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>

        `;

        list.appendChild(li)
    });
}

renderList();

function deleteTransaction(id) {
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index,1);

    renderList();
}

// This function will make the user add the new data and submit it without reloading the page
function addTransaction(e){
    // I used e.preventDefault() to not reload the page when pressing the submit
    e.preventDefault();

    const formData = new FormData(this);

    // This will push the new transaction
    transactions.push({
        id: transactions.length + 1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get('date')),
        type: "on" === formData.get("type") ? "income" : "expense"
    });

    this.reset();

    renderList();

}