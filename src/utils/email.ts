import sgMail, { MailDataRequired } from "@sendgrid/mail";
import handlebars from "handlebars";
import fs from "fs";
import path, { resolve } from "path";
import mailer from "nodemailer";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

handlebars.registerHelper("eq", (a, b) => a == b)

export const sendMailNotification = (
  to_email: string,
  subject: string,
  substitutional_parameters: { [key: string]: string | number },
  Template_Name: string,
  is_save?: any
) => {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "..", "templates", `${Template_Name}.hbs`),
    "utf-8"
  )

  const compiledTemplate = handlebars.compile(source)
  // Gmail smtp
  return new Promise((resolve, reject) => {
    let smtpProtocol = mailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_APP,
        pass: process.env.GMAIL_APP_KEY,
      }
    })

    let mailoption = {
      from: process.env.COMPANY_EMAIL,
      to: to_email,
      subject: subject,
      html: compiledTemplate(substitutional_parameters),
    }

    return smtpProtocol.sendMail(mailoption, function (err, response) {
      if (err) {
        return reject(err)
      }
      console.log("Message Sent" + response)
      smtpProtocol.close()
      return resolve(true)
    })
  })
}

export const sendMultiEmailNotification = (
  to_emails: string[],
  subject: string,
  substitutional_parameters: { [key: string]: string | number },
  Template_Names: string[],
  is_save: any,
  whoIAm: string = "User"
) => {
  for (let index = 0; index < to_emails.length; index++) {
    const to_email = to_emails[index]
    const template_name = Template_Names[index]
    sendMailNotification(
      to_email,
      subject,
      substitutional_parameters,
      template_name,
      is_save ? index : 0
    )
  }
}
