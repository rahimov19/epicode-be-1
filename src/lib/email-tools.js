import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.EMAIL_API_KEY);

export const sendVerificationEmail = async (recipientAdress) => {
  console.log(recipientAdress);
  const msg = {
    to: recipientAdress,
    from: "rahimov19.ar@gmail.com",
    subject: "Your uploaded Blog",
    text: "Here in attachments you can see your blog saved ad pdf file",
    html: "<strong>Here in attachments you can see your blog saved ad pdf file</strong>",
  };
  let variable = await sgMail.send(msg);
  console.log(variable);
};
