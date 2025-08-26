import React from 'react';
import { Player } from '../types';
import { StarIcon, TrashIcon, UserCircleIcon } from './icons/Icons';

interface PlayerListProps {
    players: Player[];
    onRemovePlayer: (id: number) => void;
    onClearAll: () => void;
    sortByRating: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onRemovePlayer, onClearAll, sortByRating }) => {
    return (
        <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold flex items-center text-teal-400">
                    <UserCircleIcon />
                    <span className="ml-2">Jogadores ({players.length})</span>
                </h2>
                {players.length > 0 && (
                     <button
                        onClick={onClearAll}
                        className="flex items-center gap-1.5 text-sm bg-red-800/50 hover:bg-red-700/50 text-red-300 font-semibold py-1 px-3 rounded-md transition-colors"
                        aria-label="Limpar todos os jogadores"
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span>Limpar Todos</span>
                    </button>
                )}
            </div>

            {players.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Nenhum jogador adicionado ainda.</p>
            ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {players.map(player => (
                        <li
                            key={player.id}
                            className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <div className="flex items-center">
                                <span className="font-medium text-slate-200">{player.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                               {sortByRating && (
                                <div className="flex items-center gap-1" title={`Nota: ${player.rating}`}>
                                    <span className="font-bold text-teal-400">{player.rating}</span>
                                    <StarIcon className="w-5 h-5 text-yellow-400" />
                                </div>
                               )}
                                <button
                                    onClick={() => onRemovePlayer(player.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                    aria-label={`Remover ${player.name}`}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlayerList;