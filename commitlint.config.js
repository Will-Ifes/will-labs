// Commits seguem docs/padroes/10-git-revisao-e-seguranca.md: tipo(escopo): resumo.
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "style",
        "test",
        "docs",
        "chore",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
    // Resumos em português começam com letra minúscula ou nome próprio (Select, Dropdown).
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [1, "always", 100],
  },
};
