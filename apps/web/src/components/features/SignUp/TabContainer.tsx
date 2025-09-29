"use client";
import React from "react";
import { ManagerIcon, StaffIcon } from "../../../assets/icons/TabIcons";
import {
  TabContainer as TabContainerStyle,
  Tab,
} from "@/styles/SignUp/formWrapper.style";

type UserType = "manager" | "staff";

interface TabContainerProps {
  activeTab: UserType;
  onTabChange: (tab: UserType) => void;
}

export default function TabContainer({
  activeTab,
  onTabChange,
}: TabContainerProps) {
  return (
    <TabContainerStyle role="tablist" aria-label="User type selection">
      <Tab
        role="tab"
        aria-selected={activeTab === "manager"}
        aria-label="Select Manager account type"
        $active={activeTab === "manager"}
        onClick={() => onTabChange("manager")}
      >
        Manager <ManagerIcon />
      </Tab>
      <Tab
        role="tab"
        aria-selected={activeTab === "staff"}
        aria-label="Select Staff account type"
        $active={activeTab === "staff"}
        onClick={() => onTabChange("staff")}
      >
        Staff <StaffIcon />
      </Tab>
    </TabContainerStyle>
  );
}
