"use client";

import { Card, CardTitle, Placeholder } from "../dashboard.styles";

export default function RecentOrdersCard() {
  return (
    <Card $height="400px">
      <CardTitle>Recent Orders</CardTitle>
      <Placeholder>No Data Found</Placeholder>
    </Card>
  );
}
