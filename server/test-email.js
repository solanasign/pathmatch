require('dotenv').config();
const { sendAutoResponderEmail, sendNotificationEmail } = require('./dist/services/email.service');

async function testEmailService() {
  try {
    console.log('Testing email service...');
    
    // Test auto-responder email
    await sendAutoResponderEmail(
      'test@example.com',
      'John Doe',
      'Senior Software Engineer'
    );
    
    console.log('Auto-responder email test completed');
    
    // Test notification email
    await sendNotificationEmail(
      'John Doe',
      'test@example.com',
      'Senior Software Engineer',
      'This is a test cover letter for the position.'
    );
    
    console.log('Notification email test completed');
    console.log('All email tests passed!');
    
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmailService(); 