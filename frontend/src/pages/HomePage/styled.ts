import styled from "styled-components"




export const ButtonsStyledContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;

    @media (max-width: 440px){
        flex-direction: column;
        align-items: center;
    
    }
`