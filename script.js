let students = [];
let editingIndex = -1;

const fname = document.getElementById('name');
const lname = document.getElementById('lname');
const grade = document.getElementById('grade');
const studentForm = document.getElementById('studentForm');
const add = document.getElementById('add');
const del =document.getElementById('delete');


const submit = document.getElementById('submit')

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (editingIndex === -1) {
        students.push({ fname: fname.value, lname: lname.value, grade: grade.value });
    } else {
        students[editingIndex] = { fname: fname.value, lname: lname.value, grade: grade.value };
        editingIndex = -1;
    }

    localStorage.setItem('students', JSON.stringify(students));
    studentForm.reset();
    submit.innerHTML ='Add'
    submit.style.backgroundColor= '#28a745'
    add.play()

    renderStudents();
});

const renderStudents = () => {
    const tbody = document.getElementById('studentTable').querySelector('tbody');
    tbody.innerHTML = '';

    if (students.length !== 0) {
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.fname}</td>
                <td>${student.lname}</td>
                <td>${student.grade}</td>
                <td class="actions">
                    <button class="edit" onclick="editStudent(${index})">Edit</button>
                    <button class="delete" onclick="deleteStudent(${index})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

const editStudent = (index) => {
    
    student = students[index];
    fname.value = student.fname;
    lname.value = student.lname;
    grade.value = student.grade;
    editingIndex = index;
    submit.innerHTML='Updating...'
    submit.style.backgroundColor= '#ffc107'
}

const deleteStudent = (index) => {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    
    renderStudents();
    del.play()
}

renderStudents();
