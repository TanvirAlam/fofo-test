"use client";

import { Card, CardTitle, Placeholder } from "../dashboard.styles";

export default function OverviewCard() {
  return (
    <Card $height="300px">
      <CardTitle>Overview</CardTitle>
      <Placeholder>Stats here</Placeholder>
    </Card>
  );
}
