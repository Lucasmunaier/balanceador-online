
import React, { useState } from 'react';
import StarRating from './StarRating';
import { UserPlusIcon } from './icons/Icons';

interface PlayerFormProps {
    onAddPlayer: (name: string, rating: number) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
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
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nota (1-5)
                </label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
                <UserPlusIcon />
                Adicionar Jogador
            </button>
        </form>
    );
};

export default PlayerForm;