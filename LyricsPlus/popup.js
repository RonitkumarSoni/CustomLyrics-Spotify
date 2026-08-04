document.addEventListener("DOMContentLoaded", function () {
  // Mock flag for testing Pro features
  const isProUser = true; 

  // Ad Banner Logic
  const adBanner = document.getElementById('adBanner');
  if (adBanner) {
    if (!isProUser) {
      adBanner.style.display = 'block';
    } else {
      adBanner.style.display = 'none';
    }
  }

  // Get the current colors from the storage
  chrome.storage.sync.get(
    {
      lyricsColor: "",
      inactiveLyricsColor: "",
      backgroundColor: "",
      glowColor: "",
      enableCheckbox: "",
      gradientCheckbox: "",
      glowCheckbox: "",
      karaokeCheckbox: "",
      dualLangCheckbox: "",
      scoringCheckbox: "",
      useCustomLyrics: "",
      autoMoodTheme: "",
      playlistIntegration: "",
      syncFix: "",
      lyricsColorOpacity: "",
      inactiveLyricsColorOpacity: "",
      romanizeLang: "none",
      translateLang: "none",
      fontFamily: "",
      fontWeight: "",
      textAlign: "",
      animatedBg: "none",
      textEffect: "none"
    },
    function (data) {
      document.getElementById("lyricsColor").value = data.lyricsColor;
      document.getElementById("lyricsinactiveColor").value =
        data.inactiveLyricsColor;
      document.getElementById("backgroundColor").value = data.backgroundColor;
      document.getElementById("glowColor").value = data.glowColor;
      //Set checkbox values
      document.getElementById("enableSwitch").checked = data.enableCheckbox;
      document.getElementById("gradientSwitch").checked = data.gradientCheckbox;
      document.getElementById("glowSwitch").checked = data.glowCheckbox;
      document.getElementById("karaokeSwitch").checked = data.karaokeCheckbox;
      document.getElementById("dualLangSwitch").checked = data.dualLangCheckbox;
      document.getElementById("scoringSwitch").checked = data.scoringCheckbox;
      document.getElementById("useCustomLyrics").checked = data.useCustomLyrics;
      document.getElementById("autoMoodTheme").checked = data.autoMoodTheme;
      document.getElementById("playlistIntegration").checked = data.playlistIntegration;
      document.getElementById("syncFix").checked = data.syncFix;
      document.getElementById("lyricsColorOpacity").value =
        data.lyricsColorOpacity;
      document.getElementById("lyricsinactiveColorOpacity").value =
        data.inactiveLyricsColorOpacity;
      if (data.romanizeLang) document.getElementById("romanizeLang").value = data.romanizeLang;
      if (data.translateLang) document.getElementById("translateLang").value = data.translateLang;
      if (data.fontFamily) document.getElementById("fontFamily").value = data.fontFamily;
      if (data.fontWeight) document.getElementById("fontWeight").value = data.fontWeight;
      if (data.textAlign) document.getElementById("textAlign").value = data.textAlign;
      if (data.theme) document.getElementById("themeSelect").value = data.theme;
      if (data.animatedBg) document.getElementById("animatedBg").value = data.animatedBg;
      if (data.textEffect) document.getElementById("textEffect").value = data.textEffect;
      
      if (data.fontFamily === 'custom_upload') {
        document.getElementById("customFontSection").classList.remove("hidden");
      }
    }
  );
  // MOCK PRO FLAG ALREADY DECLARED AT TOP

  document.getElementById("screenshotBtn").addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "takeScreenshot" });
    });
  });

  document.getElementById("textEffect").addEventListener("change", function (e) {
    if (!isProUser && e.target.value !== "none") {
      alert("This is a Pro feature! Upgrade to use Text Effects.");
      e.target.value = "none";
    }
  });

  document.getElementById("fontFamily").addEventListener("change", function (e) {
    const val = e.target.value;
    if (val === 'custom_upload' || val.includes('Pro')) {
      if (!isProUser) {
        alert("This is a Pro feature! Upgrade to use Premium Fonts.");
        e.target.value = "";
        return;
      }
    }
    if (val === 'custom_upload') {
      document.getElementById("customFontSection").classList.remove("hidden");
    } else {
      document.getElementById("customFontSection").classList.add("hidden");
    }
  });

  document.getElementById("customFontUpload").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      const base64Font = evt.target.result;
      chrome.storage.local.set({ customFontData: base64Font }, function() {
        document.getElementById("fontUploadStatus").classList.remove("hidden");
      });
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("dualLangSwitch").addEventListener("change", function(e) {
    if (!isProUser && e.target.checked) {
      alert("This is a Pro feature! Upgrade to use Dual Language Display.");
      e.target.checked = false;
    }
  });

  document.getElementById("scoringSwitch").addEventListener("change", function(e) {
    if (!isProUser && e.target.checked) {
      alert("This is a Pro feature! Upgrade to use Sing-along Scoring.");
      e.target.checked = false;
    }
  });

  document.getElementById("partyLinkBtn").addEventListener("click", function(e) {
    e.preventDefault();
    if (!isProUser) {
      alert("This is a Pro feature! Upgrade to start a Karaoke Party.");
      return;
    }
    const mockLink = "https://lyricsplus.app/party/" + Math.random().toString(36).substring(2, 8);
    navigator.clipboard.writeText(mockLink).then(() => {
      e.target.innerText = "Link Copied!";
      setTimeout(() => e.target.innerText = "Copy Party Link", 2000);
    });
  });

  document.getElementById("useCustomLyrics").addEventListener("change", function(e) {
    if (!isProUser && e.target.checked) {
      alert("This is a Pro feature! Upgrade to use Custom Lyrics.");
      e.target.checked = false;
    }
  });

  document.getElementById("autoMoodTheme").addEventListener("change", function(e) {
    if (!isProUser && e.target.checked) {
      alert("This is a Pro feature! Upgrade to use AI Mood Themes.");
      e.target.checked = false;
    }
  });

  document.getElementById("playlistIntegration").addEventListener("change", function(e) {
    if (!isProUser && e.target.checked) {
      alert("This is a Pro feature! Upgrade to use Playlist Integration.");
      e.target.checked = false;
    }
  });

  document.getElementById("syncFix").addEventListener("change", function(e) {
    if (!isProUser && e.target.checked) {
      alert("This is a Pro feature! Upgrade to use Live Sync Fix.");
      e.target.checked = false;
    }
  });

  document.getElementById("openLyricsEditorBtn").addEventListener("click", function () {
    if (!isProUser) {
      alert("This is a Pro feature! Upgrade to edit custom lyrics.");
      return;
    }
    chrome.tabs.create({ url: chrome.runtime.getURL("lyrics-editor.html") });
  });

  document.getElementById("backupCloudBtn").addEventListener("click", function () {
    if (!isProUser) {
      alert("This is a Pro feature! Upgrade to use Cloud Sync.");
      return;
    }
    const btn = this;
    const originalText = btn.innerText;
    btn.innerText = "⏳ Saving...";
    setTimeout(() => {
      btn.innerText = "✅ Saved!";
      setTimeout(() => { btn.innerText = originalText; }, 2000);
      alert("Success! Your themes and settings have been backed up to the Cloud (Mock).");
    }, 800);
  });

  document.getElementById("restoreCloudBtn").addEventListener("click", function () {
    if (!isProUser) {
      alert("This is a Pro feature! Upgrade to use Cloud Sync.");
      return;
    }
    const btn = this;
    const originalText = btn.innerText;
    btn.innerText = "⏳ Loading...";
    setTimeout(() => {
      btn.innerText = "✅ Restored!";
      setTimeout(() => { btn.innerText = originalText; }, 2000);
      alert("Success! Your themes and settings have been restored from the Cloud (Mock).");
    }, 1200);
  });

  document.getElementById("openWidgetBtn").addEventListener("click", function () {
    if (!isProUser) {
      alert("This is a Pro feature! Upgrade to use the Floating Widget.");
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "openFloatingWidget" });
      }
    });
  });

  document.getElementById("openStatsBtn").addEventListener("click", function () {
    if (!isProUser) {
      alert("This is a Pro feature! Upgrade to view Listening Stats.");
      return;
    }
    chrome.tabs.create({ url: chrome.runtime.getURL("stats.html") });
  });

  document.getElementById("animatedBg").addEventListener("change", function (e) {
    if (!isProUser && e.target.value !== "none") {
      alert("This is a Pro feature! Upgrade to use Animated Backgrounds.");
      e.target.value = "none";
    }
  });

  document.getElementById("openThemeBuilderBtn").addEventListener("click", function () {
    if (!isProUser) {
      alert("This is a Pro feature! Upgrade to build custom themes.");
      return;
    }
    chrome.tabs.create({ url: chrome.runtime.getURL("theme-builder.html") });
  });

  const themes = {
    midnight: { bg: "#0f172a", lyrics: "#38bdf8", inactive: "#64748b", glow: "#38bdf8" },
    sunset: { bg: "#431407", lyrics: "#fdba74", inactive: "#f97316", glow: "#fdba74" },
    ocean: { bg: "#164e63", lyrics: "#67e8f9", inactive: "#06b6d4", glow: "#67e8f9" },
    neon: { bg: "#000000", lyrics: "#f0abfc", inactive: "#c026d3", glow: "#f0abfc" },
    minimal: { bg: "#ffffff", lyrics: "#000000", inactive: "#d1d5db", glow: "#000000" }
  };

  document.getElementById("themeSelect").addEventListener("change", function (e) {
    var themeName = e.target.value;
    if (themes[themeName]) {
      document.getElementById("backgroundColor").value = themes[themeName].bg;
      document.getElementById("lyricsColor").value = themes[themeName].lyrics;
      document.getElementById("lyricsinactiveColor").value = themes[themeName].inactive;
      document.getElementById("glowColor").value = themes[themeName].glow;
    }
  });

  // Save the new colors to the storage when the "save" button is clicked
  document.getElementById("save").addEventListener("click", function () {
    try {
      var lyricsInactiveColor = document.getElementById(
        "lyricsinactiveColor"
      ).value;
      var lyricsColor = document.getElementById("lyricsColor").value;
      var backgroundColor = document.getElementById("backgroundColor").value;
      var glowColor = document.getElementById("glowColor").value;
      var enableCheckbox = document.getElementById("enableSwitch").checked;
      var gradientCheckbox = document.getElementById("gradientSwitch").checked;
      var glowCheckbox = document.getElementById("glowSwitch").checked;
      var karaokeCheckbox = document.getElementById("karaokeSwitch").checked;
      var dualLangCheckbox = document.getElementById("dualLangSwitch").checked;
      var scoringCheckbox = document.getElementById("scoringSwitch").checked;
      var useCustomLyrics = document.getElementById("useCustomLyrics").checked;
      var autoMoodTheme = document.getElementById("autoMoodTheme").checked;
      var playlistIntegration = document.getElementById("playlistIntegration").checked;
      var syncFix = document.getElementById("syncFix").checked;
      var lyricsColorOpacity =
        document.getElementById("lyricsColorOpacity").value;
      var inactiveLyricsColorOpacity = document.getElementById(
        "lyricsinactiveColorOpacity"
      ).value;
      var romanizeLang = document.getElementById("romanizeLang").value;
      var translateLang = document.getElementById("translateLang").value;
      var fontFamily = document.getElementById("fontFamily").value;
      var fontWeight = document.getElementById("fontWeight").value;
      var textAlign = document.getElementById("textAlign").value;
      var themeSelect = document.getElementById("themeSelect").value;
      var animatedBg = document.getElementById("animatedBg").value;
      var textEffect = document.getElementById("textEffect").value;
      chrome.storage.sync.set(
        {
          lyricsColor: lyricsColor,
          inactiveLyricsColor: lyricsInactiveColor,
          backgroundColor: backgroundColor,
          glowColor: glowColor,
          enableCheckbox: enableCheckbox,
          gradientCheckbox: gradientCheckbox,
          glowCheckbox: glowCheckbox,
          karaokeCheckbox: karaokeCheckbox,
          dualLangCheckbox: dualLangCheckbox,
          scoringCheckbox: scoringCheckbox,
          useCustomLyrics: useCustomLyrics,
          autoMoodTheme: autoMoodTheme,
          playlistIntegration: playlistIntegration,
          syncFix: syncFix,
          lyricsColorOpacity: lyricsColorOpacity,
          inactiveLyricsColorOpacity: inactiveLyricsColorOpacity,
          romanizeLang: romanizeLang,
          translateLang: translateLang,
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          textAlign: textAlign,
          theme: themeSelect,
          animatedBg: animatedBg,
          textEffect: textEffect
        },
        function () {
          console.log("Lyrics color is set to " + lyricsColor);
          console.log("Background color is set to " + backgroundColor);

          // Send a message to the content script to refresh the changes
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "refreshColors" });
            }
          );
        }
      );
    } catch (error) {
      //reload the page
      location.reload();
    }
  });
});
