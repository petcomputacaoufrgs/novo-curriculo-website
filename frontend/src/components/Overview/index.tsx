import React, { useEffect, useState } from "react";
import { OverViewImages, SummarizedMetrics } from "../../types";
import {
  Table,
  Container,
  Section,
  ImagePreview,
  TableContainer,
  ToggleGroup,
  ToggleButton,
  Column,
  SectionTitle,
  WarningText
} from "./styled";

type OverviewCategory = "Total" | "Obrigatórios" | "Eletivos";

interface OverviewProps {
  images: OverViewImages;
  metrics: SummarizedMetrics;
}

const Overview: React.FC<OverviewProps> = ({ images, metrics }) => {
  const [selectedCategory, setSelectedCategory] = useState<OverviewCategory>("Total");
  const [windowSize, setWindowSize] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fields = ["obrigatorios", "eletivos", "total"] as const;

  const mapCategoryToFields = (category: OverviewCategory) => {
    switch (category) {
      case "Eletivos":
        return "eletivos";
      case "Obrigatórios":
        return "obrigatorios";
      case "Total":
        return "total";
    }
  };

  const renderTable = (suffix: "antigos" | "novos") => (
    <Table>
      <thead>
        <tr>
          <th>Caráter</th>
          <th>Feitos</th>
          {windowSize > 560 && <th>Restantes</th>}
          <th>Total</th>
          <th>Porcentagem Integralizada</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => {
          const key = `${field}_${suffix}` as keyof SummarizedMetrics;
          const metric = metrics[key];
          if (!metric || metric.length !== 2) return null;

          const [total, feitos] = metric;

          return (
            <tr key={key}>
              <td>{field}</td>
              <td>{feitos}</td>
              {windowSize > 560 && <td>{total - feitos}</td>}
              <td>{total}</td>
              <td>{((feitos / total) * 100).toFixed(1)}%</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );

  const renderImage = (preffix: OverviewCategory, suffix: "antigos" | "novos") => {
    const key = `${mapCategoryToFields(preffix)}_${suffix}` as keyof OverViewImages;
    const src = images[key];
    return <ImagePreview src={`data:image/png;base64,${src}`} alt={key} />;
  };

  return (
    <Container>
      {/* Currículo Antigo */}
      <Section>
        <TableContainer>
          <SectionTitle>Créditos no Currículo Antigo</SectionTitle>
          {renderTable("antigos")}
        </TableContainer>

        {windowSize > 1220 && (
          <Column>
            <ToggleGroup>
              {(["Total", "Obrigatórios", "Eletivos"] as OverviewCategory[]).map((category) => (
                <ToggleButton
                  key={category}
                  $active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </ToggleButton>
              ))}
            </ToggleGroup>
            {renderImage(selectedCategory, "antigos")}
          </Column>
        )}
      </Section>

      {/* Currículo Novo */}
      <Section>
        <TableContainer>
          <SectionTitle>Créditos no Currículo Novo</SectionTitle>
          {renderTable("novos")}
        </TableContainer>

        {windowSize > 1220 && (
          <Column>
            <ToggleGroup>
              {(["Total", "Obrigatórios", "Eletivos"] as OverviewCategory[]).map((category) => (
                <ToggleButton
                  key={category}
                  $active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </ToggleButton>
              ))}
            </ToggleGroup>
            {renderImage(selectedCategory, "novos")}
          </Column>
        )}
      </Section>

      <WarningText>
        As informações acadêmicas exibidas neste site são uma previsão baseada no novo currículo do curso. Entretanto,
        há decisões que os alunos podem tomar para a aplicação de algumas das regras. Portanto algumas informações
        podem não ser totalmente precisas.
      </WarningText>
    </Container>
  );
};

export default Overview;
