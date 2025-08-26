
export interface Player {
    id: number;
    name: string;
    rating: number;
}

export interface Team {
    id: number;
    name: string;
    players: Player[];
    totalRating: number;
}
