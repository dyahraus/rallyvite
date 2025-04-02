import { sendMagicLinkEmail } from './services/emailService';

const test = async () => {
  console.log('entered test');
  const testEmail = 'dyahraus1@gmail.com'; // ✅ replace this with your real email
  const testLink = 'https://rallyvite.com/magic-login?token=test-token-12345';

  try {
    await sendMagicLinkEmail(testEmail, testLink);
    console.log('✅ Magic link test email sent successfully!');
  } catch (err) {
    console.error('❌ Error sending test email:', err);
  }
};

test();
