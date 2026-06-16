#!/usr/bin/env node

/**
 * CLI Script to Create Invitations
 * 
 * Usage:
 *   node scripts/createInvitation.js
 *   
 * Or with parameters:
 *   node scripts/createInvitation.js --company="Acme Corp" --email="admin@acme.com" --days=30
 */

import mongoose from 'mongoose';
import readline from 'readline';
import env from '../src/config/env.js';
import Invitation from '../src/models/Invitation.js';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    log('✅ Connected to MongoDB', 'green');
  } catch (error) {
    log(`❌ MongoDB connection failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function createInvitation() {
  log('\n🎫 Create New Invitation\n', 'bright');
  log('═'.repeat(50), 'cyan');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const params = {};
  args.forEach(arg => {
    const [key, value] = arg.replace('--', '').split('=');
    params[key] = value;
  });

  // Get company name
  const companyName = params.company || await question(`${colors.cyan}Company Name: ${colors.reset}`);
  if (!companyName || !companyName.trim()) {
    log('❌ Company name is required!', 'yellow');
    return;
  }

  // Get email
  const email = params.email || await question(`${colors.cyan}Admin Email: ${colors.reset}`);
  if (!email || !email.trim() || !email.includes('@')) {
    log('❌ Valid email is required!', 'yellow');
    return;
  }

  // Get first name (optional)
  const firstName = params.firstName || await question(`${colors.cyan}First Name (optional): ${colors.reset}`) || null;

  // Get last name (optional)
  const lastName = params.lastName || await question(`${colors.cyan}Last Name (optional): ${colors.reset}`) || null;

  // Get plan
  const planInput = params.plan || await question(`${colors.cyan}Plan (free/pro/enterprise) [free]: ${colors.reset}`) || 'free';
  const plan = ['free', 'pro', 'enterprise'].includes(planInput.toLowerCase()) ? planInput.toLowerCase() : 'free';

  // Get expiration days
  const daysInput = params.days || await question(`${colors.cyan}Expires in days [30]: ${colors.reset}`) || '30';
  const expiresInDays = parseInt(daysInput) || 30;

  // Get notes (optional)
  const notes = params.notes || await question(`${colors.cyan}Notes (optional): ${colors.reset}`) || '';

  log('\n' + '─'.repeat(50), 'cyan');
  log('\n📋 Summary:', 'bright');
  log(`  Company:   ${companyName}`, 'blue');
  log(`  Email:     ${email}`, 'blue');
  if (firstName) log(`  Name:      ${firstName} ${lastName || ''}`.trim(), 'blue');
  log(`  Plan:      ${plan.toUpperCase()}`, 'blue');
  log(`  Expires:   ${expiresInDays} days`, 'blue');
  if (notes) log(`  Notes:     ${notes}`, 'blue');

  const confirm = await question(`\n${colors.yellow}Create this invitation? (yes/no): ${colors.reset}`);
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    log('\n❌ Invitation creation cancelled.', 'yellow');
    return;
  }

  try {
    // Generate unique code
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = Invitation.generateCode();
      const existing = await Invitation.findOne({ code });
      if (!existing) isUnique = true;
    }

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create invitation
    const invitation = await Invitation.create({
      code,
      companyName,
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      plan,
      expiresAt,
      createdBy: 'cli',
      notes: notes || undefined,
    });

    log('\n' + '═'.repeat(50), 'green');
    log('\n✅ Invitation Created Successfully!\n', 'green');
    log('─'.repeat(50), 'cyan');
    log(`\n  🎫 Invitation Code: ${colors.bright}${colors.green}${invitation.code}${colors.reset}`);
    log(`  🔗 Registration URL: ${colors.bright}${colors.cyan}${env.CLIENT_URL}/register?invite=${invitation.code}${colors.reset}`);
    log(`  📅 Expires: ${invitation.expiresAt.toLocaleDateString()}`, 'blue');
    log(`  📧 Email: ${invitation.email}`, 'blue');
    log('\n' + '─'.repeat(50), 'cyan');
    
    log('\n📨 Share this invitation code with the company:', 'yellow');
    log(`\n   ${colors.bright}${invitation.code}${colors.reset}\n`);
    log('Or send them this link:', 'yellow');
    log(`\n   ${colors.cyan}${env.CLIENT_URL}/register?invite=${invitation.code}${colors.reset}\n`);

  } catch (error) {
    log(`\n❌ Error creating invitation: ${error.message}`, 'yellow');
  }
}

async function main() {
  await connectDB();
  await createInvitation();
  
  rl.close();
  await mongoose.connection.close();
  log('\n✅ Disconnected from MongoDB\n', 'green');
  process.exit(0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unhandled Error: ${error.message}`, 'yellow');
  process.exit(1);
});

// Run
main();
