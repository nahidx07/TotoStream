const tg = window.Telegram.WebApp;
tg.expand();

let userData = null;

async function initUser() {
    const tgUser = tg.initDataUnsafe.user || { id: 12345, first_name: "Local", last_name: "Test", photo_url: "" };
    const userRef = db.collection('users').doc(tgUser.id.toString());
    const doc = await userRef.get();

    if (!doc.exists()) {
        const urlParams = new URLSearchParams(window.location.search);
        const refBy = urlParams.get('startapp');

        userData = {
            userId: tgUser.id,
            name: `${tgUser.first_name} ${tgUser.last_name || ''}`,
            username: tgUser.username || "guest",
            photo: tgUser.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            points: 0,
            referralCount: 0,
            referredBy: refBy || null
        };
        await userRef.set(userData);

        if (refBy) {
            await db.collection('users').doc(refBy).update({
                points: firebase.firestore.FieldValue.increment(1000),
                referralCount: firebase.firestore.FieldValue.increment(1)
            });
        }
    } else {
        userData = doc.data();
    }
    document.getElementById('topPoints').innerText = `${userData.points} pts`;
}

async function loadHomeStreams() {
    const grid = document.getElementById('streamGrid');
    const snapshot = await db.collection('streams').where('status', '==', 'Live').get();
    grid.innerHTML = '';

    snapshot.forEach(doc => {
        const s = doc.data();
        grid.innerHTML += `
            <div class="stream-card" onclick="location.href='player.html?id=${doc.id}'">
                <div class="thumb-wrap">
                    <img src="${s.thumbnail}">
                    <div class="badge-live">LIVE</div>
                </div>
                <div class="stream-info">
                    <h3 style="margin:0; font-size:16px;">${s.title}</h3>
                </div>
            </div>
        `;
    });
}
