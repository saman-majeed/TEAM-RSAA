import { useEffect, useRef, useState } from 'react';

export default function ProctorCamera({ stopRecording, onVideoReady }) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            try {
                // Request camera & microphone
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) videoRef.current.srcObject = stream;

                // Start recording
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
                };

                // When stopped, convert video to base64 and send it to Dashboard
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        if (onVideoReady) onVideoReady(reader.result);
                    };
                };

                mediaRecorder.start();
            } catch (err) {
                console.error("Camera access denied or unavailable:", err);
                setHasError(true);
                // CRITICAL: Do NOT call onVideoReady(null) here. 
                // Doing so would end the test immediately upon failure.
            }
        };

        startCamera();

        // Cleanup when leaving page
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Listen for the signal from the Dashboard to stop recording
    useEffect(() => {
        // Only act if the parent component (Dashboard) tells us to stop
        if (stopRecording) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            } else {
                // If the test ended but the camera wasn't working, 
                // send null so the dashboard can finish the final database save.
                if (onVideoReady) onVideoReady(null);
            }
        }
    }, [stopRecording]);

    return (
        <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center h-48 w-full border-2 border-gray-200">
            {hasError ? (
                <div className="flex flex-col items-center justify-center p-4 text-center bg-gray-900 w-full h-full">
                    <p className="text-red-400 text-xs font-bold uppercase mb-1">Security Warning</p>
                    <p className="text-white text-[10px]">Camera access blocked. The recruiter will be notified.</p>
                </div>
            ) : (
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
            )}

            {/* Visual Indicator */}
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center shadow-lg border border-red-400">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1.5"></span>
                {hasError ? "OFFLINE" : "LIVE"}
            </div>
        </div>
    );
}