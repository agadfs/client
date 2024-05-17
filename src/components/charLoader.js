// Character.js
import React from 'react';

import CharacterMovingRight from './AnimationLoader/characterMovingRight';
import CharacterStopRight from './characterLoader/characterStopRight';
import CharacterMovingLeft from './AnimationLoader/characterMovingLeft';
import CharacterStopLeft from './characterLoader/characterStopLeft';
import CharacterMovingDown from './AnimationLoader/characterMovingDown';
import CharacterStopDown from './characterLoader/characterStopDown';
import CharacterMovingUp from './AnimationLoader/characterMovingUp';
import CharacterStopUp from './characterLoader/characterStopUp';
// Import other components...

const Character = ({ direction, isMoving }) => {
  if (direction === 'top' && isMoving) return <CharacterMovingUp />;
  if (direction === 'top' && !isMoving) return <CharacterStopUp />;
  if (direction === 'right' && isMoving) return <CharacterMovingRight />;
  if (direction === 'right' && !isMoving) return <CharacterStopRight />;
  if (direction === 'left' && isMoving) return <CharacterMovingLeft />;
  if (direction === 'left' && !isMoving) return <CharacterStopLeft />;
  if (direction === 'down' && isMoving) return <CharacterMovingDown />;
  if (direction === 'down' && !isMoving) return <CharacterStopDown />;
  return null;
};

export default Character;