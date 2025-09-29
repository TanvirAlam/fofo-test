import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../hooks/useCounter';

describe('useCounter', () => {
  it('initializes with default value of 0', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    
    expect(result.current.count).toBe(5);
  });

  it('increments count correctly', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(2);
  });

  it('decrements count correctly', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(3);
  });

  it('resets count to initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    // Change the count
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(12);
    
    // Reset should return to initial value
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });

  it('sets count to specific value', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.setCount(42);
    });
    
    expect(result.current.count).toBe(42);
  });

  it('handles negative values correctly', () => {
    const { result } = renderHook(() => useCounter(-5));
    
    expect(result.current.count).toBe(-5);
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(-6);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(-5);
  });

  it('maintains function reference stability', () => {
    const { result, rerender } = renderHook(() => useCounter());
    
    const firstIncrement = result.current.increment;
    const firstDecrement = result.current.decrement;
    const firstSetCount = result.current.setCount;
    
    rerender({});
    
    expect(result.current.increment).toBe(firstIncrement);
    expect(result.current.decrement).toBe(firstDecrement);
    expect(result.current.setCount).toBe(firstSetCount);
  });

  it('updates reset function when initial value changes', () => {
    const { result, rerender } = renderHook(
      ({ initialValue }) => useCounter(initialValue),
      { initialProps: { initialValue: 10 } }
    );
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(11);
    
    // Change initial value
    rerender({ initialValue: 20 });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(20);
  });
});
