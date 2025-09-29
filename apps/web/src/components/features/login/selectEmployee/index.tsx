import React from "react";
import Image, { StaticImageData } from "next/image";
import managerImage from "@/assets/photos/manager.png";
import { Container, Avatar, Info, Name, Role, Chevron } from "./style";
import { ChevronIcon } from "../../../../assets/icons/chevronIcon";

type SelectEmployeeProps = {
  name?: string;
  role?: string;
  photo?: StaticImageData | string;
};

const SelectEmployee: React.FC<SelectEmployeeProps> = ({
  name = "Anna Jensen",
  role = "Manager",
  photo = managerImage,
}) => {
  return (
    <Container type="button" aria-label={`${name}, ${role}`}>
      <Avatar>
        <Image src={photo} alt={name} fill />
      </Avatar>

      <Info>
        <Name>{name}</Name>
        <Role>{role}</Role>
      </Info>

      <Chevron aria-hidden="true">
        <ChevronIcon />
      </Chevron>
    </Container>
  );
};

export default SelectEmployee;
