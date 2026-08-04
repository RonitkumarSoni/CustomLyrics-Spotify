//const defult color
const isRunning = false;
const koreanRomaji = require("@romanize/korean");
const { pinyin } = require("pinyin-pro");
const wanakana = require("wanakana");
const { romanize } = require("@pcampus/thai-romanization");

function romanizeLyrics(lang) {
  console.log("Romanizing for lang: " + lang);
  var lyrics = document.querySelectorAll(".BXlQFspJp_jq9SKhUSP3");
  lyrics.forEach((element) => {
    var text = element.textContent;
    var romanizedText = text;
    if (lang === "korean") {
      romanizedText = koreanRomaji.romanize(text);
    } else if (lang === "japanese") {
      romanizedText = wanakana.toRomaji(text);
    } else if (lang === "chinese") {
      romanizedText = pinyin(text, { toneType: 'none' });
    } else if (lang === "thai") {
      romanizedText = romanize(text);
    }
    
    // Check if dual language display is enabled
    chrome.storage.sync.get(['dualLangCheckbox'], function(data) {
      if (data.dualLangCheckbox) {
        element.innerHTML = `${text}<br><span style="font-size:0.6em;opacity:0.8;">${romanizedText}</span>`;
      } else {
        element.textContent = romanizedText;
      }
    });
  });
}

