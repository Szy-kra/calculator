//display
const currentNr = document.querySelector('.current-number');
const previousNr = document.querySelector('.previous-number-text'); // Poprawiony selektor
const mathSign = document.querySelector('.math-sign');
const calcHistory = document.querySelector('.history');

//buttons
const numbersBtn = document.querySelectorAll('.number');
const operatorsBtn = document.querySelectorAll('.operator'); // Teraz zawiera też '='
const clearDisBtn = document.querySelector('.clear-display');
const undoBtn = document.querySelector('.undo-btn');
const clearHisBtn = document.querySelector('.history-btn');

currentNr.innerHTML = '0'; // Domyślny stan początkowy currentNr
let result = ''; // Globalna zmienna na wynik obliczeń


//--------------------------------------------------------
function clearDisplay(){
    currentNr.innerHTML ='0'; // Zawsze ustawia currentNr na '0' po wyczyszczeniu
    previousNr.innerHTML ='';
    mathSign.innerHTML ='';
    result === '0';
}

//--------------------------------------------------------
function undoNumber(){
    // Jeśli na wyświetlaczu jest tylko '0' lub '-0', po cofnięciu nadal powinno być '0'
    if (currentNr.innerHTML === '0' || currentNr.innerHTML === '-0') {
        currentNr.innerHTML = '0';
        return;
    }
    
    // Usuwamy ostatni znak
    currentNr.innerHTML = currentNr.innerHTML.slice(0, -1);

    // Jeśli po usunięciu znaku currentOperand staje się pusty lub tylko '-', ustaw go na '0'
    if (currentNr.innerHTML === '' || currentNr.innerHTML === '-') {
        currentNr.innerHTML = '0';
    }
}

//--------------------------------------------------------
function clearHistory(){
    // Logika do czyszczenia historii (jeśli zaimplementowana)
}

function showResult(){
    // Strażnik: Jeśli poprzednia liczba lub operator jest pusty, nie wykonuj obliczeń
    // (currentNr.innerHTML jest zawsze '0' lub liczbą)
    if (previousNr.innerHTML === '' || mathSign.innerHTML === '') {
        return;
    }

    // Pobieramy wartości z wyświetlaczy (bez konwersji przecinka na kropkę)
    let a = parseFloat(previousNr.innerHTML); 
    let b = parseFloat(currentNr.innerHTML);   
    let operate = mathSign.innerHTML;
    
    // Strażnik: Obsługa wartości nienumerycznych, które mogą powstać z błędnego wprowadzania
    if (isNaN(a) || isNaN(b)) {
        // Specjalny przypadek dla '%', jeśli 'a' jest liczbą, ale 'b' jest NaN (np. "50 % =")
        if (operate === '%' && !isNaN(a)) {
             result = a * 0.01;
        } else {
             currentNr.innerHTML = '0';
             previousNr.innerHTML = '';
             mathSign.innerHTML = '';
             return;
        }
    }

    // Wykonanie operacji na podstawie operatora
    switch(operate){
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '×':
            result = a * b;
            break;
        case '÷':
            if (b === 0) {
                currentNr.innerHTML = '0';
                previousNr.innerHTML = '';
                mathSign.innerHTML = '';
                return;
            } else {
                result = a / b;
            }
            break;
        case '%': // Działanie procentu: b * 0.01
            result = b * 0.01;
            break;
        default: // Nieznany operator
            currentNr.innerHTML = '0';
            previousNr.innerHTML = '';
            mathSign.innerHTML = '';
            return;
    }


    previousNr.innerHTML = String(result); 
    currentNr.innerHTML = String(result);// Wyświetl wynik w previousNr
    mathSign.innerHTML = '';               // Wyczyść znak operatora
}

//--------------------------------------------------------
function operate(){

   
    // 2. Jeśli currentNr jest tylko '-' i naciśnięto inny operator, wróć.
    if (currentNr.innerHTML === '-') {
        return;
    }

    // Flaga: true, jeśli showResult() właśnie wykonało obliczenie
    let calculationJustPerformed = false; 

    // 3. Jeśli jest już poprzednia operacja (poprzednia liczba i operator są ustawione), wykonaj ją
    if (previousNr.innerHTML !== '' && mathSign.innerHTML !== '') {
        showResult(); 
        calculationJustPerformed = true; // Ustaw flagę na true po wykonaniu obliczenia
    }

    // 4. Jeśli obliczenie NIE zostało wykonane, przenieś bieżącą liczbę do previousNr.
    // Dzieje się tak tylko dla PIERWSZEGO operatora w sekwencji (np. "5 +").
    if (!calculationJustPerformed) {
        previousNr.innerHTML = currentNr.innerHTML; // Aktualna liczba staje się poprzednią
    } 
    // Jeśli showResult() zostało wywołane, previousNr już zawiera wynik, a currentNr jest '0'.
    // Nie musimy ponownie przenosić currentNr do previousNr.

            // Resetuj currentNr do '0' dla nowej liczby
       // Ustaw nowy operator

    mathSign.innerHTML = this.textContent;  
    currentNr.innerHTML=String(result);
    
} // <--- TUTAJ BRAKOWAŁO TEGO NAWIASU KLAMROWEGO '}'


//--------------------------------------------------------
function dispalyNumbers(){

    // 1. Zabezpieczenie przed wieloma kropkami: Jeśli już jest kropka, ignoruj kolejną.
    if (this.textContent === '.' && currentNr.innerHTML.includes('.')) {
        return;
    }

    // 2. Jeśli currentNr jest '0' i użytkownik wpisze '0', nic nie rób (zapobiega "00", "000" itp.)
    if (currentNr.innerHTML === '0' && this.textContent === '0') {
        return;
    }

    // 3. Jeśli currentNr jest '0' ORAZ wprowadzana treść NIE JEST kropką ORAZ NIE JEST zerem, zastąp '0'
    if (currentNr.innerHTML === '0' && this.textContent !== '.' && this.textContent !== '0') {
        currentNr.innerHTML = this.textContent;
        return;
    }

    // 4. Jeśli currentNr jest '0' i użytkownik wpisze '.', zrób '0.'
    if (currentNr.innerHTML === '0' && this.textContent === '.') {
        currentNr.innerHTML = '0.';
        return;
    }
    // 5. Jeśli currentNr jest '-' i użytkownik wpisze '.' (np. '-' -> '.' rezultuje w '-0.')
    if (currentNr.innerHTML === '-' && this.textContent === '.') {
        currentNr.innerHTML = '-0.';
        return;
    }
  
    currentNr.innerHTML =  currentNr.innerHTML + this.textContent;
    
    // 6. W każdym innym przypadku: po prostu dodaj nową cyfrę/kropkę
    
}

// Event Listeners
clearDisBtn.addEventListener('click', clearDisplay);
undoBtn.addEventListener('click', undoNumber);
clearHisBtn.addEventListener('click', clearHistory);
operatorsBtn.forEach((button) => button.addEventListener('click', operate)); // Obsługuje wszystkie operatory, w tym '='
numbersBtn.forEach((button) => button.addEventListener('click', dispalyNumbers));