import { useEffect, useRef } from 'react';

export default function ProctorCamera() {
    const videoRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
            }
        };
        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="object-cover w-full h-full transform scale-x-[-1]"
            ></video>
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> REC
            </div>
        </div>
    );
}