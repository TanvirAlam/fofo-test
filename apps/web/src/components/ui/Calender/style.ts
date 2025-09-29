import styled from "styled-components";

export const Calendar = styled.div`
  width: 320px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  box-shadow: 0 4px 8px ${({ theme }) => theme.colors.primary.BLACK_50};
  padding: 16px;
  font-family: sans-serif;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 10px;
`;

export const CalendarTitle = styled.h3`
  flex: 1;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 0;
  bottom: 0;
`;

export const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  right: 0;
`;

export const HeaderButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 8px;
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

export const Day = styled.div`
  padding: 8px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[200]};
  }
`;

export const Empty = styled.div`
  padding: 8px;
`;

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

export const Month = styled.div`
  padding: 12px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[200]};
  }
`;

export const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

export const Year = styled.div<{ selected?: boolean }>`
  padding: 12px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ selected, theme }) =>
    selected ? theme.colors.primary[200] : "transparent"};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.primary.WHITE : theme.colors.primary.BLACK};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[200]};
    color: ${({ theme }) => theme.colors.primary.BLACK};
  }
`;
