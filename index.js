require('dotenv').config()
const express = require('express')
const email = require('./email')
const app = express()
const port = 3000 || process.env.port


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.json({ message: 'Success' })
})

app.listen(port, () => {
    console.log(`Listening por el puerto http://localhost:${port}`)
})


app.post('/api/email/message', async(req, res, next) => {
    try {
        res.json(await email.sendOrderConfirmation(req.body))
    } catch (error) {
        next(error)
    }
})

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500
    console.error(error.message, error.stack)
    res.status(statusCode).json({ 'message': error.message })
    return
})

const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const sgMail = require('@sendgrid/mail')
const sendgridMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

const client = require('twilio')(accountSID, authToken)

//Enviar msj a whatsapp, utilizando sandbox y el nro de cel personal
client.messages.create({
    body: 'Mensaje de prueba twilio grupo 21 - Ciclo IV',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+573196828394'
}).then(message => console.log(`Mensaje enviado al 3196828394 ${message.sid}`))

//Enviar msj de texto
client.messages.create({
    body: 'Estamos en la semana IV - Ciclo IV. 18 de nov 2021',
    from: '+15866666312',
    to: '+573196828394'
}).then(message => console.log(`Mensaje de texto enviado al 3196828394 ${message.sid}`))

//Enviar email con sendgrid
const msg = {
    to: 'rodso91@gmail.com', // Correo destino
    from: 'orodelo.s@hotmail.com', // Correo que está registrado en sendgrid
    subject: 'Prueba SENDGRID G_21',
    text: 'Cordial saludo',
    html: 'Cordial saludo<br><br>Esta es una prueba de correo enviado utilizando <strong>SenGrid en Node.js</strong><br>Agradezco la atención prestada.',
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

function getMessage() {
    const body = 'Mensaje'
    return {
        to: 'rodso91@gmail.com', // Correo destino
        from: 'orodelo.s@hotmail.com', // Correo que está registrado en sendgrid
        subject: 'Prueba SENDGRID G_21',
        text: body,
        html: 'Cordial saludo<br><br>Esta es una prueba alternativa para el envío de correos utilizando <strong>SenGrid en Node.js</strong><br>Agradezco la atención prestada.'
    }
}

async function sendEmail() {
    try {
        await sendgridMail.send(getMessage())
        console.log('El correo ha sido enviado')
    } catch (error) {
        console.log('No se pudo enviar el mensaje')
        console.error(error)
        if (error.response) console, error(error.response.body)

    }
}

(async() => {
    console.log('Enviando correo electrónico')
    await sendEmail()
})()