// Global variables
let events = [];
let volunteers = [];
let currentEventIndex = 0;
const eventsPerPage = 6;

// DOM elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const eventsGrid = document.getElementById('events-grid');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
    animateCounters();
});

// Initialize application
function initializeApp() {
    console.log('🌊 ShoreSquad initialized');
    setupMobileMenu();
    setupSmoothScrolling();
    setupModalHandlers();
    setupFormHandlers();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// Mobile menu functionality
function setupMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Modal functionality
function setupModalHandlers() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Form handling
function setupFormHandlers() {
    const joinForm = document.getElementById('joinForm');
    const eventForm = document.getElementById('eventForm');
    
    if (joinForm) {
        joinForm.addEventListener('submit', handleJoinForm);
    }
    
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventForm);
    }
}

function handleJoinForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const volunteerData = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        location: formData.get('location'),
        experience: formData.get('experience'),
        motivation: formData.get('motivation'),
        joinDate: new Date().toISOString()
    };
    
    // Add to volunteers array
    volunteers.push(volunteerData);
    
    // Save to localStorage
    localStorage.setItem('shoreSquadVolunteers', JSON.stringify(volunteers));
    
    // Show success message
    showNotification('Welcome to ShoreSquad! 🌊', 'success');
    
    // Close modal and reset form
    closeModal('joinModal');
    e.target.reset();
    
    // Update stats
    updateVolunteerCount();
}

function handleEventForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        id: Date.now(),
        title: formData.get('eventTitle'),
        date: formData.get('eventDate'),
        time: formData.get('eventTime'),
        location: formData.get('eventLocation'),
        description: formData.get('eventDescription'),
        maxParticipants: parseInt(formData.get('maxParticipants')),
        currentParticipants: 0,
        createdBy: 'Current User', // In a real app, this would be the logged-in user
        createdAt: new Date().toISOString()
    };
    
    // Add to events array
    events.unshift(eventData); // Add to beginning for newest first
    
    // Save to localStorage
    localStorage.setItem('shoreSquadEvents', JSON.stringify(events));
    
    // Refresh events display
    displayEvents();
    
    // Show success message
    showNotification('Event created successfully! 🎉', 'success');
    
    // Close modal and reset form
    closeModal('createEventModal');
    e.target.reset();
}

// Load initial data
function loadInitialData() {
    loadVolunteers();
    loadEvents();
    generateSampleEvents();
    displayEvents();
}

function loadVolunteers() {
    const savedVolunteers = localStorage.getItem('shoreSquadVolunteers');
    if (savedVolunteers) {
        volunteers = JSON.parse(savedVolunteers);
    }
}

function loadEvents() {
    const savedEvents = localStorage.getItem('shoreSquadEvents');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }
}

// Generate sample events
function generateSampleEvents() {
    if (events.length === 0) {
        const sampleEvents = [
            {
                id: 1,
                title: "Sunrise Beach Cleanup - Marina Bay",
                date: "2025-06-15",
                time: "07:00",
                location: "Marina Bay Beach, Singapore",
                description: "Join us for an early morning cleanup at one of Singapore's most iconic beaches. We'll provide all equipment and refreshments!",
                maxParticipants: 50,
                currentParticipants: 23,
                createdBy: "ShoreSquad Team",
                createdAt: "2025-06-01T10:00:00Z"
            },
            {
                id: 2,
                title: "Family-Friendly Cleanup - East Coast",
                date: "2025-06-20",
                time: "09:00",
                location: "East Coast Park, Singapore",
                description: "Perfect for families! Bring your kids for a fun and educational beach cleanup experience. Games and prizes included!",
                maxParticipants: 75,
                currentParticipants: 34,
                createdBy: "EcoFamilies SG",
                createdAt: "2025-06-02T14:30:00Z"
            },
            {
                id: 3,
                title: "Corporate Volunteer Day - Sentosa",
                date: "2025-06-25",
                time: "14:00",
                location: "Siloso Beach, Sentosa",
                description: "Corporate teams welcome! A great team building activity while making a positive environmental impact.",
                maxParticipants: 100,
                currentParticipants: 67,
                createdBy: "Green Corp Initiative",
                createdAt: "2025-06-03T09:15:00Z"
            },
            {
                id: 4,
                title: "Night Cleanup Under the Stars",
                date: "2025-07-02",
                time: "19:00",
                location: "Changi Beach, Singapore",
                description: "Unique evening cleanup experience! We'll provide headlamps and create a magical cleanup under the stars.",
                maxParticipants: 40,
                currentParticipants: 18,
                createdBy: "NightCleaners SG",
                createdAt: "2025-06-04T16:45:00Z"
            },
            {
                id: 5,
                title: "University Student Cleanup Drive",
                date: "2025-07-10",
                time: "10:00",
                location: "Pasir Ris Beach, Singapore",
                description: "Calling all students! Join fellow university students for a cleanup drive. Community service hours available!",
                maxParticipants: 60,
                currentParticipants: 41,
                createdBy: "NUS Environmental Society",
                createdAt: "2025-06-05T11:20:00Z"
            },
            {
                id: 6,
                title: "Weekend Warriors Cleanup",
                date: "2025-07-15",
                time: "08:00",
                location: "Sembawang Beach, Singapore",
                description: "For the dedicated weekend warriors! Early start for maximum impact before the beach gets busy.",
                maxParticipants: 35,
                currentParticipants: 12,
                createdBy: "Weekend Warriors Club",
                createdAt: "2025-06-06T13:10:00Z"
            }
        ];
        
        events = sampleEvents;
        localStorage.setItem('shoreSquadEvents', JSON.stringify(events));
    }
}

