
import React from 'react';
import { StarIcon } from './icons/Icons';

interface StarRatingProps {
    rating: number;
    setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        onClick={() => setRating(ratingValue)}
                        className={`transition-colors duration-200 ${
                            ratingValue <= rating ? 'text-yellow-400' : 'text-slate-600'
                        } hover:text-yellow-300`}
                        aria-label={`Nota ${ratingValue}`}
                    >
                       <StarIcon className="w-8 h-8"/>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;