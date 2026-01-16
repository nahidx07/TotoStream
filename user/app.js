const tg = window.Telegram.WebApp;
tg.expand(); // ফুল স্ক্রিন মোড

const db = firebase.firestore();
let currentUser = null;

// Initialize User
async function initUser() {
    const userData = tg.initDataUnsafe.user;
    if (!userData) {
        alert("Please open from Telegram Bot");
        return;
    }

    const userRef = db.collection('users').doc(userData.id.toString());
    const doc = await userRef.get();

    if (!doc.exists()) {
        // New User & Referral Check
        const urlParams = new URLSearchParams(window.location.search);
        const refBy = urlParams.get('startapp'); // Telegram referral param

        const newUser = {
            userId: userData.id,
            username: userData.username || 'Guest',
            name: `${userData.first_name} ${userData.last_name || ''}`,
            photo: userData.photo_url || '',
            points: 0,
            referralCode: userData.id,
            referredBy: refBy || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await userRef.set(newUser);
        
        // Reward Referrer
        if (refBy) {
            const refUserRef = db.collection('users').doc(refBy);
            await refUserRef.update({
                points: firebase.firestore.FieldValue.increment(1000)
            });
        }
        currentUser = newUser;
    } else {
        currentUser = doc.data();
    }
    
    updateUI();
    loadStreams();
}

function updateUI() {
    document.getElementById('userPoints').innerText = `${currentUser.points} pts`;
}

async function loadStreams() {
    const snapshot = await db.collection('streams').where('status', '==', 'Live').get();
    const container = document.getElementById('streamContainer');
    container.innerHTML = '';

    snapshot.forEach(doc => {
        const stream = doc.data();
        container.innerHTML += `
            <div class="stream-card" onclick="openPlayer('${doc.id}')">
                <div class="thumbnail-container">
                    <img src="${stream.thumbnail}" alt="thumb">
                    <div class="live-badge">LIVE</div>
                </div>
                <div style="padding: 12px;">
                    <h3 style="margin:0; font-size:16px;">${stream.title}</h3>
                </div>
            </div>
        `;
    });
}

function openPlayer(id) {
    window.location.href = `player.html?id=${id}`;
}

initUser();
