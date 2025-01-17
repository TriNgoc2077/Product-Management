//link to detail with "tr"
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('[data-href]');
    rows.forEach(row => {
      row.addEventListener('click', function(e) {
        if (!e.target.closest('.not-click')) {
          window.location.href = this.dataset.href;
        }
      });
    });
  });