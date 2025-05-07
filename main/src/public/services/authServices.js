// src/api/services/authServices.js
import api from './config/apiConfig.js';
	
/**
 * loginValidate - POST FUNCTION to handle user login validation
 * @param { string } accountName - used to validate user's account name
 * @param { string } pw - used to validate user's password
 * @return { Promise<Object> || Error } Return user data or throw errors accordingly
 */
const loginValidate = async (email, password) => {
  try {
	const response = await api.post('/auth/login', { email, password });
	if (response.data) {
	  return response.data;
	} else {
	  throw new Error(response.data.error.message);
	}
  } catch (error) {
	throw new Error(`User login error occured! ${error}`, { cause: error });
  }
};

/**
 * registerUser - POST FUNCTION to handle user registration
 * @param { Object } newUser - contains all input information
 * @return { Promise<Object> || Error } Return user data or throw errors accordingly
 */
const registerUser = async (newUser) => {
  const username = newUser.username;
  const password = newUser.password;
  const email = newUser.email;
  try {  
	const response = await api.post('/auth/create', { username, password, email });
	if (response.data) {
		return response.data;
	} else {
		throw new Error(response.data.error.message);
	}
  } catch (error) {
	if (error.response.status === 409) {
	  throw new Error('Email already in use, try logging in or resetting password.', { cause: error });
	} else {
		throw new Error(`User register error occured! ${error.message}`, { cause: error });
	}
  }
};

export { 
  loginValidate,
  registerUser
};