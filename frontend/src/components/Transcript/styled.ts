import styled from 'styled-components'
export const OuterTranscriptBox = styled.div`
  border-radius: 15px;
  background-color: rgba(122, 142, 167, 1);
  padding: 10px;
  height: 400px;
  width: auto;
  box-sizing: border-box;
`

export const InnerTranscriptBox = styled.div`
  border-radius: 10px;
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`


export const InputsBox = styled.div`
  display: flex;
  width: 100%;
  gap: 18px;
  align-items: center;

  @media(max-width: 470px){
    flex-direction: column;
  }
`

