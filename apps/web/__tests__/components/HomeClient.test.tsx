import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import HomeClient from "../../src/components/HomeClient";
import { BUTTON_TYPE } from "../../src/utils/constants";
import { COLORS } from "@packages/ui";

// Mock react-i18next
const mockT = jest.fn((key: string) => {
  const translations: Record<string, string> = {
    Welcome: "Welcome",
    Disable: "Disabled",
    Manager: "Manager",
    fullName: "Full Name",
    enterName: "Enter your name",
    forgetPasswordTitle: "Forgot Password?",
    forgetPasswordSubtitle: "Reset your password",
    forgetPasswordMessage: "Enter your email to reset password",
    requestPinReset: "Request PIN Reset",
    resetPasswordTitle: "Reset Password",
    resetPasswordMessage: "Enter your registered email",
    resendPassword: "Resend Password",
    cancel: "Cancel",
    viaEmail: "Via Email",
    enterRegisteredEmail: "Enter registered email",
  };
  return translations[key] || key;
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock styled components
jest.mock("../../src/styles/root/root.style", () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Main: ({ children }: { children: React.ReactNode }) => (
    <main data-testid="main">{children}</main>
  ),
  ButtonGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="button-group">{children}</div>
  ),
  StyledLogoIcon: () => <div data-testid="logo-icon" />,
}));

