import { v4 as uuidv4 } from 'uuid';
import { plans, type NewPlan } from "../../schema/plans";
import type { SeederData } from "../types";

export const generate = async (): Promise<SeederData<NewPlan>> => {
  const records: NewPlan[] = [];

  const basicPlan: NewPlan = {
    id: uuidv4(),
    name: 'Basic',
    description: 'Perfect for small restaurants getting started with digital ordering',
    price: '29.99',
  };
  records.push(basicPlan);

  const premiumPlan: NewPlan = {
    id: uuidv4(),
    name: 'Premium',
    description: 'Advanced features for growing restaurants with multiple locations',
    price: '79.99',
  };
  records.push(premiumPlan);

  const enterprisePlan: NewPlan = {
    id: uuidv4(),
    name: 'Enterprise',
    description: 'Complete solution for large restaurant chains with custom integrations',
    price: '199.99',
  };
  records.push(enterprisePlan);

  const trialPlan: NewPlan = {
    id: uuidv4(),
    name: 'Free Trial',
    description: '14-day free trial with access to basic features',
    price: '0.00',
  };
  records.push(trialPlan);

  return {
    tableName: "plans",
    records,
    table: plans,
  };
};
