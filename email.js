const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmailConfirmationEmailHtml(customerName, orderNro) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div class="container section">
            <label>Paisaje</label>
            <img src = "https://images.pexels.com/photos/7224255/pexels-photo-7224255.jpeg?cs=srgb&dl=pexels-simon-gough-7224255.jpg&fm=jpg" alt="" width="400px"
        </div>
    </body>
    </html>`
}

function getMessage(emailParams) {
    return {
        to: emailParams.toEmail, // Correo destino
        from: 'orodelo.s@hotmail.com', // Correo que está registrado en sendgrid
        subject: 'Orden de Compra',
        text: `Hola, ${emailParams.customerName} hemos recibido tu orden número ${emailParams.orderNro}`,
        html: sendEmailConfirmationEmailHtml(emailParams.customerName, emailParams.orderNro)
    }
}

async function sendOrderConfirmation(emailParams) {
    try {
        await sendgridMail.send(getMessage(emailParams))
        return { message: 'Confirmación de orden enviada' }
    } catch (error) {
        const message = 'Error enviando mensaje'
        console.error(message)
        console.error(error)
        if (error.response) console.error(error.response.body)
        return { message }
    }
}

module.exports = {
    sendOrderConfirmation
}