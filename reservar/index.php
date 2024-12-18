<?php include('templates/header.php'); ?>

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
                <div class="goto-buttons">
                    <button type="button" class="btn today">Today</button>
                    <button type="button" id="confirm-reservation" class="btn">Confirmar Reserva</button>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/js/script.js"></script>
</body>
</html>

<?php include('templates/footer.php'); ?>
