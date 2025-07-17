
import React from 'react';
import { Container } from './styled';
interface DiagramProps {
  blobUrl: string;
  show: number;
}

const Diagram: React.FC<DiagramProps> = ({ blobUrl, show }) => {
  const widthByShow: Record<number, string> = {
    1: "1500px",
    2: "1000px",
    3: "600px",
    4: "300px"
  };

  return (
    <Container>
        <iframe
        style={{ width: widthByShow[show] || "1000px", height: "60vh" }}
        src={blobUrl}
        ></iframe>
    </Container>
  );
};

export default Diagram;
