const API_URL = "http://127.0.0.1:8000";

let editingStudentId = null;
// LOAD STUDENTS


async function loadStudents() {

    try {

        const response = await fetch(
            `${API_URL}/students`
        );

        const students = await response.json();

        displayStudents(students);

    } catch (error) {

        console.error("Error:", error);

        alert("Unable to connect to FastAPI");

    }
}
// DISPLAY 


function displayStudents(students) {

    const tableBody =
        document.getElementById("studentTableBody");


    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.semester}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(
                        ${student.id},
                        '${student.name}',
                        '${student.department}',
                        ${student.semester}
                    )"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });
}
// ADD / UPDATE 


document
    .getElementById("studentForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value;

        const department =
            document.getElementById("department").value;

        const semester =
            parseInt(
                document.getElementById("semester").value
            );


        const studentData = {

            name: name,

            department: department,

            semester: semester

        };


        try {

            let response;


            // UPDATE

            if (editingStudentId !== null) {

                response = await fetch(
                    `${API_URL}/students/${editingStudentId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(studentData)
                    }
                );

            }

            // CREATE

            else {

                response = await fetch(
                    `${API_URL}/students`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(studentData)
                    }
                );

            }


            if (!response.ok) {

                throw new Error(
                    "Failed to save student"
                );

            }


            await response.json();


            alert(
                editingStudentId !== null
                    ? "Student updated successfully"
                    : "Student added successfully"
            );


            resetForm();

            loadStudents();

        }

        catch (error) {

            console.error(error);

            alert("Something went wrong");

        }

    });
// EDIT 


function editStudent(
    id,
    name,
    department,
    semester
) {

    editingStudentId = id;


    document.getElementById("name").value =
        name;

    document.getElementById("department").value =
        department;

    document.getElementById("semester").value =
        semester;


    document.getElementById("formTitle")
        .innerText = "Update Student";


    document.querySelector(
        "#studentForm button[type='submit']"
    ).innerText = "Update Student";


    document.getElementById("cancelBtn")
        .style.display = "block";

}
// DELETE 


async function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/students/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to delete student"
            );

        }


        alert(
            "Student deleted successfully"
        );


        loadStudents();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete student"
        );

    }

}
// RESET


function resetForm() {

    document
        .getElementById("studentForm")
        .reset();

    editingStudentId = null;


    document.getElementById("formTitle")
        .innerText = "Add Student";


    document.querySelector(
        "#studentForm button[type='submit']"
    ).innerText = "Add Student";


    document.getElementById("cancelBtn")
        .style.display = "none";

}
// CANCEL EDIT


function cancelEdit() {

    resetForm();

}
// LOAD DATA 
loadStudents();