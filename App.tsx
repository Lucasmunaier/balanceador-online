import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Player, Team } from './types';
import PlayerForm from './components/PlayerForm';
import PlayerList from './components/PlayerList';
import TeamResults from './components/TeamResults';
import { ClockIcon, SparklesIcon, PokerChipIcon } from './components/icons/Icons';
import LotteryModal from './components/LotteryModal';
import TimerModal from './components/TimerModal';

const App: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [playersPerTeam, setPlayersPerTeam] = useState<string>('2');
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortByRating, setSortByRating] = useState<boolean>(true);
    const [isLotteryModalOpen, setIsLotteryModalOpen] = useState(false);
    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

    const resultsRef = useRef<HTMLDivElement>(null);

    const addPlayer = (name: string, rating: number) => {
        const newPlayer: Player = {
            id: Date.now(),
            name,
            rating: sortByRating ? rating : 1,
        };
        setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    };

    const removePlayer = useCallback((id: number) => {
        setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
    }, []);

    const clearAllPlayers = useCallback(() => {
        setPlayers([]);
        setTeams([]);
        setError(null);
    }, []);

    const handleGenerateTeams = () => {
        setError(null);
        setTeams([]);
    
        const playersPerTeamNum = parseInt(playersPerTeam, 10);

        if (players.length === 0 || isNaN(playersPerTeamNum) || playersPerTeamNum <= 0) {
            setError('Adicione jogadores e defina um número válido de jogadores por time.');
            return;
        }
    
        // 1. Sort players randomly first for tie-breaking and for the random sort option
        let sortedPlayers = [...players]
            .sort(() => Math.random() - 0.5);
        
        // If sorting by rating is enabled, apply the rating sort
        if (sortByRating) {
            sortedPlayers.sort((a, b) => b.rating - a.rating);
        }
    
        // 2. Determine the exact structure of the teams (e.g., 3 teams of 6, 1 team of 2)
        const numFullTeams = Math.floor(players.length / playersPerTeamNum);
        const playersInLastTeam = players.length % playersPerTeamNum;
        const numTotalTeams = playersInLastTeam > 0 ? numFullTeams + 1 : numFullTeams;

        if (numTotalTeams === 0) {
            return;
        }

        const teamsWithCapacity: (Team & { capacity: number })[] = Array.from({ length: numTotalTeams }, (_, i) => {
            const isFullTeam = i < numFullTeams;
            const capacity = isFullTeam ? playersPerTeamNum : playersInLastTeam;
            return {
                id: i,
                name: `Time ${i + 1}`,
                players: [],
                totalRating: 0,
                capacity: capacity
            };
        });
    
        // 3. Distribute players using a Snake Draft that respects each team's specific capacity
        const playersQueue = [...sortedPlayers];
        let round = 0;
        while (playersQueue.length > 0) {
            const teamOrder = round % 2 === 0 ? teamsWithCapacity : [...teamsWithCapacity].reverse();
            let playerWasAssignedInRound = false;

            for (const team of teamOrder) {
                // Assign a player only if the team is not yet full
                if (playersQueue.length > 0 && team.players.length < team.capacity) {
                    const player = playersQueue.shift()!;
                    team.players.push(player);
                    team.totalRating += player.rating;
                    playerWasAssignedInRound = true;
                }
            }

            // Safety break: if a full round completes with no assignments, exit to prevent infinite loop
            if (!playerWasAssignedInRound) {
                break;
            }
            round++;
        }
    
        // 4. Remove the temporary 'capacity' property
        const generatedTeams = teamsWithCapacity.map(({ capacity, ...team }) => team);

        // 5. Sort teams to show incomplete teams last
        const sortedGeneratedTeams = generatedTeams.sort((a, b) => b.players.length - a.players.length);
    
        // 6. Rename teams based on their final sorted order for consistent naming
        const finalTeams = sortedGeneratedTeams.map((team, index) => ({
            ...team,
            id: index + 1,
            name: `Time ${index + 1}`,
        }));
    
        setTeams(finalTeams);

        // Scroll to results after a short delay
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    
    const unassignedPlayers = useMemo(() => {
        const assignedPlayerIds = new Set(teams.flatMap(team => team.players.map(p => p.id)));
        return players.filter(p => !assignedPlayerIds.has(p.id));
    }, [players, teams]);


    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        SORTEAR TIMES
                    </h1>
                    <p className="mt-2 text-slate-400 text-lg">
                        Crie times equilibrados com base na habilidade dos jogadores.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Inputs and Player List */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700">
                           <div className="flex justify-between items-center mb-4 gap-4">
                                <button
                                    onClick={() => setIsTimerModalOpen(true)}
                                    className="flex w-full justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <ClockIcon className="w-5 h-5" />
                                    Temporizador
                                </button>
                                <button
                                    onClick={() => setIsLotteryModalOpen(true)}
                                    className="flex w-full justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <PokerChipIcon className="w-5 h-5 text-blue-500" />
                                    Tirar Sorte na tampinha
                                </button>
                           </div>
                            <PlayerForm onAddPlayer={addPlayer} sortByRating={sortByRating} />
                             <div className="mt-6">
                                <div className="flex items-center">
                                    <input
                                        id="sortByRating"
                                        type="checkbox"
                                        checked={sortByRating}
                                        onChange={(e) => setSortByRating(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-offset-slate-800 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="sortByRating" className="ml-2 block text-sm font-medium text-slate-300">
                                        Equilibrar times por nota
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="playersPerTeam" className="block text-sm font-medium text-slate-300 mb-2">
                                    Jogadores por Time
                                </label>
                                <input
                                    type="number"
                                    id="playersPerTeam"
                                    min="1"
                                    value={playersPerTeam}
                                    onChange={(e) => setPlayersPerTeam(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                />
                            </div>
                            <button
                                onClick={handleGenerateTeams}
                                disabled={players.length === 0}
                                className="mt-6 w-full flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg"
                            >
                                <SparklesIcon />
                                Gerar Times
                            </button>
                            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                        </div>

                        <PlayerList players={players} onRemovePlayer={removePlayer} onClearAll={clearAllPlayers} sortByRating={sortByRating} />
                    </div>

                    {/* Right Column: Team Results */}
                    <div ref={resultsRef} className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700 lg:h-full">
                         {teams.length > 0 ? (
                            <TeamResults
                                teams={teams}
                                unassignedPlayers={unassignedPlayers}
                                sortByRating={sortByRating}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                <SparklesIcon className="w-16 h-16 mb-4" />
                                <h3 className="text-xl font-semibold">Os times gerados aparecerão aqui.</h3>
                                <p>Adicione jogadores e clique em "Gerar Times" para começar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <LotteryModal 
                isOpen={isLotteryModalOpen}
                onClose={() => setIsLotteryModalOpen(false)}
            />
            <TimerModal 
                isOpen={isTimerModalOpen}
                onClose={() => setIsTimerModalOpen(false)}
            />
        </div>
    );
};

export default App;