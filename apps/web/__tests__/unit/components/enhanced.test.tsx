import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const InteractiveComponent = ({
  onButtonClick,
  initialText = "Click me",
}: {
  onButtonClick?: () => void;
  initialText?: string;
}) => {
  const [text, setText] = React.useState(initialText);

  return (
    <div>
      <button
        onClick={() => {
          setText("Clicked!");
          onButtonClick?.();
        }}
      >
        {text}
      </button>
    </div>
  );
};

describe("Enhanced Component Testing", () => {
  it("should handle user interactions", async () => {
    const mockHandler = jest.fn();
    const user = userEvent.setup();

    render(<InteractiveComponent onButtonClick={mockHandler} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Click me");

    await user.click(button);

    expect(button).toHaveTextContent("Clicked!");
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("should support async testing patterns", async () => {
    const AsyncComponent = () => {
      const [data, setData] = React.useState<string | null>(null);

      React.useEffect(() => {
        setTimeout(() => setData("Loaded!"), 100);
      }, []);

      return <div>{data || "Loading..."}</div>;
    };

    render(<AsyncComponent />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Loaded!")).toBeInTheDocument();
    });
  });
});
