
import React, { useState, useEffect } from 'react';
import { EditablePlayer } from '../types';
import { extractPlayersFromText } from '../services/geminiService';
import StarRating from './StarRating';
import { SparklesIcon, TrashIcon } from './icons/Icons';

interface ImportPlayersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPlayers: (players: Omit<EditablePlayer, 'key'>[]) => void;
}

const ImportPlayersModal: React.FC<ImportPlayersModalProps> = ({ isOpen, onClose, onAddPlayers }) => {
    type Stage = 'input' | 'loading' | 'review' | 'error';
    const [stage, setStage] = useState<Stage>('input');
    const [inputText, setInputText] = useState('');
    const [editablePlayers, setEditablePlayers] = useState<EditablePlayer[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const resetState = () => {
        setStage('input');
        setInputText('');
        setEditablePlayers([]);
        setErrorMessage('');
    };

    useEffect(() => {
        if (!isOpen) {
            setTimeout(resetState, 300); // Reset after close animation
        }
    }, [isOpen]);

    const handleExtract = async () => {
        if (!inputText.trim()) {
            setErrorMessage('Por favor, cole uma lista de jogadores.');
            setStage('error');
            return;
        }
        setStage('loading');
        try {
            const playerNames = await extractPlayersFromText(inputText);
            if (playerNames.length === 0) {
                setErrorMessage('Nenhum jogador encontrado na lista. Tente novamente com um texto diferente.');
                setStage('error');
                return;
            }
            const playersToEdit: EditablePlayer[] = playerNames.map((name, index) => ({
                key: Date.now() + index,
                name: name,
                rating: 3.5,
                isGoalkeeper: false,
            }));
            setEditablePlayers(playersToEdit);
            setStage('review');
        } catch (error) {
            setErrorMessage('Ocorreu um erro ao contatar a IA. Por favor, tente novamente.');
            setStage('error');
        }
    };
    
    const handlePlayerUpdate = (key: number, field: keyof EditablePlayer, value: string | number | boolean) => {
        setEditablePlayers(prev =>
            prev.map(p => (p.key === key ? { ...p, [field]: value } : p))
        );
    };

    const handleRemovePlayer = (key: number) => {
        setEditablePlayers(prev => prev.filter(p => p.key !== key));
    };

    const handleAddAllPlayers = () => {
        const finalPlayers = editablePlayers.filter(p => p.name.trim() !== '');
        onAddPlayers(finalPlayers);
        onClose();
    };

    const renderContent = () => {
        switch (stage) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center text-center h-64">
                        <SparklesIcon className="w-12 h-12 text-teal-400 animate-pulse" />
                        <p className="mt-4 text-lg text-slate-300">Analisando sua lista...</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center text-center h-64">
                        <p className="text-red-400 mb-4">{errorMessage}</p>
                        <button
                            onClick={() => setStage('input')}
                            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                );
            case 'review':
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">Revise os jogadores encontrados:</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {editablePlayers.map((player) => (
                                <div key={player.key} className="bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-start gap-4">
                                        <input
                                            type="text"
                                            value={player.name}
                                            onChange={(e) => handlePlayerUpdate(player.key, 'name', e.target.value)}
                                            className="w-full bg-slate-700 border border-slate-600 rounded-md py-1 px-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                        <button
                                            onClick={() => handleRemovePlayer(player.key)}
                                            className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 mt-1"
                                            aria-label={`Remover ${player.name}`}
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <StarRating rating={player.rating} setRating={(r) => handlePlayerUpdate(player.key, 'rating', r)} />
                                        <div className="flex items-center">
                                            <input
                                                id={`goalkeeper-${player.key}`}
                                                type="checkbox"
                                                checked={player.isGoalkeeper}
                                                onChange={(e) => handlePlayerUpdate(player.key, 'isGoalkeeper', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-offset-slate-800 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <label htmlFor={`goalkeeper-${player.key}`} className="ml-2 block text-sm font-medium text-slate-300">
                                                É Goleiro?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setStage('input')}
                                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleAddAllPlayers}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                Adicionar {editablePlayers.length} Jogadores
                            </button>
                        </div>
                    </div>
                );
            case 'input':
            default:
                return (
                    <div className="flex flex-col gap-4">
                        <label htmlFor="player-list-input" className="text-slate-300">
                            Cole a lista de jogadores do seu grupo de conversa aqui:
                        </label>
                        <textarea
                            id="player-list-input"
                            rows={8}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ex:
- João
- Maria
- Carlos (confirmado)
- etc..."
                            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                        <button
                            onClick={handleExtract}
                            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg"
                        >
                            <SparklesIcon className="w-5 h-5"/>
                            Extrair Jogadores
                        </button>
                    </div>
                );
        }
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
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg text-slate-100 flex flex-col relative"
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
                        Importar Lista
                    </h2>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default ImportPlayersModal;
