
export interface Player {
    id: number;
    name: string;
    rating: number;
    isGoalkeeper?: boolean;
}

export interface Team {
    id: number;
    name: string;
    players: Player[];
    totalRating: number;
}
