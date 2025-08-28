
import React, { useState } from 'react';
import { Team, Player } from '../types';
import { StarIcon, ClipboardIcon } from './icons/Icons';

interface TeamResultsProps {
    teams: Team[];
    unassignedPlayers: Player[];
    sortByRating: boolean;
}

const TeamCard: React.FC<{ team: Team, sortByRating: boolean, showRatings: boolean }> = ({ team, sortByRating, showRatings }) => (
    <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
            <h4 className="text-xl font-bold text-teal-400">{team.name}</h4>
            {sortByRating && showRatings && (
                <div className="flex items-center gap-1 text-yellow-400 bg-slate-700 px-2 py-1 rounded-full text-sm font-semibold" title="Nota Total do Time">
                    <StarIcon className="w-4 h-4" />
                    <span>{team.totalRating.toFixed(1)}</span>
                </div>
            )}
        </div>
        <ul className="space-y-2 flex-grow">
            {team.players.map(player => (
                <li key={player.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                    <span className="text-slate-200 flex items-center gap-2">
                        {player.isGoalkeeper && <span className="text-xs font-bold bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full" title="Goleiro">G</span>}
                        {player.name}
                    </span>
                    {sortByRating && showRatings && (
                        <div className="flex items-center gap-1 text-sm">
                            <span className="font-semibold text-slate-300">{player.rating.toFixed(1)}</span>
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

const TeamResults: React.FC<TeamResultsProps> = ({ 
    teams, 
    unassignedPlayers, 
    sortByRating
}) => {
    const [showRatings, setShowRatings] = useState(true);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleCopyToClipboard = () => {
        const textToCopy = teams.map(team => {
            const ratingInfo = sortByRating && showRatings ? ` (Nota Total: ${team.totalRating.toFixed(1)})` : '';
            const header = `${team.name}${ratingInfo}`;
            const playersList = team.players.map(p => {
                const gkInfo = p.isGoalkeeper ? ' (G)' : '';
                const playerRatingInfo = sortByRating && showRatings ? ` - ${p.rating.toFixed(1)}` : '';
                return `- ${p.name}${gkInfo}${playerRatingInfo}`;
            }).join('\n');
            return `${header}\n${playersList}`;
        }).join('\n\n');

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-teal-400">Times Gerados</h3>
                <div className='flex items-center flex-shrink-0 gap-4'>
                    {teams.length > 0 && sortByRating && (
                        <div className="flex items-center">
                            <input
                                id="showRatingsCheckbox"
                                type="checkbox"
                                checked={showRatings}
                                onChange={(e) => setShowRatings(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-teal-500 focus:ring-offset-slate-800 focus:ring-2 focus:ring-teal-500"
                            />
                            <label htmlFor="showRatingsCheckbox" className="ml-2 text-sm font-medium text-slate-300">
                                Mostrar Notas
                            </label>
                        </div>
                    )}
                     {teams.length > 0 && (
                        <button
                            onClick={handleCopyToClipboard}
                            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-1 px-3 rounded-md transition-all duration-200"
                            title="Copiar times para a área de transferência"
                        >
                            {copyStatus === 'idle' ? <ClipboardIcon className="w-4 h-4" /> : '✅'}
                            <span className="w-20 text-left">{copyStatus === 'idle' ? 'Exportar' : 'Copiado!'}</span>
                        </button>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-auto pr-2">
                {teams.map(team => (
                    <TeamCard key={team.id} team={team} sortByRating={sortByRating} showRatings={showRatings} />
                ))}
            </div>

            {unassignedPlayers.length > 0 && (
                 <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 text-slate-400">Jogadores Não Atribuídos</h4>
                    <div className="flex flex-wrap gap-2">
                        {unassignedPlayers.map(p => (
                            <span key={p.id} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
                                {p.name}
                                {p.isGoalkeeper && <span className="text-xs font-bold bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded-full" title="Goleiro">G</span>}
                                {sortByRating && showRatings && (
                                    <span>
                                        ({p.rating.toFixed(1)} <StarIcon className="inline-block w-3 h-3 text-yellow-400 -mt-1" />)
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamResults;
