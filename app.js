
// BUDGET CONTROLLER
let budgetController = (function () {

  let iStorage = [];
  let eStorage = [];
  let totalInc = (totalExp = 0);

  // Finding month
  function monthFinder(month) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

    return months[month];
  }


  // Total Income (Green)
  function totalIncomeFinder(incomeTotal) {
    totalInc = 0;
    iStorage.forEach((i) => (totalInc += i));

    document.querySelector(`${incomeTotal}`).textContent = `+ ${totalInc}`;
  };

  
  //Total expense (Red)
  function totalExpenseFinder(expenseTotal) {
    totalExp = 0;
    eStorage.forEach((ex) => (totalExp += ex));

    document.querySelector(`${expenseTotal}`).textContent = `- ${totalExp}`;
  };


// Total expense percentage
  function totalExpensePercentageFinder(expPercent, expenseList, exItemPercent) {
    let totalPerc = parseFloat((totalExp * 100) / totalInc).toFixed(2);

    if (totalPerc == 0 || totalPerc == "Infinity" || totalPerc == "NaN") totalPerc = 0;
    document.querySelector(`${expPercent}`).textContent = `${totalPerc}%`;

    // calling individual expense finder
    indExpenseFinder(expenseList, exItemPercent);
    
  };


// Individual Expense finder
  function indExpenseFinder(expenseList, exItemPercent) {
    let temp = [...document.querySelector(`${expenseList}`).children];

    temp.forEach((el) => {
      let perc = parseFloat(
        (+eStorage[el.id.slice(el.id.indexOf("-") + 1)] * 100) / totalInc
      ).toFixed(2);

      if (perc == 0 || perc == "Infinity" || perc == "NaN") perc = 0;

      el.querySelector(`${exItemPercent}`).textContent = `${perc}%`;
    });

  }


  //available budget (Main)
  function budgetFinder(avBudget) {
    document.querySelector(`${avBudget}`).textContent = `${totalInc - totalExp}`
      //totalInc - totalExp > 0 ? `+ ${totalInc - totalExp}` : `+ ${0}`;
  };



  //Add items to Storage
  function addItemsToArray(
    addType,value,description,incomeList,expenseList,incomeTotal,expenseTotal,avBudget,expPercent,exItemPercent
    )
    {
    let htmlEle, parent;

    // Item -> income

    if (addType === "inc") {

      htmlEle = 
      
      `<div class="item clearfix" id="${ iStorage.length === 0 ? 0 : "income-" + iStorage.length }">
              <div class="item__description">${description}</div>
              <div class="right clearfix">
                  <div class="item__value">+ ${value}</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>`;

      // To storage
      iStorage.push(value);
      
      // UI display
      display = document.querySelector(`${incomeList}`);

      //income calculate
      totalIncomeFinder(incomeTotal);

    } else {

      // item -> expense
      
      htmlEle = 

      `<div class="item clearfix" id="${ eStorage.length === 0 ? 0 : "expense-" + eStorage.length }">
              <div class="item__description">${description}</div>
              <div class="right clearfix">
                  <div class="item__value">- ${value}</div>
                  <div class="item__percentage">- 1%</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>`;

      //pushing to expense
      eStorage.push(value);

      // UI display
      display = document.querySelector(`${expenseList}`);

      //expense calculate
      totalExpenseFinder(expenseTotal);
    };

    // create DOM nodes from a string of HTML
    let el = document.createRange().createContextualFragment(htmlEle);

    display.appendChild(el);

    // Find budget
    budgetFinder(avBudget);

    // Find Expense percentage
    totalExpensePercentageFinder(expPercent, expenseList, exItemPercent);
  };


  //Item Delete from Storage
  function deleteItemsFromArray(
    e,incomeList,expenseList,incomeTotal,expenseTotal,avBudget,expPercent,exItemPercent
    )
    {
    if (e.parentNode.classList.contains(incomeList.slice(1))) {
      iStorage[parseInt(e.id.slice(e.id.indexOf("-") + 1))] = 0;
      totalIncomeFinder(incomeTotal);
    } else {
      eStorage[parseInt(e.id.slice(e.id.indexOf("-") + 1))] = 0;
      totalExpenseFinder(expenseTotal);
    }
    e.parentNode.removeChild(e);

    // Recalculating budget
    budgetFinder(avBudget);

    // Finding total Expense Percentage
    totalExpensePercentageFinder(expPercent, expenseList, exItemPercent);
  };

  return {
    monthFinder,addItemsToArray,deleteItemsFromArray,totalExpensePercentageFinder
  };
})();



// DISPLAY CONTROLLER
let displayController = (function () {

  let domClasses = {    
    month: document.querySelector(".budget__title--month"),
    addType: document.querySelector(".add__type"),
    description: document.querySelector(".add__description"),
    value: document.querySelector(".add__value"),
    add: document.querySelector(".add__btn"),
    incomeList: ".income__list", 
    expenseList: ".expenses__list", 
    delete: "item__delete--btn", 
    incomeTotal: ".budget__income--value", 
    expenseTotal: ".budget__expenses--value", 
    avBudget: ".budget__value", 
    expPercent: ".budget__expenses--percentage", 
    exItemPercent: ".item__percentage"
  };

  return { domClasses }

})();



// MAIN CONTROLLER
let mainController = (function (displayController, budgetController) {

  //Add Event (+)
  let addButtonEvent = () =>
    displayController.domClasses.add.addEventListener("click", () => {
      budgetController.addItemsToArray(
        displayController.domClasses.addType.value,
        parseInt(displayController.domClasses.value.value),
        displayController.domClasses.description.value,
        displayController.domClasses.incomeList,
        displayController.domClasses.expenseList,
        displayController.domClasses.incomeTotal,
        displayController.domClasses.expenseTotal,
        displayController.domClasses.avBudget,
        displayController.domClasses.expPercent,
        displayController.domClasses.exItemPercent
      );
    });

  //Delete event (-)
  let deleteButtonEvent = () =>
    document.addEventListener("click", (e) => {
      if (
        e.target &&
        e.target.parentNode.classList.contains(displayController.domClasses.delete)
      ) {
        budgetController.deleteItemsFromArray(
          e.target.parentNode.parentNode.parentNode.parentNode,
          displayController.domClasses.incomeList,
          displayController.domClasses.expenseList,
          displayController.domClasses.incomeTotal,
          displayController.domClasses.expenseTotal,
          displayController.domClasses.avBudget,
          displayController.domClasses.expPercent,
          displayController.domClasses.exItemPerc
        );
      }
    });

  //inital condition
  let startConditionFunc = () => {
    displayController.domClasses.month.textContent = budgetController.monthFinder(new Date().getMonth());
    document.querySelector(displayController.domClasses.incomeTotal).textContent = `+ 0`;
    document.querySelector(displayController.domClasses.expenseTotal).textContent = `- 0`;
    document.querySelector(displayController.domClasses.avBudget).textContent = `+ 0`;
    document.querySelector(displayController.domClasses.expPercent).textContent = `0%`;
  };

  return {
    start: () => {
      startConditionFunc();
      addButtonEvent();
      deleteButtonEvent();
    },
  };
})(displayController, budgetController);

mainController.start();
