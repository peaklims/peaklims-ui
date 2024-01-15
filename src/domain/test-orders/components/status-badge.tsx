import { Badge, BadgeVariant } from "@/components/badge";
import React from "react";
import { PanelOrderStatus, TestOrderStatus } from "../types";

interface TestOrderStatusBadgeProps {
  status: TestOrderStatus;
  className?: string;
  props?: React.HTMLProps<HTMLSpanElement>;
}

export const TestOrderStatusBadge: React.FC<TestOrderStatusBadgeProps> = ({
  status,
  className,
  props,
}) => {
  let variant: BadgeVariant;

  switch (status) {
    case "Pending":
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

interface PanelOrderStatusBadgeProps {
  status: PanelOrderStatus;
  className?: string;
  props?: React.HTMLProps<HTMLSpanElement>;
}

export const PanelOrderStatusBadge: React.FC<PanelOrderStatusBadgeProps> = ({
  status,
  className,
  props,
}) => {
  let variant: BadgeVariant;

  switch (status) {
    case "Pending":
      variant = "amber";
      break;
    case "Processing":
      variant = "violet";
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
    default:
      variant = "gray";
  }

  return (
    <Badge text={status} variant={variant} className={className} {...props} />
  );
};
