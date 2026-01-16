const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');

// Firebase Admin Setup (আপনার Service Account JSON ডাটা এখানে বসান)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "YOUR_PROJECT_ID",
      clientEmail: "YOUR_CLIENT_EMAIL",
      privateKey: "YOUR_PRIVATE_KEY".replace(/\\n/g, '\n')
    })
  });
}
const db = admin.firestore();
const bot = new Telegraf("YOUR_BOT_TOKEN");

bot.start(async (ctx) => {
  const { id, first_name, username, photo_url } = ctx.from;
  const userRef = db.collection('users').doc(id.toString());
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      userId: id,
      name: first_name,
      username: username || "guest",
      photo: photo_url || "",
      points: 500, // ওয়েলকাম বোনাস
      referralCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  ctx.replyWithHTML(`<b>স্বাগতম ${first_name}!</b>\n\nআপনার একাউন্ট তৈরি হয়ে গেছে।\n🆔 <b>ID:</b> <code>${id}</code>\n👤 <b>Name:</b> ${first_name}\n\nনিচের বাটনে ক্লিক করে লাইভ খেলা দেখুন এবং পয়েন্ট আয় করুন।`, {
    reply_markup: {
      inline_keyboard: [[{ text: "Open Mini App 🚀", web_app: { url: "https://your-vercel-link.vercel.app" } }]]
    }
  });
});

module.exports = async (req, res) => {
  await bot.handleUpdate(req.body);
  res.status(200).send('ok');
};
