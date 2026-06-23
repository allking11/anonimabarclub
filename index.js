/**
 * Anónima Cocina & Bar - Interactive Logic (Vanilla JS)
 * This script manages the scrolling header, mobile menu, gastronomy tabs, 
 * menu lightbox view, and the multi-step reservation modal with dynamic 7-day calendar.
 */

(function () {
  'use strict';

  // Constants & Configuration
  const WHATSAPP_NUMBER = '573115476363'; // Colombia WhatsApp booking number
  const DAYS_SHORT = ['DOM', 'LUN', 'MΛR', 'MIE', 'JUE', 'VIE', 'SΛB'];
  const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const MONTHS_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Time slots per day of the week
  // Martes (2), Miércoles (3), Jueves (4): 6:00 PM - 12:00 AM (18:00 to 23:30 slots)
  const TIME_SLOTS_WEEKDAY = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
  // Viernes (5), Sábado (6): 6:00 PM - 3:00 AM (18:00 to 02:30 slots)
  const TIME_SLOTS_WEEKEND = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30'
  ];

  // Application State
  const state = {
    currentWizardStep: 1,
    selectedDate: '',
    selectedTime: '',
    selectedGuestsCount: 0,
    selectedDayOfWeek: -1 // 0-6 index
  };

  // ==========================================
  // Header Navigation & Mobile Menu
  // ==========================================

  // Glassmorphism scroll effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('bg-black/90', 'shadow-lg', 'border-b', 'border-gold/20');
      header.classList.remove('bg-black/40', 'border-white/5');
    } else {
      header.classList.add('bg-black/40', 'border-white/5');
      header.classList.remove('bg-black/90', 'shadow-lg', 'border-gold/20');
    }
  });

  // Toggle mobile menu drawer
  function toggleMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav || !mobileMenuBtn) return;

    const isOpen = !mobileNav.classList.contains('hidden');
    if (isOpen) {
      mobileNav.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileNav.classList.remove('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  // ==========================================
  // Gastronomy Section Tabs
  // ==========================================

  function switchMenuTab(tab) {
    const platesBtn = document.getElementById('tab-plates-btn');
    const drinksBtn = document.getElementById('tab-drinks-btn');
    const platesDesc = document.getElementById('menu-description-plates');
    const drinksDesc = document.getElementById('menu-description-drinks');
    const platesImg = document.getElementById('menu-image-plates');
    const drinksImg = document.getElementById('menu-image-drinks');

    if (!platesBtn || !drinksBtn || !platesDesc || !drinksDesc || !platesImg || !drinksImg) return;

    if (tab === 'plates') {
      platesBtn.classList.add('text-gold', 'border-gold');
      platesBtn.classList.remove('text-gray-400', 'border-transparent');
      platesBtn.setAttribute('aria-selected', 'true');

      drinksBtn.classList.remove('text-gold', 'border-gold');
      drinksBtn.classList.add('text-gray-400', 'border-transparent');
      drinksBtn.setAttribute('aria-selected', 'false');

      platesDesc.classList.remove('hidden');
      drinksDesc.classList.add('hidden');

      platesImg.classList.remove('hidden');
      drinksImg.classList.add('hidden');
    } else {
      drinksBtn.classList.add('text-gold', 'border-gold');
      drinksBtn.classList.remove('text-gray-400', 'border-transparent');
      drinksBtn.setAttribute('aria-selected', 'true');

      platesBtn.classList.remove('text-gold', 'border-gold');
      platesBtn.classList.add('text-gray-400', 'border-transparent');
      platesBtn.setAttribute('aria-selected', 'false');

      drinksDesc.classList.remove('hidden');
      platesDesc.classList.add('hidden');

      drinksImg.classList.remove('hidden');
      platesImg.classList.add('hidden');
    }
  }

  // Lightbox functions removed

  // ==========================================
  // Reservation Modal & Wizard Navigation
  // ==========================================

  function openReservationModal() {
    const modal = document.getElementById('reservation-modal');
    if (!modal) return;

    state.currentWizardStep = 1;
    
    // Clear selections
    state.selectedDate = '';
    state.selectedTime = '';
    state.selectedGuestsCount = 0;
    state.selectedDayOfWeek = -1;
    
    document.getElementById('res-date-hidden').value = '';
    document.getElementById('res-time-hidden').value = '';
    document.getElementById('res-guests-hidden').value = '';

    // Clear dynamic grids
    const slotsContainer = document.getElementById('time-slots-container');
    if (slotsContainer) slotsContainer.innerHTML = '';

    // Reset button selectors highlights
    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('border-gold', 'text-gold', 'bg-gold/5'));
    document.querySelectorAll('.guests-card').forEach(c => c.classList.remove('border-gold', 'text-gold', 'bg-gold/5'));

    // Disable navigation buttons initially
    document.getElementById('btn-next-to-step-2').setAttribute('disabled', 'true');
    document.getElementById('btn-next-to-step-2').className = 'px-6 py-3.5 bg-white/10 hover:bg-gold hover:text-black text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';
    
    document.getElementById('btn-next-to-step-3').setAttribute('disabled', 'true');
    document.getElementById('btn-next-to-step-3').className = 'px-6 py-3.5 bg-white/10 hover:bg-gold hover:text-black text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';
    
    document.getElementById('btn-next-to-step-4').setAttribute('disabled', 'true');
    document.getElementById('btn-next-to-step-4').className = 'px-6 py-3.5 bg-white/10 hover:bg-gold hover:text-black text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';

    clearErrors();
    showWizardStep(1);

    modal.showModal();
    document.body.classList.add('overflow-hidden');
  }

  function closeReservationModal() {
    const modal = document.getElementById('reservation-modal');
    if (!modal) return;
    modal.close();
    document.body.classList.remove('overflow-hidden');
  }

  function showWizardStep(step) {
    state.currentWizardStep = step;
    
    for (let i = 1; i <= 4; i++) {
      const stepDiv = document.getElementById(`res-step-${i}`);
      const indicator = document.getElementById(`step-indicator-${i}`);
      
      if (stepDiv) {
        if (i === step) {
          stepDiv.classList.remove('hidden');
        } else {
          stepDiv.classList.add('hidden');
        }
      }

      if (indicator) {
        if (i === step) {
          indicator.className = 'text-gold font-bold transition-all duration-200';
        } else if (i < step) {
          indicator.className = 'text-white transition-all duration-200';
        } else {
          indicator.className = 'text-gray-500 transition-all duration-200';
        }
      }
    }
  }

  function nextStep(step) {
    if (step === 2 && !state.selectedDate) return;
    if (step === 3 && !state.selectedTime) return;
    if (step === 4 && !state.selectedGuestsCount) return;
    
    showWizardStep(step);
  }

  function prevStep(step) {
    showWizardStep(step);
  }

  // ==========================================
  // Calendar, Time, Guest Selectors
  // ==========================================

  // Generate date options for the next 7 days, locking closed days (Sunday/Monday)
  function initDynamicDates() {
    const container = document.getElementById('date-cards-container');
    if (!container) return;

    container.innerHTML = '';
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dayVal = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayVal}`;

      const dayOfWeekIndex = currentDate.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
      const dayOfWeekShort = DAYS_SHORT[dayOfWeekIndex];
      const dayOfMonth = currentDate.getDate();

      const isClosed = (dayOfWeekIndex === 0 || dayOfWeekIndex === 1); // Sun / Mon closed

      let labelText = 'JUN'; // Default Month label
      const shortMonth = currentDate.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
      labelText = shortMonth.substring(0, 3);
      if (labelText === 'AGO') labelText = 'ΛGO';
      if (labelText === 'ABR') labelText = 'ΛBR';

      if (isClosed) labelText = 'CERR';
      else if (i === 0) labelText = 'HOY';
      else if (i === 6) labelText = 'ÚLT';

      const btn = document.createElement('button');
      btn.type = 'button';
      
      if (isClosed) {
        btn.className = 'date-card py-3.5 px-2.5 sm:py-4 border border-dark-border bg-dark-pure/30 opacity-30 cursor-not-allowed text-center flex flex-col items-center justify-center';
        btn.setAttribute('title', 'Establecimiento cerrado los Domingos y Lunes');
      } else {
        btn.className = 'date-card py-3.5 px-2.5 sm:py-4 border border-dark-border bg-dark-pure hover:border-gold hover:text-gold transition-all duration-300 text-center flex flex-col items-center justify-center';
        btn.addEventListener('click', function () {
          selectDateCard(dateStr, btn, dayOfWeekIndex);
        });
      }
      
      btn.innerHTML = `
        <span class="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">${dayOfWeekShort}</span>
        <span class="text-lg sm:text-xl font-bold font-serif text-white mt-1">${dayOfMonth}</span>
        <span class="text-[9px] sm:text-[10px] ${isClosed ? 'text-red-400' : 'text-gold'} mt-1 uppercase tracking-widest font-semibold">${labelText}</span>
      `;

      container.appendChild(btn);
    }
  }

  function selectDateCard(dateStr, element, dayOfWeekIndex) {
    state.selectedDate = dateStr;
    state.selectedDayOfWeek = dayOfWeekIndex;
    document.getElementById('res-date-hidden').value = dateStr;

    // Toggle border highlights
    document.querySelectorAll('.date-card').forEach(card => {
      if (!card.classList.contains('cursor-not-allowed')) {
        card.classList.remove('border-gold', 'text-gold', 'bg-gold/5');
        card.classList.add('border-dark-border', 'bg-dark-pure');
      }
    });

    element.classList.remove('border-dark-border', 'bg-dark-pure');
    element.classList.add('border-gold', 'text-gold', 'bg-gold/5');

    // Dynamically rebuild the time slots depending on the day of the week
    rebuildTimeSlots(dayOfWeekIndex);

    // Reset selected time state since date changed
    state.selectedTime = '';
    document.getElementById('res-time-hidden').value = '';
    
    // Disable next button for step 2 since time selection is reset
    document.getElementById('btn-next-to-step-3').setAttribute('disabled', 'true');
    document.getElementById('btn-next-to-step-3').className = 'px-6 py-3.5 bg-white/10 hover:bg-gold hover:text-black text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';

    // Enable next button for step 1
    const nextBtn = document.getElementById('btn-next-to-step-2');
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.className = 'px-6 py-3.5 bg-gold text-black text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300';
    }
  }

  // Populates Step 2 time chips based on selected day hours
  function rebuildTimeSlots(dayOfWeekIndex) {
    const container = document.getElementById('time-slots-container');
    if (!container) return;

    container.innerHTML = '';
    
    // Select correct schedule list
    let availableSlots = [];
    if (dayOfWeekIndex === 5 || dayOfWeekIndex === 6) {
      // Friday or Saturday (6:00 PM - 3:00 AM)
      availableSlots = TIME_SLOTS_WEEKEND;
    } else {
      // Tuesday, Wednesday, Thursday (6:00 PM - 12:00 AM)
      availableSlots = TIME_SLOTS_WEEKDAY;
    }

    availableSlots.forEach(slot => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-card py-3.5 px-2 border border-dark-border bg-dark-pure hover:border-gold hover:text-gold transition-all duration-300 text-center font-serif text-sm sm:text-base';
      btn.textContent = slot;

      btn.addEventListener('click', function () {
        selectTimeSlot(slot, btn);
      });

      container.appendChild(btn);
    });
  }

  function selectTimeSlot(timeStr, element) {
    state.selectedTime = timeStr;
    document.getElementById('res-time-hidden').value = timeStr;

    // Toggle styles
    document.querySelectorAll('.time-card').forEach(card => {
      card.classList.remove('border-gold', 'text-gold', 'bg-gold/5');
      card.classList.add('border-dark-border', 'bg-dark-pure');
    });

    element.classList.remove('border-dark-border', 'bg-dark-pure');
    element.classList.add('border-gold', 'text-gold', 'bg-gold/5');

    // Enable next button for step 2
    const nextBtn = document.getElementById('btn-next-to-step-3');
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.className = 'px-6 py-3.5 bg-gold text-black text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300';
    }
  }

  function selectGuests(count, element) {
    state.selectedGuestsCount = count;
    document.getElementById('res-guests-hidden').value = count;

    // Toggle styles
    document.querySelectorAll('.guests-card').forEach(card => {
      card.classList.remove('border-gold', 'text-gold', 'bg-gold/5');
      card.classList.add('border-dark-border', 'bg-dark-pure');
    });

    element.classList.remove('border-dark-border', 'bg-dark-pure');
    element.classList.add('border-gold', 'text-gold', 'bg-gold/5');

    // Enable next button for step 3
    const nextBtn = document.getElementById('btn-next-to-step-4');
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.className = 'px-6 py-3.5 bg-gold text-black text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300';
    }
  }

  // ==========================================
  // Form Validation & Submission
  // ==========================================

  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const parentGroup = element.closest('.form-group') || element.parentElement;
    parentGroup.classList.add('has-error');

    let errorDiv = parentGroup.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message text-xs text-red-500 mt-1';
      parentGroup.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    element.classList.add('border-red-500');
    element.classList.remove('focus:border-gold');
  }

  function clearError(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const parentGroup = element.closest('.form-group') || element.parentElement;
    parentGroup.classList.remove('has-error');

    const errorDiv = parentGroup.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }

    element.classList.remove('border-red-500');
    element.classList.add('focus:border-gold');
  }

  function clearErrors() {
    document.querySelectorAll('.form-group, .wizard-step > div').forEach(group => {
      group.classList.remove('has-error');
      const errorDiv = group.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
    });
    document.querySelectorAll('input, textarea').forEach(input => {
      input.classList.remove('border-red-500');
      input.classList.add('focus:border-gold');
    });
  }

  function validateForm() {
    let isValid = true;
    const nameEl = document.getElementById('contact-name');

    if (!nameEl) return false;

    const nameVal = nameEl.value.trim();

    // Name check
    if (!nameVal) {
      showError('contact-name', 'Por favor, ingresa tu nombre completo.');
      isValid = false;
    } else if (nameVal.length < 3) {
      showError('contact-name', 'El nombre debe tener al menos 3 caracteres.');
      isValid = false;
    } else {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!nameRegex.test(nameVal)) {
        showError('contact-name', 'El nombre solo debe contener letras.');
        isValid = false;
      } else {
        clearError('contact-name');
      }
    }

    return isValid;
  }

  // Pre-load typing validation triggers
  function setupInputValidationTriggers() {
    const nameEl = document.getElementById('contact-name');

    if (nameEl) {
      nameEl.addEventListener('blur', () => {
        const val = nameEl.value.trim();
        if (val) {
          if (val.length < 3) showError('contact-name', 'El nombre debe tener al menos 3 caracteres.');
          else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) showError('contact-name', 'El nombre solo debe contener letras.');
          else clearError('contact-name');
        }
      });
      nameEl.addEventListener('focus', () => clearError('contact-name'));
    }
  }

  function handleReservationSubmit(event) {
    if (event) event.preventDefault();

    if (!validateForm()) return;

    const name = document.getElementById('contact-name').value.trim();
    const requests = document.getElementById('contact-requests').value.trim() || 'Ninguno';

    // Parse Selected Date details for highly readable text
    const dateParts = state.selectedDate.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const d = new Date(year, month, day);

    const formattedSpanishDate = `${DAYS_FULL[d.getDay()]} ${day} de ${MONTHS_FULL[month]} de ${year}`;
    const guestGrammar = state.selectedGuestsCount === 1 ? 'persona' : 'personas';

    const msg = `¡Hola Anónima Cocina & Bar! 🥂\n\n` +
      `Me gustaría realizar una reserva con los siguientes detalles:\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `📅 *Fecha:* ${formattedSpanishDate}\n` +
      `⏰ *Hora:* ${state.selectedTime} hs\n` +
      `👥 *Mesa para:* ${state.selectedGuestsCount} ${guestGrammar}\n` +
      `💬 *Notas/Pedidos:* ${requests}\n\n` +
      `Quedo a la espera de su confirmación y de las indicaciones de acceso en Barranquilla. ¡Muchas gracias!`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    // Open link safely in a new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Close and reset reservation dialog
    closeReservationModal();
  }

  // ==========================================
  // Experience Slider Logic
  // ==========================================
  let experienceIndex = 0;
  let experienceAutoplayTimer = null;

  function initExperienceSlider() {
    const container = document.getElementById('exp-slides-container');
    const prevBtn = document.getElementById('exp-prev-btn');
    const nextBtn = document.getElementById('exp-next-btn');
    const dots = document.querySelectorAll('.exp-dot');
    if (!container || dots.length === 0) return;

    const totalSlides = dots.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      experienceIndex = index;

      // Move container
      container.style.transform = `translateX(-${experienceIndex * 100}%)`;

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === experienceIndex) {
          dot.classList.remove('bg-white/30');
          dot.classList.add('bg-gold');
        } else {
          dot.classList.remove('bg-gold');
          dot.classList.add('bg-white/30');
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(experienceIndex - 1);
        resetExperienceAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(experienceIndex + 1);
        resetExperienceAutoplay();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(index);
        resetExperienceAutoplay();
      });
    });

    function resetExperienceAutoplay() {
      if (experienceAutoplayTimer) clearInterval(experienceAutoplayTimer);
      experienceAutoplayTimer = setInterval(() => {
        goToSlide(experienceIndex + 1);
      }, 5000);
    }

    resetExperienceAutoplay();
  }

  // ==========================================
  // Scroll Reveal Observer
  // ==========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ==========================================
  // Security & Anti-Copy Protection
  // ==========================================
  function initSecurityHooks() {
    // Disable right click context menu (except on input/textarea fields)
    window.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
    });

    // Disable dragging of images (to prevent download dragging)
    window.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    });
  }

  // ==========================================
  // Menu Category Images Slideshow (Autoplay & Cross-fade)
  // ==========================================
  function initMenuSliders() {
    let platesIndex = 0;
    const platesSlides = document.querySelectorAll('.menu-slide-plate');
    
    let drinksIndex = 0;
    const drinksSlides = document.querySelectorAll('.menu-slide-drink');

    if (platesSlides.length > 0) {
      setInterval(() => {
        platesSlides[platesIndex].classList.remove('opacity-100');
        platesSlides[platesIndex].classList.add('opacity-0');
        
        platesIndex = (platesIndex + 1) % platesSlides.length;
        
        platesSlides[platesIndex].classList.remove('opacity-0');
        platesSlides[platesIndex].classList.add('opacity-100');
      }, 2100);
    }

    if (drinksSlides.length > 0) {
      setInterval(() => {
        drinksSlides[drinksIndex].classList.remove('opacity-100');
        drinksSlides[drinksIndex].classList.add('opacity-0');
        
        drinksIndex = (drinksIndex + 1) % drinksSlides.length;
        
        drinksSlides[drinksIndex].classList.remove('opacity-0');
        drinksSlides[drinksIndex].classList.add('opacity-100');
      }, 2100);
    }
  }

  // ==========================================
  // Initialization & Event Binding
  // ==========================================

  function init() {
    initDynamicDates();
    initExperienceSlider();
    initScrollReveal();
    initSecurityHooks();
    initMenuSliders();
    setupInputValidationTriggers();

    // Dialog backdrop click closing triggers
    const resModal = document.getElementById('reservation-modal');
    if (resModal) {
      resModal.addEventListener('click', (e) => {
        const dialogDimensions = resModal.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          closeReservationModal();
        }
      });
    }
  }

  // Execute initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==============================
  // TESTIMONIALS CAROUSEL
  // ==============================
  let testimonialIndex = 0;
  const testimonialCount = 3;
  let testimonialAutoplayTimer = null;

  function updateTestimonialCarousel() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;
    track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
      if (i === testimonialIndex) {
        dot.classList.remove('bg-gray-600');
        dot.classList.add('bg-gold');
      } else {
        dot.classList.remove('bg-gold');
        dot.classList.add('bg-gray-600');
      }
    });
  }

  function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonialCount;
    updateTestimonialCarousel();
    resetTestimonialAutoplay();
  }

  function prevTestimonial() {
    testimonialIndex = (testimonialIndex - 1 + testimonialCount) % testimonialCount;
    updateTestimonialCarousel();
    resetTestimonialAutoplay();
  }

  function goToTestimonial(index) {
    testimonialIndex = index;
    updateTestimonialCarousel();
    resetTestimonialAutoplay();
  }

  function resetTestimonialAutoplay() {
    if (testimonialAutoplayTimer) clearInterval(testimonialAutoplayTimer);
    testimonialAutoplayTimer = setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonialCount;
      updateTestimonialCarousel();
    }, 6000);
  }

  // ==========================================
  // CHATBOT INTERACTIVE DEMO (MÍSTICΛ)
  // ==========================================
  const CHATBOT_FAQS = [
    {
      id: 'ubicacion',
      label: '📍 ¿Dónde están ubicados?',
      question: '¿Dónde están ubicados?',
      answer: 'Anónima es un speakeasy exclusivo en Barranquilla, Colombia. Nuestra ubicación exacta es **Calle 93 #43-41, Barrio Norte Centro Histórico**. Sin embargo, las indicaciones de acceso secretas te serán provistas una vez confirmes tu reserva para mantener la atmósfera selecta y misteriosa del lugar. 🤫🚪'
    },
    {
      id: 'horarios',
      label: '⏰ ¿Cuáles son los horarios?',
      question: '¿Cuáles son los horarios de atención?',
      answer: 'Nuestros horarios de atención son:\n• **Martes a Jueves:** 6:00 PM a 12:00 AM\n• **Viernes y Sábados:** 6:00 PM a 3:00 AM\n• **Domingos y Lunes:** Cerrados por descanso de nuestro equipo. ¡Te esperamos para planear tu noche! 🍸✨'
    },
    {
      id: 'reserva',
      label: '📅 ¿Cómo hago una reserva?',
      question: '¿Cómo realizo una reserva?',
      answer: 'Puedes reservar de manera directa y rápida haciendo clic en el botón **"PLΛNEΛR TU NOCHE"** en la pantalla principal. Nuestro sistema interactivo te guiará para elegir fecha, hora y cantidad de comensales, y generará tu ticket directo a WhatsApp para la confirmación. 🎟️'
    },
    {
      id: 'vestimenta',
      label: '👗 ¿Tienen código de vestimenta?',
      question: '¿Tienen código de vestimenta?',
      answer: 'Mantenemos un código de vestimenta **Smart Casual / Elegante**. Agradecemos evitar el ingreso con ropa deportiva, sandalias playeras, gorras o bermudas de baño para mantener la atmósfera selecta del speakeasy. ¡Vístete para una noche especial! 👔✨'
    },
    {
      id: 'menu',
      label: '🍸 ¿Qué tipo de carta ofrecen?',
      question: '¿Qué tipo de gastronomía y coctelería ofrecen?',
      answer: 'Ofrecemos alta gastronomía fusión de autor diseñada para acompañar la noche y coctelería conceptual experimental de primer nivel elaborada por mixólogos profesionales. Puedes ver fotos de algunos de nuestros platos y tragos estrella en la sección **"NUESTRΛ CΛRTΛ"** de esta página. 🍽️🍹'
    }
  ];

  let isChatbotFirstOpen = true;

  function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');

    if (!chatbotToggle || !chatbotWindow || !chatbotClose || !chatbotMessages || !chatbotForm || !chatbotInput) return;

    // Set to keep track of already answered FAQs
    const answeredFaqIds = new Set();

    // Toggle Chatbot Window
    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('chatbot-open');
      
      // Hide Notification Dot
      const pulseDot = chatbotToggle.querySelector('.animate-pulse');
      if (pulseDot) pulseDot.remove();

      if (chatbotWindow.classList.contains('chatbot-open')) {
        chatbotInput.focus();
        
        if (isChatbotFirstOpen) {
          isChatbotFirstOpen = false;
          showTypingIndicator();
          
          setTimeout(() => {
            hideTypingIndicator();
            addChatMessage('¡Hola! Bienvenido a **Anónima Cocina & Bar**. Soy Mística, tu guía virtual. ¿En qué te puedo ayudar hoy? 🥂');
            renderFAQs();
          }, 1000);
        }
      }
    });

    // Close Chatbot Window
    chatbotClose.addEventListener('click', (e) => {
      e.stopPropagation();
      chatbotWindow.classList.remove('chatbot-open');
    });

    // Form Submit
    chatbotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatbotInput.value.trim();
      if (!text) return;

      // Add user message
      addChatMessage(text, true);
      chatbotInput.value = '';

      // Match custom keywords
      const cleanedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip accents
      let matchedFaq = null;

      if (cleanedText.includes('reserva') || cleanedText.includes('reservar') || cleanedText.includes('mesa') || cleanedText.includes('ticket') || cleanedText.includes('book')) {
        matchedFaq = CHATBOT_FAQS.find(f => f.id === 'reserva');
      } else if (cleanedText.includes('ubicacion') || cleanedText.includes('donde') || cleanedText.includes('direccion') || cleanedText.includes('calle') || cleanedText.includes('queda') || cleanedText.includes('barranquilla') || cleanedText.includes('lugar')) {
        matchedFaq = CHATBOT_FAQS.find(f => f.id === 'ubicacion');
      } else if (cleanedText.includes('horario') || cleanedText.includes('hora') || cleanedText.includes('abren') || cleanedText.includes('cierran') || cleanedText.includes('abierto') || cleanedText.includes('cerrado') || cleanedText.includes('atencion')) {
        matchedFaq = CHATBOT_FAQS.find(f => f.id === 'horarios');
      } else if (cleanedText.includes('vestimenta') || cleanedText.includes('ropa') || cleanedText.includes('vestir') || cleanedText.includes('codigo') || cleanedText.includes('elegante') || cleanedText.includes('casual') || cleanedText.includes('entrar')) {
        matchedFaq = CHATBOT_FAQS.find(f => f.id === 'vestimenta');
      } else if (cleanedText.includes('menu') || cleanedText.includes('carta') || cleanedText.includes('trago') || cleanedText.includes('coctel') || cleanedText.includes('comida') || cleanedText.includes('plato') || cleanedText.includes('precio') || cleanedText.includes('beber') || cleanedText.includes('comer')) {
        matchedFaq = CHATBOT_FAQS.find(f => f.id === 'menu');
      }

      // Mark matched FAQ as answered
      if (matchedFaq) {
        answeredFaqIds.add(matchedFaq.id);
      }

      // Remove any existing FAQ choice buttons to keep conversation flow clean
      const oldFaqWrappers = chatbotMessages.querySelectorAll('.pl-10.5');
      oldFaqWrappers.forEach(w => w.remove());

      showTypingIndicator();

      setTimeout(() => {
        hideTypingIndicator();
        if (matchedFaq) {
          addChatMessage(matchedFaq.answer);
        } else {
          addChatMessage('Gracias por escribirme. Actualmente estoy en **modo demostración** 🍸.\n\nPuedes hacerme preguntas directas sobre nuestro *horario, ubicación, código de vestimenta, carta o cómo reservar*, o bien seleccionar cualquiera de las siguientes preguntas frecuentes:');
        }
        renderFAQs();
      }, 1200);
    });

    // Helper functions
    function addChatMessage(text, isUser = false) {
      const bubbleContainer = document.createElement('div');
      bubbleContainer.className = isUser ? 'flex justify-end chat-message-bubble' : 'flex items-start gap-2.5 chat-message-bubble';

      const formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (isUser) {
        bubbleContainer.innerHTML = `
          <div class="bg-gold/15 border border-gold/30 text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%] text-xs leading-relaxed font-sans shadow-md">
            ${formattedText}
          </div>
        `;
      } else {
        bubbleContainer.innerHTML = `
          <div class="w-8 h-8 rounded-full border border-gold/30 overflow-hidden flex-shrink-0">
            <img src="./logo.webp" alt="Mística" class="w-full h-full object-cover">
          </div>
          <div class="bg-dark-pure border border-dark-border text-gray-200 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[75%] text-xs leading-relaxed font-sans shadow-sm">
            ${formattedText}
          </div>
        `;
      }

      chatbotMessages.appendChild(bubbleContainer);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
      const typingContainer = document.createElement('div');
      typingContainer.id = 'chatbot-typing';
      typingContainer.className = 'flex items-start gap-2.5 chat-message-bubble';
      typingContainer.innerHTML = `
        <div class="w-8 h-8 rounded-full border border-gold/30 overflow-hidden flex-shrink-0">
          <img src="./logo.webp" alt="Mística" class="w-full h-full object-cover">
        </div>
        <div class="bg-dark-pure border border-dark-border rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center shadow-sm">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
      chatbotMessages.appendChild(typingContainer);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
      const typing = document.getElementById('chatbot-typing');
      if (typing) typing.remove();
    }

    // Renders custom styled clickable option buttons (excluding already answered ones)
    function renderFAQs() {
      // If all questions have been answered, reset the set so they can be explored again
      if (answeredFaqIds.size === CHATBOT_FAQS.length) {
        answeredFaqIds.clear();
      }

      // Remove any existing FAQ wrappers first to avoid duplicate options
      const oldFaqWrappers = chatbotMessages.querySelectorAll('.pl-10.5');
      oldFaqWrappers.forEach(w => w.remove());

      const remainingFaqs = CHATBOT_FAQS.filter(faq => !answeredFaqIds.has(faq.id));
      if (remainingFaqs.length === 0) return;

      const faqWrapper = document.createElement('div');
      faqWrapper.className = 'chat-message-bubble pl-10.5 flex flex-col gap-2 pt-1.5';
      
      remainingFaqs.forEach(faq => {
        const btn = document.createElement('button');
        btn.className = 'chatbot-faq-btn';
        btn.innerHTML = faq.label;
        btn.addEventListener('click', () => {
          // Remove options from view so they aren't clicked multiple times
          faqWrapper.remove();
          
          // Mark as answered
          answeredFaqIds.add(faq.id);
          
          // Add user's question
          addChatMessage(faq.question, true);
          
          // Trigger response
          showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator();
            addChatMessage(faq.answer);
            renderFAQs();
          }, 1000);
        });
        faqWrapper.appendChild(btn);
      });

      chatbotMessages.appendChild(faqWrapper);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
  }

  // Initialize Chatbot logic
  initChatbot();

  // Start autoplay on load
  resetTestimonialAutoplay();

  // Export functions to global window object so that inline HTML onclick event handlers trigger correctly
  window.openReservationModal = openReservationModal;
  window.closeReservationModal = closeReservationModal;
  
  window.selectDateCard = selectDateCard;
  window.selectTimeSlot = selectTimeSlot;
  window.selectGuests = selectGuests;
  
  window.nextStep = nextStep;
  window.prevStep = prevStep;
  window.handleReservationSubmit = handleReservationSubmit;

  window.toggleMobileMenu = toggleMobileMenu;
  window.switchMenuTab = switchMenuTab;

  window.nextTestimonial = nextTestimonial;
  window.prevTestimonial = prevTestimonial;
  window.goToTestimonial = goToTestimonial;

})();
