import React, { useState, useEffect, useCallback } from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon } from './icons/Icons';

interface TimerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Helper function to play sound on timer completion
const playSoundAlert = () => {
    // Play a sound using the Web Audio API
    try {
        // Create an AudioContext for web audio manipulation
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioContext) return; // Web Audio API not supported

        // Function to create and play a single beep
        const playBeep = (freq: number, startTime: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Connect oscillator to gain node, and gain node to output
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine'; // A clean sine wave tone
            oscillator.frequency.setValueAtTime(freq, startTime);
            
            // Control volume and fade out to prevent clicking
            gainNode.gain.setValueAtTime(0.4, startTime); // Start at 40% volume
            gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };
        
        const now = audioContext.currentTime;
        // Play two beeps in succession
        playBeep(880, now, 0.15); // A4 note
        playBeep(880, now + 0.2, 0.15);

    } catch (e) {
        console.error("Could not play timer completion sound:", e);
    }
};

const TimerModal: React.FC<TimerModalProps> = ({ isOpen, onClose }) => {
    const [stage, setStage] = useState<'setup' | 'running'>('setup');
    const [inputMinutes, setInputMinutes] = useState('7');
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [error, setError] = useState('');
    const [isAlerting, setIsAlerting] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleStart = () => {
        const minutes = parseInt(inputMinutes, 10);
        if (isNaN(minutes) || minutes <= 0) {
            setError('Por favor, insira um tempo válido.');
            return;
        }
        setError('');
        const totalSeconds = minutes * 60;
        setSecondsLeft(totalSeconds);
        setIsActive(true);
        setStartTime(new Date());
        setStage('running');
    };

    const handleReset = useCallback(() => {
        setIsActive(false);
        setIsAlerting(false);
        setHasFinished(false);
        setStage('setup');
        setSecondsLeft(0);
        setStartTime(null);
        setError('');
    }, []);

    const handleTogglePause = () => {
        if (isAlerting) {
            setIsAlerting(false);
        } else {
            setIsActive(!isActive);
        }
    };
    
    // Effect for timer countdown
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined = undefined;

        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(seconds => seconds - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isActive) {
            setIsActive(false);
            playSoundAlert(); // Trigger sound
            setIsAlerting(true); // Trigger continuous vibration
            setHasFinished(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, secondsLeft]);

    // Effect for continuous vibration
    useEffect(() => {
        let vibrationInterval: ReturnType<typeof setInterval> | undefined = undefined;
        if (isAlerting && 'vibrate' in navigator) {
            // More intense vibrate pattern: 400ms vibration, 200ms pause, repeat
            vibrationInterval = setInterval(() => {
                navigator.vibrate(400);
            }, 600);
        }
        return () => {
            if (vibrationInterval) clearInterval(vibrationInterval);
            if ('vibrate' in navigator) {
                navigator.vibrate(0); // Stop vibration on cleanup
            }
        };
    }, [isAlerting]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(handleReset, 300);
        }
    }, [isOpen, handleReset]);

    const getButtonLabel = () => {
        if (isAlerting) return 'Parar Alerta';
        if (secondsLeft === 0 && !isActive) return 'Retomar';
        return isActive ? 'Pausar' : 'Retomar';
    };

    const getButtonIcon = () => {
        if (isAlerting) return <PauseIcon className="w-6 h-6" />;
        return isActive ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />;
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-slate-100 flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
                    aria-label="Fechar modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="text-center mb-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-teal-400">
                        Temporizador
                    </h2>
                </div>

                {stage === 'setup' ? (
                    <div className="flex flex-col items-center gap-4">
                        <label htmlFor="duration" className="text-lg text-slate-300">Definir tempo (em minutos):</label>
                        <input
                            type="number"
                            id="duration"
                            min="1"
                            value={inputMinutes}
                            onChange={(e) => {
                                setInputMinutes(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-40 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white text-center text-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                        <button
                            onClick={handleStart}
                            className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                            <PlayIcon className="w-6 h-6" />
                            Iniciar
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                        {startTime && (
                            <p className="text-sm text-slate-400">
                                Iniciado às: {startTime.toLocaleTimeString()}
                            </p>
                        )}
                        <p className={`text-7xl sm:text-8xl font-mono font-bold transition-colors duration-500 ${isAlerting || (secondsLeft <= 10 && secondsLeft > 0) ? 'text-red-500 animate-pulse' : 'text-slate-100'}`}>
                            {formatTime(secondsLeft)}
                        </p>
                        <div className="flex items-center justify-center gap-4 w-full mt-4">
                           { !(hasFinished && !isAlerting) && (
                                <button
                                    onClick={handleTogglePause}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                                >
                                    {getButtonIcon()}
                                    {getButtonLabel()}
                                </button>
                            )}
                            <button
                                onClick={handleReset}
                                className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                <ArrowPathIcon className="w-6 h-6" />
                                Zerar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimerModal;