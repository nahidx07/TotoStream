async function addStream() {
    const title = document.getElementById('sTitle').value;
    const thumb = document.getElementById('sThumb').value;
    const url = document.getElementById('sUrl').value;
    const btn = document.getElementById('addBtn');

    if (!title || !thumb || !url) {
        alert("সবগুলো বক্স পূরণ করুন!");
        return;
    }

    try {
        btn.disabled = true;
        btn.innerText = "Publishing...";

        // Firestore এ ডাটা সেভ করা
        await db.collection('streams').add({
            title: title,
            thumbnail: thumb,
            streamUrl: url,
            status: 'Live',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("সফলভাবে অ্যাড হয়েছে!");
        
        // ইনপুট বক্স খালি করা
        document.getElementById('sTitle').value = '';
        document.getElementById('sThumb').value = '';
        document.getElementById('sUrl').value = '';
        
        loadAdminStreams(); // লিস্ট রিফ্রেশ করা
    } catch (error) {
        console.error("Error adding stream: ", error);
        alert("ভুল হয়েছে: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Publish Now";
    }
}

async function loadAdminStreams() {
    const list = document.getElementById('adminList');
    try {
        const snapshot = await db.collection('streams').orderBy('createdAt', 'desc').get();
        list.innerHTML = '';
        snapshot.forEach(doc => {
            const s = doc.data();
            list.innerHTML += `
                <div style="background:white; margin:10px 0; padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="display:block;">${s.title}</strong>
                        <span style="font-size:12px; color:green;">${s.status}</span>
                    </div>
                    <button onclick="deleteStream('${doc.id}')" style="color:red; background:none; border:none; font-weight:bold;">Delete</button>
                </div>
            `;
        });
    } catch (err) {
        list.innerHTML = "ডাটা লোড হচ্ছে না। আপনার ডাটাবেস চেক করুন।";
    }
}

async function deleteStream(id) {
    if (confirm("আপনি কি এটি ডিলিট করতে চান?")) {
        await db.collection('streams').doc(id).delete();
        loadAdminStreams();
    }
}

// পেজ লোড হলে স্ট্রীম লিস্ট দেখাবে
window.onload = loadAdminStreams;
