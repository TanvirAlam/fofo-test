import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: ${({ theme }) => theme.typography.Body_Title1.fontFamily};
  background: ${({ theme }) => theme.colors.neutral[10]};

  @media (max-width: 48rem) {
    flex-direction: column;
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 0;
  width: 50%;
  padding: 2rem;
  overflow-y: auto;
  max-height: 100vh;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 48rem) {
    width: 100%;
    min-height: 100vh;
    padding: 1rem;
  }
`;

const ImageContainer = styled.div`
  width: 50%;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  overflow: hidden;
  border-top-left-radius: 3.125rem;
  border-bottom-left-radius: 3.125rem;

  @media (max-width: 48rem) {
    display: none;
  }
`;

const StyledImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export { MainContainer, FormContainer, ImageContainer, StyledImage };
