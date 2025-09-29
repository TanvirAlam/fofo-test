import { v4 as uuidv4 } from 'uuid';
import type { SeederData } from "../types";
import { posVendors, type NewPosVendor } from "../../schema/pos";

export const generate = async (): Promise<SeederData<NewPosVendor>> => {
  const records: NewPosVendor[] = [];

  const vendorNames = [
    'Square',
    'Toast',
    'Clover'
  ];

  for (const vendorName of vendorNames) {
    const vendor: NewPosVendor = {
      id: uuidv4(),
      name: vendorName,
    };
    records.push(vendor);
  }

  return { 
    tableName: "pos_vendors", 
    records,
    table: posVendors 
  };
};
