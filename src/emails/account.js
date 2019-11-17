const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jsmayankyadav@gmail.com',
        subject: "Welcome on board!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({ 
        to: email,
        from: 'jsmayankyadav@gmail.com',
        subject: "Sad to see you go. :(",
        text: `Sorry to see you go ${name}. Is there anything we could have done better.
        Please write back to us. :)`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}