// src/styled.d.ts
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string
    text: string
    abaAtiva: string
    abaInativa: string
    textoInativo: string
  }
}
