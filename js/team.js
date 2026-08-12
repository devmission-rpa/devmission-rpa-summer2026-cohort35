async function retrieveData(token, dataAttribute){
  let person = document.querySelectorAll('[data-' + dataAttribute + ']');
  let clickable_area = document.querySelectorAll('.img-container');
  console.log(clickable_area);

  await fetch(
    `https://api.airtable.com/v0/apphqAXizGk5FjuTB/` + token,
    {
      headers: {
        Authorization: `Bearer pat7t95zxMmQHUzsh.5eb26aaa36c99f3d55b8c0482a98849df96c4a9c3ca6de3920dadf5ebcd1e168`,
      },
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((data) => {

    // Create "Key-Value" Map, which enables finding a specific img URL through the "Name" key
    const photoMap = new Map(data.records.map(record => [record.fields["Name"], record.fields["Photo"]?.[0]?.url]));
    const photoMap2 = new Map(data.records.map(record => [record.fields["Name"], record.fields["Photo 2"]?.[0]?.url]));
    const textMap = new Map(data.records.map(record => [record.fields["Name"], record.fields["Description"]]));
    const titleMap = new Map(data.records.map(record => [record.fields["Name"], record.fields["Title"]]));
      person.forEach(element => {
        let key;
        let clicked = false;
        let placeholder = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original";
        if(dataAttribute == 'staff'){
          key = element.dataset.staff;
        } else if(dataAttribute == 'intern'){
          key = element.dataset.intern;
        } else {
          key = null;
        }

        if(!key) return;

        element.src = photoMap.get(key) ?? placeholder;
        element.addEventListener('click', () =>{
          if(clicked == false){
            element.src = photoMap2.get(key) ?? photoMap.get(key) ?? placeholder;
            element.parentElement.nextElementSibling.innerHTML = textMap.get(key) ?? "Description Unavailable :("
            clicked = true;
          } else {
            element.src = photoMap.get(key) ?? placeholder;
            let name = key.split(" ");
            let first_name = name[0];
            element.parentElement.nextElementSibling.innerHTML = first_name + " - " + titleMap.get(key) ?? "Title Unavailable :("
            clicked = false;
          }
          playMultiBlip();
        })
      });
    });
}

// State variables
let audioCtx = null;
let isPlaying = false;

// Audio Engine Initialization
function initAudioEngine() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  // Master Gain Node
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // Tempo & Sequence Configuration
  const bpm = 130;
  const stepDuration = 60 / bpm / 4;
  const totalSteps = 32;

  const NOTES = {
    A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00,
    A3: 220.00, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
    A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, OFF: 0
  };

  const leadPattern = [
    NOTES.A4, NOTES.OFF, NOTES.C5, NOTES.E5,  NOTES.A4, NOTES.OFF, NOTES.G4, NOTES.OFF,
    NOTES.F4, NOTES.OFF, NOTES.A4, NOTES.C5,  NOTES.E5, NOTES.D5,  NOTES.C5, NOTES.G4,
    NOTES.A4, NOTES.OFF, NOTES.C5, NOTES.E5,  NOTES.A4, NOTES.OFF, NOTES.G4, NOTES.OFF,
    NOTES.F4, NOTES.G4,  NOTES.A4, NOTES.C5,  NOTES.B4, NOTES.G4,  NOTES.A4, NOTES.OFF
  ];

  const bassPattern = [
    NOTES.A2, NOTES.OFF, NOTES.A2, NOTES.OFF,  NOTES.F3, NOTES.OFF, NOTES.F3, NOTES.OFF,
    NOTES.D3, NOTES.OFF, NOTES.D3, NOTES.OFF,  NOTES.E3, NOTES.OFF, NOTES.E3, NOTES.OFF,
    NOTES.A2, NOTES.OFF, NOTES.A2, NOTES.OFF,  NOTES.F3, NOTES.OFF, NOTES.F3, NOTES.OFF,
    NOTES.D3, NOTES.OFF, NOTES.E3, NOTES.OFF,  NOTES.A2, NOTES.OFF, NOTES.A2, NOTES.OFF
  ];

  const drumPattern = [
    1, 0, 1, 0,  2, 0, 1, 0,  1, 0, 1, 1,  2, 0, 1, 0,
    1, 0, 1, 0,  2, 0, 1, 0,  1, 0, 1, 1,  2, 2, 1, 0
  ];

  // Instrument Functions
  function playLead(freq, time) {
    if (!freq) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + stepDuration * 0.9);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + stepDuration * 0.9);
  }

  function playBass(freq, time) {
    if (!freq) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + stepDuration * 1.8);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + stepDuration * 1.8);
  }

  function playDrums(type, time) {
    if (!type) return;
    const duration = type === 1 ? 0.03 : 0.08;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    const volume = type === 1 ? 0.15 : 0.4;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    noise.connect(gain);
    gain.connect(masterGain);
    noise.start(time);
  }

  // Scheduler Loop
  let nextStepTime = audioCtx.currentTime;
  let currentStep = 0;

  function schedule() {
    while (nextStepTime < audioCtx.currentTime + 0.1) {
      playLead(leadPattern[currentStep], nextStepTime);
      playBass(bassPattern[currentStep], nextStepTime);
      playDrums(drumPattern[currentStep], nextStepTime);

      nextStepTime += stepDuration;
      currentStep = (currentStep + 1) % totalSteps;
    }
    setTimeout(schedule, 25);
  }

  schedule();
}

// Toggle Controller
function toggleMusic() {
  const btn = document.getElementById('retro-audio-btn');
  const btnText = document.getElementById('btn-text');

  if (!audioCtx) {
    initAudioEngine();
  }

  if (!isPlaying) {
    audioCtx.resume().then(() => {
      isPlaying = true;
      btn.classList.add('playing');
      btnText.textContent = 'PAUSE ❚❚';
    });
  } else {
    audioCtx.suspend().then(() => {
      isPlaying = false;
      btn.classList.remove('playing');
      btnText.textContent = 'PLAY ♫';
    });
  }
}

// Bind event listener after the DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('retro-audio-btn');
  if (btn) {
    btn.addEventListener('click', toggleMusic);
  }
});

function playMultiBlip(blipCount = 4, speedMs = 50) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const startTime = audioCtx.currentTime;

  for (let i = 0; i < blipCount; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // 'square' for retro grit, or 'sine'/'triangle' for a smoother chime
    osc.type = 'square';

    // Delay each blip by speedMs (converted to seconds)
    const time = startTime + (i * (speedMs / 1000));

    // Pitch rises with each consecutive blip (e.g., 800Hz, 950Hz, 1100Hz...)
    const pitch = 300 + (i * 150);
    osc.frequency.setValueAtTime(pitch, time);

    // Envelope for a sharp, tiny tap sound per blip
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.04);
  }
}

function startLoading(){
  const progressBar = document.getElementById("loading-bar");
  let width = 0;

  // Clear any existing text or width if restarted
  progressBar.style.width = "0%";
  progressBar.innerHTML = "0%";

  // Update the progress every 20 milliseconds
  const intervalId = setInterval(function() {
    if (width >= 100) {
      clearInterval(intervalId);
      progressBar.innerHTML = "Complete!";
    } else {
      width++;
      progressBar.style.width = width + "%";
      progressBar.innerHTML = width + "%";
    }
  }, 20);
}