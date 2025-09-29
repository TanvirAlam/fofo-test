import { createGlobalStyle } from "styled-components";

const GlobalStyle: ReturnType<typeof createGlobalStyle> = createGlobalStyle` 
  :root {
    --background: ${({ theme }) => theme.colors.primary[400]};
    --foreground: ${({ theme }) => theme.colors.neutral[300]};
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: ${({ theme }) => theme.colors.primary[800]};
      --foreground: ${({ theme }) => theme.colors.neutral[100]};
    }
  }

  body {
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.primary[400]};
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }
`;

export { GlobalStyle };
