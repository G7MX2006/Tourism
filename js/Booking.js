import { checkAuth } from "./main.js";

document.addEventListener('DOMContentLoaded', () => {

    checkAuth();

    const tourSelect = document.getElementById('tourSelect');
    const travelersInput = document.getElementById('travelers');
    const bookingForm = document.getElementById('bookingForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const travelDate = document.getElementById('travelDate');
    const summaryContent = document.getElementById('summaryContent');
    const summaryPlaceholder = document.getElementById('summaryPlaceholder');
    const summaryTourName = document.getElementById('summaryTourName');
    const summaryCalc = document.getElementById('summaryCalc');
    const summaryTotal = document.getElementById('summaryTotal');
    const bookingsList = document.getElementById('bookingsList');
    const filterCity = document.getElementById('filterCity');
    const filterPrice = document.getElementById('filterPrice');
    const resetFiltersBtn = document.getElementById('resetFilters');

    if (travelDate) {
        travelDate.min = new Date().toISOString().split('T')[0];
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        if (fullName && (currentUser.name || currentUser.username)) {
            fullName.value = currentUser.name || currentUser.username;
        }
        if (email && currentUser.email) {
            email.value = currentUser.email;
        }
    }

    let toursData = [];
    let bookingsData = [];

    const TOURS_API = 'http://localhost:3000/tours';
    const BOOKINGS_API = 'http://localhost:3000/bookings';

    const nameReg = /^[A-Za-z]{3,}( [A-Za-z]{3,})+$/;
    const emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/;

    async function fetchTours() {
        try {
            const res = await fetch(TOURS_API);
            toursData = await res.json();

            populateTourSelect(toursData);
            populateCityFilter(toursData);

            const urlParams = new URLSearchParams(window.location.search);
            const tourIdFromUrl = urlParams.get('tourId');

            if (tourIdFromUrl) {
                tourSelect.value = tourIdFromUrl;
                updateSummary();
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    }

    function populateTourSelect(tours) {
        tourSelect.innerHTML = '<option value="">Select a Tour...</option>';
        tours.forEach(tour => {
            const option = document.createElement('option');
            option.value = tour.id;
            option.textContent = `${tour.name} - ${tour.city} ($${tour.price})`;
            tourSelect.appendChild(option);
        });
    }

    function populateCityFilter(tours) {
        tours.forEach(tour => {
            const exists = [...filterCity.options].some(op => op.value === tour.city);
            if (!exists) {
                const option = document.createElement('option');
                option.value = tour.city;
                option.textContent = tour.city;
                filterCity.appendChild(option);
            }
        });
    }

    // ===================================================
    // الدالة 4: جلب حجوزات الإيميل الحالي فقط
    // ===================================================
    async function fetchBookings() {
        try {
            const res = await fetch(BOOKINGS_API);
            const allBookings = await res.json();

            if (currentUser && currentUser.email) {
                bookingsData = allBookings.filter(
                    item => item.email && item.email.toLowerCase() === currentUser.email.toLowerCase()
                );
            } else {
                bookingsData = [];
            }

            renderBookings(bookingsData);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    function updateSummary() {
        const selectedTour = toursData.find(t => String(t.id) === String(tourSelect.value));
        const count = parseInt(travelersInput.value) || 1;

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

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const loggedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!loggedUser) {
            alert('Please log in first to book your trip.');
            window.location.href = './signin.html';
            return;
        }

        if (!tourSelect.value) {
            alert('Please select a tour');
            return;
        }
        if (!travelDate.value) {
            alert('Please select travel date');
            return;
        }
        if (!nameReg.test(fullName.value.trim())) {
            alert('Please enter a valid full name (First and Last name, at least 3 letters each)');
            return;
        }
        if (!emailReg.test(email.value.trim())) {
            alert('Please enter a valid email ending with .com');
            return;
        }
        if (!phone.value.trim()) {
            alert('Please enter your phone number');
            return;
        }

        const selectedTour = toursData.find(t => String(t.id) === String(tourSelect.value));
        const count = Number(travelersInput.value) || 1;

        const newBooking = {
            id: Date.now().toString(),
            tourName: selectedTour.name,
            city: selectedTour.city,
            date: travelDate.value,
            travelers: count,
            total: selectedTour.price * count,
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            notes: document.getElementById('notes').value,
            status: 'Confirmed'
        };

        try {
            const res = await fetch(BOOKINGS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBooking)
            });

            if (res.ok) {
                bookingForm.reset();
                updateSummary();
                await fetchBookings();
                alert('Your expedition has been successfully booked!');
            }
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    });

    function renderBookings(list) {
        bookingsList.innerHTML = '';

        if (!list || list.length === 0) {
            bookingsList.innerHTML = '<tr><td colspan="8" class="text-muted py-3">No bookings found.</td></tr>';
            return;
        }

        list.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-bold">${item.tourName}</td>
                <td>${item.date}</td>
                <td>${item.travelers}</td>
                <td class="fw-bold text-success">$${item.total}</td>
                <td>${item.fullName}</td>
                <td>${item.email}</td>
                <td><span class="badge bg-success">${item.status}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm rounded-pill px-3" onclick="window.removeBooking('${item.id}')">
                        Delete
                    </button>
                </td>
            `;
            bookingsList.appendChild(tr);
        });
    }

    window.removeBooking = async function (id) {
        try {
            const res = await fetch(`${BOOKINGS_API}/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await fetchBookings();
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    function applyFilters() {
        const selectedCity = filterCity.value;
        const maxPrice = parseFloat(filterPrice.value);

        const filtered = bookingsData.filter(item => {
            const matchesCity = selectedCity === 'all' || item.city === selectedCity;
            const matchesPrice = isNaN(maxPrice) || item.total <= maxPrice;
            return matchesCity && matchesPrice;
        });

        renderBookings(filtered);
    }

    tourSelect.addEventListener('change', updateSummary);
    travelersInput.addEventListener('input', updateSummary);
    filterCity.addEventListener('change', applyFilters);
    filterPrice.addEventListener('input', applyFilters);

    resetFiltersBtn.addEventListener('click', () => {
        filterCity.value = 'all';
        filterPrice.value = '';
        renderBookings(bookingsData);
    });

    fetchTours();
    fetchBookings();
});
