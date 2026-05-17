const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required." }),
      };
    }

    // Create email transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,   // set in Netlify dashboard
        pass: process.env.GMAIL_PASS,   // Gmail App Password (not your real password)
      },
    });

    // Email to YOU (John) when someone contacts you
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: "jkibue749@gmail.com",
      subject: `📩 New message from ${name} via your portfolio`,
      html: `
        <div style="font-family:monospace;background:#050a0e;color:#c8d8e8;padding:2rem;border-radius:8px;border:1px solid rgba(0,255,136,0.3)">
          <h2 style="color:#00ff88;letter-spacing:2px">// NEW PORTFOLIO MESSAGE</h2>
          <hr style="border-color:rgba(0,255,136,0.2);margin:1rem 0"/>
          <p><strong style="color:#00ff88">Name:</strong> ${name}</p>
          <p><strong style="color:#00ff88">Email:</strong> ${email}</p>
          <p><strong style="color:#00ff88">Message:</strong></p>
          <p style="background:#0a1219;padding:1rem;border-left:3px solid #00ff88;border-radius:4px">${message}</p>
        </div>
      `,
    });

    // Auto-reply to the person who contacted you
    await transporter.sendMail({
      from: `"John Kibue" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family:monospace;background:#050a0e;color:#c8d8e8;padding:2rem;border-radius:8px;border:1px solid rgba(0,255,136,0.3)">
          <h2 style="color:#00ff88">// MESSAGE RECEIVED</h2>
          <hr style="border-color:rgba(0,255,136,0.2);margin:1rem 0"/>
          <p>Hey ${name},</p>
          <p>Thanks for getting in touch! I've received your message and will get back to you as soon as possible.</p>
          <br/>
          <p style="color:#6a8899">— John Kibue</p>
          <p style="color:#6a8899;font-size:12px">Aspiring Penetration Tester | Eldoret, Kenya</p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Message sent successfully!" }),
    };

  } catch (error) {
    console.error("Email error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send message. Please try again." }),
    };
  }
};
