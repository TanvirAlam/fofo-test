import { MENU_LABELS } from "@/utils/SidebarItems";
import { useState } from "react";

export function useNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>(
    MENU_LABELS.DASHBOARD
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return {
    sidebarOpen,
    activeSection,
    toggleSidebar,
    closeSidebar,
    setActiveSection,
  };
}
