import { FETCH_ERROR_MESSAGE } from "@/constants/common";

export const fetchData = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(FETCH_ERROR_MESSAGE);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
