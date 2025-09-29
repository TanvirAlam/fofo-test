import { renderHook, act } from "@testing-library/react";
import { useCounter } from "../../src/hooks/useCounter";

describe("useCounter", () => {
  test("should initialize with default value of 0", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  test("should initialize with provided initial value", () => {
    const initialValue = 10;
    const { result } = renderHook(() => useCounter(initialValue));

    expect(result.current.count).toBe(initialValue);
  });

  test("should increment count by 1", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(6);
  });

  test("should decrement count by 1", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  test("should handle multiple increments", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(3);
  });

  test("should handle multiple decrements", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.count).toBe(3);
  });

  test("should handle mixed increment and decrement operations", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment(); // 1
      result.current.increment(); // 2
      result.current.decrement(); // 1
      result.current.increment(); // 2
      result.current.decrement(); // 1
      result.current.decrement(); // 0
    });

    expect(result.current.count).toBe(0);
  });

  test("should handle negative values correctly", () => {
    const { result } = renderHook(() => useCounter(-5));

    expect(result.current.count).toBe(-5);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(-4);

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-5);
  });

  test("should allow count to go below zero", () => {
    const { result } = renderHook(() => useCounter(1));

    act(() => {
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });

  test("should work with large numbers", () => {
    const largeNumber = 1000000;
    const { result } = renderHook(() => useCounter(largeNumber));

    expect(result.current.count).toBe(largeNumber);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(largeNumber + 1);
  });

  test("should maintain separate state for multiple instances", () => {
    const { result: result1 } = renderHook(() => useCounter(0));
    const { result: result2 } = renderHook(() => useCounter(10));

    act(() => {
      result1.current.increment();
      result2.current.decrement();
    });

    expect(result1.current.count).toBe(1);
    expect(result2.current.count).toBe(9);
  });

  test("should provide new function references on re-render (no memoization)", () => {
    const { result, rerender } = renderHook(() => useCounter(0));

    const initialIncrement = result.current.increment;
    const initialDecrement = result.current.decrement;

    // Trigger a re-render
    rerender();

    // Functions should be new instances (not memoized)
    expect(result.current.increment).not.toBe(initialIncrement);
    expect(result.current.decrement).not.toBe(initialDecrement);

    // But they should still work correctly
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
