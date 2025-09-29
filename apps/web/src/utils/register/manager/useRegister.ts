"use client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createManagerSchema } from "./schema";
import { initialFormData } from "./initialValue";
import type { FormData } from "@/types/forms";
import { submitRegistration } from "@/actions/submitRegistration";

export function useManagerForm() {
  const { t } = useTranslation();
  const schema = useMemo(() => createManagerSchema(t), [t]);

  const form = useForm<FormData>({
    defaultValues: initialFormData,
    resolver: zodResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (data: FormData) => {
    const result = await submitRegistration(data);
    if (result?.success) {
      form.reset(initialFormData);
    } else {
      console.error("Form submission failed:", result?.message);
    }
  });

  return { ...form, onSubmit };
}
