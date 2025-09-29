"use client";

import { Card, CardTitle, Placeholder } from "../dashboard.styles";

export default function MostOrderedCard() {
  return (
    <Card $height="400px">
      <CardTitle>Most Ordered Today</CardTitle>
      <Placeholder>No Data Found</Placeholder>
    </Card>
  );
}
