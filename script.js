/* Fetch and integrate data from external JSON file */
let data = {};
fetch('data.json')
    .then(response => response.json())
    .then(json => data = json)
    .catch(error => console.error("Error loading JSON:", error));

/* Select HTML elements for user interactions */
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat');
const aboutUsButton = document.getElementById('about-us');
const aboutPopup = document.getElementById('about-popup');
const closePopup = document.getElementById('close-popup');
const toggleButton = document.getElementById('dark-mode-toggle');

/* Check for Dark Mode preference and apply settings */
let isDarkMode = localStorage.getItem('darkMode') === 'enabled';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    toggleButton.innerHTML = '<i class="fa fa-sun-o"></i>';
}

toggleButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    toggleButton.innerHTML = isDarkMode ? '<i class="fa fa-sun-o"></i>' : '<i class="fa fa-moon-o"></i>';
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

/* Show 'Processing...' animation while fetching response */
function showProcessingAnimation() {
    const processingDiv = document.createElement('div');
    processingDiv.className = 'processing-animation';
    processingDiv.textContent = 'Processing...';
    chatBox.appendChild(processingDiv);
    chatBox.scroll({ top: chatBox.scrollHeight, behavior: 'smooth' });
    return processingDiv;
}

/* Remove 'Processing...' animation once response is ready */
function removeProcessingAnimation(element) {
    if (element) chatBox.removeChild(element);
}

/* Append user and bot messages to the chat box */
function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scroll({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

/* Handle user input, validate message, and initiate response processing */
function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        appendMessage('user', userMessage);
        const processingElement = showProcessingAnimation();
        setTimeout(() => {
            processUserQuery(userMessage.toLowerCase());
            removeProcessingAnimation(processingElement);
        }, 1000);
        userInput.value = '';
    } else {
        alert("Please enter a message before sending.");
    }
}

/* Process user query, extract destination, and return appropriate response */
function processUserQuery(query) {
    const destinationRegex = /(agra|jaipur|mumbai|goa|madurai|chennai)/i;
    const match = query.match(destinationRegex);
    if (match) {
        currentDestination = match[1].toLowerCase();
        appendMessage('bot', `You've selected Destination ${capitalizeFirstLetter(currentDestination)}. What would you like to know? Places, famous foods, restaurants, or hotels?`);
    } else if (currentDestination && data[currentDestination]) {
        if (query.includes('places')) {
            appendMessage('bot', getPlacesInfo());
        } else if (query.includes('famous foods')) {
            appendMessage('bot', getFamousFoodsInfo());
        } else if (query.includes('restaurants')) {
            appendMessage('bot', getRestaurantsInfo());
        } else if (query.includes('hotels')) {
            appendMessage('bot', getHotelsInfo());
        } else {
            appendMessage('bot', "I'm sorry, I didn't understand that. You can ask about places, famous foods, restaurants, or hotels.");
        }
    } else {
        appendMessage('bot', "Please specify a destination like 'Goa', 'Madurai', or 'Mumbai'.");
    }
}

/* Fetch place information for selected destination */
function getPlacesInfo() {
    return data[currentDestination].places.map(place => `${place.name}: ${place.description}`).join('\n');
}

/* Fetch famous food information for selected destination */
function getFamousFoodsInfo() {
    return data[currentDestination].famousFoods.map(food => `${food.name}: ${food.description}`).join('\n');
}

/* Fetch restaurant information for selected destination */
function getRestaurantsInfo() {
    return data[currentDestination].restaurants.map(restaurant => `${restaurant.name} (${restaurant.cuisine}): ${restaurant.description}, Price Range: ${restaurant.priceRange}`).join('\n');
}

/* Fetch hotel information for selected destination */
function getHotelsInfo() {
    return data[currentDestination].hotels.map(hotel => `${hotel.name} (Rating: ${hotel.rating} stars): ${hotel.description}, Price Range: ${hotel.priceRange}`).join('\n');
}

/* Capitalize the first letter of a word */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* Event Listeners for user interactions */
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

newChatButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to start a new chat?')) location.reload();
});

aboutUsButton.addEventListener('click', () => aboutPopup.classList.add('show'));
closePopup.addEventListener('click', () => aboutPopup.classList.remove('show'));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutPopup.classList.contains('show')) closePopup.click();
});