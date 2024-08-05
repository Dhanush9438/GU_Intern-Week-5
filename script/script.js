document.addEventListener("DOMContentLoaded", function () {
    // Sample data for doctors
    const doctors = [
        { id: 1, name: "Dr. Santhosh Kumar (Obstetrics and gynaecology)", availableSlots: ["09:00", "10:00", "11:00"] },
        { id: 2, name: "Dr. Suresh (Neurology)", availableSlots: ["13:00", "14:00", "15:00"] },
    ];

    // Array to store appointments
    const appointments = [];

    // DOM elements
    const doctorSelection = document.getElementById("doctor-selection");
    const appointmentsList = document.getElementById("appointments-list");
    const doctorCards = document.getElementById("doctor-cards");

    // Function to populate doctor selection dropdown and display cards
    function populateDoctors() {
        doctors.forEach((doctor) => {
            // Populate dropdown
            const option = document.createElement("option");
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelection.appendChild(option);

            // Display doctor cards
            const doctorCard = document.createElement("div");
            doctorCard.className = "doctor-card";
            doctorCard.innerHTML = `
                <h3>${doctor.name}</h3>
                <p>Total Slots: ${doctor.availableSlots.length}</p>
                <p>Available Slots: ${doctor.availableSlots.join(", ")}</p>
                <div class="slots"></div>
            `;
            doctorCards.appendChild(doctorCard);
        });
    }

    // Function to update the display of available and booked slots for each doctor
    function updateDoctorSlots() {
        const doctorCards = document.querySelectorAll(".doctor-card");
        doctorCards.forEach((card, index) => {
            const doctor = doctors[index];
            const slots = card.querySelector(".slots");
            slots.innerHTML = ""; // Clear existing slots
            doctor.availableSlots.forEach((slot) => {
                const slotElement = document.createElement("span");
                slotElement.className = "slot";
                slotElement.textContent = slot;
                // Mark slot as booked if it is already booked
                if (appointments.some((appt) => appt.doctorId === doctor.id && appt.time === slot)) {
                    slotElement.classList.add("booked");
                }
                slots.appendChild(slotElement);
            });
        });
    }

    // Function to book an appointment
    function bookAppointment(event) {
        event.preventDefault();
        const patientName = document.getElementById("patient-name").value;
        const doctorId = parseInt(doctorSelection.value, 10);
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;

        // Validate input fields
        if (!patientName || !doctorId || !date || !time) {
            alert("Please fill in all fields.");
            return;
        }

        // Find selected doctor
        const doctor = doctors.find((doc) => doc.id === doctorId);

        // Validate selected slot
        if (!doctor.availableSlots.includes(time) || appointments.some((appt) => appt.doctorId === doctorId && appt.time === time)) {
            alert("Selected time slot is not available.");
            return;
        }

        // Create and store appointment
        const appointment = {
            id: appointments.length + 1, // Generate appointment ID
            patientName,
            doctorId,
            doctorName: doctor.name,
            date,
            time,
        };
        appointments.push(appointment);

        alert("Appointment booked successfully!");
        updateDoctorSlots();
    }

    // Function to cancel an appointment
    function cancelAppointment() {
        const appointmentId = parseInt(document.getElementById("appointment-id").value, 10);

        // Find and remove appointment
        const index = appointments.findIndex((appt) => appt.id === appointmentId);
        if (index !== -1) {
            appointments.splice(index, 1); // Remove appointment
            alert("Appointment canceled successfully!");
            updateDoctorSlots();
        } else {
            alert("Appointment ID not found.");
        }
    }

    // Function to view all appointments
    function viewAppointments() {
        appointmentsList.innerHTML = ""; // Clear existing appointments
        appointments.forEach((appt) => {
            const appointmentElement = document.createElement("div");
            appointmentElement.textContent = `ID: ${appt.id}, Patient: ${appt.patientName}, Doctor: ${appt.doctorName}, Date: ${appt.date}, Time: ${appt.time}`;
            appointmentsList.appendChild(appointmentElement);
        });
    }

    // Add event listeners
    document.getElementById("booking-form").addEventListener("submit", bookAppointment);
    document.getElementById("cancel-appointment").addEventListener("click", cancelAppointment);
    document.getElementById("view-appointments").addEventListener("click", viewAppointments);

    // Initialize the application
    populateDoctors();
    updateDoctorSlots();
});
