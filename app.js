// --- SELEKTORY ELEMENTÓW DOM ---
const currentNr = document.querySelector('.current-number');
const previousNr = document.querySelector('.previous-number-text');
const mathSign = document.querySelector('.math-sign');
const calcHistory = document.querySelector('.history');

const numbersBtn = document.querySelectorAll('.number');
const operatorsBtn = document.querySelectorAll('.operator');
const clearDisBtn = document.querySelector('.clear-display');
const undoBtn = document.querySelector('.undo-btn');
const clearHisBtn = document.querySelector('.history-btn');

// --- ZMIENNE GLOBALNE STANU ---
currentNr.innerHTML = '0';
let result = '';
let operateString = '';

//--------------------------------------------------------
// FUNKCJE
//--------------------------------------------------------

// Formatuje ciąg znaków liczby, wstawiając spacje jako separatory tysięcy.
function formatNumber(numberString) {
    if (numberString === null || typeof numberString === 'undefined') {
        return '';
    }
    const string = numberString.toString();
    const parts = string.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedInteger + decimalPart;
}

// Resetuje kalkulator do stanu początkowego.
function clearDisplay() {
    currentNr.innerHTML = '0';
    previousNr.innerHTML = '';
    mathSign.innerHTML = '';
    result = '';
    operateString = '';
}

// Implementuje funkcjonalność przycisku "cofnij".
function undoNumber() {
    let cleanNumber = currentNr.innerHTML.replace(/\s/g, '');
    if (cleanNumber.length > 1 && cleanNumber !== '-0') {
        cleanNumber = cleanNumber.slice(0, -1);
    } else {
        cleanNumber = '0';
    }
    currentNr.innerHTML = formatNumber(cleanNumber);
}

// Czyści historię obliczeń.
function clearHistory() {
    calcHistory.innerHTML = '';
}

// Wykonuje główną operację matematyczną na podstawie zapisanych liczb i operatora.
function showResult() {
    if (previousNr.innerHTML === '' || mathSign.innerHTML === '') {
        return;
    }
    let a = parseFloat(previousNr.innerHTML.replace(/\s/g, ''));
    let b = parseFloat(currentNr.innerHTML.replace(/\s/g, ''));
    let operate = mathSign.innerHTML;

    if (isNaN(a) || isNaN(b)) return;

    switch (operate) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '×': result = a * b; break;
        case '÷':
            if (b === 0) {
                currentNr.innerHTML = 'Error';
                previousNr.innerHTML = '';
                mathSign.innerHTML = '';
                return;
            }
            result = a / b;
            break;
        default: return;
    }
    operateString = `${formatNumber(a)} ${operate} ${formatNumber(b)} =`;
    result = Math.round(result * 10000000) / 10000000;

    //zapisywanie wyników w kolumnie 
    const fullOperationText = `${operateString} ${formatNumber(result)}`;
    addToHistory(fullOperationText);
}

function addToHistory(operationText) {
    
    const historyItem = document.createElement('li');
    historyItem.textContent = operationText;
    calcHistory.prepend(historyItem);
}




// --- FUNKCJA Z NANİESİONĄ, OSTATECZNĄ POPRAWKĄ DLA PROCENTÓW ---
// Obsługuje zdarzenia kliknięcia dla wszystkich przycisków operatorów.
function operate() {
    const operator = this.textContent;

    // Specjalna obsługa procentów z rozróżnieniem operatorów.
    if (operator === '%') {
        if (previousNr.innerHTML === '' || mathSign.innerHTML === '') return;
        
        const a = parseFloat(previousNr.innerHTML.replace(/\s/g, ''));
        const b = parseFloat(currentNr.innerHTML.replace(/\s/g, ''));
        const previousOp = mathSign.innerHTML;

        if (isNaN(a) || isNaN(b)) return;
        
        let percentageValue;

        if (previousOp === '+' || previousOp === '-') {
            // Dla + i - liczymy procent z pierwszej liczby (a).
            percentageValue = (a * b) / 100;
        } else if (previousOp === '×' || previousOp === '÷') {
            // Dla × i ÷ zamieniamy drugą liczbę (b) na ułamek.
            percentageValue = b / 100;
        } else {
            return;
        }

        currentNr.innerHTML = formatNumber(percentageValue.toString());
        return;
    }

    if (currentNr.innerHTML === '0' && operator === '-') {
        currentNr.innerHTML = '-';
        return;
    }
    if (currentNr.innerHTML === '-') {
        return;
    }

    if (operator === '=') {
        if (previousNr.innerHTML === '' || mathSign.innerHTML === '') return;
        showResult();
        currentNr.innerHTML = formatNumber(result);
        previousNr.innerHTML = operateString;
        mathSign.innerHTML = '';
    } else {
        const cleanPrevious = previousNr.innerHTML.replace(/\s/g, '');
        if (cleanPrevious !== '' && mathSign.innerHTML) {
            showResult();
            previousNr.innerHTML = formatNumber(result);
            currentNr.innerHTML = '0';
            mathSign.innerHTML = operator;
        } else {
            previousNr.innerHTML = formatNumber(currentNr.innerHTML.replace(/\s/g, ''));
            mathSign.innerHTML = operator;
            currentNr.innerHTML = '0';
        }
    }
}

// Obsługuje zdarzenia kliknięcia dla przycisków numerycznych i kropki dziesiętnej.
function displayNumbers() {
    const cleanNumber = currentNr.innerHTML.replace(/\s/g, '');

    if (cleanNumber.length >= 15 && this.textContent !== '.') {
        return;
    }
    if (this.textContent === '.' && cleanNumber.includes('.')) {
        return;
    }

    let newNumberString;

    if (cleanNumber === '0' && this.textContent !== '.') {
        newNumberString = this.textContent;
    } else if (cleanNumber === '-0' && this.textContent !== '.') {
        newNumberString = '-' + this.textContent;
    } else {
        newNumberString = cleanNumber + this.textContent;
    }

    currentNr.innerHTML = formatNumber(newNumberString);
}

// --- NASŁUCHIWANIE ZDARZEŃ ---
clearDisBtn.addEventListener('click', clearDisplay);
undoBtn.addEventListener('click', undoNumber);
clearHisBtn.addEventListener('click', clearHistory);
operatorsBtn.forEach((button) => button.addEventListener('click', operate));
numbersBtn.forEach((button) => button.addEventListener('click', displayNumbers));