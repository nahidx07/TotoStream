const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');

// আপনার দেওয়া Firebase Service Account ডাটা এখানে সেট করা হয়েছে
const serviceAccount = {
  "projectId": "totostream",
  "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCptREbKFE/G/oW\nC0MAA2dGkp5Ne/IBg7YRDMdvDygEY4ulBMz/X3DcsSsJ0xs9uJG74912HWKwevBW\nQkyMM1aB/+BXAVreq+B8TVTESa4Efri4AW3IjuzKDFH/eKrFyineh6u68MX1pm18\nSQRTzYkiD+dLEw+ZGwZx/uHX8751R3FKyepf0f3qnzJyH91q0bdJXRWJQKLR/kOc\nSrhejbHIXDNBOVAATvha8KFSZFYL0e+yUE6CmfE9tzKl421zdSsXgpl437KRIJiR\nip+OJlBB8VNGUwmqMXz1J4hC5HIMl8U6iByGpdc+9BRPQJKg7LO5wCyehGHsCy/z\nZGyAWQOxAgMBAAECggEABG2YstXxHDydaRTW4M8LQkCFVPqU2nlUbs79pzDV4k4Z\ncM0WgCACkbiuIRu7E80slm9zXKNBuADv3zQOQxGV2/iUmlXo8tm47Cq524ikgBAg\nJbILDIYCuPcOMvFFDu1GMFaSHkGCqmxmHc+WD+LtBWXf1Z9ZZq0mR7y5ISModhnE\nAmjS6okz8I9BkCzYloaOrEi6rLN2zwDLZpbgwDfCMwYzdhVmtoYZJ/trAwkXTuZ7\nmNGtO8WgV1NdSECRlqne3TznYK1GfDXrvIaLcmOsb60qKF9IlMm6VqJdZjgUBpQ3\nYlT2C7MSyD4h/JVx7Q9OOGpAnfCdIGYYiHgK1crLxwKBgQDU3aIM69Ni0QFxm+rY\nePoVGqKvbtqV6HiA6zrzSrawokERdCsCHrpkOsll8SyA1Dm6mFUT74Pp8LeMDNNg\nDzScaaDd1rl3iSg32Lc8M9hAaJawzLFKvQyX3vdwxWQONQNzlN7CK1bD+6uv4Zr5\n6Ve8C0iu8ETDrV66vPFNIm6L5wKBgQDMGJj31QPrRcUOrGsMWrVqjlli63xBVCbV\nCvjxnsoSishHFGu0mtLCSt9zD9fbDAWY2C4cTU4C2MWnbHztKlPcL2BJNP8oiirg\nSxmajcKnMCCy5vXAiE6CQd8G0g7fSj3rfxNsDXwLVgdPr859Sl4b074IMEcDem1s\nJBCNJm5ApwKBgQC3DIQ/Aki8MClCrias0pOTtFzz6ar0wH1nt2DxOG2TxWOZA8G8\nR/pXGKp6DIQNoPKnwDlhNFXGxebA+4KFl23Rl4/rVKwW3A6Gv8kKbzbmZEo5bTyE\nb+HlghIpKXfBb2bFgjdBnHNhM1mKOahRATbQwTU0u7/KkZM5Q/IGfTgPwKBgQCz\ngzMQUMjop+5CEL77F9GXTmsqiWs53rVlDwiVJJAhrPWpJznwmXikscxF3PqDzNgj\nboloFUp3UIjQ0Kg0xdUKxpTO7xE6bAR4UTXM7cD24mrwUBp5ZKqBAUUUL7ArD5bU\nymmf0WB4bAt0OHLLWpzZpuzvMN9VHNqfkj0ImXPB4wKBgGVkma3NFEywiyapIsNg\n978W7bbUx6j4UyO0D8VfLTTsM0uW45J+Z+MTVpPyfZ3c2CHtGAjps6bPvcVOFfRT\nXxt+LRA+GJb3dTHva2sRG18eofQb7/pWU5Rynrpuxg9oF0h3myVhY35Uk45Q/jOK\npS67mYr3PdJCSxsBC69qHE3+\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "clientEmail": "firebase-adminsdk-fbsvc@totostream.iam.gserviceaccount.com"
};

// Firebase Admin Initialize
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const bot = new Telegraf("8257435353:AAFuoWUyTOe6tJk7M1czdFZ1NkQJA1rZR70"); // আপনার বটের টোকেন এখানে দিন

bot.start(async (ctx) => {
  const { id, first_name, last_name, username } = ctx.from;
  const fullName = `${first_name} ${last_name || ''}`.trim();
  
  try {
    const userRef = db.collection('users').doc(id.toString());
    const doc = await userRef.get();

    // যদি নতুন ইউজার হয়, তবে ডাটাবেসে সেভ হবে
    if (!doc.exists) {
      await userRef.set({
        userId: id,
        name: fullName,
        username: username || "guest",
        points: 500, // ওয়েলকাম বোনাস
        referralCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // প্রিমিয়াম ওয়েলকাম মেসেজ
    const welcomeMsg = `
✨ <b>Welcome to Toto Stream, ${first_name}!</b> ✨

আপনার প্রিমিয়াম স্ট্রিমিং একাউন্টটি সফলভাবে সেটআপ করা হয়েছে।

🆔 <b>User ID:</b> <code>${id}</code>
👤 <b>Name:</b> ${fullName}
💰 <b>Bonus:</b> 500 Points added!

নিচের <b>Watch Live</b> বাটনে ক্লিক করে সরাসরি আমাদের মিনি অ্যাপে প্রবেশ করুন এবং খেলা উপভোগ করুন।
    `;

    ctx.replyWithHTML(welcomeMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Watch Live Sports 🚀", web_app: { url: "https://totostream.vercel.app" } }] // আপনার ভার্সেল লিংক দিন
        ]
      }
    });

  } catch (error) {
    console.error("Error creating user:", error);
    ctx.reply("Sorry, something went wrong while setting up your account.");
  }
});

// Vercel handles requests through this
module.exports = async (req, res) => {
  try {
    if (req.body) {
      await bot.handleUpdate(req.body);
    }
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Error');
  }
};
