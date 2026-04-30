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
const loginContainer = document.querySelector(".login-container");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  if (homeSection) {
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
  } else if (loginContainer) {
    const loginRect = loginContainer.getBoundingClientRect();
    const isTouching = loginRect.top <= header.offsetHeight;

    header.classList.toggle("header-light", isTouching);
    header.classList.toggle("header-active", !isTouching && scrollY > 5);
  } else {
    header.classList.toggle("header-active", scrollY > 5);
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

// Navigation function
function navigateToPage(pageId) {
  // Prevent default link behavior
  if (event) {
    event.preventDefault();
  }
  
  const header = document.querySelector('.header');
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(pageId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update header styling based on active page
  if (pageId === 'login') {
    header.classList.add('header-login');
  } else {
    header.classList.remove('header-login');
  }
  
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active-navlink');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active-navlink');
    }
  });
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Setup navigation links
function setupNavigation() {
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      navigateToPage(pageId);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  initRecipeCards();

  // Remove active from all first
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Set ONLY home active
  document.getElementById('home').classList.add('active');
});



// Loginform
    document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("show-register").onclick = (e) => {
    e.preventDefault();
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
};

document.getElementById("show-login").onclick = (e) => {
    e.preventDefault();
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
};

    document.getElementById("registerBtn").onclick = () => {
        const username = document.getElementById("reg-username").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        if (!username || !email || !password) {
            document.getElementById("regErrorMsg").innerText = "Fill all fields!";
            return;
        }

        const user = { username, email, password };
        localStorage.setItem("user", JSON.stringify(user));

        alert("Registered successfully!");
    };

    document.getElementById("loginBtn").onclick = () => {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("errorMsg");

    // clear old message
    errorBox.innerText = "";

    if (!email || !password) {
        errorBox.innerText = "Please fill all fields!";
        return;
    }

    fetch("login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            window.location.href = "index.php";
        } else if (data.status === "wrong") {
            errorBox.innerText = "Wrong password";
        } else if (data.status === "not_found") {
            errorBox.innerText = "User not found";
        } else {
            errorBox.innerText = "Something went wrong";
        }
    })
    .catch(() => {
        errorBox.innerText = "Server error";
    });
};
});
