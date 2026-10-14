import { Surface } from "@will-labs/ui-react";
import "./case-study.css";

const repository = "https://github.com/Will-Ifes/will-labs";
const source = (path: string) => `${repository}/blob/main/${path}`;
const images = `${import.meta.env.BASE_URL}case-study/`;

export function CaseStudy() {
  return (
    <article className="catalog-view case-study">
      <header className="site-page-head">
        <span className="site-eyebrow">ESTUDO DE CASO · WILL OLIVEIRA</span>
        <h1>Do guia visual ao componente React.</h1>
        <p>
          Como organizei o Will Labs para conectar identidade visual,
          implementação e verificações de comportamento.
        </p>
        <div className="site-actions">
          <a href="#comp-modal">Experimentar o modal</a>
          <a href={source("docs/case-study.md")}>
            Ler com referências no GitHub
          </a>
        </div>
      </header>

      <dl className="case-study-facts" aria-label="Recorte do projeto">
        <div>
          <dt>Componentes React</dt>
          <dd>40</dd>
        </div>
        <div>
          <dt>Temas</dt>
          <dd>8</dd>
        </div>
        <div>
          <dt>Views auditadas</dt>
          <dd>61</dd>
        </div>
      </dl>
      <p className="site-footnote">
        Recorte documentado em 13/10/2026. Os números descrevem a base
        registrada, não resultados de uso por clientes.
      </p>

      <Surface title="O problema que escolhi resolver">
        <p>
          Criei o Will Labs para reunir componentes e decisões que possam ser
          examinados em uma aplicação pública. O guia original já tinha uma
          identidade visual definida. Na migração para React, o desafio foi
          preservar essa referência e transformar os exemplos em peças
          reutilizáveis, com estado, contratos e interação verificáveis.
        </p>
        <p>
          O recorte deste caso é o design system e seu catálogo. O produto
          OpsFlow, a API e os Labs futuros pertencem ao roadmap; a demonstração
          de Fluxos ainda não tem backend.
        </p>
      </Surface>

      <Surface title="As decisões que sustentam a interface">
        <ol className="case-study-decisions">
          <li>
            <strong>Separar tokens, componentes e catálogo.</strong> Cores e
            temas ficam em <code>packages/tokens</code>; a implementação React,
            em <code>packages/ui-react</code>; o site consome os pacotes. A
            camada de UI não recebe os dados do futuro produto.
          </li>
          <li>
            <strong>Preservar o guia como referência.</strong> O guia HTML
            continua disponível para comparação. Parte do CSS é compartilhada
            durante a migração, uma dependência que ainda precisa evoluir.
          </li>
          <li>
            <strong>Usar controles nativos quando atendem ao contrato.</strong>{" "}
            No modal, o elemento <code>dialog</code> fornece a base de abertura
            e modalidade; React coordena o estado, o fechamento e o retorno do
            foco.
          </li>
        </ol>
        <p>
          <a href={source("docs/adr/ADR-004-design-system.md")}>
            Decisão inicial do design system
          </a>
          {" · "}
          <a href={source("packages/ui-react/src/overlays.tsx")}>
            Implementação das camadas
          </a>
        </p>
      </Surface>

      <Surface title="Um desafio concreto: fechar e retomar a tarefa">
        <p>
          Ao abrir uma confirmação, a pessoa precisa entender a consequência,
          cancelar pelo teclado e continuar do ponto em que estava. Na migração
          do modal, mantive o título associado ao diálogo, o estado controlado
          pelo consumidor e uma referência ao botão que iniciou a ação.
        </p>
        <p>
          A implementação usa <code>showModal()</code>, trata o evento
          <code> cancel</code> do diálogo e devolve o foco ao acionador após o
          fechamento. O teste de navegador abre o modal, pressiona Esc, confirma
          que ele fechou e verifica qual controle voltou a receber foco.
        </p>
        <div className="case-study-shots">
          <figure>
            <img
              src={`${images}modal-desktop.webp`}
              alt="Modal de confirmação do catálogo React no tema âmbar escuro, em tela larga."
              width="1363"
              height="936"
              loading="lazy"
            />
            <figcaption>
              Captura do catálogo React publicado, em 14/10/2026.
            </figcaption>
          </figure>
          <figure>
            <img
              src={`${images}themes.webp`}
              alt="Seletor do catálogo React exibindo as oito paletas claras e escuras."
              width="1363"
              height="936"
              loading="lazy"
            />
            <figcaption>
              Oito temas compartilham os mesmos componentes.
            </figcaption>
          </figure>
        </div>
        <p>
          <a href="#comp-modal">Abrir a demonstração</a>
          {" · "}
          <a href={source("tests/react-advanced.mjs")}>
            Conferir os cenários de teclado e foco
          </a>
        </p>
      </Surface>

      <Surface title="O que foi verificado e o que ainda falta">
        <p>
          A auditoria registrada cobre 61 views, com axe em desktop claro e
          mobile escuro, e informa zero violações automáticas nesse conjunto. Os
          testes de camadas em React também percorrem oito temas e duas
          larguras. O resultado de cada execução do CI pode ser consultado no
          repositório.
        </p>
        <p>
          A avaliação automática tem limites. O roteiro manual de leitor de tela
          ainda está pendente; Firefox e WebKit têm verificações de smoke; as
          capturas não têm comparação visual automática. A decisão por Vitest
          está documentada, mas não representa uma cobertura unitária já
          entregue neste recorte.
        </p>
        <p>
          <a href={source("evidence/VIEW-AUDIT.md")}>Auditoria registrada</a>
          {" · "}
          <a href={`${repository}/actions/workflows/ci.yml`}>Execuções do CI</a>
          {" · "}
          <a href={source("docs/adr/ADR-007-testes.md")}>Evolução dos testes</a>
        </p>
      </Surface>

      <Surface title="Resultado e próximo passo">
        <p>
          O catálogo permite experimentar os componentes e seguir a decisão até
          o código e o teste. O cuidado central foi transformar aparência em um
          contrato de uso: o que abre, o que fecha, qual estado aparece e para
          onde o foco volta.
        </p>
        <p>
          Os próximos passos são executar a avaliação manual com leitor de tela,
          ampliar os testes isolados e evoluir o primeiro fluxo de produto com
          contratos de API. O roadmap mantém essas entregas separadas do que já
          está disponível.
        </p>
        <p>
          <a href={source("docs/plano/roadmap.md")}>Consultar o roadmap</a>
        </p>
      </Surface>
    </article>
  );
}
