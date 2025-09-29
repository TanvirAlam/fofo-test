"use client";

import React, { useState } from "react";
import {
  Calendar,
  CalendarHeader,
  HeaderButton,
  CalendarTitle,
  Weekdays,
  DaysGrid,
  Day,
  Empty,
  MonthGrid,
  Month,
  YearGrid,
  Year,
  HeaderButtons,
} from "./style";

import { ArrowLeftIcon } from "@/assets/icons/arrowLeftIcon";
import { ArrowRightIcon } from "@/assets/icons/arrowRight";

import {
  getFullMonthName,
  generateDaysGrid,
  getPreviousDate,
  getNextDate,
  DATE_PICKER_CONSTANTS,
  ViewMode,
  VIEW_MODES_ENUM,
} from "@/utils/dateUtils";

const { MONTHS, WEEKDAYS, VIEW_MODES } = DATE_PICKER_CONSTANTS;

interface Props {
  value?: Date;
  onChange?: (date: Date) => void;
}

export default function CustomDatePicker({ value, onChange }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES_ENUM.DAY);

  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    setCurrentDate(getPreviousDate(viewMode, year, month));
  };

  const handleNext = () => {
    setCurrentDate(getNextDate(viewMode, year, month));
  };

  const selectDate = (d: number) => {
    const newDate = new Date(year, month, d);
    onChange?.(newDate);
  };

  const renderDays = () => {
    const days = generateDaysGrid(year, month);

    return (
      <DaysGrid>
        {days.map((d, i) =>
          d === null ? (
            <Empty key={`e${i}`} />
          ) : (
            <Day key={d} onClick={() => selectDate(d)}>
              {d}
            </Day>
          )
        )}
      </DaysGrid>
    );
  };

  const renderMonths = () => (
    <MonthGrid>
      {MONTHS.map((m, i) => (
        <Month
          key={m}
          onClick={() => {
            setCurrentDate(new Date(year, i, 1));
            setViewMode(VIEW_MODES.DAY);
          }}
        >
          {m}
        </Month>
      ))}
    </MonthGrid>
  );

  const renderYears = () => {
    const startYear = Math.floor(year / 12) * 12;
    return (
      <YearGrid>
        {Array.from({ length: 12 }).map((_, i) => {
          const y = startYear + i;
          return (
            <Year
              key={y}
              selected={y === year}
              onClick={() => {
                setCurrentDate(new Date(y, month, 1));
                setSelectedYear(y);
                setViewMode(VIEW_MODES.MONTH);
              }}
            >
              {y}
            </Year>
          );
        })}
      </YearGrid>
    );
  };

  return (
    <Calendar>
      <CalendarHeader>
        <CalendarTitle
          onClick={() =>
            setViewMode(
              viewMode === VIEW_MODES.DAY
                ? VIEW_MODES.MONTH
                : viewMode === VIEW_MODES.MONTH
                  ? VIEW_MODES.YEAR
                  : VIEW_MODES.DAY
            )
          }
        >
          {viewMode === VIEW_MODES.DAY && `${getFullMonthName(month)} ${year}`}
          {viewMode === VIEW_MODES.MONTH &&
            `${getFullMonthName(month)} ${year}`}
          {viewMode === VIEW_MODES.YEAR && `${selectedYear ?? year}`}
        </CalendarTitle>

        <HeaderButtons>
          <HeaderButton onClick={handlePrev}>
            <ArrowLeftIcon />
          </HeaderButton>
          <HeaderButton onClick={handleNext}>
            <ArrowRightIcon />
          </HeaderButton>
        </HeaderButtons>
      </CalendarHeader>

      {viewMode === VIEW_MODES.DAY && (
        <>
          <Weekdays>
            {WEEKDAYS.map(day => (
              <div key={day}>{day}</div>
            ))}
          </Weekdays>
          {renderDays()}
        </>
      )}

      {viewMode === VIEW_MODES.MONTH && renderMonths()}
      {viewMode === VIEW_MODES.YEAR && renderYears()}
    </Calendar>
  );
}
