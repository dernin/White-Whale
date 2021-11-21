import { sendEmail } from "../../lib/email"
import sgMail from '@sendgrid/mail'

// recieves a name, from email address, and body message and calls sendEmail
export default async function handler(req, res) {
    const query = req.query
    console.log(query)
    //const urlParams = new URLSearchParams(query['query'])
    const name = query['name']
    const email = query['email']
    const subject = 'A new message on White Whale from ' + name
    const message = query['message']

    // const results = await sendEmail(name, email, subject, message)
    

    sgMail.setApiKey(process.env.SEND_GRID_API)

    const msg = {
        to: process.env.NODEMAILER_USER,
        from: process.env.NODEMAILER_USER,
        subject: subject,
        text: message,
        reply_to: email
    }
    
    await sgMail.send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

    return res.json()
}