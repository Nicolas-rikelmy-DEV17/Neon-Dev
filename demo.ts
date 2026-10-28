
interface Desenvolvedor {
  nome: string;
  cargo: string;
  tecnologias: string[];
}

const equipe: Desenvolvedor[] = [
  {
    nome: "Iury Madeira",
    cargo: "Desenvolvedor",
    tecnologias: ["HTML", "CSS", "JavaScript"]
  },
  {
    nome: "Nicolas Rikelmy",
    cargo: "Dev",
    tecnologias: ["HTML", "CSS", "JavaScript", "TypeScript"]
  }
];

function apresentarEquipe(pessoas: Desenvolvedor[]): void {
  pessoas.forEach((pessoa) => {
    console.log(`${pessoa.nome} — ${pessoa.cargo}`);
    console.log("Tecnologias:", pessoa.tecnologias.join(", "));
  });
}

apresentarEquipe(equipe);
