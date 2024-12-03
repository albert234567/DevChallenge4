// Variables globals
let franjaHoraria = null;
const cursos = {
  mati: ["ESO", "BAT", "ADFI (matí)", "GEST (matí)", "ASIX (matí)", "DAW (matí)", "CAI (matí)"],
  tarda: ["ADFI (tarda)", "GEST (tarda)", "MARQ (tarda)", "ASIX (tarda)", "DAM (tarda)", "DAW (tarda)", "FARM (tarda)"],
};

// Gestió de la selecció de franja horària
document.querySelectorAll(".time-slot-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    franjaHoraria = e.target.dataset.slot;
    document.getElementById("step-1").style.display = "none";
    loadCursos(franjaHoraria);
    document.getElementById("step-2").style.display = "block";
  });
});

// Carregar cursos segons franja horària
function loadCursos(slot) {
  const select = document.getElementById("curs-select");
  select.innerHTML = '<option value="" disabled selected>Escull un curs</option>';
  cursos[slot].forEach((curs) => {
    const option = document.createElement("option");
    option.value = curs;
    option.textContent = curs;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    document.getElementById("curs-next-btn").disabled = !select.value;
  });
}

// Passar al calendari
document.getElementById("curs-next-btn").addEventListener("click", () => {
  document.getElementById("step-2").style.display = "none";
  document.getElementById("step-3").style.display = "block";
});

// Gestió del calendari
let currentMonth = document.querySelector(".current-month");
let calendarDays = document.querySelector(".calendar-days");
let today = new Date();
let date = new Date();

currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
today.setHours(0, 0, 0, 0);
renderCalendar();

// Renderitzar el calendari
function renderCalendar() {
  // Obtenir el primer dia del mes (1er dia)
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  const totalMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startWeekDay = firstDayOfMonth.getDay(); // Ens dóna el dia de la setmana del primer dia del mes
  calendarDays.innerHTML = "";

  const totalCalendarDay = 6 * 7; // 6 setmanes, cada setmana 7 dies
  for (let i = 0; i < totalCalendarDay; i++) {
    let day = i - startWeekDay + 1;

    if (i < startWeekDay) {
      // Dies del mes anterior
      calendarDays.innerHTML += `<div class="padding-day">${prevLastDay - i}</div>`;
    } else if (i < startWeekDay + totalMonthDay) {
      // Dies del mes actual
      let currentDay = new Date(date.getFullYear(), date.getMonth(), day);  // Crear data per al dia
      let dayClass = currentDay.toDateString() === today.toDateString() ? "current-day" : "month-day";
      calendarDays.innerHTML += `<div class="${dayClass}">${day}</div>`;
    } else {
      // Dies del mes següent
      calendarDays.innerHTML += `<div class="padding-day">${day - totalMonthDay}</div>`;
    }
  }
}

// Canviar mes amb botons prev i next
document.querySelectorAll(".month-btn").forEach((button) => {
  button.addEventListener("click", () => {
    let currentDate = new Date(date);  // Crear una nova instància de la data
    if (button.classList.contains("prev")) {
      // Retrocedir al mes anterior
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (button.classList.contains("next")) {
      // Avançar al següent mes
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Actualitzar la data global
    date = currentDate;
    currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    renderCalendar();
  });
});

// Botó "today" per anar al dia actual
document.querySelector(".btn.today").addEventListener("click", () => {
  date = new Date(); // Estableix la data a l'actual
  currentMonth.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  renderCalendar();
});
