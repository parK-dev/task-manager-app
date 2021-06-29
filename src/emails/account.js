import 'dotenv/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SG);

const sendWelcomeEmail = (email, username) => {
  sgMail.send({
    to: email,
    from: 'park.devapi@gmail.com',
    subject: 'Welcome to the App!',
    text: `Thank you, ${username}, for registering to our app.`
  });
};

const sendCancellationEmail = (email, username) => {
  sgMail.send({
    to: email,
    from: 'park.devapi@gmail.com',
    subject: 'Are you breaking up with us?!',
    text: `It wasn't you, ${username}, it was us.`
  });
};

export { sendWelcomeEmail, sendCancellationEmail };