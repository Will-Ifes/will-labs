import { useState } from "react";
import { Button, LabPage, TextField } from "@will-labs/ui-react";

export function LabDesign() {
  const [name, setName] = useState("Will Labs");
  const [feedback, setFeedback] = useState("");
  return (
    <div className="site-stack">
      <header className="site-page-head">
        <span className="site-eyebrow">
          LAB 02 / DEMONSTRAÇÃO DE ARQUITETURA
        </span>
        <h1>Uma decisão visual que vira código.</h1>
        <p>
          Exemplo de composição React para testar a reutilização do pacote. O
          conteúdo editorial completo do Lab ainda será escrito a partir do
          produto real.
        </p>
      </header>
      <LabPage
        title="Do token ao componente"
        learn={
          <>
            <p>
              Quando cada tela define seus próprios espaçamentos, o produto
              perde consistência. O Will Labs centraliza tokens e componentes
              para que o mesmo padrão apareça no guia e nos Labs.
            </p>
            <p>
              A implementação nasce de um problema de manutenção observável:
              estilos duplicados no guia v2.3.
            </p>
          </>
        }
        tryContent={
          <>
            <TextField
              label="Nome do experimento"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <p>
              Prévia: <strong>{name || "Sem nome"}</strong>
            </p>
            <Button onClick={() => setFeedback("Ação local executada.")}>
              Testar ação
            </Button>
            <p role="status">{feedback}</p>
          </>
        }
        code={
          'import { TextField, Button } from "@will-labs/ui-react";\n\n<TextField label="Nome do experimento" value={name} onChange={handleChange} />\n<Button onClick={run}>Testar ação</Button>'
        }
        architecture={
          <div className="site-architecture">
            <span>themes.json</span>
            <b aria-hidden="true">→</b>
            <span>tokens CSS</span>
            <b aria-hidden="true">→</b>
            <span>ui-react</span>
            <b aria-hidden="true">→</b>
            <span>Lab e guia</span>
          </div>
        }
        test={
          <p>
            Teste a edição do campo e a ação pelo teclado. O teste automatizado
            deste consumidor está em <code>tests/react-site.mjs</code>.
          </p>
        }
        production={
          <p>
            O exemplo ainda não salva dados. A aplicação pública exigirá
            persistência, falhas tratadas e revisão em outros navegadores antes
            de ser apresentada como Lab concluído.
          </p>
        }
        related={
          <p>
            <a href="#componentes">Abrir o catálogo React</a> ·{" "}
            <a href="/design-system">Ver o guia herdado</a>
          </p>
        }
      />
    </div>
  );
}
