// Test environment variables
console.log('Testing environment variables...');
console.log('VITE_AWS_ACCESS_KEY_ID:', process.env.VITE_AWS_ACCESS_KEY_ID);
console.log('VITE_AWS_SECRET_ACCESS_KEY length:', process.env.VITE_AWS_SECRET_ACCESS_KEY?.length);
console.log('VITE_AWS_SECRET_ACCESS_KEY:', process.env.VITE_AWS_SECRET_ACCESS_KEY);

// Load from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

console.log('\nAfter loading .env.local:');
console.log('VITE_AWS_ACCESS_KEY_ID:', process.env.VITE_AWS_ACCESS_KEY_ID);
console.log('VITE_AWS_SECRET_ACCESS_KEY length:', process.env.VITE_AWS_SECRET_ACCESS_KEY?.length);
console.log('VITE_AWS_SECRET_ACCESS_KEY:', process.env.VITE_AWS_SECRET_ACCESS_KEY);
