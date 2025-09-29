"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import DashboardContent from "@/components/features/Dashboard/DashboardContent";
import Header from "@/components/Layout/Header";
import DashboardLayout from "@/components/Layout/Dashboard";
import { MENU_LABELS } from "@/utils/SidebarItems";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState<string>(MENU_LABELS.DASHBOARD);

  const renderHeader = () => {
    return <Header title={activePage} />;
  };

  const renderContent = () => {
    if (activePage === MENU_LABELS.DASHBOARD) return <DashboardContent />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  };

  return (
    <DashboardLayout
      header={renderHeader()}
      sidebar={<Sidebar activeItem={activePage} onSelect={setActivePage} />}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