// Display events
function displayEvents() {
    if (!eventsGrid) return;
    
    const eventsToShow = events.slice(currentEventIndex, currentEventIndex + eventsPerPage);
    
    if (currentEventIndex === 0) {
        eventsGrid.innerHTML = '';
    }
    
    eventsToShow.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
        
        // Add animation
        setTimeout(() => {
            eventCard.classList.add('fade-in-up');
        }, 100);
    });
    
    // Update load more button visibility
    const loadMoreBtn = document.querySelector('.btn-secondary');
    if (loadMoreBtn && currentEventIndex + eventsPerPage >= events.length) {
        loadMoreBtn.style.display = 'none';
    }
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const eventDate = new Date(event.date + 'T' + event.time);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const participantsPercentage = (event.currentParticipants / event.maxParticipants) * 100;
    const isFullyBooked = participantsPercentage >= 100;
    
    card.innerHTML = `
        <div class="event-date">${formattedDate} • ${formattedTime}</div>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-location">📍 ${event.location}</div>
        <p class="event-description">${event.description}</p>
        <div class="event-participants">
            <div class="participants-count">
                ${event.currentParticipants}/${event.maxParticipants} participants
            </div>
            <div class="participants-bar">
                <div class="participants-progress" style="width: ${Math.min(participantsPercentage, 100)}%"></div>
            </div>
        </div>
        <button class="join-event-btn ${isFullyBooked ? 'fully-booked' : ''}" 
                onclick="joinEvent(${event.id})" 
                ${isFullyBooked ? 'disabled' : ''}>
            ${isFullyBooked ? 'Fully Booked' : 'Join Event'}
        </button>
    `;
    
    return card;
}

// Load more events
function loadMoreEvents() {
    currentEventIndex += eventsPerPage;
    displayEvents();
}

// Join event functionality
function joinEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    if (event.currentParticipants >= event.maxParticipants) {
        showNotification('Sorry, this event is fully booked! 😔', 'error');
        return;
    }
    
    // Increment participants
    event.currentParticipants++;
    
    // Update localStorage
    localStorage.setItem('shoreSquadEvents', JSON.stringify(events));
    
    // Refresh display
    displayEvents();
    currentEventIndex = 0; // Reset to show from beginning
    
    // Show success message
    showNotification('Successfully joined the event! 🎉', 'success');
    
    // Update beaches cleaned counter (simulate impact)
    updateBeachesCleanedCount();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 3000;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                animation: slideInRight 0.3s ease;
                max-width: 350px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            .notification.success { background: #10b981; }
            .notification.error { background: #ef4444; }
            .notification.info { background: #0ea5e9; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Counter animations
function animateCounters() {
    const counters = [
        { element: document.getElementById('beaches-cleaned'), target: 247 },
        { element: document.getElementById('trash-collected'), target: 15642 },
        { element: document.getElementById('volunteers'), target: 3891 }
    ];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = counters.find(c => c.element === entry.target);
                if (counter && !counter.element.classList.contains('animated')) {
                    animateCounter(counter.element, counter.target);
                    counter.element.classList.add('animated');
                }
            }
        });
    });
    
    counters.forEach(counter => {
        if (counter.element) {
            observer.observe(counter.element);
        }
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// Update volunteer count
function updateVolunteerCount() {
    const volunteerElement = document.getElementById('volunteers');
    if (volunteerElement) {
        const currentCount = parseInt(volunteerElement.textContent.replace(/,/g, ''));
        volunteerElement.textContent = (currentCount + 1).toLocaleString();
    }
}

// Update beaches cleaned count
function updateBeachesCleanedCount() {
    const beachesElement = document.getElementById('beaches-cleaned');
    if (beachesElement) {
        const currentCount = parseInt(beachesElement.textContent.replace(/,/g, ''));
        // Randomly increase between 1-3
        const increase = Math.floor(Math.random() * 3) + 1;
        beachesElement.textContent = (currentCount + increase).toLocaleString();
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.scrollToSection = scrollToSection;
window.joinEvent = joinEvent;
window.loadMoreEvents = loadMoreEvents;

// Console welcome message
console.log(`
🌊 Welcome to ShoreSquad! 🌊
Building a community of ocean warriors.
Together, we can restore our coastlines and protect marine life.

Made with 💙 for the environment.
`);

// Add some interactive console commands for developers
window.shoreSquadDebug = {
    getEvents: () => events,
    getVolunteers: () => volunteers,
    addSampleVolunteer: () => {
        const sampleVolunteer = {
            id: Date.now(),
            name: 'Test User',
            email: 'test@example.com',
            location: 'Singapore',
            experience: 'intermediate',
            motivation: 'Love the ocean!',
            joinDate: new Date().toISOString()
        };
        volunteers.push(sampleVolunteer);
        localStorage.setItem('shoreSquadVolunteers', JSON.stringify(volunteers));
        updateVolunteerCount();
        console.log('Sample volunteer added!');
    },
    clearData: () => {
        localStorage.removeItem('shoreSquadEvents');
        localStorage.removeItem('shoreSquadVolunteers');
        events = [];
        volunteers = [];
        console.log('All data cleared!');
    }
};
