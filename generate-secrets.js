#!/usr/bin/env node

import crypto from 'crypto';

console.log('\n🔐 Generating secrets for PeopleSync deployment...\n');

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');

console.log('═══════════════════════════════════════════════════════════');
console.log('Copy these to your Render environment variables:');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('JWT_SECRET='+jwtSecret);
console.log('JWT_REFRESH_SECRET='+jwtRefreshSecret);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('✅ Secrets generated successfully!');
console.log('═══════════════════════════════════════════════════════════\n');
