"use client";

import React, { useState } from "react";
import {
  HeaderWrapper,
  TitleWrapper,
  RightWrapper,
  IconButton,
  ProfileCircle,
  ProfileWrapper,
  ProfileInfo,
  ProfileLabel,
  Dropdown,
  Divider,
} from "./styles";
import { AvatarIcon } from "@/assets/icons/avterIcon";
import NotificaationIcon from "@/assets/icons/NotificationIcon";

type HeaderProps = {
  title: string;
};

const profileInfo = ["poke poke", "Manager"];

const ProfileDetails = () => (
  <>
    {profileInfo.map(text => (
      <ProfileLabel key={text}>{text}</ProfileLabel>
    ))}
  </>
);

const Header = ({ title }: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <HeaderWrapper>
      <TitleWrapper>
        <p>{title}</p>
      </TitleWrapper>

      <RightWrapper>
        <Divider />
        <IconButton>
          <NotificaationIcon />
        </IconButton>

        <ProfileWrapper>
          <ProfileCircle onClick={() => setShowDropdown(!showDropdown)}>
            <AvatarIcon />
          </ProfileCircle>
          <ProfileInfo>
            <ProfileDetails />
          </ProfileInfo>
          {showDropdown && (
            <Dropdown>
              <ProfileDetails />
            </Dropdown>
          )}
        </ProfileWrapper>
      </RightWrapper>
    </HeaderWrapper>
  );
};

export default Header;
