Um aluno que deseja verificar como fica o seu histórico no novo currículo deve criar um arquivo historico.csv nesta pasta seguindo o exemplo em historico_exemplo.csv (valores separados por vírgula).

Colunas do CSV:
* 'cartao' (código do aluno): pode ser qualquer número ou palavra, só necessita ser sempre igual para o mesmo aluno;
* 'ingresso' (semestre de matrícula na disciplina): é irrelevante por ora pode se colocar qualquer coisa ali [1];
* 'codigo' (da disciplina do currículo velho): é obrigatória e tem de estar exatamente igual a como aparece em disciplinas.csv;
* 'titulo': é irrelevante (só ajuda a saber qual disciplina é qual, pode ser consultada em disciplinas.csv);
* 'situação' (da disciplina): tem de possuir a string "Aprovado" (sem as aspas) só com a primeira letra maiúscula [2].

[1] O ingresso pode ser relevante para algumas disciplinas de tópicos no futuro (para saber o que era realmente a matéria de tópicos quando foi cursada e destravar algo baseado nisso).
[2] Disciplinas em que o aluno não foi aprovado não são consideradas para nada e não precisam ser incluídas.
