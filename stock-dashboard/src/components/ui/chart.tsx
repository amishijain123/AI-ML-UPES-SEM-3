"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "./utils";

// --- THEME DEFINITIONS ---
const THEMES = { light: "", dark: ".dark" } as const;

// --- CHART CONFIG TYPES ---
export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

// --- CONTEXT ---
type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within <ChartContainer />");
  return context;
}

// --- CHART CONTAINER ---
export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & { config: ChartConfig; children: React.ReactNode }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// --- CHART STYLE FOR COLOR/THEME ---
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, c]) => c.theme || c.color
  );
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `\
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}`
          )
          .join("\n"),
      }}
    />
  );
};

// --- TOOLTIP PAYLOAD TYPE ---
export type TooltipPayloadItem = {
  value?: number | string;
  name?: string;
  dataKey?: string;
  fill?: string;
  color?: string;
  payload?: Record<string, any>;
};

// --- CHART TOOLTIP ---
export const ChartTooltip = Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  className?: string;
  indicator?: "dot" | "line" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string;
  labelFormatter?: (value: any, payloadArray: TooltipPayloadItem[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (value: number | string, name: string, item: TooltipPayloadItem, index: number, fullItem: TooltipPayloadItem) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}) {
  const { config } = useChart();
  const payloadArray: TooltipPayloadItem[] = payload ?? [];

  if (!active || !payloadArray.length) return null;

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payloadArray.length) return null;
    const item = payloadArray[0];
    const key = `${labelKey || item.dataKey || item.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (!value) return null;

    return labelFormatter ? (
      <div className={cn("font-medium", labelClassName)}>
        {labelFormatter(value, payloadArray)}
      </div>
    ) : (
      <div className={cn("font-medium", labelClassName)}>{value}</div>
    );
  }, [label, labelFormatter, payloadArray, hideLabel, labelClassName, config, labelKey]);

  const nestLabel = payloadArray.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payloadArray.map((item: TooltipPayloadItem, index: number) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.fill || item.color;

          return (
            <div
              key={item.dataKey || index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item)
              ) : (
                <>
                  {itemConfig?.icon && !hideIndicator && <itemConfig.icon />}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {typeof item.value === "number" && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- CHART LEGEND ---
export const ChartLegend = Legend;

export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: {
  className?: string;
  hideIcon?: boolean;
  payload?: TooltipPayloadItem[];
  verticalAlign?: "top" | "bottom";
  nameKey?: string;
}) {
  const { config } = useChart();
  const payloadArray: TooltipPayloadItem[] = payload ?? [];

  if (!payloadArray.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payloadArray.map((item: TooltipPayloadItem, idx: number) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value || idx}
            className={cn("[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.fill || item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// --- HELPER ---
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: TooltipPayloadItem,
  key: string
) {
  if (!payload || typeof payload !== "object") return undefined;

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object"
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (payload[key as keyof TooltipPayloadItem] && typeof payload[key as keyof TooltipPayloadItem] === "string") {
    configLabelKey = payload[key as keyof TooltipPayloadItem] as string;
  } else if (
    payloadPayload &&
    payloadPayload[key as keyof typeof payloadPayload] &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}
