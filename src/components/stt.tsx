import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import './stt.css'

// props to pass in
interface Props {
  update: (transcript: string) => void;
  submit: (prompt: string) => void;
  waiting: boolean; 
}

const Microphone: React.FC<Props> = ({ update, submit, waiting }) => {
  // enable speech recognition
  const { transcript, listening, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // function to start listening
  const handleStartListening = () => {
    SpeechRecognition.startListening();
  };

  // function to stop listening
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };


  // update input box with live transcript
  useEffect(() => {
    update(transcript);
  }, [transcript, update]);

  // update input box with final transcript at the end and submit when finished
  useEffect(() => {
    if (finalTranscript) {
      update(finalTranscript);
    }
  }, [finalTranscript, update]);

  return (
    <div>
      {browserSupportsSpeechRecognition && listening ? (
        <button className="microphone stop" onClick={handleStopListening}>
          <FontAwesomeIcon icon={faStop} />
        </button>
      ) : (
        <button className={`microphone ${waiting ? 'disabled' : 'enabled'}`} onClick={handleStartListening}>
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      )}
    </div>
  )
};

export default Microphone;
