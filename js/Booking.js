import { checkAuth } from "./main.js";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const todayDate = new Date().toISOString().split('T')[0];

   
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');

    function fillUserData() {
        if (currentUser) {
            if (fullName) fullName.value = currentUser.name || currentUser.username || '';
            if (email) email.value = currentUser.email || '';
        }
    }
    fillUserData();

    
    let toursData = [];
    const tourSelect = document.getElementById('tourSelect');

    async function loadTours() {
        try {
            const res = await fetch('http://localhost:3000/tours');
            toursData = await res.json();

            tourSelect.innerHTML = '<option value="">Select a Tour...</option>';
            if (editTourSelect) editTourSelect.innerHTML = '<option value="">Select a Tour...</option>';

            toursData.forEach(tour => {
                const opt = `<option value="${tour.id}">${tour.name} - $${tour.price}</option>`;
                tourSelect.innerHTML += opt;
                if (editTourSelect) editTourSelect.innerHTML += opt;
            });

            
            const urlParams = new URLSearchParams(window.location.search);
            const tourId = urlParams.get('tourId');
            if (tourId) {
                tourSelect.value = tourId;
                updateSummary();
            }
        } catch (err) {
            console.error("Error loading tours:", err);
        }
    }

  
    const travelersInput = document.getElementById('travelers');
    const summaryPlaceholder = document.getElementById('summaryPlaceholder');
    const summaryContent = document.getElementById('summaryContent');
    const summaryTourName = document.getElementById('summaryTourName');
    const summaryCalc = document.getElementById('summaryCalc');
    const summaryTotal = document.getElementById('summaryTotal');

    function updateSummary() {
        const selectedTour = toursData.find(t => String(t.id) === String(tourSelect.value));
        const count = parseInt(travelersInput.value, 10) || 1;

        if (selectedTour) {
            const total = selectedTour.price * count;
            summaryTourName.textContent = selectedTour.name;
            summaryCalc.textContent = `$${selectedTour.price} × ${count}`;
            summaryTotal.textContent = `$${total}`;

            summaryPlaceholder.classList.add('d-none');
            summaryContent.classList.remove('d-none');
        } else {
            summaryContent.classList.add('d-none');
            summaryPlaceholder.classList.remove('d-none');
        }
    }

    tourSelect.addEventListener('change', updateSummary);
    travelersInput.addEventListener('input', updateSummary);

   
    const bookingsList = document.getElementById('bookingsList');

    async function loadBookings() {
        try {
            const res = await fetch('http://localhost:3000/bookings');
            const allBookings = await res.json();

            let myBookings = [];
            if (currentUser && currentUser.email) {
                myBookings = allBookings.filter(b => b.email.toLowerCase() === currentUser.email.toLowerCase());
            }

            bookingsList.innerHTML = '';
            if (myBookings.length === 0) {
                bookingsList.innerHTML = '<tr><td colspan="8" class="text-center py-3 text-muted">No bookings yet</td></tr>';
                return;
            }

            myBookings.forEach(item => {
                const tr = `
                    <tr class="align-middle border-bottom border-light-subtle">
                        <td class="fw-bold py-3 text-dark">${item.tourName}</td>
                        <td class="text-secondary text-nowrap">${item.date}</td>
                        <td class="text-secondary text-center">${item.travelers || 1}</td>
                        <td class="fw-bold text-success text-center">$${item.total}</td>
                        <td class="text-secondary text-nowrap">${item.fullName || ''}</td>
                        <td class="text-muted small">${item.email || ''}</td>
                        <td class="text-center">
                            <span class="badge rounded-pill fw-normal px-3 py-2" style="background-color: #198754; color: #fff;">
                                ${item.status || 'Confirmed'}
                            </span>
                        </td>
                        <td class="text-nowrap text-end">
                            <button class="btn btn-sm rounded-pill px-3 me-1 fw-semibold" 
                                    style="background-color: #f5f0eb; color: #8c7355; border: 1px solid #d4c5b9;" 
                                    onclick="askEditBooking('${item.id}')">
                                Edit
                            </button>
                            <button class="btn btn-sm rounded-pill px-3 fw-semibold" 
                                    style="background-color: #d9534f; color: #fff; border: none;" 
                                    onclick="askDeleteBooking('${item.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
                bookingsList.innerHTML += tr;
            });

        } catch (err) {
            console.error("Error loading bookings:", err);
        }
    }

   
    const bookingForm = document.getElementById('bookingForm');
    const travelDate = document.getElementById('travelDate');
    const phone = document.getElementById('phone');
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));

    if (travelDate) travelDate.min = todayDate;

    const errorMsg = document.createElement("p");
    errorMsg.id = "errorMsg";
    errorMsg.style.color = "#ff6b6b";
    errorMsg.style.fontSize = "0.85rem";
    errorMsg.style.marginTop = "10px";
    errorMsg.style.textAlign = "center";
    bookingForm.appendChild(errorMsg);

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        if (!currentUser) {
            sessionStorage.setItem("returnUrl", window.location.href);
            authModal.show();
            return;
        }

        if (!tourSelect.value) {
            errorMsg.textContent = "Please select a tour!";
            return;
        }
        if (!travelDate.value) {
            errorMsg.textContent = "Please select a travel date!";
            return;
        }
        if (!fullName.value.trim()) {
            errorMsg.textContent = "Please enter your full name!";
            return;
        }
        if (!email.value.trim()) {
            errorMsg.textContent = "Please enter your email!";
            return;
        }
        if (!phone.value.trim()) {
            errorMsg.textContent = "Please enter your phone number!";
            return;
        }

        const selectedTour = toursData.find(t => String(t.id) === String(tourSelect.value));
        const count = Number(travelersInput.value) || 1;

        const newBooking = {
            id: Date.now().toString(),
            tourId: selectedTour.id,
            tourName: selectedTour.name,
            date: travelDate.value,
            travelers: count,
            total: selectedTour.price * count,
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            status: 'Confirmed'
        };

        try {
            const res = await fetch('http://localhost:3000/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBooking)
            });

            if (res.ok) {
                errorMsg.textContent = "";
                bookingForm.reset();
                fillUserData();
                updateSummary();
                successModal.show();
                loadBookings();
            } else {
                errorMsg.textContent = "Failed to save booking. Please try again.";
            }
        } catch (err) {
            errorMsg.textContent = "Connection error! Make sure server is running.";
        }
    });

   
    let itemToEditId = null;
    const editTourSelect = document.getElementById('editTourSelect');
    const editTravelDate = document.getElementById('editTravelDate');
    const editTravelers = document.getElementById('editTravelers');
    const editPhone = document.getElementById('editPhone');
    const editErrorMsg = document.getElementById('editErrorMsg');
    const confirmUpdateBtn = document.getElementById('confirmUpdateBtn');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));

    if (editTravelDate) editTravelDate.min = todayDate;

    window.askEditBooking = async function (id) {
        itemToEditId = id;
        if (editErrorMsg) editErrorMsg.textContent = "";

        try {
            const res = await fetch(`http://localhost:3000/bookings/${id}`);
            const booking = await res.json();

            const matchingTour = toursData.find(t => t.name === booking.tourName || String(t.id) === String(booking.tourId));
            if (matchingTour && editTourSelect) editTourSelect.value = matchingTour.id;

            if (editTravelDate) editTravelDate.value = booking.date;
            if (editTravelers) editTravelers.value = booking.travelers;
            if (editPhone) editPhone.value = booking.phone;

            editModal.show();
        } catch (err) {
            console.error("Error fetching booking details:", err);
        }
    };

    confirmUpdateBtn.addEventListener('click', async () => {
        if (!itemToEditId) return;
        if (editErrorMsg) editErrorMsg.textContent = "";

        if (!editTourSelect.value) {
            editErrorMsg.textContent = "Please select a tour!";
            return;
        }
        if (!editTravelDate.value) {
            editErrorMsg.textContent = "Please select a travel date!";
            return;
        }
        if (!editTravelers.value || editTravelers.value < 1) {
            editErrorMsg.textContent = "Please enter a valid travelers count!";
            return;
        }
        if (!editPhone.value.trim()) {
            editErrorMsg.textContent = "Please enter your phone number!";
            return;
        }

        const selectedTour = toursData.find(t => String(t.id) === String(editTourSelect.value));
        const count = Number(editTravelers.value) || 1;

        const updatedData = {
            tourId: selectedTour.id,
            tourName: selectedTour.name,
            date: editTravelDate.value,
            travelers: count,
            total: selectedTour.price * count,
            phone: editPhone.value.trim()
        };

        try {
            const res = await fetch(`http://localhost:3000/bookings/${itemToEditId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                editModal.hide();
                loadBookings();
            } else {
                if (editErrorMsg) editErrorMsg.textContent = "Failed to update booking.";
            }
        } catch (err) {
            if (editErrorMsg) editErrorMsg.textContent = "Connection error while updating.";
        }
    });

   
    let itemToDeleteId = null;
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    window.askDeleteBooking = function (id) {
        itemToDeleteId = id;
        deleteModal.show();
    };

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!itemToDeleteId) return;

        try {
            const res = await fetch(`http://localhost:3000/bookings/${itemToDeleteId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                deleteModal.hide();
                loadBookings();
            }
        } catch (err) {
            console.error("Error deleting:", err);
        } finally {
            itemToDeleteId = null;
        }
    });

    
    loadTours();
    loadBookings();
});
