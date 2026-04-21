// Swiper js
var swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      // grabCursor: true}
      loop: true,
      speed: 1000,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

// Nav open close


// Change header bg color
const header = document.querySelector(".header");
const homeSection = document.querySelector(".home");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;
  const triggerPoint = homeSection.offsetHeight - 25;

  if (scrollY > 5) {
    header.classList.add("header-active");
  } else {
    header.classList.remove("header-active");
  }

  if (scrollY > triggerPoint) {
    header.classList.add("header-dark");
  } else {
    header.classList.remove("header-dark");
  }

  if (scrollY > triggerPoint) {
    header.classList.remove("header-active");
  } else {
    header.classList.add("header-active");
  }
});
  
// Nav indicator
const menuList = document.querySelector('.menu-list');
const navLinks = document.querySelectorAll('.nav-link');
const navIndicator = document.createElement('div');
navIndicator.classList.add('nav-indicator');
menuList.appendChild(navIndicator);

// Function to update indicator position
function updateIndicator(activeLink) {
  const linkRect = activeLink.getBoundingClientRect();
  const menuRect = menuList.getBoundingClientRect();
  const left = linkRect.left - menuRect.left + linkRect.width / 2 - 3; // 3 is half width of indicator
  navIndicator.style.left = `${left}px`;
}

// Initial position
const initialActive = document.querySelector('.active-navlink');
if (initialActive) {
  updateIndicator(initialActive);
}

// Click handlers
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Remove active from all
    navLinks.forEach(l => l.classList.remove('active-navlink'));
    // Add to clicked
    link.classList.add('active-navlink');
    // Update indicator
    updateIndicator(link);
  });
});

// Update active on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  const bottomThreshold = 5;
  if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - bottomThreshold) {
    const lastSection = sections[sections.length - 1];
    if (lastSection) {
      current = lastSection.getAttribute('id');
    }
  }

  navLinks.forEach(link => {
    link.classList.remove('active-navlink');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-navlink');
      updateIndicator(link);
    }
  });
});

// Update indicator on resize
window.addEventListener('resize', () => {
  const activeLink = document.querySelector('.active-navlink');
  if (activeLink) {
    updateIndicator(activeLink);
  }
});

// Load recipes section from external component
function loadRecipesComponent() {
  const recipesSection = document.querySelector('#recipes');
  if (!recipesSection) return;

  fetch('components/recipes.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not load recipes component');
      }
      return response.text();
    })
    .then(html => {
      recipesSection.innerHTML = html;
      initRecipeCards();
    })
    .catch(error => {
      console.error(error);
    });
}

function loadFavoritesComponent() {
  const favoritesSection = document.querySelector('#favorites');
  if (!favoritesSection) return;

  fetch('components/favorites.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not load favorites component');
      }
      return response.text();
    })
    .then(html => {
      favoritesSection.innerHTML = html;
    })
    .catch(error => {
      console.error(error);
    });
}

function initRecipeCards() {
  const recipeCards = document.querySelectorAll('.recipe-card:not(.favorite-card)');
  recipeCards.forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.favorite-btn')) return;
      card.classList.toggle('active');
    });

    const favoriteBtn = card.querySelector('.favorite-btn');
    if (favoriteBtn) {
      const recipeName = card.querySelector('h3')?.textContent?.trim();
      const isFavorited = isRecipeFavorited(recipeName);
      if (isFavorited) {
        favoriteBtn.classList.add('active');
      }

      favoriteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (favoriteBtn.classList.contains('active')) {
          removeRecipeFromFavorites(card);
          favoriteBtn.classList.remove('active');
        } else {
          addRecipeToFavorites(card);
          favoriteBtn.classList.add('active');
        }
      });
    }
  });
}

function isRecipeFavorited(recipeName) {
  const favoriteGrid = document.querySelector('.favorite-grid');
  if (!favoriteGrid) return false;
  return Array.from(favoriteGrid.querySelectorAll('.favorite-card')).some(fav => {
    return fav.querySelector('h3')?.textContent?.trim() === recipeName;
  });
}

function addRecipeToFavorites(card) {
  const favoriteGrid = document.querySelector('.favorite-grid');
  const emptyText = document.querySelector('.favorite-empty');
  if (!favoriteGrid) return;

  const title = card.querySelector('h3')?.textContent?.trim();
  if (!title) return;

  const alreadyAdded = Array.from(favoriteGrid.querySelectorAll('.favorite-card')).some(fav => {
    return fav.querySelector('h3')?.textContent?.trim() === title;
  });
  if (alreadyAdded) return;

  const clone = card.cloneNode(true);
  clone.classList.add('favorite-card');
  clone.classList.remove('active', 'recipe-card');

  const heartButton = clone.querySelector('.favorite-btn');
  if (heartButton) {
    heartButton.remove();
  }

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('favorite-card-remove');
  removeBtn.innerHTML = '<i class="bx bx-x"></i>';
  removeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    removeFavCard(clone, title);
  });
  clone.appendChild(removeBtn);

  favoriteGrid.appendChild(clone);

  if (emptyText) {
    emptyText.style.display = 'none';
  }
}

function removeRecipeFromFavorites(card) {
  const favoriteGrid = document.querySelector('.favorite-grid');
  const title = card.querySelector('h3')?.textContent?.trim();
  
  if (!favoriteGrid || !title) return;

  const favCards = Array.from(favoriteGrid.querySelectorAll('.favorite-card'));
  favCards.forEach(favCard => {
    if (favCard.querySelector('h3')?.textContent?.trim() === title) {
      favCard.remove();
    }
  });

  const remainingCards = favoriteGrid.querySelectorAll('.favorite-card');
  if (remainingCards.length === 0) {
    const emptyText = document.querySelector('.favorite-empty');
    if (emptyText) {
      emptyText.style.display = 'block';
    }
  }
}

function removeFavCard(favCard, recipeName) {
  const recipeCard = document.querySelector(`.recipe-card:not(.favorite-card) h3`);
  const recipeCards = document.querySelectorAll('.recipe-card:not(.favorite-card)');
  
  recipeCards.forEach(card => {
    if (card.querySelector('h3')?.textContent?.trim() === recipeName) {
      const favoriteBtn = card.querySelector('.favorite-btn');
      if (favoriteBtn) {
        favoriteBtn.classList.remove('active');
      }
    }
  });

  favCard.remove();

  const favoriteGrid = document.querySelector('.favorite-grid');
  const remainingCards = favoriteGrid?.querySelectorAll('.favorite-card');
  if (remainingCards && remainingCards.length === 0) {
    const emptyText = document.querySelector('.favorite-empty');
    if (emptyText) {
      emptyText.style.display = 'block';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadFavoritesComponent();
  loadRecipesComponent();
});

// Scroll Reveal Animation
