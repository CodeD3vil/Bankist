'use strict';

const account1 = {
  owner: 'Tomas Vega',
  movements: [
    [200, '2019-11-18T21:31:17.178Z'],
    [455.23, '2019-12-23T07:42:02.383Z'],
    [-306.5, '2020-01-28T09:15:04.904Z'],
    [25000, '2020-04-01T10:17:24.185Z'],
    [-642.21, '2020-05-08T14:11:59.604Z'],
    [-133.9, '2020-05-27T17:01:17.194Z'],
    [79.97, '2021-10-20T23:36:17.929Z'],
    [1300, '2021-10-19T10:51:36.790Z'],
  ],
  loans: 0,
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'BRL',
  locale: 'pt-BR', // de-DE
};

const account3 = {
  owner: 'Noah Heisenberg',
  movements: [
    [2000, '2019-11-18T21:31:17.178Z'],
    [415.23, '2019-12-23T07:42:02.383Z'],
    [-206.5, '2020-01-28T09:15:04.904Z'],
    [28000, '2020-04-01T10:17:24.185Z'],
    [-612.21, '2020-05-08T14:11:59.604Z'],
    [-113.9, '2020-05-27T17:01:17.194Z'],
    [790.97, '2021-10-20T23:36:17.929Z'],
    [1350, '2021-10-19T10:51:36.790Z'],
  ],
  loans: 0,
  interestRate: 1.2, // %
  pin: 3333,
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    [5000, '2019-11-01T13:15:33.035Z'],
    [3400, '2019-11-30T09:48:16.867Z'],
    [-150, '2019-12-25T06:04:23.907Z'],
    [-790, '2020-01-25T14:18:46.235Z'],
    [-3210, '2020-02-05T16:33:06.386Z'],
    [-1000, '2020-04-10T14:43:26.374Z'],
    [8500, '2020-06-25T18:49:59.371Z'],
    [-30, '2020-07-26T12:01:20.894Z'],
    [45000, '2021-06-25T13:35:59.371Z'],
  ],
  loans: 0,
  interestRate: 1.5,
  pin: 2222,
  currency: 'EUR',
  locale: 'sk-SK',
};

