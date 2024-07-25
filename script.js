const display = document.getElementById('result');
const buttons = document.querySelectorAll('button');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (!isNaN(value)) {
      appendNumber(value);
    } else if (value === '.') {
      appendDecimal();
    } else if (value === 'C') {
      clear();
    } else if (value === '=') {
      calculate();
    } else {
      handleOperator(value);
    }
  });
});

function appendNumber(number) {
  if (waitingForSecondValue) {
    display.value = number;
    waitingForSecondValue = false;
  } else {
    if (display.value === '0') {
      display.value = number;
    } else {
      display.value += number;
    }
  }
}

function appendDecimal() {
  if (!display.value.includes('.')) {
    display.value += '.';
  }
}

function clear() {
  display.value = '';
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
}

function handleOperator(op) {
  if (firstValue === null) {
    firstValue = parseFloat(display.value);
  } else if (operator) {
    calculate();
  }
  operator = op;
  waitingForSecondValue = true;
}

function calculate() {
  if (firstValue === null || operator === null) return;
  const secondValue = parseFloat(display.value);
  let result;
  switch (operator) {
    case '+':
      result = firstValue + secondValue;
      break;
    case '-':
      result = firstValue - secondValue;
      break;
    case '*':
      result = firstValue * secondValue;
      break;
    case '/':
      result = firstValue / secondValue;
      break;
    case '%':
      result = firstValue % secondValue;
      break;
  }
  display.value = result;
  firstValue = result;
  operator = null;
  waitingForSecondValue = false;
}

function insertValue(value) {
  if (value === 'C') {
    clear();
  } else {
    if (waitingForSecondValue) {
      display.value = value;
      waitingForSecondValue = false;
    } else {
      if (display.value === '0') {
        display.value = value;
      } else {
        display.value += value;
      }
    }
  }
}

function clearResult() {
  display.value = '';
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
}
