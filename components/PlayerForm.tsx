import React, { useState } from 'react';
import StarRating from './StarRating';
import { PlusIcon } from './icons/Icons';

interface PlayerFormProps {
    onAddPlayer: (name: string, rating: number) => void;
    sortByRating: boolean;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer, sortByRating }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(3);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') {
            setError('O nome do jogador não pode estar em branco.');
            return;
        }
        setError('');
        onAddPlayer(name.trim(), rating);
        setName('');
        setRating(3);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-slate-300 mb-2">
                    Nome do Jogador
                </label>
                <input
                    type="text"
                    id="playerName"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                    }}
                    placeholder="Ex: João"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
                 {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
            <div>
                <div className={`flex justify-between items-center mb-2 ${!sortByRating ? 'opacity-50' : ''}`}>
                    <label className="block text-sm font-medium text-slate-300">
                        Nota (1-5)
                    </label>
                    {!sortByRating && <span className="text-xs text-slate-400">Desativado</span>}
                </div>
                <div className={!sortByRating ? 'pointer-events-none opacity-50' : ''}>
                    <StarRating rating={rating} setRating={setRating} disabled={!sortByRating} />
                </div>
            </div>
            <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
                <PlusIcon />
                Adicionar Jogador
            </button>
        </form>
    );
};

export default PlayerForm;