// DiagramaComResumo.tsx
import React, { useState } from 'react';
import { FrontData } from '../../types';
import { Container, IframeWrapper, Lista, StyledIframe, TextoIntro, ToggleButton, ToggleWrapper, Topico } from './styled';

interface Props {
  newUrl: string | null;
  oldUrl: string | null;
  windowSize: number;
  frontData?: FrontData;
}

const path_length = (path: string) => {
  if(path === "")
    return 0;

  return path.split(">").length
}

const DiagramaComResumo: React.FC<Props> = ({ oldUrl, newUrl, windowSize, frontData }) => {
  const [mode, setMode] = useState<"antigo" | "novo">("novo");

  const urlSelecionada = mode === "antigo" ? oldUrl : newUrl;

  return (
    <Container>

      <ToggleWrapper>
        <ToggleButton $active={mode === "antigo"} onClick={() => setMode("antigo")}>
          Antigo
        </ToggleButton>
        <ToggleButton $active={mode === "novo"} onClick={() => setMode("novo")}>
          Novo
        </ToggleButton>
      </ToggleWrapper>



      <IframeWrapper>
        {urlSelecionada && (
          <StyledIframe
            key={windowSize}
            id="meuIframe"
            src={urlSelecionada}
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
              Currículo Antigo (tamanho {path_length(frontData.caminho_antigo)}): {frontData.caminho_antigo}
            </Topico>
            <Topico>
              Currículo Novo (tamanho {path_length(frontData.caminho_novo)}): {frontData.caminho_novo}
            </Topico>
          </Lista>
        </div>
      )}
    </Container>
  );
};

export default DiagramaComResumo;
