
let editingIndex = -1;
let chartInstance = null; 

const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const grade = document.getElementById('grade');
const studentForm = document.getElementById('studentForm');
const del =document.getElementById('del')
const adding = document.getElementById('add')
const submit = document.getElementById('submit')
const studentModal = document.getElementById('studentModal')
const chartModal = document.getElementById('chartModal')
const search = document.getElementById('search');
const deleteAllModal = document.getElementById('deleteAllModal')
const gradeChart = document.getElementById('gradeChart')





let students = JSON.parse(localStorage.getItem('students')) || [];

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentData = {
        fname: fname.value,
        lname: lname.value,
        grade: parseInt(grade.value)
    };

    if (editingIndex === -1) {
        students.push(studentData);
    } else {
        students[editingIndex] = studentData;
        editingIndex = -1;
        submit.textContent = 'Add';
    }

    adding.play();
    localStorage.setItem('students', JSON.stringify(students));

    studentForm.reset();
    closeModal();
    renderStudents();
});

function renderStudents() {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    const searchQuery = search ? search.value.toLowerCase() : '';

    students.filter(student => student.fname.toLowerCase().includes(searchQuery) || 
            student.lname.toLowerCase().includes(searchQuery) ||
            student.grade.toString().includes(searchQuery)
        ).forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3">${student.fname}</td>
                <td class="p-3">${student.lname}</td>
                <td class="p-3">${student.grade}</td>
                <td class="p-3 items-center">
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="editStudent(${index})"><i class="fas fa-pen mr-2"></i>Update</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteStudent(${index})"><i class="fas fa-trash-alt mr-2"></i>Delete</button>
                </td>
            `;
            tbody.prepend(row);
        });
}

function editStudent(index) {
    const student = students[index];
    fname.value = student.fname;
    lname.value = student.lname;
    grade.value = student.grade;
    editingIndex = index;
    submit.textContent = 'Update';
    submit.classList = 'bg-yellow-500 text-white px-3 py-1 rounded mr-2';
    openModal();
}

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    del.play();
    deleteAllModal.classList.add('hidden');
    renderStudents();
}

function deleteAll() {
    deleteAllModal.classList.remove('hidden');
}

function confirmDeleteAll() {
    students = [];
    localStorage.removeItem('students');
    del.play();
    renderStudents();
    cancelDeleteAll();
}

function cancelDeleteAll() {
    deleteAllModal.classList.add('hidden');
    
}

function openModal() {
    studentModal.classList.remove('hidden');
}

function closeModal() {
    studentModal.classList.add('hidden');
    studentForm.reset();
    editingIndex = -1;
    submit.textContent = 'Add';
}

function openChartModal() {
    const ctx = gradeChart .getContext('2d');

    
    if (chartInstance) {
        chartInstance.destroy();
    }

    
    const ranges = [0, 50, 60, 70, 80, 90, 100];
    const rangeLabels = ['0-49', '50-59', '60-69', '70-79', '80-89', '90-100'];
    const dataCounts = new Array(ranges.length - 1).fill(0);

    students.forEach(student => {
        const grade = student.grade;
        for (let i = 0; i < ranges.length - 1; i++) {
            if (grade >= ranges[i] && grade < ranges[i + 1]) {
                dataCounts[i]++;
                break;
            }
        }
    });

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: rangeLabels,
            datasets: [{
                label: 'Number of Students',
                data: dataCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Grade Ranges'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const rangeIndex = context.dataIndex;
                            return `${rangeLabels[rangeIndex]}: ${dataCounts[rangeIndex]} students`;
                        }
                    }
                }
            }
        }
    });

    chartModal.classList.remove('hidden');
}

function closeChartModal() {
    chartModal.classList.add('hidden');
}

search.addEventListener('input', renderStudents);

renderStudents();

let currentInput = '';
let previousInput = '';
let operator = '';

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function setOperation(op) {
    if (currentInput === '' && previousInput === '') return;

    if (previousInput !== '' && currentInput !== '') {
        calculateResult();
    }

    operator = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function calculateResult() {
    if (previousInput === '' || currentInput === '' || operator === '') return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current === 0 ? 'Error' : prev / current;
            break;
        default:
            return;
    }

    currentInput = result.toString();
    previousInput = '';
    operator = '';
    updateDisplay();
}

function clearCalculator() {
    currentInput = '';
    previousInput = '';
    operator = '';
    updateDisplay();
}

function updateDisplay() {
    const display = document.getElementById('calculatorDisplay');
    if (currentInput === '' && previousInput === '') {
        display.value = '0';
    } else if (currentInput === '') {
        display.value = `${previousInput} ${operator}`;
    } else {
        display.value = `${previousInput} ${operator} ${currentInput}`;
    }
}

function closeCalculatorModal() {
    document.getElementById('calculatorModal').classList.add('hidden');
}

function openCalculatorModal() {
    document.getElementById('calculatorModal').classList.remove('hidden');
}

// document.getElementById('clearButton').addEventListener('click', clearCalculator);
// document.getElementById('equalsButton').addEventListener('click', calculateResult);

document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => appendNumber(button.innerText));
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => setOperation(button.innerText));
});

function updateProgressBar() {
    const table = document.getElementById('studentTable');
    const rows = table.querySelectorAll('tbody tr');
    let totalGrade = 0;
    let count = 0;

    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const gradeCell = row.cells[2];


            const grade = parseFloat(gradeCell.textContent);
            if (!isNaN(grade)) {
                totalGrade += grade;
                count++;
            }
        }
    });

    const average = count > 0 ? totalGrade / count : 0;
    const progressBar = document.getElementById('progressBar');
    const percentage = Math.min(100, Math.round(average));
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage + '%';
}
updateProgressBar()
