// DiagramaComResumo.tsx
import React from 'react';
import styled from 'styled-components';
import { FrontData } from '../../types';

interface Props {
  blobUrl: string | null;
  windowSize: number;
  frontData?: FrontData;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  align-items: flex-start;
  padding: 30px 0 30px 0;
  gap: 16px;
`;

const IframeWrapper = styled.div`
  width: 100%;
  border-radius: 15px;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 38vw;
  border-radius: 15px;
`;

const TextoIntro = styled.p`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 18px;
  text-align: left;
`;

const Topico = styled.li`
  margin-left: 1.25rem;
  text-align: left;
`;

const Lista = styled.ul`
  padding-left: 1rem;
`;

const DiagramaComResumo: React.FC<Props> = ({ blobUrl, windowSize, frontData }) => {
  return (
    <Container>
      <IframeWrapper>
        {blobUrl && (
          <StyledIframe
            key={windowSize}
            id="meuIframe"
            src={blobUrl}
          />
        )}
      </IframeWrapper>

      {frontData && (
        <div>
          <TextoIntro>
            Caminho mais longo a partir dos pré-requisitos (mínimo de semestres para concluir todas as obrigatórias assumindo que tu sempre faça todas as possíveis):
          </TextoIntro>
          <Lista>
            <Topico>
              Currículo Antigo (tamanho {frontData.caminho_antigo.split(">").length}): {frontData.caminho_antigo}
            </Topico>
            <Topico>
              Currículo Novo (tamanho {frontData.caminho_novo.split(">").length}): {frontData.caminho_novo}
            </Topico>
          </Lista>
        </div>
      )}
    </Container>
  );
};

export default DiagramaComResumo;
