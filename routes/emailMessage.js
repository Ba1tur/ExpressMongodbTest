const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-email", (req, res) => {
  const { title, tel, email } = req.body;
  console.log(process.env.USER_EMAIL, process.env.USER_PASSWORD);
  // Настройки транспорта для Nodemailer (вам нужно заменить на свои реальные данные)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 456,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  // Опции электронного письма
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: "lalalalotvovo@gmail.com",
    subject: "Новое сообщение",
    // text: `Заголовок: ${title}\nТелефон: ${tel}\nEmail: ${email}`,
    html: `
		<div style="font-family: Arial, sans-serif; padding: 20px;">
			<h2 style="color: #3498db;">Новое сообщение</h2>
			<p><strong>Заголовок:</strong> ${title}</p>
			<p><strong>Телефон:</strong> ${tel}</p>
			<p><strong>Email:</strong> ${email}</p>
		</div>
	`,
  };

  // Отправка электронного письма
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

module.exports = router;
