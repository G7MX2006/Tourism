import { checkAuth } from "./main.js";

let cards = document.getElementById("cont-cards");
let allTours = [];
let API_Tour = "http://localhost:3000/tours";
const cityFilter = document.getElementById("city-filter");
const priceFilter = document.getElementById("price-filter");
const sortFilter = document.getElementById("sort-filter");
const priceVal = document.getElementById("price-val");

checkAuth();

async function FetchTours() {
  try {
    const response = await fetch(API_Tour);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    let data = await response.json();
    allTours = data;
    const urlParams = new URLSearchParams(window.location.search);
    const destId = urlParams.get("destinationId");

    if (destId) {
      const match = allTours.find(t => t.destinationId === destId);
      if (match) {
        cityFilter.value = match.city;
        filterTours();
        return;
      }
    }
    displayTours(allTours);
  } catch (err) {
    console.error(err);
  }
}



function displayTours(tours) {
  cards.innerHTML = "";
  if (tours.length === 0) {
    cards.innerHTML = `<p class="text-center w-100 py-4">No tours match your criteria.</p>`;
    return;
  }
  tours.forEach(tour => {
    cards.innerHTML += `
    <div class="col-12 col-md-6 col-xl-6">
      <div class="card h-100 border border-secondary border-opacity-10 shadow-sm rounded-4 overflow-hidden tour-card-hover bg-white">

        <div class="position-relative">
          <img src="${tour.image}" class="card-img-top" alt="${tour.name}" style="height: 175px; object-fit: cover;">
          <span class="badge bg-white text-dark position-absolute top-0 start-0 m-3 px-2 py-1 fw-bold shadow-sm rounded-pill small d-flex align-items-center gap-1">
            <i class="bi bi-star-fill text-gold"></i> ${tour.rate || '4.8'}
          </span>
        </div>

        <div class="card-body d-flex flex-column p-4">
          <h6 class="card-title fw-bold text-dark mb-2 font-headline fs-6 text-truncate" title="${tour.name}">
            ${tour.name}
          </h6>

          <div class="d-flex align-items-center gap-2 text-muted mb-3 small" style="font-size: 13px;">
            <span><i class="bi bi-geo-alt-fill text-gold me-1"></i>${tour.city}</span>
            <span>•</span>
            <span><i class="bi bi-clock-fill text-gold me-1"></i>${tour.duration}</span>
          </div>

          <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
            <div>
              <span class="d-block text-muted" style="font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase;">From</span>
              <span class="fw-bold text-primary-custom font-headline fs-5">$${tour.price}</span>
            </div>
            
            <a href="Booking.html?tourId=${tour.id}" class="btn btn-luxury-gold btn-sm px-3 py-2 rounded-pill label-md text-uppercase">
              Book Now
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
  });
}

function filterTours() {
  let city = cityFilter.value;
  let maxPrice = Number(priceFilter.value);
  let sortValue = sortFilter.value;

  if (priceVal) {
    priceVal.textContent = `$${maxPrice}`;
  }


  let filtered = allTours.filter((item) => {
    const matchesCity = (city === "" || item.city === city);
    const matchesPrice = (item.price <= maxPrice);
    return matchesCity && matchesPrice;
  });


  if (sortValue === "low-high") {
    filtered = filtered.toSorted((a, b) => a.price - b.price);
  } else if (sortValue === "high-low") {
    filtered = filtered.toSorted((a, b) => b.price - a.price);
  }


  displayTours(filtered);
}
cityFilter.addEventListener("change", filterTours);
priceFilter.addEventListener("input", filterTours);
sortFilter.addEventListener("change", filterTours);
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", function () {

  cityFilter.value = "";
  priceFilter.value = 300;


  if (priceVal) {
    priceVal.textContent = "$300";
  }

  window.history.pushState({}, document.title, window.location.pathname);
  displayTours(allTours);
});

FetchTours();
