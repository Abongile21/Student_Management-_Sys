
let editingIndex = -1;
let chartInstance = null; 

const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const grade = document.getElementById('grade');
const studentForm = document.getElementById('studentForm');
const del =document.getElementById('del')
const adding = document.getElementById('adding')
const submit = document.getElementById('submit')
const studentModal = document.getElementById('studentModal')
const chartModal = document.getElementById('chartModal')
const search = document.getElementById('search');
const deleteAllModal = document.getElementById('deleteAllModal')
const gradeChart = document.getElementById('gradeChart')





let students = [
    { fname: 'Alice', lname: 'Smith', grade: 88 },
    { fname: 'Bob', lname: 'Johnson', grade: 74 },
    { fname: 'Charlie', lname: 'Williams', grade: 92 },
    { fname: 'David', lname: 'Jones', grade: 85 },
    { fname: 'Eva', lname: 'Brown', grade: 67 },
    { fname: 'Frank', lname: 'Davis', grade: 76 },
    { fname: 'Grace', lname: 'Miller', grade: 81 },
    { fname: 'Hannah', lname: 'Wilson', grade: 90 },
    { fname: 'Ivy', lname: 'Moore', grade: 72 },
    { fname: 'Jack', lname: 'Taylor', grade: 95 },
    { fname: 'Liam', lname: 'Anderson', grade: 60 },
    { fname: 'Mia', lname: 'Thomas', grade: 78 },
    { fname: 'Noah', lname: 'Jackson', grade: 84 },
    { fname: 'Olivia', lname: 'White', grade: 89 },
    { fname: 'Paul', lname: 'Harris', grade: 73 },
    { fname: 'Quinn', lname: 'Martin', grade: 66 },
    { fname: 'Riley', lname: 'Thompson', grade: 88 },
    { fname: 'Sophia', lname: 'Garcia', grade: 92 },
    { fname: 'Thomas', lname: 'Martinez', grade: 80 },
    { fname: 'Uma', lname: 'Roberts', grade: 77 },
    { fname: 'Victor', lname: 'Clark', grade: 63 },
    { fname: 'Wendy', lname: 'Lewis', grade: 95 },
    { fname: 'Xander', lname: 'Walker', grade: 82 },
    { fname: 'Yara', lname: 'Hall', grade: 70 },
    { fname: 'Zach', lname: 'Allen', grade: 66 },
    { fname: 'Anna', lname: 'Young', grade: 90 },
    { fname: 'Brian', lname: 'King', grade: 75 },
    { fname: 'Cora', lname: 'Wright', grade: 83 },
    { fname: 'Derek', lname: 'Scott', grade: 71 },
    { fname: 'Ella', lname: 'Adams', grade: 87 },
    { fname: 'Felix', lname: 'Baker', grade: 69 },
    { fname: 'Gina', lname: 'Gonzalez', grade: 94 },
    { fname: 'Henry', lname: 'Nelson', grade: 62 },
    { fname: 'Iris', lname: 'Carter', grade: 91 },
    { fname: 'James', lname: 'Mitchell', grade: 85 },
    { fname: 'Kara', lname: 'Perez', grade: 79 },
    { fname: 'Leo', lname: 'Robinson', grade: 96 },
    { fname: 'Maya', lname: 'Foster', grade: 68 },
    { fname: 'Nina', lname: 'Sullivan', grade: 77 },
    { fname: 'Owen', lname: 'Parker', grade: 82 },
    { fname: 'Paige', lname: 'Morris', grade: 73 },
    { fname: 'Quincy', lname: 'Ward', grade: 87 },
    { fname: 'Rosa', lname: 'Price', grade: 61 },
    { fname: 'Sam', lname: 'Cooper', grade: 78 },
    { fname: 'Tina', lname: 'Bell', grade: 80 },
    { fname: 'Ulysses', lname: 'Murphy', grade: 93 },
    { fname: 'Vera', lname: 'Bailey', grade: 84 },
    { fname: 'Will', lname: 'Rivera', grade: 88 },
    { fname: 'Xena', lname: 'Fox', grade: 95 },
    { fname: 'Yann', lname: 'Hayes', grade: 67 },
    { fname: 'Zoe', lname: 'Ward', grade: 81 }
] || JSON.parse(localStorage.getItem('students'));


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
    adding.play()
    localStorage.setItem('students', JSON.stringify(students));

    studentForm.reset();
    closeModal();
    
    renderStudents();
});

function renderStudents() {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    const searchQuery = search.value.toLowerCase();

    students
        .filter(student => student.fname.toLowerCase().includes(searchQuery) || 
            student.lname.toLowerCase().includes(searchQuery) ||
            student.grade.toString().includes(searchQuery))
        .forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3">${student.fname}</td>
                <td class="p-3">${student.lname}</td>
                <td class="p-3">${student.grade}</td>
                <td class="p-3">
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
    submit.classList='bg-yellow-500 text-white px-3 py-1 rounded mr-2'
    openModal();
}

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    del.play()
    deleteAllModal.classList.add('hidden');
    renderStudents();
}

function deleteAll() {
    deleteAllModal.classList.remove('hidden');
}

function confirmDeleteAll() {
    students = [];
    localStorage.removeItem('students');
    del.play()
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
