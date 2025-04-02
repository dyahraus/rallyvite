import sgMail from '@sendgrid/mail';

console.log('Using SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

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
