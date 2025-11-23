document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const sheet = document.getElementById('sheet');
    const typeSelect = document.getElementById('type-select');
    const addSubMinInput = document.getElementById('add-sub-min');
    const addSubMaxInput = document.getElementById('add-sub-max');
    const mulDivMinInput = document.getElementById('mul-div-min');
    const mulDivMaxInput = document.getElementById('mul-div-max');
    const excludedNumbersInput = document.getElementById('excluded-numbers');
    const problemCountInput = document.getElementById('problem-count');
    const columnCountInput = document.getElementById('column-count');
    const answerStyleSelect = document.getElementById('answer-style-select');

    function generateProblems() {
        // Clear previous problems
        sheet.innerHTML = '';

        const problemType = typeSelect.value;

        // 加减法范围
        let addSubMin = parseInt(addSubMinInput.value, 10);
        let addSubMax = parseInt(addSubMaxInput.value, 10);
        if (addSubMin > addSubMax) {
            [addSubMin, addSubMax] = [addSubMax, addSubMin];
            addSubMinInput.value = addSubMin;
            addSubMaxInput.value = addSubMax;
        }
        const addSubRange = addSubMax - addSubMin + 1;

        // 乘除法范围
        let mulDivMin = parseInt(mulDivMinInput.value, 10);
        let mulDivMax = parseInt(mulDivMaxInput.value, 10);
        if (mulDivMin > mulDivMax) {
            [mulDivMin, mulDivMax] = [mulDivMax, mulDivMin];
            mulDivMinInput.value = mulDivMin;
            mulDivMaxInput.value = mulDivMax;
        }
        const mulDivRange = mulDivMax - mulDivMin + 1;

        // 解析屏蔽数字
        const excludedNumbers = new Set();
        const excludedInput = excludedNumbersInput.value.trim();
        if (excludedInput) {
            excludedInput.split(',').forEach(s => {
                const num = parseInt(s.trim(), 10);
                if (!isNaN(num)) {
                    excludedNumbers.add(num);
                }
            });
        }

        // 辅助函数：生成不在屏蔽列表中的随机数
        function getRandomNumber(min, max, excluded) {
            const maxAttempts = 100;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const num = Math.floor(Math.random() * (max - min + 1)) + min;
                if (!excluded.has(num)) {
                    return num;
                }
            }
            // 如果尝试多次都失败，返回范围内第一个不被屏蔽的数
            for (let num = min; num <= max; num++) {
                if (!excluded.has(num)) {
                    return num;
                }
            }
            // 如果所有数都被屏蔽，返回 min
            return min;
        }

        const problemCount = parseInt(problemCountInput.value, 10);
        const columnCount = parseInt(columnCountInput.value, 10);
        const answerStyle = answerStyleSelect.value;

        // Dynamically set the grid layout
        sheet.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;

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
                case 'multiply_divide_mixed':
                    operators.push('×', '÷');
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
                // 除法：除数和商都在乘除法范围内，被除数不受限制
                // 商在 [mulDivMin, mulDivMax] 范围内
                // 除数在 [mulDivMin, mulDivMax] 范围内（但至少为1避免除以0）
                // 被除数 = 除数 × 商（不限制范围）

                let divisorMin = Math.max(mulDivMin, 1);
                let quotient = getRandomNumber(mulDivMin, mulDivMax, excludedNumbers);
                let divisor = getRandomNumber(divisorMin, mulDivMax, excludedNumbers);

                let dividend = divisor * quotient;

                num1 = dividend;
                num2 = divisor;
            } else if (operator === '×') {
                // 乘法：乘数和被乘数都在乘除法范围内
                num1 = getRandomNumber(mulDivMin, mulDivMax, excludedNumbers);
                num2 = getRandomNumber(mulDivMin, mulDivMax, excludedNumbers);
            } else {
                // 加法和减法：使用加减法范围
                num1 = getRandomNumber(addSubMin, addSubMax, excludedNumbers);
                num2 = getRandomNumber(addSubMin, addSubMax, excludedNumbers);
            }


            if (operator === '-' && num1 < num2) {
                [num1, num2] = [num2, num1]; // Swap numbers for subtraction
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
