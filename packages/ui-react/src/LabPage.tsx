import { type ReactNode } from "react";
import { Surface } from "./Surface";
import { Tabs } from "./Tabs";
import { Code } from "./Code";

export function LabPage({
  title,
  learn,
  tryContent,
  code,
  architecture,
  test,
  production,
  related,
}: {
  title: string;
  learn: ReactNode;
  tryContent: ReactNode;
  code: string;
  architecture: ReactNode;
  test: ReactNode;
  production: ReactNode;
  related: ReactNode;
}) {
  return (
    <Surface title={title}>
      <Tabs
        label="Conteúdo do Lab"
        items={[
          { id: "learn", label: "Learn", content: learn },
          { id: "try", label: "Try", content: tryContent },
          {
            id: "code",
            label: "Code",
            content: <Code code={code} language="JavaScript" />,
          },
          { id: "architecture", label: "Architecture", content: architecture },
        ]}
      />
      <Surface title="Como testar isso">{test}</Surface>
      <Surface title="Considerações de produção">{production}</Surface>
      <Surface title="Relacionados">{related}</Surface>
    </Surface>
  );
}
