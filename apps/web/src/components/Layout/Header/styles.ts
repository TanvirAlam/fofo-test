import styled from "styled-components";

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.neutral[10]};
  padding: 0 20px;
  position: relative;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    margin-left: 40px;
  }
`;

export const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  flex: 1;
`;

export const Divider = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-left: 15px;
`;

export const IconButton = styled.button`
  border: none;
  padding: 7px 8px;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary[50]};
  border-radius: 20%;
  font-size: 18px;
  cursor: pointer;
`;

export const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ProfileCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary[50]};
  font-weight: bold;
  cursor: pointer;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ProfileLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary[500]};
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: ${({ theme }) => theme.colors.neutral[10]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 5px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 20;

  @media (min-width: 769px) {
    display: none;
  }
`;
