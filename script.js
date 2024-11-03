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

const list = document.getElementById("transactionList");

function renderList() {
    list.innerHTML = "<li>items</li>";

    transactions.forEach((transaction) => {
        const li = document.createElement('li');

        li.innerHTML = transaction.amount;

        list.appendChild(li)
    })
}

renderList();