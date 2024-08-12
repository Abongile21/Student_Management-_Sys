let students = JSON.parse(localStorage.getItem('students')) || [];
let editingIndex = -1;
let chartInstance = null; // Store the chart instance for destruction

const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const grade = document.getElementById('grade');
const studentForm = document.getElementById('studentForm');

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
        document.getElementById('submit').textContent = 'Add';
    }

    localStorage.setItem('students', JSON.stringify(students));
    studentForm.reset();
    closeModal();
    renderStudents();
});

function renderStudents() {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    const searchQuery = document.getElementById('search').value.toLowerCase();

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
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="editStudent(${index})">Edit</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteStudent(${index})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
}

function editStudent(index) {
    const student = students[index];
    fname.value = student.fname;
    lname.value = student.lname;
    grade.value = student.grade;
    editingIndex = index;
    document.getElementById('submit').textContent = 'Update';
    openModal();
}

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
}

function deleteAll() {
    document.getElementById('deleteAllModal').classList.remove('hidden');
}

function confirmDeleteAll() {
    students = [];
    localStorage.removeItem('students');
    renderStudents();
    closeDeleteAllModal();
}

function cancelDeleteAll() {
    closeDeleteAllModal();
}

function openModal() {
    document.getElementById('studentModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('studentModal').classList.add('hidden');
    studentForm.reset();
    editingIndex = -1;
    document.getElementById('submit').textContent = 'Add';
}

function openChartModal() {
    const ctx = document.getElementById('gradeChart').getContext('2d');

    // Destroy existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Calculate the number of students in each grade range
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

    document.getElementById('chartModal').classList.remove('hidden');
}

function closeChartModal() {
    document.getElementById('chartModal').classList.add('hidden');
}

document.getElementById('search').addEventListener('input', renderStudents);

renderStudents();
