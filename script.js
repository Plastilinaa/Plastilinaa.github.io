// Base de datos de ejemplo
const data = [
    {
        specialty: "Traumatología",
        doctors: ["Dr. Roberto Sánchez", "Dra. Lucía Fernández"]
    },
    {
        specialty: "Pediatría",
        doctors: ["Dra. Mariana López", "Dr. Carlos Galarza", "Dra. Sofía Mendoza"]
    },
    {
        specialty: "Cardiología",
        doctors: ["Dr. Hernán Cortéz", "Dra. Julieta Román"]
    },
    {
        specialty: "Dermatología",
        doctors: ["Dra. Valeria Blanco", "Dr. Tomás Quintana"]
    },
    {
        specialty: "Oftalmología",
        doctors: ["Dr. Esteban Quito", "Dra. Laura Campos"]
    }
];

// Elementos del DOM
const specialtiesContainer = document.getElementById('specialties-container');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const modalDoctorName = document.getElementById('modal-doctor-name');
const timeSlotsContainer = document.getElementById('time-slots');
const dateInput = document.getElementById('appointment-date');
const bookBtn = document.getElementById('book-btn');
const resultMessage = document.getElementById('result-message');
const currentTicketDisplay = document.getElementById('current-ticket');

let selectedSlot = null;

// Configurar fecha mínima de hoy en el input de fecha
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);
dateInput.value = today;

// 1. Renderizar la lista de especialidades y doctores
data.forEach((item, index) => {
    const specialtyDiv = document.createElement('div');
    specialtyDiv.className = 'specialty-item';

    const header = document.createElement('div');
    header.className = 'specialty-header';
    header.textContent = item.specialty;

    const doctorList = document.createElement('ul');
    doctorList.className = 'doctors-list';
    doctorList.id = `list-${index}`;

    item.doctors.forEach(doctor => {
        const li = document.createElement('li');
        li.textContent = doctor;
        // Al hacer clic en un doctor, abrir el modal
        li.addEventListener('click', () => openModal(doctor));
        doctorList.appendChild(li);
    });

    // Lógica para desplegar/contraer (Acordeón)
    header.addEventListener('click', () => {
        const isVisible = doctorList.style.display === 'block';
        // Ocultar todas primero para que sea limpio (opcional)
        document.querySelectorAll('.doctors-list').forEach(list => list.style.display = 'none');
        // Alternar la actual
        doctorList.style.display = isVisible ? 'none' : 'block';
    });

    specialtyDiv.appendChild(header);
    specialtyDiv.appendChild(doctorList);
    specialtiesContainer.appendChild(specialtyDiv);
});

// 2. Lógica de la ventana Modal y Horarios
function openModal(doctorName) {
    modalDoctorName.textContent = doctorName;
    resultMessage.classList.add('hidden');
    bookBtn.disabled = true;
    selectedSlot = null;
    generateTimeSlots();
    modal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Si el usuario cambia la fecha, regeneramos los horarios (simulando nueva disponibilidad)
dateInput.addEventListener('change', () => {
    generateTimeSlots();
    bookBtn.disabled = true;
    resultMessage.classList.add('hidden');
});

function generateTimeSlots() {
    timeSlotsContainer.innerHTML = '';
    const times = [];

    // Mañana: 08:00 a 13:00 (cada 30 min)
    for (let h = 8; h < 13; h++) {
        times.push(`${h.toString().padStart(2, '0')}:00`);
        times.push(`${h.toString().padStart(2, '0')}:30`);
    }

    // Tarde: 17:00 a 21:00 (cada 30 min)
    for (let h = 17; h < 21; h++) {
        times.push(`${h.toString().padStart(2, '0')}:00`);
        times.push(`${h.toString().padStart(2, '0')}:30`);
    }

    times.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.textContent = time;

        // Simular que algunos turnos están ocupados (aprox 30% de probabilidad)
        const isOccupied = Math.random() < 0.3;

        if (isOccupied) {
            slot.classList.add('occupied');
            slot.title = "Turno no disponible";
        } else {
            slot.addEventListener('click', () => selectSlot(slot));
        }

        timeSlotsContainer.appendChild(slot);
    });
}

function selectSlot(slotElement) {
    // Quitar selección previa
    const previous = document.querySelector('.slot.selected');
    if (previous) previous.classList.remove('selected');

    slotElement.classList.add('selected');
    selectedSlot = slotElement.textContent;
    bookBtn.disabled = false;
}

// 3. Lógica del Botón "Pedir Turno"
bookBtn.addEventListener('click', () => {
    // Generar un número aleatorio entre 1 y 15
    const ticketNumber = Math.floor(Math.random() * 15) + 1;
    
    resultMessage.innerHTML = `¡Turno confirmado!<br>Tu número de atención es el: <strong>#${ticketNumber}</strong>`;
    resultMessage.classList.remove('hidden');
    bookBtn.disabled = true; // Deshabilitar el botón para evitar clics múltiples
    
    // Opcional: Marcar el slot como ocupado visualmente después de reservarlo
    const selected = document.querySelector('.slot.selected');
    if(selected) {
        selected.classList.remove('selected');
        selected.classList.add('occupied');
        // Clonar para quitar el event listener
        const clone = selected.cloneNode(true);
        selected.parentNode.replaceChild(clone, selected);
    }
});

// 4. Lógica del número de turno en tiempo real (Header)
let currentTicket = 1;
setInterval(() => {
    // Avanza el número de turno cada 5 a 15 segundos (simulado)
    currentTicket++;
    if (currentTicket > 99) currentTicket = 1; // Reiniciar si llega a 100
    currentTicketDisplay.textContent = currentTicket;
}, Math.floor(Math.random() * 10000) + 5000);
