<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore-compat.js"></script>
</head>
<body style="padding: 20px; background: #f4f4f4; color: #333;">
    <h2>Toto Admin</h2>
    
    <div class="admin-form" style="background: white; padding: 15px; border-radius: 10px;">
        <h4>Add New Live</h4>
        <input type="text" id="sTitle" placeholder="Match Title">
        <input type="text" id="sThumb" placeholder="Thumbnail Image URL">
        <input type="text" id="sUrl" placeholder="Stream URL (m3u8/Embed)">
        <button onclick="addStream()" style="width: 100%; padding: 10px; background: red; color: white; border: none; border-radius: 5px; margin-top: 10px;">Publish Live</button>
    </div>

    <h3>Active Streams</h3>
    <div id="adminList"></div>

    <script src="../firebase-config.js"></script>
    <script src="admin.js"></script>
</body>
</html>
