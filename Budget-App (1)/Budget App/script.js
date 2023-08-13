// JavaScript code

let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

//Set Budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  //empty or negative input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    //Set Budget
    amount.innerHTML = tempAmount;
    //Set Balance
    balanceValue.innerText = tempAmount - expenditureValue.innerText;
    //Clear Input Box
    totalAmount.value = "";
  }
});

//Function To Disable Edit and Delete Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Function To Modify List Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }
  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText =
    parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();
};

//Function To Create List
const listCreator = (expenseName, expenseValue, expenseDate) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p><p class="date">${expenseDate}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(sublistContent);
};

//Function To Add Expenses
checkAmountButton.addEventListener("click", () => {
  //empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  //Enable buttons
  disableButtons(false);
  //Expense
  let expenditure = parseInt(userAmount.value);
  //Total expense (existing + new)
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;
  //Total balance(budget - total expense)
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;
  //Create list
  const expenseDate = document.getElementById("expense-date").value; // Get the date value
  listCreator(productTitle.value, userAmount.value, expenseDate); // Create list with date value
  //Empty inputs
  productTitle.value = "";
  userAmount.value = "";

  // Check if the expense reaches 80% of the budget
  if (sum >= tempAmount * 0.8) {
    alert("Warning: You have reached 80% of your budget!");
  }
});

// for export data 
const exportDataButton = document.getElementById("export-data");

exportDataButton.addEventListener("click", () => {
  const dataToExport = [
    ["Expense Name", "Amount", "Date"], // Header row
  ];

  // Collect data from the list
  const listItems = document.querySelectorAll(".sublist-content");
  listItems.forEach((item) => {
    const expenseName = item.querySelector(".product").innerText;
    const expenseAmount = item.querySelector(".amount").innerText;
    const expenseDate = item.querySelector(".date").innerText;
    dataToExport.push([expenseName, expenseAmount, expenseDate]);
  });

  // Generate CSV content
  const csvContent =
    "data:text/csv;charset=utf-8," +
    dataToExport.map((row) => row.join(",")).join("\n");

  // Create a download link and trigger the download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "budget_data.csv");
  document.body.appendChild(link);
  link.click();
});

// ...

// Chart Data
const chartData = {
  labels: ["Total Budget", "Expenses", "Balance"],
  datasets: [
    {
      label: "Amount",
      data: [parseInt(amount.innerText), parseInt(expenditureValue.innerText), parseInt(balanceValue.innerText)],
      backgroundColor: [
        "#587ef4", // Total Budget
        "#ff465a", // Expenses
        "#32cd32", // Balance
      ],
      borderColor: "#ffffff",
      borderWidth: 1,
    },
  ],
};

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};



