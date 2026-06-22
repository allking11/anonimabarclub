/**
 * Anónimo Cocina & Bar - Interactive Logic (Vanilla JS)
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
    selectedDayOfWeek: -1, // 0-6 index
    menuUrls: ['./carta1 (1).png', './carta1 (2).png'],
    currentMenuIndex: 0,
    isMenuZoomed: false
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

  // ==========================================
  // Menu Lightbox Dialog
  // ==========================================

  function openMenuLightbox(index) {
    const lightbox = document.getElementById('menu-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');

    if (!lightbox || !lightboxImg) return;

    state.currentMenuIndex = index === 1 ? 0 : 1;
    state.isMenuZoomed = false;

    // Reset zoom classes
    lightboxImg.classList.remove('scale-[1.8]', 'cursor-zoom-out');
    lightboxImg.classList.add('cursor-zoom-in');

    updateLightboxContent();

    lightbox.showModal();
    document.body.classList.add('overflow-hidden');
  }

  function updateLightboxContent() {
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDownload = document.getElementById('lightbox-download');

    if (!lightboxImg) return;

    lightboxImg.src = state.menuUrls[state.currentMenuIndex];
    if (state.currentMenuIndex === 0) {
      if (lightboxTitle) lightboxTitle.textContent = 'CΛRTΛ DE PLΛTOS';
      if (lightboxDownload) lightboxDownload.href = state.menuUrls[0];
    } else {
      if (lightboxTitle) lightboxTitle.textContent = 'CΛRTΛ DE COCTELERÍΛ';
      if (lightboxDownload) lightboxDownload.href = state.menuUrls[1];
    }
  }

  // Closes the menu lightbox and releases scroll lock if reservation modal is not open
  function closeMenuLightbox() {
    const lightbox = document.getElementById('menu-lightbox');
    if (!lightbox) return;

    lightbox.close();
    
    const resModal = document.getElementById('reservation-modal');
    if (!resModal || !resModal.open) {
      document.body.classList.remove('overflow-hidden');
    }
  }

  function toggleLightboxZoom() {
    const lightboxImg = document.getElementById('lightbox-image');
    if (!lightboxImg) return;

    state.isMenuZoomed = !state.isMenuZoomed;
    if (state.isMenuZoomed) {
      lightboxImg.classList.remove('cursor-zoom-in');
      lightboxImg.classList.add('scale-[1.8]', 'cursor-zoom-out');
    } else {
      lightboxImg.classList.remove('scale-[1.8]', 'cursor-zoom-out');
      lightboxImg.classList.add('cursor-zoom-in');
    }
  }

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
    document.getElementById('btn-next-to-step-2').className = 'px-6 py-3 bg-white/10 hover:bg-gold hover:text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';
    
    document.getElementById('btn-next-to-step-3').setAttribute('disabled', 'true');
    document.getElementById('btn-next-to-step-3').className = 'px-6 py-3 bg-white/10 hover:bg-gold hover:text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';
    
    document.getElementById('btn-next-to-step-4').setAttribute('disabled', 'true');
    document.getElementById('btn-next-to-step-4').className = 'px-6 py-3 bg-white/10 hover:bg-gold hover:text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';

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
        btn.className = 'date-card py-3 px-2 border border-dark-border bg-dark-pure/30 opacity-30 cursor-not-allowed text-center flex flex-col items-center justify-center';
        btn.setAttribute('title', 'Establecimiento cerrado los Domingos y Lunes');
      } else {
        btn.className = 'date-card py-3 px-2 border border-dark-border bg-dark-pure hover:border-gold hover:text-gold transition-all duration-300 text-center flex flex-col items-center justify-center';
        btn.addEventListener('click', function () {
          selectDateCard(dateStr, btn, dayOfWeekIndex);
        });
      }
      
      btn.innerHTML = `
        <span class="text-[9px] uppercase tracking-widest text-gray-500">${dayOfWeekShort}</span>
        <span class="text-base font-bold font-serif text-white mt-1">${dayOfMonth}</span>
        <span class="text-[8px] ${isClosed ? 'text-red-500' : 'text-gold'} mt-1 uppercase">${labelText}</span>
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
    document.getElementById('btn-next-to-step-3').className = 'px-6 py-3 bg-white/10 hover:bg-gold hover:text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none';

    // Enable next button for step 1
    const nextBtn = document.getElementById('btn-next-to-step-2');
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.className = 'px-6 py-3 bg-gold text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300';
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
      btn.className = 'time-card py-3 px-2 border border-dark-border bg-dark-pure hover:border-gold hover:text-gold transition-all duration-300 text-center font-serif text-sm';
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
      nextBtn.className = 'px-6 py-3 bg-gold text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300';
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
      nextBtn.className = 'px-6 py-3 bg-gold text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300';
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
    const phoneEl = document.getElementById('contact-phone');

    if (!nameEl || !phoneEl) return false;

    const nameVal = nameEl.value.trim();
    const phoneVal = phoneEl.value.trim();

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

    // Phone check
    if (!phoneVal) {
      showError('contact-phone', 'Por favor, ingresa tu número de WhatsApp.');
      isValid = false;
    } else {
      // Basic WhatsApp digits validation (exclude formatting characters)
      const digits = phoneVal.replace(/[\s\-\(\)\+]/g, '');
      if (digits.length < 8 || isNaN(digits)) {
        showError('contact-phone', 'Por favor, ingresa un número de WhatsApp válido.');
        isValid = false;
      } else {
        clearError('contact-phone');
      }
    }

    return isValid;
  }

  // Pre-load typing validation triggers
  function setupInputValidationTriggers() {
    const nameEl = document.getElementById('contact-name');
    const phoneEl = document.getElementById('contact-phone');

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

    if (phoneEl) {
      phoneEl.addEventListener('blur', () => {
        const val = phoneEl.value.trim();
        if (val) {
          const digits = val.replace(/[\s\-\(\)\+]/g, '');
          if (digits.length < 8 || isNaN(digits)) showError('contact-phone', 'Por favor, ingresa un número de WhatsApp válido.');
          else clearError('contact-phone');
        }
      });
      phoneEl.addEventListener('focus', () => clearError('contact-phone'));
    }
  }

  function handleReservationSubmit(event) {
    if (event) event.preventDefault();

    if (!validateForm()) return;

    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const requests = document.getElementById('contact-requests').value.trim() || 'Ninguno';

    // Parse Selected Date details for highly readable text
    const dateParts = state.selectedDate.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const d = new Date(year, month, day);

    const formattedSpanishDate = `${DAYS_FULL[d.getDay()]} ${day} de ${MONTHS_FULL[month]} de ${year}`;
    const guestGrammar = state.selectedGuestsCount === 1 ? 'persona' : 'personas';

    const msg = `¡Hola Anónimo Cocina & Bar! 🥂\n\n` +
      `Me gustaría realizar una reserva con los siguientes detalles:\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `📅 *Fecha:* ${formattedSpanishDate}\n` +
      `⏰ *Hora:* ${state.selectedTime} hs\n` +
      `👥 *Mesa para:* ${state.selectedGuestsCount} ${guestGrammar}\n` +
      `📱 *WhatsApp:* ${phone}\n` +
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
  // Initialization & Event Binding
  // ==========================================

  function init() {
    initDynamicDates();
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

    const menuLightbox = document.getElementById('menu-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    if (menuLightbox) {
      menuLightbox.addEventListener('click', (e) => {
        const dialogDimensions = menuLightbox.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          closeMenuLightbox();
        }
      });

      if (lightboxImage) {
        lightboxImage.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent modal close on clicking image itself
          toggleLightboxZoom();
        });
      }
    }

    // Keyboard support inside Menu Lightbox & Arrow triggers
    document.addEventListener('keydown', (e) => {
      if (menuLightbox && menuLightbox.open) {
        if (e.key === 'Escape') closeMenuLightbox();
        if (e.key === 'ArrowRight') {
          state.currentMenuIndex = (state.currentMenuIndex + 1) % state.menuUrls.length;
          updateLightboxContent();
          state.isMenuZoomed = false;
          if (lightboxImage) lightboxImage.classList.remove('scale-[1.8]', 'cursor-zoom-out');
        }
        if (e.key === 'ArrowLeft') {
          state.currentMenuIndex = (state.currentMenuIndex - 1 + state.menuUrls.length) % state.menuUrls.length;
          updateLightboxContent();
          state.isMenuZoomed = false;
          if (lightboxImage) lightboxImage.classList.remove('scale-[1.8]', 'cursor-zoom-out');
        }
      }
    });

    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.currentMenuIndex = (state.currentMenuIndex - 1 + state.menuUrls.length) % state.menuUrls.length;
        updateLightboxContent();
        state.isMenuZoomed = false;
        if (lightboxImage) {
          lightboxImage.classList.remove('scale-[1.8]', 'cursor-zoom-out');
          lightboxImage.classList.add('cursor-zoom-in');
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.currentMenuIndex = (state.currentMenuIndex + 1) % state.menuUrls.length;
        updateLightboxContent();
        state.isMenuZoomed = false;
        if (lightboxImage) {
          lightboxImage.classList.remove('scale-[1.8]', 'cursor-zoom-out');
          lightboxImage.classList.add('cursor-zoom-in');
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
  window.openMenuLightbox = openMenuLightbox;
  window.closeMenuLightbox = closeMenuLightbox;

  window.nextTestimonial = nextTestimonial;
  window.prevTestimonial = prevTestimonial;
  window.goToTestimonial = goToTestimonial;

})();
