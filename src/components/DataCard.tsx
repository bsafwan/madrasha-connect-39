
import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DataCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: DataCardProps) => {
  return (
    <Card className={cn("overflow-hidden hover-lift", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-2xl font-medium text-foreground">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center text-sm",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              <span>
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DataCard;
