"use client";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  createStaffSchema,
  STAFF_DEFAULT_VALUES,
  type StaffFormValues,
} from "./schema";

type UseStaffRegistrationReturn = {
  control: ReturnType<typeof useForm<StaffFormValues>>["control"];
  formState: ReturnType<typeof useForm<StaffFormValues>>["formState"];
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
};

export function useStaffRegistration(): UseStaffRegistrationReturn {
  const { t } = useTranslation();
  const schema = createStaffSchema(t);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(schema),
    defaultValues: STAFF_DEFAULT_VALUES,
    mode: "onTouched",
  });

  const submitToApi = useCallback(async (data: StaffFormValues) => {
    void data;
    await new Promise(r => setTimeout(r, 800));
  }, []);

  const onSubmit = form.handleSubmit(async values => {
    await submitToApi(values);
  });

  return {
    control: form.control,
    formState: form.formState,
    onSubmit,
  };
}
