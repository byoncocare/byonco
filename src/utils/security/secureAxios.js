// src/utils/security/secureAxios.js
// Secure axios instance with fingerprinting and rate limit awareness

import axios from 'axios';
import { createSecureAxios } from './requestInterceptor';

// Create a default secure axios instance
const secureAxios = createSecureAxios(axios.create());

// Export both the secure instance and a function to create secure instances
export default secureAxios;
export { createSecureAxios };