// Mock UI components
jest.mock("../../src/components/ui/Buttons", () => ({
  __esModule: true,
  default: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button
      data-testid="generic-button"
      data-variant={variant}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("../../src/components/ui/InputFields", () => ({
  __esModule: true,
  default: ({ label, placeholder, type, ...props }: any) => (
    <div data-testid="input-field">
      <label>{label}</label>
      <input placeholder={placeholder} type={type} {...props} />
    </div>
  ),
}));

jest.mock("../../src/components/ui/Modals", () => ({
  GenericModal: ({
    visible,
    onClose,
    title,
    subtitle,
    message,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    children,
    icon,
    iconTop,
    iconBgColor,
    buttonRow,
    ...props
  }: any) =>
    visible ? (
      <div data-testid="generic-modal" data-button-row={buttonRow} {...props}>
        <div data-testid="modal-backdrop" onClick={onClose} />
        <div data-testid="modal-content">
          {icon && (
            <div
              data-testid="modal-icon"
              data-icon-top={iconTop}
              data-icon-bg={iconBgColor}
            >
              {icon}
            </div>
          )}
          <h2 data-testid="modal-title">{title}</h2>
          {subtitle && <h3 data-testid="modal-subtitle">{subtitle}</h3>}
          <p data-testid="modal-message">{message}</p>
          {children && <div data-testid="modal-children">{children}</div>}
          <div data-testid="modal-actions">
            {cancelLabel && (
              <button data-testid="modal-cancel" onClick={onCancel}>
                {cancelLabel}
              </button>
            )}
            <button data-testid="modal-confirm" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    ) : null,
}));

jest.mock("../../src/assets/icons/avterIcon", () => ({
  AvatarIcon: ({ width, height }: { width: number; height: number }) => (
    <div data-testid="avatar-icon" data-width={width} data-height={height}>
      Avatar
    </div>
  ),
}));

describe.skip("HomeClient Component", () => {
  beforeEach(() => {
    mockT.mockClear();
  });

  describe("Initial Render", () => {
    test("should render all main elements", () => {
      render(<HomeClient />);

      expect(screen.getByTestId("container")).toBeInTheDocument();
      expect(screen.getByTestId("main")).toBeInTheDocument();
      expect(screen.getByTestId("logo-icon")).toBeInTheDocument();
      expect(screen.getByTestId("button-group")).toBeInTheDocument();
      expect(screen.getByTestId("input-field")).toBeInTheDocument();
    });

    test("should render all buttons with correct labels", () => {
      render(<HomeClient />);

      const buttons = screen.getAllByTestId("generic-button");
      expect(buttons).toHaveLength(3);

      expect(buttons[0]).toHaveTextContent("Welcome");
      expect(buttons[1]).toHaveTextContent("Disabled");
      expect(buttons[2]).toHaveTextContent("Manager");
    });

    test("should render input field with correct properties", () => {
      render(<HomeClient />);

      const inputField = screen.getByTestId("input-field");
      expect(inputField).toBeInTheDocument();

      const label = screen.getByText("Full Name");
      const input = screen.getByPlaceholderText("Enter your name");

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });

    test("should have correct button variants", () => {
      render(<HomeClient />);

      const buttons = screen.getAllByTestId("generic-button");

      expect(buttons[0]).toHaveAttribute("data-variant", BUTTON_TYPE.PRIMARY);
      expect(buttons[1]).not.toHaveAttribute("data-variant"); // disabled button
      expect(buttons[2]).toHaveAttribute("data-variant", BUTTON_TYPE.PRIMARY);
    });

    test("should have disabled button properly disabled", () => {
      render(<HomeClient />);

      const buttons = screen.getAllByTestId("generic-button");
      expect(buttons[1]).toBeDisabled();
    });
  });

  describe("Translation Integration", () => {
    test("should call translation function for all text elements", () => {
      render(<HomeClient />);

      const expectedTranslationKeys = [
        "Welcome",
        "Disable",
        "Manager",
        "fullName",
        "enterName",
      ];

      expectedTranslationKeys.forEach(key => {
        expect(mockT).toHaveBeenCalledWith(key);
      });
    });

    test("should display translated text", () => {
      render(<HomeClient />);

      expect(screen.getByText("Welcome")).toBeInTheDocument();
      expect(screen.getByText("Disabled")).toBeInTheDocument();
      expect(screen.getByText("Manager")).toBeInTheDocument();
      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your name")
      ).toBeInTheDocument();
    });
  });

  describe("Modal Interactions", () => {
    test("should open welcome modal when Welcome button is clicked", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const welcomeButton = screen.getByText("Welcome");
      await user.click(welcomeButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      expect(screen.getByTestId("modal-title")).toHaveTextContent(
        "Forgot Password?"
      );
      expect(screen.getByTestId("modal-subtitle")).toHaveTextContent(
        "Reset your password"
      );
      expect(screen.getByTestId("modal-message")).toHaveTextContent(
        "Enter your email to reset password"
      );
      expect(screen.getByTestId("modal-confirm")).toHaveTextContent(
        "Request PIN Reset"
      );
    });

    test("should open manager modal when Manager button is clicked", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const managerButton = screen.getByText("Manager");
      await user.click(managerButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      expect(screen.getByTestId("modal-title")).toHaveTextContent(
        "Reset Password"
      );
      expect(screen.getByTestId("modal-message")).toHaveTextContent(
        "Enter your registered email"
      );
      expect(screen.getByTestId("modal-confirm")).toHaveTextContent(
        "Resend Password"
      );
      expect(screen.getByTestId("modal-cancel")).toHaveTextContent("Cancel");
    });

    test("should close welcome modal when backdrop is clicked", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const welcomeButton = screen.getByText("Welcome");
      await user.click(welcomeButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      const backdrop = screen.getByTestId("modal-backdrop");
      await user.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
      });
    });

    test("should close welcome modal when confirm button is clicked", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const welcomeButton = screen.getByText("Welcome");
      await user.click(welcomeButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal-confirm");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
      });
    });

    test("should close manager modal when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const managerButton = screen.getByText("Manager");
      await user.click(managerButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      const cancelButton = screen.getByTestId("modal-cancel");
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
      });
    });

    test("should close manager modal when confirm button is clicked", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const managerButton = screen.getByText("Manager");
      await user.click(managerButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal-confirm");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("Modal Content and Configuration", () => {
    test("should configure welcome modal with correct properties", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const welcomeButton = screen.getByText("Welcome");
      await user.click(welcomeButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      // Check icon properties
      const modalIcon = screen.getByTestId("modal-icon");
      expect(modalIcon).toHaveAttribute("data-icon-top", "false");
      expect(modalIcon).toHaveAttribute("data-icon-bg", COLORS.primary[100]);

      // Check avatar icon
      const avatarIcon = screen.getByTestId("avatar-icon");
      expect(avatarIcon).toHaveAttribute("data-width", "58");
      expect(avatarIcon).toHaveAttribute("data-height", "58");

      // Ensure no cancel button in welcome modal
      expect(screen.queryByTestId("modal-cancel")).not.toBeInTheDocument();
    });

    test("should configure manager modal with correct properties", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const managerButton = screen.getByText("Manager");
      await user.click(managerButton);

      await waitFor(() => {
        expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
      });

      // Check button row configuration
      const modal = screen.getByTestId("generic-modal");
      expect(modal).toHaveAttribute("data-button-row", "true");

      // Check modal children (input field)
      const modalChildren = screen.getByTestId("modal-children");
      expect(modalChildren).toBeInTheDocument();

      // Check input field in modal
      const inputFields = screen.getAllByTestId("input-field");
      expect(inputFields).toHaveLength(2); // One in main content, one in modal

      // No subtitle in manager modal
      expect(screen.queryByTestId("modal-subtitle")).not.toBeInTheDocument();

      // No icon in manager modal
      expect(screen.queryByTestId("modal-icon")).not.toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    test("should handle multiple modal states independently", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      // Open welcome modal
      const welcomeButton = screen.getByText("Welcome");
      await user.click(welcomeButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal-title")).toHaveTextContent(
          "Forgot Password?"
        );
      });

      // Close welcome modal
      const backdrop = screen.getByTestId("modal-backdrop");
      await user.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
      });

      // Open manager modal
      const managerButton = screen.getByText("Manager");
      await user.click(managerButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal-title")).toHaveTextContent(
          "Reset Password"
        );
      });
    });

    test("should prevent multiple modals from opening simultaneously", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      // This test assumes only one modal can be open at a time
      const welcomeButton = screen.getByText("Welcome");
      await user.click(welcomeButton);

      await waitFor(() => {
        expect(screen.getAllByTestId("generic-modal")).toHaveLength(1);
        expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
      });

      // Try to open manager modal while welcome modal is open
      const managerButton = screen.getByText("Manager");
      await user.click(managerButton);

      // Should still show welcome modal (first one opened) and prevent the manager modal from opening
      await waitFor(() => {
        expect(screen.getAllByTestId("generic-modal")).toHaveLength(1);
        expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
        expect(screen.queryByText("Reset Password")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    test("should have proper button accessibility", () => {
      render(<HomeClient />);

      const buttons = screen.getAllByTestId("generic-button");

      buttons.forEach((button, index) => {
        if (index === 1) {
          // disabled button
          expect(button).toBeDisabled();
        } else {
          expect(button).toBeEnabled();
        }
      });
    });

    test("should have proper input accessibility", () => {
      render(<HomeClient />);

      const input = screen.getByPlaceholderText("Enter your name");
      expect(input).toBeEnabled();
      expect(input).toHaveAttribute("type", "text");
    });
  });

  describe("Edge Cases", () => {
    test("should handle rapid button clicks", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const welcomeButton = screen.getByText("Welcome");

      // Rapid clicks
      await user.click(welcomeButton);
      await user.click(welcomeButton);
      await user.click(welcomeButton);

      // Should only open one modal
      await waitFor(() => {
        expect(screen.getAllByTestId("generic-modal")).toHaveLength(1);
      });
    });

    test("should handle keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      // Tab through buttons
      // Initial tab should focus the input field
      await user.tab();
      expect(screen.getByPlaceholderText("Enter your name")).toHaveFocus();

      // Tab to Welcome button
      await user.tab();
      expect(screen.getAllByTestId("generic-button")[0]).toHaveFocus(); // Welcome

      // Tab to Manager button (Disabled button is skipped)
      await user.tab();
      expect(screen.getAllByTestId("generic-button")[2]).toHaveFocus(); // Manager
    });

    test("should handle disabled button interactions", async () => {
      const user = userEvent.setup();
      render(<HomeClient />);

      const disabledButton = screen.getAllByTestId("generic-button")[1];
      expect(disabledButton).toBeDisabled();

      // Clicking disabled button should do nothing
      await user.click(disabledButton);

      await waitFor(() => {
        expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
      });
    });
  });
});