async function translateLyrics(lang) {
  console.log("Translating to lang: " + lang);
  var lyrics = document.querySelectorAll(".BXlQFspJp_jq9SKhUSP3:not([data-translated='true'])");
  for (let element of lyrics) {
    let originalText = element.childNodes[0] ? element.childNodes[0].textContent : element.textContent;
    if (originalText.trim() === "") {
        element.dataset.translated = "true";
        continue;
    }
    
    if (element.querySelector('.lyric-translation')) continue;
    element.dataset.translated = "true";

    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(originalText)}`);
      const data = await res.json();
      let translatedText = data[0][0][0];
      
      let span = document.createElement("div");
      span.className = "lyric-translation";
      span.style.fontSize = "0.5em";
      span.style.opacity = "0.8";
      span.style.marginTop = "5px";
      span.textContent = translatedText;
      
      element.appendChild(span);
    } catch (err) {
      console.error("Translation error:", err);
    }
  }
}

if (window.location.href.includes("open.spotify.com/lyrics")) {
  // Select the node that will be observed for mutations
  var targetNode = document.body;

  // Options for the observer (which mutations to observe)
  var config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  var callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Run your code here
        ActivateLyrics();
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function ActivateLyrics() {
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
      animatedBg: "none",
      textEffect: "none",
      fontFamily: "",
      fontWeight: "",
      textAlign: "",
      theme: "",
      customProTheme: {}
    },
    function (data) {
      inactiveLyricsColor = data.inactiveLyricsColor;
      lyricsColor = data.lyricsColor;
      if (data.enableCheckbox) {
        // If the current URL is spotify.com
        if (window.location.href.includes("open.spotify.com/lyrics")) {
          if (!data.useCustomLyrics && data.romanizeLang && data.romanizeLang !== "none") {
            romanizeLyrics(data.romanizeLang);
          }
          // ==== CUSTOM LYRICS OVERRIDE ====
          if (data.useCustomLyrics) {
            chrome.storage.local.get(['customLyricsData', 'customLyricsSpeed'], function(localData) {
              if (localData.customLyricsData) {
                let spotifyLyricsContainer = document.querySelector(".BXlQFspJp_jq9SKhUSP3");
                if (spotifyLyricsContainer) {
                  // Clear Spotify's lyrics
                  spotifyLyricsContainer.innerHTML = '';
                  
                  // Create our custom lyrics container
                  let customContainer = document.createElement("div");
                  let speed = localData.customLyricsSpeed || 60;
                  
                  customContainer.innerHTML = `
                    <style>
                      @keyframes autoScrollLyrics {
                        0% { transform: translateY(100vh); }
                        100% { transform: translateY(-150%); }
                      }
                      .custom-lyrics-wrapper {
                        width: 100%; height: 100vh; overflow: hidden; position: relative;
                        display: flex; justify-content: center;
                      }
                      .custom-lyrics-text {
                        font-size: 40px; font-weight: bold; line-height: 1.5;
                        text-align: center; white-space: pre-wrap;
                        animation: autoScrollLyrics ${speed}s linear infinite;
                      }
                    </style>
                    <div class="custom-lyrics-wrapper">
                      <div class="custom-lyrics-text nw6rbs8R08fpPn7RWW2w EhKgYshvOwpSrTv399Mw">${localData.customLyricsData}</div>
                    </div>
                  `;
                  spotifyLyricsContainer.appendChild(customContainer);
                }
              }
            });
            // We still let the rest of the styles apply to our `.nw6rbs8R08fpPn7RWW2w` elements
          }

          // ==== PLAYLIST INTEGRATION (MOCK UI) ====
          if (data.playlistIntegration) {
            if (!document.querySelector('#lyrics-recommendations-panel')) {
              let panel = document.createElement("div");
              panel.id = "lyrics-recommendations-panel";
              panel.innerHTML = `
                <style>
                  #lyrics-recommendations-panel {
                    position: fixed; bottom: 30px; right: 30px; width: 300px;
                    background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
                    padding: 15px; color: white; z-index: 99999;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family: sans-serif;
                  }
                  .rec-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #1DB954; }
                  .rec-song { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 5px; opacity: 0.8; }
                  .rec-btn {
                    width: 100%; padding: 8px; margin-top: 10px; border-radius: 20px;
                    background: #1DB954; color: black; font-weight: bold; font-size: 12px;
                    border: none; cursor: pointer; transition: transform 0.1s;
                  }
                  .rec-btn:hover { transform: scale(1.02); background: #1ed760; }
                </style>
                <div class="rec-title">✨ Songs with Similar Lyrics</div>
                <div class="rec-song"><span>1. Starboy</span><span style="font-size: 10px;">88% match</span></div>
                <div class="rec-song"><span>2. Save Your Tears</span><span style="font-size: 10px;">76% match</span></div>
                <div class="rec-song"><span>3. Die For You</span><span style="font-size: 10px;">65% match</span></div>
                <button class="rec-btn" id="createPlaylistBtn">Auto-create Mood Playlist</button>
              `;
              document.body.appendChild(panel);
              
              document.getElementById("createPlaylistBtn").addEventListener("click", () => {
                alert("Success! Mood-based playlist 'Late Night Vibes' has been added to your Spotify account! (Mock UI)");
              });
            }
          } else {
            let existingPanel = document.querySelector('#lyrics-recommendations-panel');
            if(existingPanel) existingPanel.remove();
          }

          // ==== LIVE SYNC FIX (MOCK UI) ====
          if (data.syncFix) {
            if (!document.querySelector('#lyrics-sync-panel')) {
              let syncPanel = document.createElement("div");
              syncPanel.id = "lyrics-sync-panel";
              syncPanel.innerHTML = `
                <style>
                  #lyrics-sync-panel {
                    position: fixed; top: 120px; right: 30px; width: 220px;
                    background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
                    padding: 15px; color: white; z-index: 99999;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family: sans-serif;
                    text-align: center;
                  }
                  .sync-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #facc15; }
                  .sync-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
                  .sync-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: #374151; color: white; font-weight: bold; font-size: 20px;
                    border: none; cursor: pointer; transition: background 0.1s;
                  }
                  .sync-btn:hover { background: #4b5563; }
                  #sync-offset-val { font-size: 18px; font-weight: bold; font-variant-numeric: tabular-nums; }
                  #sync-toast { font-size: 11px; color: #a7f3d0; opacity: 0; transition: opacity 0.3s; margin-top: 5px; }
                </style>
                <div class="sync-title">🎙️ Live Sync Fix</div>
                <div class="sync-controls">
                  <button class="sync-btn" id="sync-minus">-</button>
                  <div id="sync-offset-val">0.0s</div>
                  <button class="sync-btn" id="sync-plus">+</button>
                </div>
                <div id="sync-toast">Offset Updated!</div>
              `;
              document.body.appendChild(syncPanel);
              
              let currentOffset = 0.0;
              let toastTimeout;
              const offsetDisplay = document.getElementById('sync-offset-val');
              const syncToast = document.getElementById('sync-toast');
              
              const updateOffset = (change) => {
                currentOffset += change;
                offsetDisplay.innerText = (currentOffset > 0 ? "+" : "") + currentOffset.toFixed(1) + "s";
                
                syncToast.style.opacity = 1;
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => { syncToast.style.opacity = 0; }, 1500);
              };

              document.getElementById("sync-minus").addEventListener("click", () => updateOffset(-0.5));
              document.getElementById("sync-plus").addEventListener("click", () => updateOffset(0.5));
            }
          } else {
            let existingSync = document.querySelector('#lyrics-sync-panel');
            if(existingSync) existingSync.remove();
          }

          if (data.translateLang && data.translateLang !== "none" && !data.useCustomLyrics) {
            translateLyrics(data.translateLang);
          }
          let lyricsColorRgb = hexToRgb(data.lyricsColor);
          let inactiveLyricsColorRgb = hexToRgb(data.inactiveLyricsColor);
          let finalLyricsColor = data.lyricsColor;
          let finalInactiveColor = data.inactiveLyricsColor;
          
          let moodDivHTML = '';
          let extraMoodCSS = '';
          
          if (data.autoMoodTheme) {
            const moods = ['Sad', 'Happy', 'Romantic', 'Energetic'];
            const activeMood = moods[Math.floor(Math.random() * moods.length)];
            
            data.theme = 'midnight'; // fallback basic theme
            data.gradientCheckbox = true; // force gradient
            
            if (activeMood === 'Sad') {
              data.backgroundColor = '#0f172a';
              data.lyricsColor = '#60a5fa';
              extraMoodCSS = `
                @keyframes fall { to { transform: translateY(100vh); } }
                .mood-particles { position: absolute; top: -50px; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
                .rain-drop { position: absolute; width: 2px; height: 40px; background: rgba(255,255,255,0.4); animation: fall linear infinite; }
              `;
              moodDivHTML = `<div class="mood-particles">${Array.from({length:40}).map(()=>`<div class="rain-drop" style="left:${Math.random()*100}%; animation-duration:${0.5+Math.random()}s; animation-delay:${Math.random()}s;"></div>`).join('')}</div>`;
            } else if (activeMood === 'Happy') {
              data.backgroundColor = '#f97316';
              data.lyricsColor = '#fef08a';
              extraMoodCSS = `
                @keyframes float-confetti { 0% { transform: translateY(0) rotate(0); } 100% { transform: translateY(100vh) rotate(360deg); } }
                .mood-particles { position: absolute; top: -50px; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
                .confetti { position: absolute; width: 10px; height: 10px; animation: float-confetti linear infinite; }
              `;
              const colors = ['#fde047', '#86efac', '#67e8f9', '#f9a8d4', '#ffffff'];
              moodDivHTML = `<div class="mood-particles">${Array.from({length:50}).map(()=>`<div class="confetti" style="left:${Math.random()*100}%; background:${colors[Math.floor(Math.random()*colors.length)]}; animation-duration:${2+Math.random()*2}s; animation-delay:${Math.random()*2}s;"></div>`).join('')}</div>`;
            } else if (activeMood === 'Romantic') {
              data.backgroundColor = '#9f1239';
              data.lyricsColor = '#fbcfe8';
              extraMoodCSS = `
                @keyframes float-up { 0% { transform: translateY(100vh) scale(0.5); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(-100px) scale(1.5); opacity: 0; } }
                .mood-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 9999; }
                .heart { position: absolute; color: rgba(255,192,203,0.7); font-size: 28px; animation: float-up linear infinite; bottom: -50px; }
              `;
              moodDivHTML = `<div class="mood-particles">${Array.from({length:25}).map(()=>`<div class="heart" style="left:${Math.random()*100}%; animation-duration:${4+Math.random()*4}s; animation-delay:${Math.random()*3}s;">❤️</div>`).join('')}</div>`;
            } else if (activeMood === 'Energetic') {
              data.backgroundColor = '#000000';
              data.lyricsColor = '#d946ef';
              extraMoodCSS = `
                @keyframes pulse-bg { 0%, 100% { background: #000; } 50% { background: #1a001a; } }
                .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw { animation: energetic-pulse 0.4s infinite alternate !important; }
                @keyframes energetic-pulse { from { text-shadow: 0 0 10px #d946ef; transform: scale(1); } to { text-shadow: 0 0 30px #d946ef, 0 0 50px #d946ef; transform: scale(1.05); } }
              `;
            }
            
            // Re-calculate after mood override
            lyricsColorRgb = hexToRgb(data.lyricsColor);
            finalLyricsColor = data.lyricsColor;
          }

          if (data.theme === 'custom_pro' && data.customProTheme) {
            finalLyricsColor = data.customProTheme.lyricsColor || data.lyricsColor;
          }

          let lyricsColorRgba = `rgba(${lyricsColorRgb.r}, ${lyricsColorRgb.g}, ${lyricsColorRgb.b}, ${data.lyricsColorOpacity})`;
          let inactiveLyricsColorRgba = `rgba(${inactiveLyricsColorRgb.r}, ${inactiveLyricsColorRgb.g}, ${inactiveLyricsColorRgb.b}, ${data.inactiveLyricsColorOpacity})`;

          var element = document.querySelector(".FUYNhisXTCmbzt9IDxnT");
          if (element) {
            var style = document.createElement("style");
            style.innerHTML = `
              .FUYNhisXTCmbzt9IDxnT {
                color: ${finalLyricsColor};
                --lyrics-color-active: ${lyricsColorRgba};
                --lyrics-color-inactive: ${inactiveLyricsColorRgba};
                --lyrics-color-passed: ${inactiveLyricsColorRgba};
                --lyrics-color-background: ${data.backgroundColor};
                --lyrics-color-messaging: rgb(0, 0, 0);
              }
            `;
            document.head.appendChild(style);
            // element.style.setProperty("--lyrics-color-active", lyricsColorRgba);
            // element.style.setProperty(
            //   "--lyrics-color-inactive",
            //   inactiveLyricsColorRgba
            // );
            // element.style.setProperty(
            //   "--lyrics-color-passed",
            //   inactiveLyricsColorRgba
            // );
            // element.style.setProperty(
            //   "--lyrics-color-background",
            //   data.backgroundColor
            // );
            // element.style.setProperty(
            //   "--lyrics-color-messaging",
            //   "rgb(0, 0, 0)"
            // );
            // element.style.setProperty("text-align", "center");
          }

          //if gradient is enabled, create style element and add gradient animation

          if (data.theme === 'custom_pro' && data.customProTheme) {
            var ct = data.customProTheme;
            var style = document.createElement("style");
            style.innerHTML = `
              @keyframes gradientCustom {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .o4GE4jG5_QICak2JK_bn {
                background: linear-gradient(${ct.gradAngle}deg, ${ct.gradColor1}, ${ct.gradColor2});
                background-size: 400% 400%;
                animation: gradientCustom ${ct.animSpeed}s ease infinite;
                height: 100vh;
              }
              .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw {
                text-shadow: 0 0 10px ${ct.shadowColor}, 0 0 20px ${ct.shadowColor} !important;
                color: ${ct.lyricsColor} !important;
              }
            `;
            document.head.appendChild(style);
          } else if (data.gradientCheckbox) {
            var style = document.createElement("style");
            style.innerHTML = `
              @keyframes gradient {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
              .o4GE4jG5_QICak2JK_bn {
                background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                background-size: 400% 400%;
                animation: gradient 15s ease infinite;
                height: 100vh;
              }
            `;
            document.head.appendChild(style);
          }
          if (data.gradientCheckbox == false && data.animatedBg !== "album_blur" && data.animatedBg !== "particles") {
            var style = document.createElement("style");
            style.innerHTML = `
              .o4GE4jG5_QICak2JK_bn {
                background: ${data.backgroundColor};
              }
            `;
            document.head.appendChild(style);
          }

          if (data.animatedBg === "album_blur") {
            var coverArt = document.querySelector('img[data-testid="cover-art-image"]');
            var bgUrl = coverArt ? coverArt.src : "";
            var style = document.createElement("style");
            style.innerHTML = `
              .o4GE4jG5_QICak2JK_bn {
                background-image: url('${bgUrl}') !important;
                background-size: cover !important;
                background-position: center !important;
              }
              .gqaWFmQeKNYnYD5gRv3x {
                backdrop-filter: blur(40px) brightness(0.6) !important;
                background-color: rgba(0,0,0,0.3) !important;
              }
            `;
            document.head.appendChild(style);
          } else if (data.animatedBg === "particles") {
            var style = document.createElement("style");
            style.innerHTML = `
              @keyframes floatUp {
                0% { transform: translateY(100vh) scale(0); opacity: 1; }
                100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
              }
              .o4GE4jG5_QICak2JK_bn::before {
                content: '';
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background-image: radial-gradient(#fff 1px, transparent 1px);
                background-size: 50px 50px;
                animation: floatUp 15s linear infinite;
                opacity: 0.3;
                pointer-events: none;
              }
              .o4GE4jG5_QICak2JK_bn {
                background: ${data.backgroundColor};
                position: relative;
                overflow: hidden;
              }
            `;
            document.head.appendChild(style);
          }

          // TEXT EFFECTS
          if (data.textEffect && data.textEffect !== "none") {
            var effectStyle = document.createElement("style");
            if (data.textEffect === "rainbow") {
              effectStyle.innerHTML = `
                @keyframes rainbowText {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw {
                  background: linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
                  background-size: 200% 100%;
                  -webkit-background-clip: text;
                  color: transparent !important;
                  animation: rainbowText 3s linear infinite !important;
                }
              `;
            } else if (data.textEffect === "neon") {
              effectStyle.innerHTML = `
                .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw {
                  color: #fff !important;
                  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de, 0 0 55px #ff00de !important;
                }
              `;
            } else if (data.textEffect === "3d") {
              effectStyle.innerHTML = `
                .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw {
                  color: #fff !important;
                  text-shadow: 1px 1px 0 #ccc, 2px 2px 0 #c9c9c9, 3px 3px 0 #bbb, 4px 4px 0 #b9b9b9, 5px 5px 0 #aaa, 6px 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 1px 1px 3px rgba(0,0,0,.3), 3px 3px 5px rgba(0,0,0,.2), 5px 5px 10px rgba(0,0,0,.25), 10px 10px 10px rgba(0,0,0,.2), 20px 20px 20px rgba(0,0,0,.15) !important;
                }
              `;
            }
            document.head.appendChild(effectStyle);
          }

          //if glow is enabled, create style element and add glow animation

          if (data.glowCheckbox) {
            var style = document.createElement("style");
            style.innerHTML = `
              @keyframes glow {
                0% {
                  text-shadow: 0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.2), 0 0 15px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2);
                }
                50% {
                  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5);
                }
                100% {
                  text-shadow: 0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.2), 0 0 15px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2);
                }
              }

              .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw{
                --lyrics-color-active: ${data.lyricsColor};
                animation: glow 2s infinite;
                font-weight: 900;
                opacity: 1;
              }
              `;
            document.head.appendChild(style);
          }

          if (data.karaokeCheckbox) {
            var style = document.createElement("style");
            style.innerHTML = `
              @keyframes karaokeSweep {
                0% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw {
                background: linear-gradient(to right, ${data.lyricsColor} 50%, ${inactiveLyricsColorRgba} 50%);
                background-size: 200% 100%;
                background-position: 100% 50%;
                -webkit-background-clip: text;
                color: transparent !important;
                animation: karaokeSweep 4s linear forwards;
                position: relative;
              }
              .nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw::before {
                content: '🎤';
                position: absolute;
                left: -40px;
                animation: bounce 0.5s infinite alternate;
              }
              @keyframes bounce {
                from { transform: translateY(0); }
                to { transform: translateY(-10px); }
              }
            `;
            document.head.appendChild(style);
          }

          if (data.scoringCheckbox) {
            let scoreContainer = document.getElementById("mockScoreboard");
            if (!scoreContainer) {
              scoreContainer = document.createElement("div");
              scoreContainer.id = "mockScoreboard";
              scoreContainer.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                background: rgba(0,0,0,0.8); border: 2px solid #ff00ff;
                border-radius: 10px; padding: 15px; color: #fff;
                font-family: monospace; font-size: 24px; text-shadow: 0 0 10px #ff00ff;
                display: flex; flex-direction: column; align-items: flex-end;
              `;
              scoreContainer.innerHTML = `<div>SCORE: <span id="mScore">0</span></div><div style="font-size:16px; color:#0ff;">COMBO: x<span id="mCombo">1</span></div>`;
              document.body.appendChild(scoreContainer);

              // Mock score loop
              setInterval(() => {
                let sElem = document.getElementById("mScore");
                let cElem = document.getElementById("mCombo");
                if (sElem && document.querySelector(".nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw")) {
                  let currentCombo = parseInt(cElem.innerText);
                  if (Math.random() > 0.3) {
                    sElem.innerText = parseInt(sElem.innerText) + (100 * currentCombo);
                    cElem.innerText = currentCombo < 10 ? currentCombo + 1 : currentCombo;
                  } else if (Math.random() > 0.8) {
                    cElem.innerText = "1"; // combo break
                  }
                }
              }, 2000);
            }
          }

          // Create a new style element
          var style = document.createElement("style");
          // Add CSS rules to the style element. You can replace the CSS inside the backticks with your own.
          let fontStyles = "";
          
          if (data.fontFamily) {
            if (data.fontFamily === 'custom_upload') {
              chrome.storage.local.get(['customFontData'], function(result) {
                if (result.customFontData) {
                  // Inject Mood particles if they exist
                  if (moodDivHTML) {
                    if (!document.querySelector('.mood-particles')) {
                      document.body.insertAdjacentHTML('beforeend', moodDivHTML);
                    }
                  }

                  let customStyle = document.createElement("style");
                  customStyle.innerHTML = `
                    @font-face {
                      font-family: 'UploadedCustomFont';
                      src: url(${result.customFontData});
                    }
                    .nw6rbs8R08fpPn7RWW2w { font-family: 'UploadedCustomFont' !important; }
                  `;
                  document.head.appendChild(customStyle);
                }
              });
            } else {
              // Inject Google Fonts link for Pro fonts
              if (data.fontFamily.includes('Dancing Script')) {
                document.head.insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">');
              } else if (data.fontFamily.includes('Oswald')) {
                document.head.insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap" rel="stylesheet">');
              } else if (data.fontFamily.includes('Pacifico')) {
                document.head.insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">');
              } else if (data.fontFamily.includes('Cinzel')) {
                document.head.insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">');
              } else if (data.fontFamily.includes('Righteous')) {
                document.head.insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet">');
              }
              fontStyles += `\n              font-family: ${data.fontFamily.replace(' (Pro 🔒)', '')} !important;`;
            }
          }

          if (data.fontWeight) fontStyles += `\n              font-weight: ${data.fontWeight} !important;`;
          if (data.textAlign) fontStyles += `\n              text-align: ${data.textAlign} !important;`;
          
          style.innerHTML = `
            ${typeof extraMoodCSS !== 'undefined' ? extraMoodCSS : ''}
            
            .nw6rbs8R08fpPn7RWW2w.aeO5D7ulxy19q4qNBrkk {
              opacity: 0.2;
            }
            .nw6rbs8R08fpPn7RWW2w {
              margin-top: 80px !important;
              font-size: 60px !important;${fontStyles}
            }

            .gqaWFmQeKNYnYD5gRv3x {
              grid-area: 1 / 1 / -1 / -1;
              width: 100%;
              -webkit-box-align: center;
              -ms-flex-align: center;
              background-size: contain;
              overflow: hidden;
              backdrop-filter: blur(22px);
              height: -webkit-fill-available;
            }
            .gqaWFmQeKNYnYD5gRv3x ._Wna90no0o0dta47Heiw {
              font-size: 2rem;
              font-weight: 300;
              align-self: center;
              overflow: hidden;
              height: 55vh;
              margin-top: 10vh;
            }

            .nw6rbs8R08fpPn7RWW2w.vapgYYF2HMEeLJuOWGq5 {
              opacity: 0.2 !important;
            }
          `;

          // Append the style element to the head of the document
          document.head.appendChild(style);
          
          if (typeof moodDivHTML !== 'undefined' && moodDivHTML !== '') {
            if (!document.querySelector('.mood-particles')) {
              document.body.insertAdjacentHTML('beforeend', moodDivHTML);
            }
          }

          if (!isRunning) {
            setInterval(ResetOpacity, 300);
            // Set the active color
            setInterval(SetActiveColor, 320);

            isRunning = true;
          }
        }
      }
    }
  );
}

