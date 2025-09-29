import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.Heading3}
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 0;
`;

export const BodyParagraph = styled.p`
  ${({ theme }) => theme.typography.Body_Paragraph}
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 0;
`;
