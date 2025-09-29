import styled from "styled-components";
import { COLORS } from "@packages/ui";

export const ContentGrid = styled.div<{
  $columns?: string;
  $gap?: number;
  $height?: string;
}>`
  display: grid;
  margin-top: 20px;
  grid-template-columns: ${({ $columns }) => $columns || "1fr 1fr"};
  gap: ${({ $gap }) => $gap ?? 5}px;
  height: ${({ $height }) => $height || "auto"};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div<{ $width?: string; $height?: string }>`
  background: ${COLORS.primary.WHITE};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 2px 8px ${COLORS.neutral[200]};
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "200px"};
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${COLORS.primary[400]};
`;

export const Placeholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.neutral[500]};
  font-size: 14px;
`;

export const PageTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${COLORS.primary.BLACK};
`;
