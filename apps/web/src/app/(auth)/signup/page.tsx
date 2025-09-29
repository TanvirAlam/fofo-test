"use client";
import Image from "next/image";
import formImage from "@/assets/photos/manager-photo.png";
import SignUpForm from "@/components/features/SignUp/form";
import {
  MainContainer,
  FormContainer,
  ImageContainer,
  StyledImage,
} from "@/styles/SignUp/signup.style";

export default function SignUpPage() {
  return (
    <MainContainer>
      <FormContainer>
        <SignUpForm />
      </FormContainer>

      <ImageContainer>
        <StyledImage>
          <Image src={formImage} alt="form image" fill />
        </StyledImage>
      </ImageContainer>
    </MainContainer>
  );
}
