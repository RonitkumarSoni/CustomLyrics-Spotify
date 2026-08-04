document.addEventListener('DOMContentLoaded', () => {
  const textArea = document.getElementById('customLyricsText');
  const speedSlider = document.getElementById('scrollSpeed');
  const speedValue = document.getElementById('speedValue');

  // Load existing
  chrome.storage.local.get(['customLyricsData', 'customLyricsSpeed'], function(data) {
    if (data.customLyricsData) {
      textArea.value = data.customLyricsData;
    }
    if (data.customLyricsSpeed) {
      speedSlider.value = data.customLyricsSpeed;
      speedValue.innerText = data.customLyricsSpeed + 's';
    }
  });

  speedSlider.addEventListener('input', (e) => {
    speedValue.innerText = e.target.value + 's';
  });

  // Save
  document.getElementById('saveLyricsBtn').addEventListener('click', () => {
    chrome.storage.local.set({ 
      customLyricsData: textArea.value,
      customLyricsSpeed: speedSlider.value
    }, () => {
      alert('Custom Lyrics Saved! Make sure to enable the override toggle in the extension popup.');
    });
  });

  // Clear
  document.getElementById('clearBtn').addEventListener('click', () => {
    if(confirm('Clear custom lyrics?')) {
      textArea.value = '';
      chrome.storage.local.remove(['customLyricsData']);
    }
  });
});