function SetActiveColor() {
  var element = document.querySelector(
    ".nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw"
  );
  if (element) {
    element.style.setProperty("opacity", "1");
    //text size
    element.style.setProperty("font-size", "80px");

    //wiggle effect
  }
}
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function ResetOpacity() {
  var elements = document.querySelectorAll(
    ".nw6rbs8R08fpPn7RWW2w.vapgYYF2HMEeLJuOWGq5.aeO5D7ulxy19q4qNBrkk"
  );

  elements.forEach(function (element) {
    // do something with element
    element.style.removeProperty("opacity");
  });
}

let inactiveLyricsColor;
let lyricsColor;
function SetColor() {
  var elemntActive = document.querySelector(
    ".nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw"
  );
  if (elemntActive) {
    //add glow effect
    element.style.setProperty(
      "text-shadow",
      `0 0 5px rgba(182, 139, 139, 0.5), 0 0 10px rgba(182, 139, 139, 0.5), 0 0 15px rgba(182, 139, 139, 0.5), 0 0 20px rgba(182, 139, 139, 0.5)`
    );

    //Bigger font size
    elemntActive.style.setProperty("font-size", "60px");
  }
  var elementPass = document.querySelector(
    "nw6rbs8R08fpPn7RWW2w.aeO5D7ulxy19q4qNBrkk"
  );
  if (elementPass) {
    elementPass.style.removeProperty("opacity");
    elementPass.style.setProperty("color", inactiveLyricsColor);
  }

  var elementLyrics = document.querySelector(".nw6rbs8R08fpPn7RWW2w");
  if (elementLyrics) {
    elementLyrics.style.setProperty("margin-top", "50px");
    elementLyrics.style.setProperty("font-size", "50px");
  }
}

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // This is a first install!
    chrome.storage.sync.set(
      {
        lyricsColor: "ffffff",
        inactiveLyricsColor: "ffffff",
        backgroundColor: "000000",
        glowColor: "ffffff",
        enableCheckbox: true,
        gradientCheckbox: true,
        shadowCheckbox: true,
        glowCheckbox: true,
        karaokeCheckbox: false,
        dualLangCheckbox: false,
        scoringCheckbox: false,
        useCustomLyrics: false,
        autoMoodTheme: false,
        playlistIntegration: false,
        syncFix: false,
        lyricsColorOpacity: 1,
        inactiveLyricsColorOpacity: 0.5,
        romanizeLang: "none",
        translateLang: "none",
        animatedBg: "none",
        textEffect: "none",
        fontFamily: "",
        fontWeight: "",
        textAlign: "",
        theme: "",
        customProTheme: {}
      },
      function () {
        console.log("Default values set on first install.");
      }
    );
  }
});

