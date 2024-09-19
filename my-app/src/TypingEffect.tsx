import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

interface TypingEffectProps {
  text: string; // Define the type for the text prop
  speed?: number; // Optional speed prop
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState('');
  console.log('Text passed to TypingEffect:', displayedText);

  useEffect(() => {
    setDisplayedText(''); // Reset the displayed text when text prop changes
    let index = 0;
  
    const interval = setInterval(() => {
      if (index < text.length-1) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);    
  
    return () => clearInterval(interval);
  }, [text, speed]);
  

  return (
    <Typography variant="h6" sx={{ marginBottom: 4, textAlign: 'center', color: '#666' }}>
      {displayedText}
    </Typography>
  );
  
};

export default TypingEffect;
