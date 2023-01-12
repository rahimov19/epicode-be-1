import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.EMAIL_API_KEY);

export const sendVerificationEmail = async (recipientAdress) => {
  const msg = {
    to: recipientAdress,
    from: "Strive Blogs",
    subject: "Your uploaded Blog",
    text: "Here in attachments you can see your blog saved ad pdf file",
  };
  await sgMail.send(msg);
};
