import sgMail from '@sendgrid/mail';
import { env } from '../config/env'; // or adjust the path if needed

console.log('Using SENDGRID_API_KEY:', env.sendGridApiKey);
sgMail.setApiKey(env.sendGridApiKey);

export const sendMagicLinkEmail = async (
  email: string,
  magicLinkUrl: string
) => {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL!, // verified sender
    subject: 'Your Magic Login Link',
    text: `Click below to sign in:\n\n${magicLinkUrl}`,
    html: `<p>Click below to sign in:</p><p><a href="${magicLinkUrl}">Log in now</a></p>`,
  };

  await sgMail.send(msg);
};
