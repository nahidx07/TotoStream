async function addStream() {
    const title = document.getElementById('sTitle').value;
    const thumb = document.getElementById('sThumb').value;
    const url = document.getElementById('sUrl').value;

    if(title && thumb && url) {
        await db.collection('streams').add({
            title, thumbnail: thumb, streamUrl: url, status: 'Live', createdAt: new Date()
        });
        alert("Published!");
        location.reload();
    }
}

async function loadAdminStreams() {
    const list = document.getElementById('adminList');
    const snapshot = await db.collection('streams').get();
    list.innerHTML = '';
    snapshot.forEach(doc => {
        const s = doc.data();
        list.innerHTML += `
            <div style="background:white; margin:10px 0; padding:10px; border-radius:5px; display:flex; justify-content:space-between;">
                <span>${s.title}</span>
                <button onclick="deleteStream('${doc.id}')" style="color:red; border:none; background:none;">Delete</button>
            </div>
        `;
    });
}
loadAdminStreams();

async function deleteStream(id) {
    if(confirm("Are you sure?")) {
        await db.collection('streams').doc(id).delete();
        location.reload();
    }
}
