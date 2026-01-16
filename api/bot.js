const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');

// আপনার প্রাইভেট কি টিকে হুবহু ফায়ারবেস ফাইলের মতো ব্যাকটিক্স দিয়ে সাজানো হয়েছে
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCptREbKFE/G/oW
C0MAA2dGkp5Ne/IBg7YRDMdvDygEY4ulBMz/X3DcsSsJ0xs9uJG74912HWKwevBW
QkyMM1aB/+BXAVreq+B8TVTESa4Efri4AW3IjuzKDFH/eKrFyineh6u68MX1pm18
SQRTzYkiD+dLEw+ZGwZx/uHX8751R3FKyepf0f3qnzJyH91q0bdJXRWJQKLR/kOc
SrhejbHIXDNBOVAATvha8KFSZFYL0e+yUE6CmfE9tzKl421zdSsXgpl437KRIJiR
ip+OJlBB8VNGUwmqMXz1J4hC5HIMl8U6iByGpdc+9BRPQJKg7LO5wCyehGHsCy/z
ZGyAWQOxAgMBAAECggEABG2YstXxHDydaRTW4M8LQkCFVPqU2nlUbs79pzDV4k4Z
cM0WgCACkbiuIRu7E80slm9zXKNBuADv3zQOQxGV2/iUmlXo8tm47Cq524ikgBAg
JbILDIYCuPcOMvFFDu1GMFaSHkGCqmxmHc+WD+LtBWXf1Z9ZZq0mR7y5ISModhnE
AmjS6okz8I9BkCzYloaOrEi6rLN2zwDLZpbgwDfCMwYzdhVmtoYZJ/trAwkXTuZ7
mNGtO8WgV1NdSECRlqne3TznYK1GfDXrvIaLcmOsb60qKF9IlMm6VqJdZjgUBpQ3
YlT2C7MSyD4h/JVx7Q9OOGpAnfCdIGYYiHgK1crLxwKBgQDU3aIM69Ni0QFxm+rY
ePoVGqKvbtqV6HiA6zrzSrawokERdCsCHrpkOsll8SyA1Dm6mFUT74Pp8LeMDNNg
DzScaaDd1rl3iSg32Lc8M9hAaJawzLFKvQyX3vdwxWQONQNzlN7CK1bD+6uv4Zr5
6Ve8C0iu8ETDrV66vPFNIm6L5wKBgQDMGJj31QPrRcUOrGsMWrVqjlli63xBVCbV
CvjxnsoSishHFGu0mtLCSt9zD9fbDAWY2C4cTU4C2MWnbHztKlPcL2BJNP8oiirg
SxmajcKnMCCy5vXAiE6CQd8G0g7fSj3rfxNsDXwLVgdPr859Sl4b074IMEcDem1s
JBCNJm5ApwKBgQC3DIQ/Aki8MClCrias0pOTtFzz6ar0wH1nt2DxOG2TxWOZA8G8
R/pXGKp6DIQNoPKnwDlhNFXGxebA+4KFl23Rl4/rVKwW3A6Gv8kKbzbmZEo5bTyE
nb+HlghIpKXfBb2bFgjdBnHNhM1mKOahRATbQwTU0u7/KkZM5Q/IGfTgPwKBgQCz
gzMQUMjop+5CEL77F9GXTmsqiWs53rVlDwiVJJAhrPWpJznwmXikscxF3PqDzNgj
boloFUp3UIjQ0Kg0xdUKxpTO7xE6bAR4UTXM7cD24mrwUBp5ZKqBAUUUL7ArD5bU
ymmf0WB4bAt0OHLLWpzZpuzvMN9VHNqfkj0ImXPB4wKBgGVkma3NFEywiyapIsNg
978W7bbUx6j4UyO0D8VfLTTsM0uW45J+Z+MTVpPyfZ3c2CHtGAjps6bPvcVOFfRT
Xxt+LRA+GJb3dTHva2sRG18eofQb7/pWU5Rynrpuxg9oF0h3myVhY35Uk45Q/jOK
pS67mYr3PdJCSxsBC69qHE3+
-----END PRIVATE KEY-----`;

// Firebase Admin Initialize
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "totostream",
      clientEmail: "firebase-adminsdk-fbsvc@totostream.iam.gserviceaccount.com",
      privateKey: privateKey // কোনো replace এর দরকার নেই, ব্যাকটিক্স নিজে থেকেই হ্যান্ডেল করবে
    })
  });
}

const db = admin.firestore();
const bot = new Telegraf("8257435353:AAFuoWUyTOe6tJk7M1czdFZ1NkQJA1rZR70"); // আপনার সঠিক বটের টোকেন

bot.start(async (ctx) => {
  const { id, first_name, last_name, username } = ctx.from;
  const fullName = `${first_name} ${last_name || ''}`.trim();
  const refBy = ctx.startPayload; // রেফারেল আইডি যদি থাকে

  try {
    const userRef = db.collection('users').doc(id.toString());
    const doc = await userRef.get();

    if (!doc.exists) {
        // নতুন ইউজার একাউন্ট তৈরি
        const photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=CCF02F&color=000&size=128`;
        
        await userRef.set({
          userId: id,
          name: fullName,
          username: username || "guest",
          photo: photoUrl,
          points: 500, // ওয়েলকাম বোনাস
          referralCount: 0,
          email: "",
          phone: "",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // যদি কেউ রেফারেলের মাধ্যমে আসে (৫০০ পয়েন্ট বোনাস)
        if (refBy && refBy !== id.toString()) {
          const referrerRef = db.collection('users').doc(refBy);
          await referrerRef.update({
            points: admin.firestore.FieldValue.increment(500),
            referralCount: admin.firestore.FieldValue.increment(1)
          });
        }
    }

    const msg = `🚀 <b>Toto Stream Activated!</b>\n\n👤 <b>Name:</b> ${fullName}\n💰 <b>Balance:</b> 500 Points Added!\n\nলাইভ খেলা দেখতে নিচের বাটনে ক্লিক করুন।`;

    await ctx.replyWithHTML(msg, {
      reply_markup: {
        inline_keyboard: [[{ text: "Watch Live ⚽", web_app: { url: "https://totostream.vercel.app" } }]]
      }
    });
  } catch (error) {
    console.error("Bot Error:", error);
  }
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error');
    }
  } else {
    res.status(200).send('Bot Status: Online');
  }
};
