import styled from "styled-components";

export const Container = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 3rem;
  width: 100%;
  height: 4.2rem;
  padding: 1rem;
  gap: 1rem;

  border: none;
  border-radius: 2rem;

  background-color: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Avatar = styled.div`
  position: relative;
  width: 2.94rem;
  height: 2.94rem;
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 2.94rem;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Name = styled.div`
  text-align: left;
  ${({ theme }) => theme.typography.Heading7}
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Role = styled.div`
  text-align: left;
  margin-top: 0.125rem;
  ${({ theme }) => theme.typography.Caption_Large}
`;

export const Chevron = styled.div`
  margin-left: auto;
  display: grid;
  place-items: center;
  height: 100%;
  width: 2rem;
`;
