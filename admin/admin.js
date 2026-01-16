const ADMIN_IDS = [12345678, 98765432]; // আপনার নিজের টেলিগ্রাম আইডি দিন

function checkAdmin() {
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    if (!ADMIN_IDS.includes(tgUser.id)) {
        document.body.innerHTML = "<h1>Access Denied!</h1>";
        return;
    }
    loadAdminDashboard();
}

// এডমিন ড্যাশবোর্ডে স্ট্রিম অ্যাড করার ফাংশন
async function addStream(title, thumb, url) {
    await db.collection('streams').add({
        title,
        thumbnail: thumb,
        streamUrl: url,
        status: 'Live',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Stream Added Successfully!");
}
