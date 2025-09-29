import styled from "styled-components";

export const SidebarWrapper = styled.aside<{ $open: boolean }>`
  width: 240px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[500]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  z-index: 90;

  @media (max-width: 768px) {
    transform: ${({ $open }) =>
      $open ? "translateX(0)" : "translateX(-100%)"};
  }
`;

export const LogoWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

export const SidebarHeader = styled.div`
  margin-top: 54px;
  padding: 4px 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  font-weight: bold;
`;

export const HeaderAddress = styled.span`
  font-size: 12px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-top: 4px;
`;

export const SidebarMenu = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

export const SidebarItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary[500] : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[50] : theme.colors.primary[500]};
  border-radius: 8px;
  margin-bottom: 8px;

  span {
    margin-left: 8px;
  }
`;

export const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 110;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 90;
  }
`;
