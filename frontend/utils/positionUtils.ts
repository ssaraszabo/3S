import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export interface Position {
    left: number;
    top: number;
}

export const generateUniquePosition = (existingPositions: Position[]): Position => {
    let newPosition: Position;
    const minDistance = 100;
     const navbarHeight = 80; 
    const safeBottom = height - navbarHeight; 

    do {
        newPosition = {
            left: Math.random() * (width - 100),
            top: (height / 2) + Math.random() * ((safeBottom - height/2) - 100)
        };
    } while (existingPositions.some(pos => 
        Math.sqrt(
            Math.pow(pos.left - newPosition.left, 2) + 
            Math.pow(pos.top - newPosition.top, 2)
        ) < minDistance
    ));

    return newPosition;
};

export const generatePositions = (count: number): Position[] => {
    return Array(count).fill(null).reduce((acc) => {
        const newPos = generateUniquePosition(acc);
        return [...acc, newPos];
    }, [] as Position[]);
};