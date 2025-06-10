document.addEventListener("DOMContentLoaded", () => {
    const currentMonth = document.querySelector(".current-month");
    const calendarDays = document.querySelector(".calendar-days");
    const hoursContainer = document.querySelector(".hours-container");
    const cursSelect = document.getElementById("curs-select");

    let today = new Date();
    let date = new Date();
    today.setHours(0, 0, 0, 0);

document.querySelectorAll('.back-btn').forEach(button => {
  button.addEventListener('click', function () {
    const currentStep = this.closest('.step');
    const prevStepId = this.getAttribute('data-prev-step');
    const prevStep = document.getElementById(prevStepId);

    if (currentStep && prevStep) {
      currentStep.style.display = 'none';
      prevStep.style.display = 'block';

      // Detectar el número del pas anterior
      const stepNumber = parseInt(prevStepId.split('-')[1]);
      updateProgressBar(stepNumber);
    }
  });
});


  //barra de progres
  function updateProgressBar(stepNumber) {
  const totalSteps = 5; // nombre total de passos
  const progress = ((stepNumber - 1) / (totalSteps - 1)) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
}


    // Inicialitzar text mes actual
    currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Control botó mesos
    document.querySelectorAll(".month-btn").forEach(button => {
        button.addEventListener("click", () => {
            date.setMonth(date.getMonth() + (button.classList.contains("prev") ? -1 : 1));
            currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            renderCalendar();
        });
    });

    // Botó "Avui"
    document.querySelector(".btn.today").addEventListener("click", () => {
        date = new Date();
        currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        renderCalendar();
    });

    // Variables estat
    let franjaHoraria = null;
    let selectedCourse = null;
    let selectedDate = null;
    let selectedHour = null;

    // Pas 1: Seleccionar franja horària
    document.querySelectorAll(".time-slot-btn").forEach(button => {
        button.addEventListener("click", e => {
            franjaHoraria = e.target.dataset.slot;
            console.log("Franja horària seleccionada:", franjaHoraria);
            document.getElementById("step-1").style.display = "none";
            loadCursos(franjaHoraria);
            document.getElementById("step-2").style.display = "block";
            updateProgressBar(2);

        });
    });

    // Carregar cursos segons franja horària
    function loadCursos(slot) {
        cursSelect.innerHTML = '<option value="" disabled selected>Escull un curs</option>';
        fetch(`api/cursos.php?slot=${slot}`)
            .then(res => {
                if (!res.ok) throw new Error("Error carregant cursos");
                return res.json();
            })
            .then(cursos => {
                if (Array.isArray(cursos)) {
                    cursos.forEach(curs => {
                        const option = document.createElement("option");
                        option.value = curs.id;
                        option.textContent = `${curs.nom} (${curs.franja_horaria})`;
                        cursSelect.appendChild(option);
                    });
                } else {
                    alert(cursos.error || "No s'han trobat cursos");
                }
            })
            .catch(err => {
                console.error("Error al carregar cursos:", err);
                alert("No s'han pogut carregar els cursos");
            });
    }

    // Pas 2: Seleccionar curs
    cursSelect.addEventListener("change", () => {
        selectedCourse = cursSelect.value;
        window.selectedCourseId = cursSelect.value;
        document.getElementById("curs-next-btn").disabled = !selectedCourse;
    });

    document.getElementById("curs-next-btn").addEventListener("click", () => {
        if (!selectedCourse) return alert("Selecciona un curs");
        document.getElementById("step-2").style.display = "none";
        document.getElementById("step-3").style.display = "block";
        updateProgressBar(3);


        // Reset seleccions quan entres al calendari
        selectedDate = null;
        selectedHour = null;
        document.getElementById("confirm-reservation").disabled = true;
        hoursContainer.innerHTML = "";

        renderCalendar();
    });

function renderCalendar() {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const totalMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  let startWeekDay = firstDayOfMonth.getDay();
  startWeekDay = (startWeekDay + 6) % 7;  // Ajust per començar la setmana per dilluns

  calendarDays.innerHTML = "";

  const totalCalendarDay = 42;

  for (let i = 0; i < totalCalendarDay; i++) {
    const dayElement = document.createElement("div");
    const day = i - startWeekDay + 1;

    if (day < 1 || day > totalMonthDay) {
      dayElement.className = "padding-day";
      dayElement.textContent = "";
    } else {
      dayElement.className = "month-day";
      dayElement.textContent = day;
    }

    calendarDays.appendChild(dayElement);
  }

  fetch(`api/disponibilitat.php?course_id=${selectedCourse}`)
    .then(response => response.json())
    .then(availableDates => {
      console.log("Resposta API:", availableDates);

    document.querySelectorAll(".month-day").forEach(dayElement => {
      const day = parseInt(dayElement.textContent, 10);
      if (isNaN(day)) return;

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const currentDate = `${year}-${month}-${dayStr}`;

      if (availableDates.includes(currentDate)) {
        dayElement.classList.add("available");
        dayElement.style.cursor = "pointer";

          dayElement.addEventListener("click", () => {
            // Neteja altres seleccions
            document.querySelectorAll(".month-day.selected").forEach(el => el.classList.remove("selected"));
            dayElement.classList.add("selected");

            selectedDate = currentDate;

            // Mostra pas 4, amaga pas 3
            document.getElementById("step-3").style.display = "none";
            document.getElementById("step-4").style.display = "block";

            // 🔧 ACTUALITZAR BARRA DE PROGRÉS AL PAS 4
            updateProgressBar(4);


            // Actualitza el resum amb curs i data
            document.getElementById("summary-course").textContent = cursSelect.options[cursSelect.selectedIndex].text;
            document.getElementById("summary-date").textContent = selectedDate;

            // Carrega hores disponibles per a aquesta data i curs
            loadAvailableHours(selectedCourse, selectedDate);
          });
        }
      });
    })
    .catch(error => console.error("Error carregant disponibilitat:", error));
}



function loadAvailableHours(courseId, date) {
  const hourSelect = document.getElementById("hour-select");
  hourSelect.innerHTML = '<option value="" disabled selected>Escull una hora</option>';

  fetch(`api/hores.php?course_id=${courseId}&data=${date}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        console.log("Hores disponibles:", data); // Mostra les hores correctes

        data.forEach(hour => {
          const option = document.createElement("option");
          option.value = hour;
          option.textContent = hour;
          hourSelect.appendChild(option);
        });
      } else {
        alert("No hi ha hores disponibles per aquesta data.");
      }
    })
    .catch(err => {
      console.error("Error carregant hores:", err);
    });
}


// Gestionar enviament formulari Pas 4
document.getElementById('reservation-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const courseId = window.selectedCourseId;
  const date = document.getElementById('summary-date').textContent;
  const hourStr = document.getElementById('hour-select').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  // Dades per reserva (igual que abans)
  const reservaData = {
    course_id: courseId,
    date: date,   // string '2025-06-10'
    hour: hourStr, // string '10:00'
    name: name,
    email: email,
    phone: phone
  };

  fetch('api/reserva.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservaData)
  })
  .then(res => res.json())
  .then(response => {
    if (!response.success) throw new Error(response.message || 'Error en la reserva');

    // Reserva OK: actualitzar UI...
    document.getElementById('reservation-title').textContent = "Reserva completada";
    document.getElementById('summary-hour').textContent = hourStr;
    document.getElementById('summary-name').textContent = name;
    document.getElementById('summary-email').textContent = email;
    document.getElementById('summary-phone').textContent = phone;
    document.getElementById('reservation-form').style.display = 'none';
    document.querySelector('.summary-extra').style.display = 'block';
    updateProgressBar(5);

    /*
    // Ara eliminem la disponibilitat (necessitem obtenir hour_id)
    return fetch(`api/get_hour_id.php?hora=${encodeURIComponent(hourStr)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error("No s'ha trobat el hour_id");

        // Ara fem la petició d'eliminar amb hour_id i data (NO date!)
        return fetch('api/eliminar.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: courseId,
            data: date,       // camp data, no date
            hour_id: data.hour_id
          })
        });

      })
      .then(delRes => delRes.json())
      .then(delResponse => {
        if (!delResponse.success) {
          console.warn("No s'ha pogut eliminar la disponibilitat:", delResponse.message);
        }
      });
    */
  })
  .catch(err => {
    console.error(err);
    alert("Error: " + err.message);
  });
});



});
