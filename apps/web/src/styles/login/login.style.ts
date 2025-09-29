import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${({ theme }) => theme.media.md} {
    flex-direction: row;
    height: 100vh;
  }
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto 0;
  padding: 0 1.5rem;

  ${({ theme }) => theme.media.sm} {
    padding: 0 2rem;
  }

  ${({ theme }) => theme.media.md} {
    width: 50%;
    margin: auto 0;
    padding: 0 3rem;
  }
`;

export const LoginWrapper = styled.div`
  width: 100%;
  max-width: 29.125rem;
`;

export const LoginButton = styled.div`
  margin-top: 2rem;

  ${({ theme }) => theme.media.md} {
    margin-top: 3.125rem;
  }
`;

export const ForgotPassword = styled.h3`
  margin-top: 1.5rem;
  text-align: center;
  ${({ theme }) => theme.typography.Heading7}
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

export const SignInText = styled.p`
  margin-top: 3.125rem;
  text-align: center;
  line-height: 160%;
  ${({ theme }) => theme.typography.Heading7}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const SignUpLink = styled.a`
  ${({ theme }) => theme.typography.Heading6}
  color: ${({ theme }) => theme.colors.primary[500]};
`;
