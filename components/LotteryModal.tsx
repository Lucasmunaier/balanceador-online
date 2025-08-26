import React, { useState, useMemo, useEffect } from 'react';

interface LotteryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LotteryResult {
    player: number;
    drawnNumber: number;
}

// Keyframe animations for the lottery
const LotteryAnimations = () => (
    <style>{`
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-1deg); }
            20%, 80% { transform: translate3d(2px, 0, 0) rotate(2deg); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0) rotate(-4deg); }
            40%, 60% { transform: translate3d(4px, 0, 0) rotate(4deg); }
        }
        .animate-shake {
            animation: shake 1s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
            animation: pop-in 0.5s ease-out forwards;
        }
    `}</style>
);

const LotteryModal: React.FC<LotteryModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'setup' | 'drawing' | 'results'>('setup');
    const [numParticipants, setNumParticipants] = useState<string>('2');
    const [numWinners, setNumWinners] = useState<string>('1');
    const [currentPlayer, setCurrentPlayer] = useState<number>(1);
    const [results, setResults] = useState<LotteryResult[]>([]);
    const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
    const [lastDrawnNumber, setLastDrawnNumber] = useState<number | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [error, setError] = useState<string>('');

    const shuffleArray = (array: number[]): number[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const handleStart = () => {
        const participants = parseInt(numParticipants, 10);
        const winners = parseInt(numWinners, 10);

        if (isNaN(participants) || participants < 2) {
            setError('Por favor, insira um número de participantes válido (2 ou mais).');
            return;
        }
        if (isNaN(winners) || winners < 1) {
            setError('Por favor, insira um número de vagas válido (1 ou mais).');
            return;
        }
        if (winners >= participants) {
            setError('O número de vagas deve ser menor que o número de participantes.');
            return;
        }

        setError('');
        const numbersToDraw = Array.from({ length: participants }, (_, i) => i + 1);
        setShuffledNumbers(shuffleArray(numbersToDraw));
        setStep('drawing');
    };

    const handleDraw = () => {
        if (isDrawing || shuffledNumbers.length === 0) return;

        setIsDrawing(true);

        setTimeout(() => {
            const drawn = shuffledNumbers.pop()!;
            setShuffledNumbers([...shuffledNumbers]);
            setLastDrawnNumber(drawn);
            setResults(prev => [...prev, { player: currentPlayer, drawnNumber: drawn }]);

            setTimeout(() => {
                if (shuffledNumbers.length === 0) {
                    setStep('results');
                } else {
                    setCurrentPlayer(prev => prev + 1);
                    setLastDrawnNumber(null);
                }
                setIsDrawing(false);
            }, 2000); // Time the number is displayed

        }, 1000); // Duration of shake animation
    };
    
    const handleReset = () => {
        setStep('setup');
        setNumParticipants('2');
        setNumWinners('1');
        setCurrentPlayer(1);
        setResults([]);
        setShuffledNumbers([]);
        setLastDrawnNumber(null);
        setError('');
        setIsDrawing(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    useEffect(() => {
        if (!isOpen) {
            // Reset state after close animation finishes
            setTimeout(handleReset, 300);
        }
    }, [isOpen]);

    const sortedResults = useMemo(() => {
        return [...results].sort((a, b) => b.drawnNumber - a.drawnNumber);
    }, [results, step]);

    const getMedal = (index: number) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}º`;
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <LotteryAnimations />
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
                        Sorte na Tampinha
                    </h2>
                </div>

                {step === 'setup' && (
                    <div className="flex flex-col items-center gap-6 animate-pop-in">
                        <div className="w-full text-center">
                            <label htmlFor="numParticipants" className="text-lg text-slate-300">Quantas pessoas vão participar?</label>
                            <input
                                type="number"
                                id="numParticipants"
                                min="2"
                                value={numParticipants}
                                onChange={(e) => {
                                    setNumParticipants(e.target.value);
                                    if (error) setError('');
                                }}
                                className="mt-2 w-40 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white text-center text-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <div className="w-full text-center">
                             <label htmlFor="numWinners" className="text-lg text-slate-300">Quantas pessoas vão entrar?</label>
                            <input
                                type="number"
                                id="numWinners"
                                min="1"
                                value={numWinners}
                                onChange={(e) => {
                                    setNumWinners(e.target.value);
                                    if (error) setError('');
                                }}
                                className="mt-2 w-40 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white text-center text-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm -mt-2 text-center">{error}</p>}
                        <button
                            onClick={handleStart}
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Começar Sorteio
                        </button>
                    </div>
                )}

                {step === 'drawing' && (
                    <div className="flex flex-col items-center gap-4 text-center min-h-[280px] justify-center">
                         <p className="text-2xl text-slate-300 font-semibold h-8 transition-opacity duration-300">
                            {lastDrawnNumber === null && `Vez do Jogador ${currentPlayer}`}
                        </p>
                        
                        <div className="my-4 w-full h-48 flex items-center justify-center">
                            {lastDrawnNumber !== null ? (
                                <div className="w-48 h-48 flex items-center justify-center animate-pop-in">
                                    <span className="text-8xl font-bold text-teal-400 drop-shadow-[0_4px_8px_rgba(82,246,222,0.4)]">{lastDrawnNumber}</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleDraw}
                                    disabled={isDrawing}
                                    className={`w-48 h-48 rounded-full font-bold text-white text-3xl transition-all duration-300 shadow-2xl 
                                                bg-gradient-to-br from-blue-500 to-blue-700
                                                hover:from-blue-600 hover:to-blue-800 hover:scale-105 active:scale-100
                                                disabled:opacity-50 disabled:cursor-wait
                                                focus:outline-none focus:ring-4 focus:ring-blue-400/50
                                                ${isDrawing ? 'animate-shake cursor-wait' : ''}`}
                                >
                                    Pressione
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {step === 'results' && (() => {
                    const winnersCount = parseInt(numWinners, 10);
                    const winners = sortedResults.slice(0, winnersCount);
                    const losers = sortedResults.slice(winnersCount);

                    return (
                        <div className="animate-pop-in">
                            <h3 className="text-xl font-bold mb-4 text-center text-teal-400">🏆 Resultado Final 🏆</h3>
                            <div className="bg-slate-800/50 p-4 rounded-lg max-h-72 overflow-y-auto">
                                <div>
                                    <h4 className="text-lg font-semibold text-green-400 mb-2 px-2">✅ Entraram:</h4>
                                    <ul className="space-y-2">
                                        {winners.map((res, index) => (
                                            <li key={res.player} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg text-lg">
                                                <span className="font-semibold text-slate-200 flex items-center gap-3">
                                                    <span className="text-2xl w-8 text-center">{getMedal(index)}</span>
                                                    <span>Jogador {res.player}</span>
                                                </span>
                                                <span className="text-xl font-bold text-teal-400 bg-slate-800 px-3 py-1 rounded-md">{res.drawnNumber}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {losers.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold text-red-400 mb-2 px-2">❌ Não entraram:</h4>
                                        <ul className="space-y-2">
                                            {losers.map((res, index) => (
                                                <li key={res.player} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg text-lg opacity-70">
                                                    <span className="font-semibold text-slate-200 flex items-center gap-3">
                                                        <span className="text-2xl w-8 text-center">{getMedal(index + winnersCount)}</span>
                                                        <span>Jogador {res.player}</span>
                                                    </span>
                                                    <span className="text-xl font-bold text-teal-400 bg-slate-800 px-3 py-1 rounded-md">{res.drawnNumber}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleReset}
                                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Sortear Novamente
                            </button>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default LotteryModal;