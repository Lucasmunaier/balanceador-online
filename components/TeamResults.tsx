import React from 'react';
import { Team, Player } from '../types';
import { StarIcon, SparklesIcon } from './icons/Icons';

interface TeamResultsProps {
    teams: Team[];
    unassignedPlayers: Player[];
}

const TeamCard: React.FC<{ team: Team }> = ({ team }) => (
    <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
            <h4 className="text-xl font-bold text-teal-400">{team.name}</h4>
            <div className="flex items-center gap-1 text-yellow-400 bg-slate-700 px-2 py-1 rounded-full text-sm font-semibold" title="Nota Total do Time">
                <StarIcon className="w-4 h-4" />
                <span>{team.totalRating}</span>
            </div>
        </div>
        <ul className="space-y-2 flex-grow">
            {team.players.map(player => (
                <li key={player.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                    <span className="text-slate-200">{player.name}</span>
                    <div className="flex items-center gap-1 text-sm">
                        <span className="font-semibold text-slate-300">{player.rating}</span>
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const TeamResults: React.FC<TeamResultsProps> = ({ teams, unassignedPlayers }) => {
    
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-4 text-center text-teal-400">Times Gerados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-auto pr-2">
                {teams.map(team => (
                    <TeamCard key={team.id} team={team} />
                ))}
            </div>

            {unassignedPlayers.length > 0 && (
                 <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 text-slate-400">Jogadores Não Atribuídos</h4>
                    <div className="flex flex-wrap gap-2">
                        {unassignedPlayers.map(p => (
                            <span key={p.id} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                                {p.name} ({p.rating} <StarIcon className="inline-block w-3 h-3 text-yellow-400 -mt-1" />)
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamResults;