document.addEventListener('DOMContentLoaded', () => {
  // Load existing theme
  chrome.storage.sync.get(['customProTheme'], function(data) {
    if (data.customProTheme) {
      document.getElementById('gradColor1').value = data.customProTheme.gradColor1 || '#ff0000';
      document.getElementById('gradColor2').value = data.customProTheme.gradColor2 || '#0000ff';
      document.getElementById('gradAngle').value = data.customProTheme.gradAngle || 45;
      document.getElementById('lyricsColor').value = data.customProTheme.lyricsColor || '#ffffff';
      document.getElementById('shadowColor').value = data.customProTheme.shadowColor || '#ff00ff';
      document.getElementById('animSpeed').value = data.customProTheme.animSpeed || 15;
    }
  });

  // Save Theme
  document.getElementById('saveThemeBtn').addEventListener('click', () => {
    const customTheme = {
      gradColor1: document.getElementById('gradColor1').value,
      gradColor2: document.getElementById('gradColor2').value,
      gradAngle: document.getElementById('gradAngle').value,
      lyricsColor: document.getElementById('lyricsColor').value,
      shadowColor: document.getElementById('shadowColor').value,
      animSpeed: document.getElementById('animSpeed').value
    };

    chrome.storage.sync.set({ 
      customProTheme: customTheme,
      theme: 'custom_pro'
    }, () => {
      alert('Custom Theme Saved and Applied! Refresh Spotify to see changes.');
    });
  });

  // Export Theme
  document.getElementById('exportThemeBtn').addEventListener('click', () => {
    const customTheme = {
      gradColor1: document.getElementById('gradColor1').value,
      gradColor2: document.getElementById('gradColor2').value,
      gradAngle: document.getElementById('gradAngle').value,
      lyricsColor: document.getElementById('lyricsColor').value,
      shadowColor: document.getElementById('shadowColor').value,
      animSpeed: document.getElementById('animSpeed').value
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customTheme));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "custom_lyrics_theme.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

  // Import Theme
  document.getElementById('importThemeBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });

  document.getElementById('importFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const customTheme = JSON.parse(e.target.result);
        if (customTheme.gradColor1) document.getElementById('gradColor1').value = customTheme.gradColor1;
        if (customTheme.gradColor2) document.getElementById('gradColor2').value = customTheme.gradColor2;
        if (customTheme.gradAngle) document.getElementById('gradAngle').value = customTheme.gradAngle;
        if (customTheme.lyricsColor) document.getElementById('lyricsColor').value = customTheme.lyricsColor;
        if (customTheme.shadowColor) document.getElementById('shadowColor').value = customTheme.shadowColor;
        if (customTheme.animSpeed) document.getElementById('animSpeed').value = customTheme.animSpeed;
        
        alert("Theme loaded successfully! Don't forget to click 'Save & Apply Theme'.");
      } catch (err) {
        alert("Invalid theme file.");
      }
    };
    reader.readAsText(file);
  });
});
