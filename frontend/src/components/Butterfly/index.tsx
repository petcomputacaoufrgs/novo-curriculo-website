import React from 'react';
import { OverlayContainer, OverlayContent, SpinnerImage } from './styles';
import Loading_1 from '../../assets/loading_1.png';
import Loading_2 from '../../assets/loading_2.png';
import Loading_3 from '../../assets/loading_3.png';
import Loading_4 from '../../assets/loading_4.png';
import Loading_5 from '../../assets/loading_5.png';
import Loading_6 from '../../assets/loading_6.png';
import Loading_7 from '../../assets/loading_7.png';
import Loading_8 from '../../assets/loading_8.png';
import Loading_9 from '../../assets/loading_9.png';
const images = [
  Loading_1,
  Loading_2,
  Loading_3,
  Loading_4,
  Loading_5,
  Loading_6,
  Loading_7,
  Loading_8,
  Loading_9
];

const Butterfly: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  
  const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <OverlayContainer>
      <OverlayContent $isDarkTheme={isDarkTheme}>
        <SpinnerImage src={images[index]} alt="Carregando..." />
        <p>Calculando, por favor aguarde...</p>
      </OverlayContent>
    </OverlayContainer>
  );
};


export default Butterfly;
