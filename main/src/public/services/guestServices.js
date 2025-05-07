import { getLocal, setLocal } from '../utils/localUtils.js';


/**
 * 
 * @param {response} error 
 * @returns true or false
 */
function isGuestService(error) {
    if (error.response.status && error.response.status === 401) {
      return true;
    }
    return false;
};

/**
 * createGuest
 * Creating a guest
 */
async function createGuest() {	
  const guest = getLocal('guest');
  if (!guest) {
    const guestName = `guest_${Date.now()}`;
    setLocal('guest', guestName);
    console.log('Guest creation request received at: ', new Date().toLocaleTimeString());
  }
};

export { 
  createGuest,
  isGuestService,  
};