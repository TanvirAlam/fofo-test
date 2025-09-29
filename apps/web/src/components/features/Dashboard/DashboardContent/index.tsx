"use client";

import { ContentGrid, PageTitle } from "../dashboard.styles";
import TotalIncomeCard from "../TotalIncome";
import OverviewCard from "../Overview";
import MostOrderedCard from "../MostOrdered";
import RecentOrdersCard from "../RecentOrders";

export default function DashboardContent() {
  return (
    <div>
      <PageTitle>Poke.Poke</PageTitle>
      <ContentGrid $columns="4.5fr 5.5fr" $gap={20}>
        <TotalIncomeCard />
        <OverviewCard />
      </ContentGrid>

      <ContentGrid $columns="7.5fr 2.5fr" $gap={20}>
        <RecentOrdersCard />
        <MostOrderedCard />
      </ContentGrid>
    </div>
  );
}
