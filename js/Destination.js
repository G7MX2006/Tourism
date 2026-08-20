

document.addEventListener("DOMContentLoaded", () => {
  const userDisplayName = document.getElementById("userDisplayName");
  const authBtn = document.getElementById("authBtn");


  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {

    userDisplayName.textContent = ` ${currentUser.name}`;
    authBtn.textContent = "Log out";
    authBtn.href = "#";


    authBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  } else {

    userDisplayName.textContent = "";
    authBtn.textContent = "Login";
    authBtn.href = "./signin.html";
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  initNewsletterForm();
  const container = document.getElementById('regions-grid');
  try {
    let destinations = await getDestinations();
    if (container) {
      container.innerHTML = destinations.map(des => `
        <div class="col-12 col-md-6">
          <div class="card-bento" style="height: 500px;">
            <img src="${des.image}" alt="${des.name}"/>
            <div class="position-absolute top-0 start-0 w-100 h-100 card-overlay"></div>          
            <div class="position-absolute top-0 end-0 p-3 p-md-4 d-flex align-items-center gap-2">
              <div class="bg-dark bg-opacity-50 backdrop-blur rounded-pill px-3 py-1 text-white small d-flex align-items-center gap-1">
                <span class="material-symbols-outlined text-warning" style="font-size: 16px;">star</span>
                <span class="fw-semibold">${des.rating}</span>
              </div>
            </div>
            <div class="position-absolute bottom-0 start-0 w-100 p-4 p-md-5 d-flex justify-content-between align-items-end">
              <div class="text-start pe-3">
                <span class="label-md text-warning text-uppercase d-block mb-1" style="letter-spacing: 0.2em;">${des.subtitle}</span>
                <h3 class="font-headline headline-md text-white mb-2">${des.name}</h3>
                <p class="text-white-50 mb-0 small" style="font-size: 0.9rem; line-height: 1.4;">${des.description}</p>
              </div>
              <a href="Tours.html?destinationId=${des.id}" class="btn-circle bg-white bg-opacity-25 text-white border border-white border-opacity-25 flex-shrink-0 d-flex align-items-center justify-content-center text-decoration-none">
                <span class="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error(error);
  }
});
async function getDestinations() {
  let response = await fetch('http://localhost:3000/destinations');
  if (!response.ok) {
    throw new Error("No Destination Found");
  }
  let destinations = await response.json();
  return destinations;
}
function initNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-section form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]');

    if (emailInput && emailInput.value.trim()) {
      form.reset();

      const modalElement = document.getElementById('newsletterModal');
      const newsletterModal = new bootstrap.Modal(modalElement);
      newsletterModal.show();

      setTimeout(() => {
        newsletterModal.hide();
      }, 3000);
    }
  });
}
