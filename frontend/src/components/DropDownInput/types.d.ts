export interface ISearchBar{
    options : string[]; // Opções que aparecerão no DropDown
    width: string; // Comprimento tanto do input quanto do DropDown
    fontSize: string; // Tamanho da fonte tanto no input quanto nas opções do DropDown
    placeholder: string; // Placeholder do input
    query: string;
    setQuery: (query: string) => void;
    readOnly?: boolean; // Se o input é apenas para leitura. Se for true, o usuário não pode digitar nada dele
    resetOption?: string; // Se definida, o usuário pode clicar na opção com o valor passado para limpar o input
    numOptionsShowed?: number; // Quantas opções devem ser mostradas no DropDown. Se não for definido, o padrão é 5
}