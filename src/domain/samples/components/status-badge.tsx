import { Badge, BadgeVariant } from "@/components/badge";
import React from "react";
import { SampleStatus } from "../types";

interface SampleStatusBadgeProps {
  status: SampleStatus;
  className?: string;
  props?: React.HTMLProps<HTMLSpanElement>;
}

export const SampleStatusBadge: React.FC<SampleStatusBadgeProps> = ({
  status,
  className,
  props,
}) => {
  let variant: BadgeVariant;

  switch (status) {
    case "Disposed":
      variant = "amber";
      break;
    case "Received":
      variant = "sky";
      break;
    case "Rejected":
      variant = "rose";
      break;
    default:
      variant = "gray";
  }

  return (
    <Badge text={status} variant={variant} className={className} {...props} />
  );
};
