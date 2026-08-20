
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
    authBtn.href = "./pages/signin.html";
  }
});




document.addEventListener('DOMContentLoaded', async () => {
  initNewsletterForm();
  try {
    const destinations = await getDestinations();
    renderFeaturedDestinations(destinations.slice(0, 2));
  } catch (error) {
    console.error('Error loading destinations:', error);
  }
});
async function getDestinations() {
  const response = await fetch('http://localhost:3000/destinations');
  if (!response.ok) throw new Error('No Destination Found');
  return response.json();
}
function renderFeaturedDestinations(destinations) {
  const container = document.getElementById('featured-grid');
  if (!container) return;
  container.innerHTML = destinations.map(des => `
    <div class="col-12 col-md-6">
      <div class="card-bento-sm">
        <img src="${des.image}" alt="${des.name}"/>
        <div class="position-absolute top-0 start-0 w-100 h-100 card-overlay"></div>
        <div class="position-absolute top-0 end-0 p-3 d-flex align-items-center gap-2">
          <div class="bg-dark bg-opacity-50 backdrop-blur rounded-pill px-3 py-1 text-white small d-flex align-items-center gap-1">
            <span class="material-symbols-outlined text-warning" style="font-size: 14px;">star</span>
            <span class="fw-semibold">${des.rating}</span>
          </div>
        </div>
        <div class="position-absolute bottom-0 start-0 w-100 p-3 p-md-4 d-flex justify-content-between align-items-end">
          <div class="text-start pe-2">
            <span class="label-md text-warning text-uppercase d-block mb-1" style="letter-spacing: 0.15em; font-size: 11px;">${des.subtitle}</span>
            <h4 class="font-headline text-white mb-0" style="font-size: 24px;">${des.name}</h4>
          </div>
          <a href="pages/Tours.html?destinationId=${des.id}" class="btn-circle bg-white bg-opacity-25 text-white border border-white border-opacity-25 flex-shrink-0 d-flex align-items-center justify-content-center text-decoration-none">
            <span class="material-symbols-outlined" style="font-size: 20px;">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterForm.reset();
    showSuccessModal("Thank You!", "You have successfully subscribed to our Newsletter");
  });
}
function showSuccessModal(title, body) {
  const modalElement = document.getElementById('successModal');
  if (!modalElement) return;

  document.getElementById('successModalTitle').textContent = title;
  document.getElementById('successModalBody').textContent = body;

  const successModal = new bootstrap.Modal(modalElement);
  successModal.show();

  setTimeout(() => successModal.hide(), 3000);
}
