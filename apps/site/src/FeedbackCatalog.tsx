import { useState, type ReactNode } from "react";
import {
  Banner,
  Button,
  Divider,
  EmptyState,
  Progress,
  Skeleton,
  Surface,
  Tag,
  Toast,
} from "@will-labs/ui-react";
import "./catalog-views.css";
const titles: Record<string, string> = {
  "comp-feedback": "Feedback",
  "comp-alert": "Avisos",
  "comp-banner": "Banner",
  "comp-toast": "Toast",
  "comp-progress": "Barra de progresso",
  "comp-empty": "Empty state",
  "comp-skeleton": "Skeleton",
  "comp-tags": "Etiquetas",
};
export const feedbackIds = Object.keys(titles);
function Page({
  view,
  description,
  children,
}: {
  view: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="catalog-view">
      <header className="site-page-head">
        <h1>{titles[view]}</h1>
        <p>{description}</p>
      </header>
      {children}
    </div>
  );
}
function FeedbackView() {
  const [open, setOpen] = useState(false),
    close = () => setOpen(false);
  return (
    <Page
      view="comp-feedback"
      description="Aviso é persistente e contextual; banner alcança a página; toast confirma uma ação e desaparece. Progresso mostra uma tarefa."
    >
      <Surface title="Escolha o feedback pelo tempo de vida">
        <p>
          <strong>Aviso:</strong> permanece junto ao campo ou à seção até a
          situação mudar.
        </p>
        <Banner title="Rascunho local">
          As alterações ainda não foram enviadas.
        </Banner>
        <Divider />
        <p>
          <strong>Banner:</strong> informação persistente de alcance maior na
          página.
        </p>
        <Banner kind="warning" title="Publicação pendente">
          Revise os responsáveis antes de publicar.
        </Banner>
        <Divider />
        <p>
          <strong>Toast:</strong> confirmação temporária após uma ação.
        </p>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir Toast
        </Button>
      </Surface>
      <Toast
        open={open}
        title="Rascunho salvo"
        message="Você pode continuar editando."
        kind="success"
        onClose={close}
      />
    </Page>
  );
}
function Alerts() {
  return (
    <Page
      view="comp-alert"
      description="Mensagens persistentes dentro da página, com intenção, texto e ação."
    >
      <div className="catalog-stack">
        <Banner title="Informação">
          A execução em andamento continua disponível na lista.
        </Banner>
        <Banner kind="success" title="Alterações salvas">
          O rascunho foi atualizado e pode ser retomado.
        </Banner>
        <Banner kind="warning" title="Revise antes de publicar">
          Há dois passos sem responsável. Complete os dados antes de continuar.
        </Banner>
        <Banner kind="danger" title="Não foi possível salvar">
          Verifique a conexão e tente novamente. O texto digitado permanece no
          formulário.
        </Banner>
      </div>
      <p>
        A cor reforça a mensagem; ícone, título e texto carregam o significado.
      </p>
    </Page>
  );
}
function BannerView() {
  const [visible, setVisible] = useState(true);
  return (
    <Page
      view="comp-banner"
      description="Mensagem de alcance amplo, acima do conteúdo que ela afeta."
    >
      <Surface title="Modo de demonstração">
        {visible ? (
          <div className="catalog-banner-row">
            <Banner title="Modo de demonstração">
              Os fluxos desta página são exemplos e nenhuma alteração é enviada
              ao servidor.
            </Banner>
            <Button
              variant="text"
              aria-label="Fechar aviso"
              onClick={() => setVisible(false)}
            >
              ×
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setVisible(true)}>
            Mostrar banner novamente
          </Button>
        )}
        <p>
          Use o banner para uma condição que afeta a página inteira. Depois de
          fechar, ele pode ser recuperado.
        </p>
      </Surface>
    </Page>
  );
}
function ToastView() {
  const [kind, setKind] = useState<"info" | "success" | "warning" | "danger">(
      "info",
    ),
    [open, setOpen] = useState(false),
    close = () => setOpen(false);
  return (
    <Page
      view="comp-toast"
      description="Retorno temporário após uma ação, anunciado sem bloquear a tela."
    >
      <Surface title="Teste os retornos">
        <p>
          Cada botão mostra uma mensagem curta. Erros que exigem correção
          permanecem junto do campo ou da seção afetada.
        </p>
        <div className="catalog-actions">
          {[
            ["Sucesso", "success"],
            ["Informação", "info"],
            ["Atenção", "warning"],
            ["Erro", "danger"],
          ].map(([label, tone]) => (
            <Button
              variant="outline"
              key={tone}
              onClick={() => {
                setKind(tone as typeof kind);
                setOpen(true);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </Surface>
      <Toast
        open={open}
        title={
          {
            success: "Alterações salvas",
            info: "Informação",
            warning: "Revise a etapa",
            danger: "Não foi possível salvar",
          }[kind]
        }
        message="Mensagem curta de retorno da ação."
        kind={kind}
        onClose={close}
      />
    </Page>
  );
}
function ProgressView() {
  const [done, setDone] = useState(9);
  return (
    <Page
      view="comp-progress"
      description="Informe quanto falta e o que está acontecendo, com espaços definidos pelos tokens."
    >
      <Surface title="Importando fluxos">
        <Progress label="Importação dos fluxos" value={done} max={20} />
        <p role="status">{done} de 20 fluxos concluídos.</p>
        <Button
          variant="outline"
          onClick={() => setDone(Math.min(20, done + 2))}
          disabled={done === 20}
        >
          Avançar demonstração
        </Button>
      </Surface>
      <Surface title="Verificando conexão">
        <p>
          Aguardando resposta. O sistema informará o resultado quando a
          verificação terminar.
        </p>
        <div className="catalog-indeterminate" role="status">
          Verificando…
        </div>
      </Surface>
    </Page>
  );
}
function Empty() {
  const [status, setStatus] = useState("");
  return (
    <Page
      view="comp-empty"
      description="Três situações diferentes: primeiro uso, busca sem resultados e erro ao carregar."
    >
      <div className="catalog-grid">
        <EmptyState
          title="Você ainda não criou um fluxo"
          description="Comece com um nome e os passos necessários. Depois, teste a execução."
          action={
            <Button
              variant="outline"
              onClick={() => setStatus("Criação iniciada.")}
            >
              Criar primeiro fluxo
            </Button>
          }
        />
        <EmptyState
          variant="search"
          title="Nenhum resultado para “revisão”"
          description="Tente outra palavra ou remova os filtros aplicados."
          action={
            <Button
              variant="outline"
              onClick={() => setStatus("Filtros limpos.")}
            >
              Limpar filtros
            </Button>
          }
        />
        <EmptyState
          variant="error"
          title="Não foi possível carregar"
          description="Os fluxos continuam disponíveis. Verifique a conexão e tente novamente."
          action={
            <Button
              variant="outline"
              onClick={() => setStatus("Nova tentativa solicitada.")}
            >
              Tentar novamente
            </Button>
          }
        />
      </div>
      <p role="status">{status}</p>
      <Surface title="Quando usar">
        <p>
          Primeiro uso orienta a criar; busca vazia orienta a mudar a consulta;
          falha oferece nova tentativa.
        </p>
      </Surface>
    </Page>
  );
}
function SkeletonView() {
  const [loading, setLoading] = useState(true);
  return (
    <Page
      view="comp-skeleton"
      description="Reserva o espaço do conteúdo enquanto os dados chegam, com anúncio textual da operação."
    >
      <Surface title="Resultados">
        {loading ? (
          <Skeleton lines={3} />
        ) : (
          <ul>
            <li>Lab de interface</li>
            <li>Lab de segurança</li>
            <li>Lab de performance</li>
          </ul>
        )}
        <p role="status">
          {loading ? "Resultados em carregamento." : "3 Labs encontrados."}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1000);
          }}
        >
          Simular carregamento
        </Button>
      </Surface>
    </Page>
  );
}
function Tags() {
  const [removable, setRemovable] = useState(true);
  return (
    <Page
      view="comp-tags"
      description="Rótulos breves de estado, com cor semântica e texto legível."
    >
      <Surface title="Estados e variantes">
        <div className="catalog-actions">
          <Tag tone="neutral">Rascunho</Tag>
          <Tag tone="info">Em andamento</Tag>
          <Tag tone="success">Concluído</Tag>
          <Tag tone="warning">Atenção</Tag>
          <Tag tone="danger">Falhou</Tag>
          <Tag avatar="AM">Ana Martins</Tag>
          {removable && (
            <Tag onRemove={() => setRemovable(false)}>Removível</Tag>
          )}
        </div>
        <p role="status">
          {removable
            ? "A etiqueta removível está disponível."
            : "Etiqueta removida."}
        </p>
        <p>
          A etiqueta sempre contém uma palavra. A cor complementa a informação.
        </p>
      </Surface>
    </Page>
  );
}
export function FeedbackCatalog({ view }: { view: string }) {
  switch (view) {
    case "comp-feedback":
      return <FeedbackView />;
    case "comp-alert":
      return <Alerts />;
    case "comp-banner":
      return <BannerView />;
    case "comp-toast":
      return <ToastView />;
    case "comp-progress":
      return <ProgressView />;
    case "comp-empty":
      return <Empty />;
    case "comp-skeleton":
      return <SkeletonView />;
    case "comp-tags":
      return <Tags />;
    default:
      return null;
  }
}
