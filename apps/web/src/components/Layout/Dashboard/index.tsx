"use client";

import React from "react";
import { LayoutWrapper, MainWrapper, ContentWrapper } from "./styles";

type DashboardLayoutProps = {
  header?: React.ReactNode;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
};

const DashboardLayout = ({
  header,
  children,
  sidebar,
}: DashboardLayoutProps) => {
  return (
    <LayoutWrapper>
      {sidebar}
      <MainWrapper>
        {header}
        {children && <ContentWrapper>{children}</ContentWrapper>}
      </MainWrapper>
    </LayoutWrapper>
  );
};

export default DashboardLayout;
