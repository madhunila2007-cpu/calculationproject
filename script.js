
// Get HTML Elements
const display = document.getElementById("display");
const history = document.getElementById("history");
const buttons = document.querySelectorAll(".buttons button");
const themeToggle = document.getElementById("themeToggle");

// Calculator Variables
let expression = "";
let justCalculated = false;

// Update Display
function updateDisplay() {
    display.value = expression || "0";
}

// Add Number or Operator
function addValue(value) {

    if (justCalculated) {

        if (/[0-9.]/.test(value)) {
            expression = "";
        }

        justCalculated = false;
    }

    // Decimal Validation
    if (value === ".") {

        const currentNumber = expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) {
            return;
        }

        if (currentNumber === "") {
            expression += "0";
        }
    }

    // Operator Validation
    if (/[+\-*/%]/.test(value)) {

        if (expression === "" && value !== "-") {
            return;
        }

        if (/[+\-*/%]$/.test(expression)) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;

    updateDisplay();
    history.textContent = "Calculating...";
}

// Calculate Result
function calculate() {

    if (!expression) return;

    try {

        // Validate expression characters
        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        if (/[+\-*/%.]$/.test(expression)) {
            throw new Error("Incomplete expression");
        }

        // Evaluate expression
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        // Save calculation history
        history.textContent = expression + " =";

        // Format result
        expression = String(
            Number(result.toPrecision(12))
        );

        updateDisplay();

        justCalculated = true;

    } catch (error) {

        display.value = "Error";
        history.textContent = "Invalid calculation";

        expression = "";
        justCalculated = false;
    }
}

// Clear Calculator
function clearDisplay() {

    expression = "";

    history.textContent = "Ready to calculate";

    justCalculated = false;

    updateDisplay();
}

// Delete Last Character
function deleteLast() {

    if (justCalculated) {
        justCalculated = false;
    }

    expression = expression.slice(0, -1);

    updateDisplay();
}

// Change Sign
function changeSign() {

    if (!expression) return;

    if (/^-?\d+(\.\d+)?$/.test(expression)) {

        expression = expression.startsWith("-")
            ? expression.slice(1)
            : "-" + expression;

    } else {

        expression = "-(" + expression + ")";
    }

    justCalculated = false;

    updateDisplay();
}

// Button Click Events
buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            addValue(value);
        }

        if (action === "clear") {
            clearDisplay();
        }

        if (action === "delete") {
            deleteLast();
        }

        if (action === "calculate") {
            calculate();
        }

        if (action === "sign") {
            changeSign();
        }

    });

});

// Keyboard Support
document.addEventListener("keydown", event => {

    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        addValue(key);
    }

    if (["+", "-", "*", "/", "%"].includes(key)) {
        addValue(key);
    }

    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();
    }

    if (key === "Backspace") {
        deleteLast();
    }

    if (key === "Escape") {
        clearDisplay();
    }

});

// Theme Toggle
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeToggle.textContent = "☾";
    } else {
        themeToggle.textContent = "☀";
    }

});

// Initial Display
updateDisplay();
