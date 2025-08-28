
import React, { useState } from 'react';
import { StarIcon } from './icons/Icons';

interface StarRatingProps {
    rating: number;
    setRating: (rating: number) => void;
    disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, disabled = false }) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, value: number) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const isHalf = (e.clientX - rect.left) / rect.width < 0.5;
        setHoverRating(value - (isHalf ? 0.5 : 0));
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, value: number) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const isHalf = (e.clientX - rect.left) / rect.width < 0.5;
        setRating(value - (isHalf ? 0.5 : 0));
    };

    return (
        <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(null)}>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                const displayRating = hoverRating !== null ? hoverRating : rating;

                return (
                    <button
                        type="button"
                        key={ratingValue}
                        onMouseMove={(e) => handleMouseMove(e, ratingValue)}
                        onClick={(e) => handleClick(e, ratingValue)}
                        disabled={disabled}
                        className={`relative transition-colors duration-200 text-slate-600 ${
                            !disabled ? 'hover:text-yellow-300' : ''
                        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label={`Nota ${ratingValue}`}
                    >
                        <StarIcon className="w-8 h-8" />
                        <span 
                            className="absolute top-0 left-0 overflow-hidden h-full"
                            style={{ width: displayRating >= ratingValue ? '100%' : displayRating >= ratingValue - 0.5 ? '50%' : '0%' }}
                        >
                             <StarIcon className="w-8 h-8 text-yellow-400" />
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
