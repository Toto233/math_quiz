document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const sheet = document.getElementById('sheet');
    const typeSelect = document.getElementById('type-select');
    const minNumberInput = document.getElementById('min-number');
    const maxNumberInput = document.getElementById('max-number');
    const problemCountInput = document.getElementById('problem-count');
    const columnCountInput = document.getElementById('column-count');
    const answerStyleSelect = document.getElementById('answer-style-select');

    function generateProblems() {
        // Clear previous problems
        sheet.innerHTML = '';

        const problemType = typeSelect.value;
        let min = parseInt(minNumberInput.value, 10);
        let max = parseInt(maxNumberInput.value, 10);
        const problemCount = parseInt(problemCountInput.value, 10);
        const columnCount = parseInt(columnCountInput.value, 10);
        const answerStyle = answerStyleSelect.value;
        
        // Dynamically set the grid layout
        sheet.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;


        // Ensure min is not greater than max
        if (min > max) {
            [min, max] = [max, min];
            minNumberInput.value = min;
            maxNumberInput.value = max;
        }

        const range = max - min + 1;

        // Generate problems
        for (let i = 0; i < problemCount; i++) {
            let num1, num2, operator;
            let expression;

            const operators = [];
            switch (problemType) {
                case 'add':
                    operators.push('+');
                    break;
                case 'subtract':
                    operators.push('-');
                    break;
                case 'multiply':
                    operators.push('×');
                    break;
                case 'divide':
                    operators.push('÷');
                    break;
                case 'all_mixed':
                    operators.push('+', '-', '×', '÷');
                    break;
                case 'add_subtract_mixed':
                default:
                    operators.push('+', '-');
                    break;
            }

            operator = operators[Math.floor(Math.random() * operators.length)];

            if (operator === '÷') {
                // 生成2位数除以1位数的除法题目
                // 除数范围: 2-9 (一位数，避免除以1)
                // 被除数范围: 10-99 (两位数)
                // 确保能整除

                let divisor = Math.floor(Math.random() * 8) + 2; // 2-9

                // 计算商的范围，确保被除数是两位数 (10-99)
                let minQuotient = Math.ceil(10 / divisor);
                let maxQuotient = Math.floor(99 / divisor);

                // 确保商至少为1
                if (minQuotient < 1) minQuotient = 1;

                let quotient = Math.floor(Math.random() * (maxQuotient - minQuotient + 1)) + minQuotient;
                let dividend = divisor * quotient;

                num1 = dividend;
                num2 = divisor;
                
            } else {
                 num1 = Math.floor(Math.random() * range) + min;
                 num2 = Math.floor(Math.random() * range) + min;
            }


            if (operator === '-' && num1 < num2) {
                [num1, num2] = [num2, num1]; // Swap numbers for subtraction
            }
            
            if (operator === '×' && (num1 > 10 || num2 > 10) && max > 10) {
                 // Make multiplication less intimidating if range is large
                 if (Math.random() > 0.5) {
                    num1 = Math.floor(Math.random() * 10) + 1;
                 } else {
                    num2 = Math.floor(Math.random() * 10) + 1;
                 }
            }


            expression = `${num1} ${operator} ${num2} =`;

            const problem = document.createElement('div');
            problem.classList.add('problem');

            const problemNumber = document.createElement('span');
            problemNumber.classList.add('problem-number');
            problemNumber.textContent = `(${i + 1})`;

            const problemExpression = document.createElement('span');
            problemExpression.classList.add('problem-expression');
            problemExpression.textContent = expression;
            
            const answerPlaceholder = document.createElement('span');
            answerPlaceholder.classList.add('answer-placeholder');

            switch (answerStyle) {
                case 'box':
                    answerPlaceholder.classList.add('style-box');
                    break;
                case 'underline':
                    answerPlaceholder.classList.add('style-underline');
                    break;
                case 'parentheses':
                    answerPlaceholder.innerHTML = '(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)';
                    break;
            }


            // Calculate and store the answer
            let answer;
            switch (operator) {
                case '+':
                    answer = num1 + num2;
                    break;
                case '-':
                    answer = num1 - num2;
                    break;
                case '×':
                    answer = num1 * num2;
                    break;
                case '÷':
                    answer = num1 / num2;
                    break;
            }
            answerPlaceholder.dataset.answer = answer;
            answerPlaceholder.dataset.style = answerStyle;


            problem.appendChild(problemNumber);
            problem.appendChild(problemExpression);
            problem.appendChild(answerPlaceholder);

            sheet.appendChild(problem);
        }
    }

    function toggleAnswers() {
        const answerPlaceholders = document.querySelectorAll('.answer-placeholder');
        answerPlaceholders.forEach(box => {
            if (box.classList.contains('has-answer')) {
                // Hide answer
                const style = box.dataset.style;
                if (style === 'parentheses') {
                    box.innerHTML = '(&nbsp;&nbsp;)';
                } else {
                    box.textContent = '';
                }
                box.classList.remove('has-answer');
            } else {
                // Show answer
                box.textContent = box.dataset.answer;
                box.classList.add('has-answer');
            }
        });
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateProblems);
    document.getElementById('toggle-answer-btn').addEventListener('click', toggleAnswers);

    // Initial generation
    generateProblems();
});
