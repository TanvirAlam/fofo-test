import { renderHook, act } from "@testing-library/react";
import { useNavigation } from "../../src/hooks/useNavigation";
import { MENU_LABELS } from "../../src/utils/SidebarItems";

describe("useNavigation", () => {
  test("should initialize with correct default values", () => {
    const { result } = renderHook(() => useNavigation());

    expect(result.current.sidebarOpen).toBe(false);
    expect(result.current.activeSection).toBe(MENU_LABELS.DASHBOARD);
  });

  test("should toggle sidebar state", () => {
    const { result } = renderHook(() => useNavigation());

    // Initially closed
    expect(result.current.sidebarOpen).toBe(false);

    // Toggle to open
    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);

    // Toggle back to closed
    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);
  });

  test("should close sidebar when called", () => {
    const { result } = renderHook(() => useNavigation());

    // First open the sidebar
    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);

    // Close it
    act(() => {
      result.current.closeSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);
  });

  test("should handle closeSidebar when already closed", () => {
    const { result } = renderHook(() => useNavigation());

    // Already closed by default
    expect(result.current.sidebarOpen).toBe(false);

    // Call close again
    act(() => {
      result.current.closeSidebar();
    });

    // Should remain closed
    expect(result.current.sidebarOpen).toBe(false);
  });

  test("should update active section", () => {
    const { result } = renderHook(() => useNavigation());

    // Default is Dashboard
    expect(result.current.activeSection).toBe(MENU_LABELS.DASHBOARD);

    // Change to Active Orders
    act(() => {
      result.current.setActiveSection(MENU_LABELS.ACTIVE_ORDERS);
    });

    expect(result.current.activeSection).toBe(MENU_LABELS.ACTIVE_ORDERS);

    // Change to Payments
    act(() => {
      result.current.setActiveSection(MENU_LABELS.PAYMENTS);
    });

    expect(result.current.activeSection).toBe(MENU_LABELS.PAYMENTS);
  });

  test("should handle all menu label transitions", () => {
    const { result } = renderHook(() => useNavigation());

    // Test all menu labels
    const menuLabels = Object.values(MENU_LABELS);

    menuLabels.forEach(label => {
      act(() => {
        result.current.setActiveSection(label);
      });

      expect(result.current.activeSection).toBe(label);
    });
  });

  test("should maintain independent state for sidebar and active section", () => {
    const { result } = renderHook(() => useNavigation());

    // Open sidebar and change section
    act(() => {
      result.current.toggleSidebar();
      result.current.setActiveSection(MENU_LABELS.MENU);
    });

    expect(result.current.sidebarOpen).toBe(true);
    expect(result.current.activeSection).toBe(MENU_LABELS.MENU);

    // Close sidebar but keep section
    act(() => {
      result.current.closeSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);
    expect(result.current.activeSection).toBe(MENU_LABELS.MENU);
  });

  test("should provide function reference behavior correctly", () => {
    const { result, rerender } = renderHook(() => useNavigation());

    const initialToggleSidebar = result.current.toggleSidebar;
    const initialCloseSidebar = result.current.closeSidebar;
    const initialSetActiveSection = result.current.setActiveSection;

    // Trigger a re-render
    rerender();

    // Custom functions should be new instances (not memoized)
    expect(result.current.toggleSidebar).not.toBe(initialToggleSidebar);
    expect(result.current.closeSidebar).not.toBe(initialCloseSidebar);

    // setActiveSection is the useState setter, which is stable
    expect(result.current.setActiveSection).toBe(initialSetActiveSection);
  });

  test("should handle multiple rapid toggles", () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.toggleSidebar(); // open
    });
    expect(result.current.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar(); // close
    });
    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.toggleSidebar(); // open
    });
    expect(result.current.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar(); // close
    });
    expect(result.current.sidebarOpen).toBe(false);
  });

  test("should handle complex navigation scenarios", () => {
    const { result } = renderHook(() => useNavigation());

    // Simulate typical user interaction flow
    act(() => {
      // User opens sidebar
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);
    expect(result.current.activeSection).toBe(MENU_LABELS.DASHBOARD);

    act(() => {
      // User navigates to orders
      result.current.setActiveSection(MENU_LABELS.ACTIVE_ORDERS);
    });

    expect(result.current.activeSection).toBe(MENU_LABELS.ACTIVE_ORDERS);

    act(() => {
      // User closes sidebar
      result.current.closeSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);
    expect(result.current.activeSection).toBe(MENU_LABELS.ACTIVE_ORDERS);

    act(() => {
      // User opens sidebar again and navigates to payments
      result.current.toggleSidebar();
      result.current.setActiveSection(MENU_LABELS.PAYMENTS);
    });

    expect(result.current.sidebarOpen).toBe(true);
    expect(result.current.activeSection).toBe(MENU_LABELS.PAYMENTS);
  });
});
