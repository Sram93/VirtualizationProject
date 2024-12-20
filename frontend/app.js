const apiUrl = "http://127.0.0.1:5000/transactions"; // URL de l'API Flask

const transactionForm = document.getElementById('transactionForm');
const transactionItems = document.getElementById('transactionItems');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const balance = document.getElementById('balance');

let transactions = [];

// Mettre à jour les totaux et le solde
function updateSummary() {
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expense = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    totalIncome.textContent = income.toFixed(2);
    totalExpense.textContent = expense.toFixed(2);
    balance.textContent = (income - expense).toFixed(2);
}

// Afficher une transaction dans la liste
function addTransactionToDOM(transaction) {
    const tr = document.createElement('tr');
    
    const dateCell = document.createElement('td');
    dateCell.textContent = new Date(transaction.date).toLocaleDateString();
    tr.appendChild(dateCell);

    const amountCell = document.createElement('td');
    amountCell.textContent = `${transaction.amount.toFixed(2)} €`;
    tr.appendChild(amountCell);

    const typeCell = document.createElement('td');
    typeCell.textContent = transaction.type === 'income' ? 'Revenu' : 'Dépense';
    tr.appendChild(typeCell);

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = transaction.description;
    tr.appendChild(descriptionCell);

    // Ajouter un bouton de suppression dans la dernière cellule
    const deleteCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));
    deleteCell.appendChild(deleteBtn);
    tr.appendChild(deleteCell);

    transactionItems.appendChild(tr);
}

// Charger les transactions depuis l'API
async function fetchTransactions() {
    const response = await fetch(apiUrl);
    if (response.ok) {
        transactions = await response.json();

        transactionItems.innerHTML = ""; // Vider la liste
        transactions.forEach(addTransactionToDOM);
        updateSummary();
    } else {
        alert("Erreur lors de la récupération des transactions.");
    }
}

// Ajouter une transaction via l'API
async function createTransaction(transaction) {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
    });

    if (response.ok) {
        fetchTransactions(); // Recharger les transactions
    } else {
        alert("Erreur lors de l'ajout de la transaction");
    }
}

// Supprimer une transaction via l'API
async function deleteTransaction(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        fetchTransactions(); // Recharger les transactions
    } else {
        alert("Erreur lors de la suppression de la transaction");
    }
}

// Gérer le formulaire d'ajout
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('transactionType').value;
    const description = document.getElementById('description').value;

    if (!amount || !type || !description) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const newTransaction = {
        amount,
        type,
        description,
        date: new Date().toISOString()  // Ajout de la date de la transaction
    };

    createTransaction(newTransaction);
    transactionForm.reset();
});

// Charger les données au démarrage
fetchTransactions();
