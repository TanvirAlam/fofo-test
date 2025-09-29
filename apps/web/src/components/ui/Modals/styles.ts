import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.primary.BLACK_50};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 16px;
  padding: 32px 24px 24px;
  text-align: center;
`;

export const IconWrapper = styled.div<{ $bgColor?: string }>`
  margin: 0 auto 16px;
  width: ${({ $bgColor }) => ($bgColor ? "76px" : " 64px")};
  height: ${({ $bgColor }) => ($bgColor ? "76px" : "64px")};
  background-color: ${({ $bgColor }) => $bgColor || "transparent"};
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 16px;
`;

export const Message = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: 24px;
`;

export const ButtonGroup = styled.div<{ $row?: boolean }>`
  display: flex;
  flex-direction: ${({ $row }) => ($row ? "row" : "column")};
  gap: 12px;
  justify-content: ${({ $row }) => ($row ? "space-between" : "flex-start")};
`;

export const Text = styled.span<{ use?: string }>`
  font-size: 14px;
  font-weight: 500;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
