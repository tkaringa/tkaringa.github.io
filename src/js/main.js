document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.cards-carousel');

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.cards-grid');
    const cards = track ? track.querySelectorAll('.project-card') : [];
    const prevBtn = carousel.querySelector('.carousel-btn-left');
    const nextBtn = carousel.querySelector('.carousel-btn-right');

    if (!track || !cards.length || !prevBtn || !nextBtn) {
      return;
    }

    const getStep = () => {
      const firstCard = cards[0];
      const cardRect = firstCard.getBoundingClientRect();
      const styles = window.getComputedStyle(track);
      const gapValue = styles.columnGap || styles.gap || '20';
      const gap = parseFloat(gapValue) || 20;
      return cardRect.width + gap;
    };

    const scrollByAmount = (direction) => {
      const step = getStep();
      track.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByAmount(-1));
    nextBtn.addEventListener('click', () => scrollByAmount(1));
  });
});
