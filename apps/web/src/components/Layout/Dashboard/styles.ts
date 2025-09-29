import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral[10]};
`;

export const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 240px;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-left: 1px;
  }
`;

export const ContentWrapper = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;
