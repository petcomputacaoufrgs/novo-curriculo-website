import { styled } from "styled-components";

export const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: rgba(32, 42, 67, 1);
  padding: 5%;
  color: #fefefe;
  gap: 2rem;


  @media (max-width: 540px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;


export const Column = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 540px) {
    align-items: center;
  }
`;

export const LeftColumn = styled(Column)`
  .emails {
    list-style: none;
    font-size: 12px;
    padding: 0;
  }

  .social {
    display: flex;
    align-items: center;
    gap: 5px;

    li {
      list-style: none;
    }

    img {
      height: 40px;
      width: auto;
    }
  }
`;

export const RightColumn = styled(Column)`
  text-align: right;

  ul {
    list-style: none;
    font-size: 12px;
    padding: 0;
    margin: 0;
  }

  p {
    font-size: 12px;
    margin: 0;
  }

  @media (max-width: 540px) {
    text-align: center;
  }
`;

