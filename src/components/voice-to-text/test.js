// test.js
import generateFinalTranscript from './voice-to-text.js';

async function runTest() {
  try {
    console.log('Generating transcript...');
    const transcript = await generateFinalTranscript();
    console.log('Transcript:', transcript);
  } catch (error) {
    console.error('Error:', error);
  }
}

runTest();
