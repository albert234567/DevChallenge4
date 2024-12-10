
// Gestió de la selecció de franja horària
document.querySelectorAll(".time-slot-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
        franjaHoraria = e.target.dataset.slot;  // Obtenim la franja horària seleccionada
        document.getElementById("step-1").style.display = "none";
        loadCursos(franjaHoraria);  // Carregar cursos en funció de la franja horària
        document.getElementById("step-2").style.display = "block";
    });
});

// Carregar cursos des de l'API segons la franja horària
function loadCursos(slot) {
    const select = document.getElementById("curs-select");
    select.innerHTML = '<option value="" disabled selected>Escull un curs</option>'; // Esborrem les opcions anteriors
    console.log("Franja horària seleccionada:", slot);

    // Realitzar una petició a l'API per obtenir els cursos disponibles segons la franja horària
    fetch(`api/cursos.php?slot=${slot}`)
        .then((response) => {
            if (!response.ok) throw new Error("Error carregant cursos");
            return response.text(); // Llegir la resposta com text per veure què retorna l'API
        })
        .then((data) => {
            console.log(data); // Mostrar la resposta crua del servidor
            try {
                const jsonData = JSON.parse(data); // Intentar convertir la resposta en JSON
                if (jsonData.error) {
                    alert(jsonData.error);
                    return;
                }

                // Afegir cada curs a la llista desplegable
                jsonData.forEach((curs) => {
                    const option = document.createElement("option");
                    option.value = curs.id;  // El valor hauria de ser l'ID del curs per referència
                    option.textContent = `${curs.nom} (${curs.franja_horaria})`;  // Mostrar nom i franja horària
                    select.appendChild(option);
                });
            } catch (error) {
                console.error("Error al parsejar JSON:", error);
                alert("No s'han pogut carregar els cursos");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("No s'han pogut carregar els cursos");
        });

    // Habilitar el botó "Continuar" quan es selecciona un curs
    select.addEventListener("change", () => {
        selectedCourse = select.value;
        document.getElementById("curs-next-btn").disabled = !selectedCourse;
    });
}

// Passar al calendari
document.getElementById("curs-next-btn").addEventListener("click", () => {
    document.getElementById("step-2").style.display = "none";
    document.getElementById("step-3").style.display = "block";
    renderCalendar();
});

// Gestió del calendari
let calendarDays = document.querySelector(".calendar-days");
let today = new Date();
let date = new Date();

currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
today.setHours(0, 0, 0, 0);

function renderCalendar() {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    const totalMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const startWeekDay = firstDayOfMonth.getDay();
    calendarDays.innerHTML = "";

    fetch(`api/disponibilitat.php?course=${selectedCourse}`)
        .then((response) => response.json())
        .then((availableDates) => {
            const totalCalendarDay = 6 * 7;
            for (let i = 0; i < totalCalendarDay; i++) {
                let day = i - startWeekDay + 1;
                let dayElement = document.createElement("div");

                if (i < startWeekDay) {
                    dayElement.className = "padding-day";
                    dayElement.textContent = prevLastDay - startWeekDay + i + 1;
                } else if (i < startWeekDay + totalMonthDay) {
                    let currentDate = new Date(date.getFullYear(), date.getMonth(), day).toISOString().split("T")[0];
                    dayElement.className = availableDates.includes(currentDate) ? "month-day available" : "month-day";
                    dayElement.textContent = day;
                    if (availableDates.includes(currentDate)) {
                        dayElement.addEventListener("click", () => {
                            document.querySelectorAll(".selected").forEach((el) => el.classList.remove("selected"));
                            dayElement.classList.add("selected");
                            selectedDate = currentDate;
                        });
                    }
                } else {
                    dayElement.className = "padding-day";
                    dayElement.textContent = day - totalMonthDay;
                }

                calendarDays.appendChild(dayElement);
            }
        })
        .catch((error) => console.error("Error carregant disponibilitat:", error));
}

// Canviar mes
document.querySelectorAll(".month-btn").forEach((button) => {
    button.addEventListener("click", () => {
        date.setMonth(date.getMonth() + (button.classList.contains("prev") ? -1 : 1));
        currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        renderCalendar();
    });
});

// Botó "today"
document.querySelector(".btn.today").addEventListener("click", () => {
    date = new Date();
    currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    renderCalendar();
});

// Confirmar reserva
document.getElementById("confirm-reservation").addEventListener("click", () => {
    const course = selectedCourse;
    if (!course || !selectedDate) {
        alert("Selecciona un curs i una data.");
        return;
    }
    const name = prompt("Introdueix el teu nom:");
    const email = prompt("Introdueix el teu correu electrònic:");

    fetch(`api/reserva.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, date: selectedDate, name, email }),
    })
        .then((response) => response.json())
        .then((data) => alert(data.message || "Reserva creada!"))
        .catch((error) => console.error("Error creant la reserva:", error));
});
