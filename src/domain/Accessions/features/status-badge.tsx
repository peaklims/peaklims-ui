import { Badge, BadgeVariant } from "@/components/badge";
import React from "react";
import { AccessionStatus } from "../types";

interface AccessionStatusBadgeProps {
  status: AccessionStatus;
  className?: string;
  props?: React.HTMLProps<HTMLSpanElement>;
}

const AccessionStatusBadge: React.FC<AccessionStatusBadgeProps> = ({
  status,
  className,
  props,
}) => {
  let variant: BadgeVariant;

  switch (status) {
    case "Draft":
      variant = "amber";
      break;
    case "Ready For Testing":
      variant = "violet";
      break;
    case "Testing":
      variant = "orange";
      break;
    case "Testing Complete":
      variant = "blue";
      break;
    case "Report Pending":
      variant = "sky";
      break;
    case "Report Complete":
      variant = "green";
      break;
    case "Completed":
      variant = "emerald";
      break;
    case "Abandoned":
      variant = "rose";
      break;
    case "Cancelled":
      variant = "red";
      break;
    case "Qns":
      variant = "gray";
      break;
    default:
      variant = "gray";
  }

  return (
    <Badge text={status} variant={variant} className={className} {...props} />
  );
};

export default AccessionStatusBadge;
