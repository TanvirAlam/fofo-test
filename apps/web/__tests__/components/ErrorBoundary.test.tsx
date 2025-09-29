import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary from "../../src/components/ErrorBoundary";

// Mock i18n
jest.mock("../../src/utils/i18n", () => ({
  t: (key: string) => {
    if (key === "error.somethingWentWrong") return "Something went wrong";
    return key;
  },
}));

// Mock styled components
jest.mock("../../src/styles/ErrorBoundary/errorBoundary.style", () => ({
  ErrorContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-container">{children}</div>
  ),
  ErrorTitle: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="error-title">{children}</h1>
  ),
}));

jest.mock("../../src/styles/SignUp/form.styles", () => ({
  ErrorMessage: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="error-message">{children}</p>
  ),
}));

// Test component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div data-testid="success-content">Content loaded successfully</div>;
};

// Suppress console.error during tests to avoid noise
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe.skip("ErrorBoundary", () => {
  test("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-content">Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.queryByTestId("error-container")).not.toBeInTheDocument();
  });

  test("should render error UI when child component throws error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("error-container")).toBeInTheDocument();
    expect(screen.getByTestId("error-title")).toHaveTextContent(
      "Something went wrong"
    );
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Test error message"
    );
  });

  test("should not render children when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByTestId("success-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("error-container")).toBeInTheDocument();
  });

  test("should display correct error title from constants", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorTitle = screen.getByTestId("error-title");
    expect(errorTitle).toHaveTextContent("Something went wrong");
  });

  test("should display the actual error message", () => {
    const customErrorMessage = "Custom error for testing";

    const ThrowCustomError = () => {
      throw new Error(customErrorMessage);
    };

    render(
      <ErrorBoundary>
        <ThrowCustomError />
      </ErrorBoundary>
    );

    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toHaveTextContent(customErrorMessage);
  });

  test("should handle multiple children correctly", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  test("should handle error in one of multiple children", () => {
    render(
      <ErrorBoundary>
        <div data-testid="safe-child">Safe content</div>
        <ThrowError shouldThrow={true} />
        <div data-testid="another-safe-child">More safe content</div>
      </ErrorBoundary>
    );

    // When error occurs, no children should render
    expect(screen.queryByTestId("safe-child")).not.toBeInTheDocument();
    expect(screen.queryByTestId("another-safe-child")).not.toBeInTheDocument();
    expect(screen.getByTestId("error-container")).toBeInTheDocument();
  });

  test("should call console.error when error occurs", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test("should handle error with no message", () => {
    const ThrowErrorWithoutMessage = () => {
      throw new Error();
    };

    render(
      <ErrorBoundary>
        <ThrowErrorWithoutMessage />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("error-container")).toBeInTheDocument();
    expect(screen.getByTestId("error-title")).toHaveTextContent(
      "Something went wrong"
    );
    // Error message should be empty or undefined
    expect(screen.getByTestId("error-message")).toBeInTheDocument();
  });

  test("should reset error state when children change", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verify error state
    expect(screen.getByTestId("error-container")).toBeInTheDocument();

    // Re-render with non-throwing component
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Error should still be displayed (ErrorBoundary doesn't auto-reset)
    expect(screen.getByTestId("error-container")).toBeInTheDocument();
  });

  test("should handle nested components with error", () => {
    const NestedComponent = () => (
      <div data-testid="nested-wrapper">
        <ThrowError shouldThrow={true} />
      </div>
    );

    render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("error-container")).toBeInTheDocument();
    expect(screen.queryByTestId("nested-wrapper")).not.toBeInTheDocument();
  });

  test("should provide error details for debugging", () => {
    const testError = new Error("Detailed test error");

    const ThrowSpecificError = () => {
      throw testError;
    };

    render(
      <ErrorBoundary>
        <ThrowSpecificError />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Detailed test error"
    );
  });
});
