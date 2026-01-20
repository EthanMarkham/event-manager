import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export type FieldErrorMap = (field: string) => string | undefined;

export function applyServerFieldErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  fieldErrors: Record<string, string[]>,
  mapField?: FieldErrorMap
) {
  Object.entries(fieldErrors).forEach(([field, errors]) => {
    const targetField = mapField ? mapField(field) : field;
    if (!targetField) return;
    setError(targetField as Path<TFieldValues>, {
      type: "server",
      message: errors[0],
    });
  });
}
