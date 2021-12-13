import sgMail from '@sendgrid/mail'

export async function sendEmail(name, from, subject, message) {

    // create client
    
    sgMail.setApiKey(process.env.SEND_GRID_API)

    const msg = {
        to: process.env.NODEMAILER_USER,
        from: process.env.NODEMAILER_USER,
        subject: subject,
        text: message,
        reply_to: from
    }
    
    sgMail.send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

}