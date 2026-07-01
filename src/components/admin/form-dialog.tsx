import React from "react";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export function FormDialog({ open, title, children }: FormDialogProps) {
  if (!open) return null;
  return (
    <div data-testid="form-dialog" role="dialog">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
