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
    // Portuguese summaries may start with a component name such as Select.
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [1, "always", 100],
  },
};