const accounts = [account1, account2, account3];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM Elements
const labelWelcome = document.querySelector('.welcome__message');
const labelDate = document.querySelector('.date');
const labelCurrentDateTime = document.querySelector('.clock__date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelTotal = document.querySelector('.summary__value--total');
const labelInterestRate = document.querySelector(
  '.summary__label--interest--rate'
);
const labelLoans = document.querySelector('.summary__value--loans');
const labelTransferOut = document.querySelector(
  '.summary__value__transfer--out'
);
const labelTransferIn = document.querySelector('.summary__value__transfer--in');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelAvailableLoan = document.querySelector('.loans__label--number');
const logoutTimer = document.querySelector('.logout-timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DISPLAYS A CLOCK
window.onload = displayClock();

function displayClock() {
  const displayTime = new Date().toLocaleTimeString();
  document.getElementById('clock__time').innerHTML = displayTime;
  setTimeout(displayClock, 1000);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FORMAT the dates
const formatDate = function () {
  //gets the current date
  const labelCurrentDateTime = new Date();
  //options for 'Intl.DateTimeFormat' to format the time and date
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };

  //get the 'locale string' based on the language of the browser and then format the current date
  return new Intl.DateTimeFormat(currentAccount.locale, options).format(
    labelCurrentDateTime
  );
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FORMAT the numbers
//Use undefined in place of the first argument ('en-US') to use the system locale
const formatNumber = function (number) {
  return new Intl.NumberFormat(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  }).format(number);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MOVEMENTS DATE AND TIME
// each movement will get a date from the 'movementsDates' array at the same index as the movement value from the 'account.movements' array
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DISPLAYS THE 'containerMovements' HTML ELEMENTS
const displayMovements = function (account, sort = false) {
  //sort parameter is set to a default value 'false', so the sort
  //functionality will only be applied if the sort is changed to 'true'
  //clears the inner movements html elements before adding the new ones
  containerMovements.innerHTML = '';

  //if the sort is true we create a copy of the movements array with the 'slice' method so we don`t modify the original movements array and the we sort the copied array
  const trans = sort
    ? account.movements.slice().sort((a, b) => a[0] - b[0])
    : account.movements;

  //depending on what is returned from the above 'trans' function. it is either the sorted or unsorted movements array
  // const type = mov[0] > 0 ? 'deposit' : 'withdrawal';
  //'tf' stands for
  trans.forEach(function (mov, i) {
    const movType = function () {
      if (mov[2] === 'ti') {
        return 'transfer__in';
      }
      if (mov[2] === 'l') {
        return 'loan';
      }
      if (mov[2] === 'to') {
        return 'transfer__out';
      }
      if (mov[0] > 0) {
        return 'deposit';
      } else {
        return 'withdrawal';
      }
    };

    //gets a date and time of the movement
    const date = new Date(mov[1]);

    //formats the date and time of each movement
    const displayDate = formatMovementDate(date, account.locale);

    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    //constructing the movement html element. for each value in the account1.movements array
    const html = `
      <div class="movements__row">
        <div class="movements__type 
        movements__type--${movType()}">${i + 1} ${movType().replace(
      '__',
      ' '
    )}</div>
        <div class="movements__date">${displayDate}<span class="movements__date--at">at ${hours}:${minutes}</span> </div>
        <div class="movements__value">${formatNumber(mov[0])}</div>
      </div>
    `;

    //adds each html element of the movements element for each value in the account1.movements array
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//COMPUTE USERNAMES
//1. we take the array 'accounts' which contains the names of each of the accounts objects
const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    //2. for each account object we ADD a new property called 'userName' which are the first letters from
    //   each of their names
    //to add a new property we write the property name on the left of the declaration and the on the right
    //side we add the value
    acc.username = acc.owner

      //3. to get the first letters we use the map method on the acc.owner property which creates a new array
      //   with the first letters of their names and then we create the final string
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

//Adds a color to every other row
const rowColor = function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = '#EBEBEB';
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//UPDATE UI
const updateUI = function (account) {
  //DISPLAY MOVEMENTS
  displayMovements(account);
  //DISPLAY BALANCE
  //we call this function with the whole object so we can manipulate the object with the function
  calcDisplayBalance(account);
  //DISPLAY SUMMARY
  calcDisplaySummary(account);
  rowColor();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DISPLAY BALANCE
const calcDisplayBalance = function (account) {
  //here we add a new object property called balance
  account.balance = account.movements.reduce((acc, mov) => acc + mov[0], 0);
  labelBalance.textContent = `${formatNumber(account.balance)}`;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DISPLAY SUMMARY
const calcDisplaySummary = function (account) {
  const out = account.movements
    .filter(mov => mov[0] < 0 && mov[2] !== 'to')
    .reduce((acc, mov) => acc + mov[0], 0);
  labelSumOut.textContent = `${formatNumber(out)}`;

  const incomes = account.movements
    .filter(mov => mov[0] > 0 && mov[2] !== 'l' && mov[2] !== 'ti')
    .reduce((acc, mov) => acc + mov[0], 0);
  labelSumIn.textContent = `${formatNumber(incomes)}`;

  const interest = account.movements
    .filter(mov => mov[0] > 0 && mov[2] !== 'l' && mov[2] !== 'ti')
    .map(deposit => (deposit[0] * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatNumber(interest)}`;
  labelInterestRate.textContent = `interest ${account.interestRate}%`;

  const loans = account.movements
    .filter(mov => mov[2] === 'l')
    .reduce((acc, mov) => acc + mov[0], 0);
  labelLoans.textContent = `${formatNumber(loans)}`;

  const transferOut = account.movements
    .filter(mov => mov[2] === 'to')
    .reduce((acc, mov) => acc + mov[0], 0);
  labelTransferOut.textContent = `${formatNumber(transferOut)}`;

  const transferIn = account.movements
    .filter(mov => mov[2] === 'ti')
    .reduce((acc, mov) => acc + mov[0], 0);
  labelTransferIn.textContent = `${formatNumber(transferIn)}`;

  const total = (
    interest +
    incomes +
    out +
    loans +
    transferIn +
    transferOut
  ).toFixed(2);

  account.balance = total;

  labelBalance.textContent = `${formatNumber(account.balance)}`;
  labelTotal.textContent = `${formatNumber(account.balance)}`;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TIMER
//starts the timer when user logs in
const startLogoutTimer = function () {
  //this function decreases the time by one second every time it is called
  const tick = function () {
    const minutes = String(Math.trunc(timeLeft / 60)).padStart(2, 0);
    const seconds = String(timeLeft % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;

    //when the timeLeft variable reaches zero it will hide the page elements to simulate a log off
    if (timeLeft === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      logoutTimer.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    //decrease the timeLeft variable
    timeLeft--;
  };
  //Each number represents 1 second (in this case)
  let timeLeft = 600;
  //the tick function is called immediately
  tick();
  //Call the timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL VARIABLES
//'currentAccount' represents the account which we are logged in with
//'timer' is used to start or reset a timer when users login
let currentAccount, timer;
//'deposits' is used to calculate the maximum user deposit to calculate maximum loan value
let deposits = [];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//RESET TIMER
const resetTimer = function () {
  clearInterval(timer);
  timer = startLogoutTimer();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FAKE always logged-in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CALCULATE THE MAX LOAN
//all deposits from the current account, used to calculate the max deposit value
//calculates the maximum possible loan, only uses the deposit values(not loans, or transfers)
const calcMaxLoan = function () {
  inputLoanAmount.value = '';
  deposits = [];
  currentAccount.movements.forEach(function (mov) {
    if (mov[2] !== 'l' && mov[2] !== 'ti' && mov[2] !== 'to') {
      deposits.push(mov[0]);
    }
  });
  //calculate and display the maximum available loan amount
  return Math.max(...deposits) * 10;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//USER LOGIN FUNCTION
btnLogin.addEventListener('click', function (event) {
  //prevent form from submitting (when form is submitted, the default behaviour is to reload the page)
  event.preventDefault();

  //find the username inserted in the login field in the accounts objects
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //we use the optional chaining '?' after the 'current account' to check if the current account exists (if the user typed an existing username in the 'inputLoginUsername' field)
    //if the 'currentAccount' exists, the script will continue, if not, nothing will happen
    labelAvailableLoan.textContent = formatNumber(
      calcMaxLoan() - currentAccount.loans
    );

    //DISPLAY UI AND THE WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    logoutTimer.style.opacity = 1;

    labelDate.textContent = formatDate();
    labelCurrentDateTime.textContent = formatDate();

    inputTransferTo.value = '';
    //clear the login input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //clear the transfer amount input field
    inputTransferAmount.value = '';
    //removes the blinking caret
    inputLoginPin.blur();
    updateUI(currentAccount);

    //checks if the timer already exists so when we log in with a different user, we won`t have 2 timers running
    if (timer) clearInterval(timer);

    //starts the timer when user logs in (reset)
    resetTimer();
  } else {
    alert('Incorrect user, PIN or user does not exists.');
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MONEY TRANSFER FUNCTIONALITY
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //clears both input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  //the transfer amount must be larger than 0, has to be less than the available balance and cannot be from the same account that is transferring amount from nad if the receiver account exists

  //alerts if the username did not match
  if (!receiverAcc) {
    alert(`Incorrect user name or user does not exists.`);
    resetTimer();
    return;
  }

  //min transfer amount
  const minTransfer = 500;
  if (transferAmount < minTransfer) {
    alert(`The minimum transfer amount is ${minTransfer}$.`);
    resetTimer();
    return;
  }

  if (
    transferAmount > 0 &&
    receiverAcc &&
    currentAccount.balance >= transferAmount &&
    receiverAcc?.username &&
    receiverAcc.username !== currentAccount.username
  ) {
    // 'to' will indicate that the transfer is outgoing
    currentAccount.movements.push([
      -transferAmount,
      new Date().toISOString(),
      'to',
    ]);
    // 'ti' will indicate that the transfer is incoming
    receiverAcc.movements.push([
      transferAmount,
      new Date().toISOString(),
      'ti',
    ]);
    inputTransferAmount.value = '';
    resetTimer();
    updateUI(currentAccount);
  } else {
    alert(
      `You don\`t have enough funds to transfer ${formatNumber(
        transferAmount
      )} to ${receiverAcc.owner}.`
    );
    resetTimer();
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SORT MOVEMENTS FUNCTIONALITY--sort method
//'sortedState' variable stores the 'true' or 'false' state of the sort function.
let sortedState = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();

  //from here we call the 'displayMovements' function and with the second parameter we set the 'sort' parameter to 'true' which will then urn the sort callback function inside the 'displayMovements' function
  displayMovements(currentAccount, !sortedState);
  // after the sort function has been applied the 'sortState' variable will be set to opposite boolean and then if we click the sort button again the 'displayMovements' function will use the original (unsorted) 'movement' array and display that to the user

  //this 'flips' the 'let sortedState' to either true or false
  sortedState = !sortedState;
  rowColor();
  resetTimer();
  sortedState
    ? (btnSort.textContent = 'UNSORT')
    : (btnSort.textContent = 'SORT');
  sortedState
    ? (btnSort.style.background = '#414142')
    : (btnSort.style.background = '#2a8be5');
});

/////////////////////////////////////////////////
//REQUEST LOAN FUNCTIONALITY -- some method
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const loanAmount = +Math.floor(inputLoanAmount.value);

  //calculates the maximum possible loan, only uses the deposit values(not loans, or transfers)
  const maxLoan = calcMaxLoan();

  //calculates the remaining loan amount that can be withdrawn
  let loanLeft = maxLoan - currentAccount.loans;

  const loanMessage = function () {
    if (maxLoan - currentAccount.loans == 0) {
      resetTimer();
      return `You have no funds left to get a loan.`;
    } else {
      resetTimer();
      return `Your remaining loan allowance is ${formatNumber(loanLeft)}.`;
    }
  };

  //alerts the user if the requested loan amount that is above the amount that is left to withdraw and also there has not been any loan yet
  if (loanAmount > loanLeft && currentAccount.loans === 0) {
    alert(
      `Your loan request of ${formatNumber(
        loanAmount
      )} has been DECLINED!\n\nYour maximum loan amount is ${formatNumber(
        maxLoan
      )}.`
    );
    resetTimer();
    return;
  }

  //alerts the user if the requested loan amount that is above the amount that is left to withdraw
  if (loanAmount > loanLeft) {
    alert(
      `Your loan request of ${formatNumber(
        loanAmount
      )} has been DECLINED!\n\nYour maximum loan amount was ${formatNumber(
        maxLoan
      )} and you have already withdrew ${formatNumber(
        currentAccount.loans
      )} in total.\n\n${loanMessage()}`
    );
    resetTimer();
    return;
  }

  //the code below adds the approved loan amount to the user account
  if (loanAmount > 0 && loanAmount <= loanLeft) {
    resetTimer();
    //adds an 'l' tag to the movements array to indicate that the movement is a loan
    setTimeout(() => {
      currentAccount.movements.push([
        loanAmount,
        new Date().toISOString(),
        'l',
      ]);

      updateUI(currentAccount);
      //adds the loan value received to the existing 'loans' property for later use
      currentAccount.loans += loanAmount;

      //updates the loanLeft
      loanLeft = maxLoan - currentAccount.loans;

      resetTimer();

      inputLoanAmount.value = '';

      //updates the available loan value on the page
      labelAvailableLoan.textContent = formatNumber(loanLeft);
    }, 3000);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CLOSE ACCOUNT FUNCTIONALITY--find index method
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount?.username &&
    Number(inputClosePin.value) === currentAccount?.pin
  ) {
    //with 'indexOf' method we can only search for a value that is in the array
    //with 'findIndex' method we can create a condition that will search for the value`s index in the array
    //they both return the index value but the 'indexOf' is just much more simpler then the 'findIndex' method
    const userToDeleteIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //removes an user object from the 'accounts' array based on the index number of the current user that is logged in
    accounts.splice(userToDeleteIndex, 1);
    //hide the UI (log out the user)
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
