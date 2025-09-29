"use client";

import React, { useState } from "react";
import {
  SidebarWrapper,
  SidebarHeader,
  SidebarMenu,
  SidebarItem,
  HeaderContent,
  HeaderText,
  HeaderAddress,
  LogoWrapper,
  MobileToggle,
  Overlay,
} from "./styles";
import Image from "next/image";
import formImage from "@/assets/photos/logo.png";
import { menuItems } from "@/utils/SidebarItems";
import MenuIcon from "@/assets/icons/MenuIcon";

type SidebarProps = {
  activeItem: string;
  onSelect: (label: string) => void;
};

const Sidebar = ({ activeItem, onSelect }: SidebarProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <MobileToggle onClick={() => setOpen(prev => !prev)}>
        <MenuIcon />
      </MobileToggle>

      {open && <Overlay onClick={() => setOpen(false)} />}

      <SidebarWrapper $open={open}>
        <SidebarHeader>
          <HeaderContent>
            <LogoWrapper>
              <Image src={formImage} alt="form image" width={40} height={40} />
            </LogoWrapper>
            <HeaderText>
              Poke.Poke
              <HeaderAddress>Vestergade 4-6, 1456 Denmark</HeaderAddress>
            </HeaderText>
          </HeaderContent>
        </SidebarHeader>

        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarItem
              key={item.label}
              onClick={() => {
                onSelect(item.label);
                setOpen(false);
              }}
              $active={activeItem === item.label}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </SidebarItem>
          ))}
        </SidebarMenu>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