const themes = {
  midnight: { bg: "#0f172a", lyrics: "#38bdf8", inactive: "#64748b", glow: "#38bdf8" },
  sunset: { bg: "#431407", lyrics: "#fdba74", inactive: "#f97316", glow: "#fdba74" },
  ocean: { bg: "#164e63", lyrics: "#67e8f9", inactive: "#06b6d4", glow: "#67e8f9" },
  neon: { bg: "#000000", lyrics: "#f0abfc", inactive: "#c026d3", glow: "#f0abfc" },
  minimal: { bg: "#ffffff", lyrics: "#000000", inactive: "#d1d5db", glow: "#000000" }
};
const themeKeys = Object.keys(themes);

document.addEventListener("keydown", function(e) {
  if (e.altKey && e.key.toLowerCase() === 't') {
    chrome.storage.sync.get(["theme", "glowCheckbox", "gradientCheckbox", "enableCheckbox"], function(data) {
      let currentTheme = data.theme || "midnight";
      let currentIndex = themeKeys.indexOf(currentTheme);
      let nextIndex = (currentIndex + 1) % themeKeys.length;
      let nextTheme = themeKeys[nextIndex];
      let tColors = themes[nextTheme];

      chrome.storage.sync.set({
        theme: nextTheme,
        backgroundColor: tColors.bg,
        lyricsColor: tColors.lyrics,
        inactiveLyricsColor: tColors.inactive,
        glowColor: tColors.glow
      }, function() {
        location.reload();
      });
    });
  }
  
  if (e.altKey && e.key.toLowerCase() === 'g') {
    chrome.storage.sync.get(["glowCheckbox"], function(data) {
      chrome.storage.sync.set({ glowCheckbox: !data.glowCheckbox }, function() {
        location.reload();
      });
    });
  }
  
  if (e.altKey && e.key.toLowerCase() === 'l') {
    if (window.location.href.includes('/lyrics')) {
      window.history.back();
    } else {
      window.location.href = window.location.href + (window.location.href.endsWith('/') ? '' : '/') + 'lyrics';
    }
  }
  
  if (e.altKey && e.key.toLowerCase() === 's') {
    var lyricsContainer = document.querySelector(".gqaWFmQeKNYnYD5gRv3x") || document.body;
    if (typeof html2canvas !== 'undefined') {
      html2canvas(lyricsContainer, { useCORS: true, allowTaint: true }).then(function(canvas) {
        var imgData = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = 'lyrics-screenshot.png';
        link.href = imgData;
        link.click();
      }).catch(err => console.error("Error generating screenshot:", err));
    } else {
      console.error("html2canvas is not loaded");
    }
  }
});
window.onload = function () {
  ActivateLyrics();
};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "refreshColors") {
    // Refresh the PAGE
    location.reload();
  }
  if (request.action === "takeScreenshot") {
    var lyricsContainer = document.querySelector(".gqaWFmQeKNYnYD5gRv3x") || document.body;
    if (typeof html2canvas !== 'undefined') {
      html2canvas(lyricsContainer, { useCORS: true, allowTaint: true }).then(function(canvas) {
        var imgData = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = 'lyrics-screenshot.png';
        link.href = imgData;
        link.click();
      }).catch(err => console.error("Error generating screenshot:", err));
    } else {
      console.error("html2canvas is not loaded");
    }
  }
  if (request.action === "openFloatingWidget") {
    if (!('documentPictureInPicture' in window)) {
      alert("Your browser does not support Document Picture-in-Picture for the floating widget.");
      return;
    }
    
    // Request a PiP window
    window.documentPictureInPicture.requestWindow({
      width: 400,
      height: 200
    }).then(pipWindow => {
      // Basic styling for the PiP window
      pipWindow.document.body.style.cssText = "background: #121212; color: #1DB954; font-family: sans-serif; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 24px; font-weight: bold; margin: 0; padding: 20px; overflow: hidden;";
      pipWindow.document.body.innerHTML = "<div id='pip-lyrics'>Waiting for lyrics...</div>";
      
      const pipLyricsDiv = pipWindow.document.getElementById('pip-lyrics');
      
      // Update interval
      const pipInterval = setInterval(() => {
        // Stop if window closed
        if (pipWindow.closed) {
          clearInterval(pipInterval);
          return;
        }
        
        // Find the currently active lyric
        const activeLyric = document.querySelector(".nw6rbs8R08fpPn7RWW2w.EhKgYshvOwpSrTv399Mw");
        if (activeLyric) {
          pipLyricsDiv.innerText = activeLyric.innerText;
        } else {
          // Check if custom lyrics are present
          const customLyrics = document.querySelector(".custom-lyrics-text");
          if (customLyrics) {
            pipLyricsDiv.innerText = "Custom Lyrics Playing (See main window)";
          }
        }
      }, 500);
      
      pipWindow.addEventListener("pagehide", () => {
        clearInterval(pipInterval);
      });
    }).catch(err => {
      console.error("Failed to open PiP window:", err);
      alert("Failed to open the floating widget. Ensure you have interacted with the Spotify page first.");
    });
  }
});
