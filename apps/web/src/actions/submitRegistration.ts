"use server";

import { FormData } from "@/types/forms";

export async function submitRegistration(formData: FormData) {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    statusCode: 200,
    message: `Registration submitted for ${formData.fullName}`,
    data: formData,
  };
}
