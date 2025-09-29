"use client";
import React, { useRef, useState } from "react";
import { Container, Label, Row, PinBox } from "./styles";
import { onlyDigits } from "../../../utils/constants";

export type PinInputFieldProps = {
  label?: string;
  length?: number;
  value: string;
  disabled?: boolean;
  gap?: number;
  onChange: (val: string) => void;
};

export default function PinInputField({
  label,
  length = 4,
  value,
  disabled = false,
  gap = 56,
  onChange,
}: PinInputFieldProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [cells, setCells] = useState<string[]>(() =>
    Array.from({ length }, (_, i) => onlyDigits(value)[i] ?? "")
  );

  const setAt = (i: number, v: string) => {
    const digit = onlyDigits(v).slice(0, 1);
    setCells(prev => {
      const arr = [...prev];
      arr[i] = digit;
      return arr;
    });
    const next = (() => {
      const arr = [...cells];
      arr[i] = digit;
      return arr.join("");
    })();
    onChange(next);

    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (e.key) {
      case "Backspace":
        if (cells[i]) {
          e.preventDefault();
          const arr = [...cells];
          arr[i] = "";
          setCells(arr);
          onChange(arr.join(""));
        } else if (i > 0) {
          e.preventDefault();
          refs.current[i - 1]?.focus();
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        refs.current[Math.max(0, i - 1)]?.focus();
        break;
      case "ArrowRight":
        e.preventDefault();
        refs.current[Math.min(length - 1, i + 1)]?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <Row $gap={gap} role="group" aria-label={label || "PIN input"}>
        {cells.map((d, i) => (
          <PinBox
            key={i}
            ref={el => {
              refs.current[i] = el;
            }}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={d}
            $filled={!!d}
            onChange={e => setAt(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={disabled}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </Row>
    </Container>
  );
}
