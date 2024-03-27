import * as RecordRTC from 'recordrtc';

async function generateFinalTranscript() {
  const socket = await setupWebSocket();
  const recorder = await setupRecorder(socket);

  return new Promise((resolve, reject) => {
    let transcript = '';

    socket.onmessage = (voicePrompt) => {
      const res = JSON.parse(voicePrompt.data);
      if (res.message_type === 'PartialTranscript' && res.text) {
        transcript += res.text;
      } else if (res.message_type === 'FinalTranscript') {
        transcript += res.text;
        resolve(transcript);
      }
    };

    socket.onerror = (error) => {
      reject(error);
    };

    socket.onclose = () => {
      // Cleanup code
      recorder.pauseRecording();
      recorder.destroy();
    };

    // Start recording
    recorder.startRecording();
  });
}

async function setupWebSocket() {
  const response = await fetch('http://localhost:8000/token');
  const { token } = await response.json();
  const socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

  return new Promise((resolve, reject) => {
    socket.onopen = () => resolve(socket);
    socket.onerror = (error) => reject(error);
  });
}

async function setupRecorder(socket) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new RecordRTC(stream, {
    type: 'audio',
    mimeType: 'audio/webm;codecs=pcm',
    recorderType: RecordRTC.StereoAudioRecorder,
    timeSlice: 250,
    desiredSampRate: 16000,
    numberOfAudioChannels: 1,
    bufferSize: 4096,
    audioBitsPerSecond: 128000,
    ondataavailable: (blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result;
        if (socket) {
          socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
        }
      };
      reader.readAsDataURL(blob);
    },
  });
  recorder.initStream = stream;
  return recorder;
}

export default generateFinalTranscript;
