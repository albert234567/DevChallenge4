<!DOCTYPE html>
<html lang="en">
<head>
    <title>Reserva de Cites</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body>

    <div class="container">

    <div class="progress-bar-container">
    <div class="progress-bar" id="progress-bar"></div>
    </div>

        <!-- Pas 1: Seleccionar Matí o Tarda -->
        <div id="step-1" class="step">
            <h2>Selecciona la franja horària</h2>
            <button class="time-slot-btn" data-slot="mati">Matí</button>
            <button class="time-slot-btn" data-slot="tarda">Tarda</button>
        </div>

        <!-- Pas 2: Seleccionar el curs -->
        <div id="step-2" class="step" style="display: none;">
            <h2>Selecciona el curs</h2>
            <select id="curs-select">
                <option value="" disabled selected>Escull un curs</option>
            </select>
            <button class="back-btn" data-prev-step="step-1">⬅️</button>
            <button id="curs-next-btn" disabled>Continuar</button>
        </div>

<!-- Pas 3: Calendari -->
<div id="step-3" class="step" style="display: none;">
    <h2>Selecciona un dia disponible</h2>
    <div class="card">
        <div class="calendar-toolbar">
            <button class="prev month-btn"><i class="fas fa-chevron-left"></i></button>
            <div class="current-month"></div>
            <button class="next month-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar">
            <div class="weekdays">
                <div class="weekday-name">Su</div>
                <div class="weekday-name">Mo</div>
                <div class="weekday-name">Tu</div>
                <div class="weekday-name">We</div>
                <div class="weekday-name">Th</div>
                <div class="weekday-name">Fr</div>
                <div class="weekday-name">Sa</div>
            </div>
            <div class="calendar-days"></div>
        </div>
        
        <!-- Aquí afegeix això -->
        <div class="hours-container"></div>

        <div class="goto-buttons">
            <button class="back-btn" data-prev-step="step-2">⬅️</button>
            <button type="button" class="btn today">Today</button>
            <button type="button" id="confirm-reservation" class="btn" disabled style="display: none;"></button>
        </div>
    </div>
</div>

<!-- Pas 4: Confirmació i formulari -->
<div id="step-4" class="step" style="display: none;">
<h2 id="reservation-title">Confirma la teva reserva</h2>  <div class="summary">
    <p><strong>Curs:</strong> <span id="summary-course"></span></p>
    <p><strong>Data:</strong> <span id="summary-date"></span></p>

    <!-- Dades que apareixeran només després de confirmar -->
    <div class="summary-extra" style="display: none;">
      <p><strong>Hora:</strong> <span id="summary-hour"></span></p>
      <p><strong>Nom:</strong> <span id="summary-name"></span></p>
      <p><strong>Email:</strong> <span id="summary-email"></span></p>
      <p><strong>Telèfon:</strong> <span id="summary-phone"></span></p>
    </div>
  </div>

  <form id="reservation-form">
    <label for="hour-select">Hora disponible:</label>
    <select id="hour-select" name="hour_select" required>
      <option value="" disabled selected>Escull una hora</option>
    </select>

    <label for="name">Nom:</label>
    <input type="text" id="name" name="name" required>

    <label for="email">Mail:</label>
    <input type="email" id="email" name="email" required>

    <label for="phone">Telèfon:</label>
    <input type="tel" id="phone" name="phone" required>

    <div class="goto-buttons">
        <button class="back-btn" data-prev-step="step-3">⬅️</button>
        <button type="submit" class="btn">Confirmar reserva</button>
    </div>
  </form>
</div>

<script src="assets/js/script.js" defer></script>
</body>
</html>