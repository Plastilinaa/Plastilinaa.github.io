// Estructura de datos con contadores individuales
const data = [
    {
        specialty: "Traumatología",
        doctors: [
            { name: "Dr. Roberto Sánchez", current: 5 },
            { name: "Dra. Lucía Fernández", current: 12 }
        ]
    },
    {
        specialty: "Pediatría",
        doctors: [
            { name: "Dra. Mariana López", current: 2 },
            { name: "Dr. Carlos Galarza", current: 8 }
        ]
    }
];

const specialtiesContainer = document.getElementById('specialties-container');
const modal = document.getElementById('modal');
const nowServingDisplay = document.getElementById('doctor-now-serving');
let activeDoctor = null;

// Crear lista de especialidades
data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'specialty-item';
    div.innerHTML = `<div class="specialty-header">${item.specialty}</div>`;
    
    const ul = document.createElement('ul');
    ul.className = 'doctors-list';
    
    item.doctors.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.name;
        li.onclick = () => openDoctorModal(doc);
        ul.appendChild(li);
    });

    div.onclick = () => {
        const isVisible = ul.style.display === 'block';
        ul.style.display = isVisible ? 'none' : 'block';
    };
    
    div.appendChild(ul);
    specialtiesContainer.appendChild(div);
});

function openDoctorModal(doctor) {
    activeDoctor = doctor;
    document.getElementById('modal-doctor-name').textContent = doctor.name;
    document.getElementById('result-message').classList.add('hidden');
    nowServingDisplay.textContent = `#${doctor.current}`;
    
    generateSlots();
    modal.style.display = 'block';
}

function generateSlots() {
    const container = document.getElementById('time-slots');
    container.innerHTML = '';
    const hours = ["08:00", "08:30", "09:00", "09:30", "10:00", "17:00", "17:30", "18:00"];
    
    hours.forEach(h => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.textContent = h;
        if (Math.random() < 0.3) slot.classList.add('occupied');
        else {
            slot.onclick = () => {
                document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
                document.getElementById('book-btn').disabled = false;
            };
        }
        container.appendChild(slot);
    });
}

document.getElementById('book-btn').onclick = () => {
    const ticket = Math.floor(Math.random() * 15) + 1;
    const msg = document.getElementById('result-message');
    msg.innerHTML = `Reserva exitosa. Tu turno es el <strong>#${ticket}</strong>`;
    msg.classList.remove('hidden');
};

document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

// Simulación: los doctores avanzan sus turnos cada cierto tiempo
setInterval(() => {
    data.forEach(spec => {
        spec.doctors.forEach(doc => {
            if (Math.random() < 0.1) { // 10% de probabilidad de avanzar turno
                doc.current++;
                if (doc.current > 50) doc.current = 1;
                // Si el modal está abierto y es este doctor, actualizar pantalla
                if (activeDoctor && activeDoctor.name === doc.name) {
                    nowServingDisplay.textContent = `#${doc.current}`;
                }
            }
        });
    });
}, 5000);
