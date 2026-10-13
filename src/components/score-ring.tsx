"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  score: { label: "Match", color: "var(--color-plasma-pink)" },
  rest: { label: "Remaining", color: "var(--color-plasma-wash)" },
} satisfies ChartConfig;

export function ScoreRing({ score }: { score: number }) {
  const safe = Math.max(0, Math.min(100, score));
  const data = [{ score: safe, rest: 100 - safe }];

  return (
    <div className="relative mx-auto h-[220px] w-[220px]">
      <ChartContainer config={chartConfig} className="aspect-square h-[220px] w-[220px]">
        <RadialBarChart
          data={data}
          startAngle={90}
          endAngle={-270}
          innerRadius={74}
          outerRadius={104}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="rest"
            stackId="match"
            cornerRadius={12}
            fill="var(--color-rest)"
            className="stroke-transparent"
          />
          <RadialBar
            dataKey="score"
            stackId="match"
            cornerRadius={12}
            fill="var(--color-score)"
            className="stroke-transparent"
          />
        </RadialBarChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-heading font-bold text-frost-white">{safe}%</span>
        <span className="text-caption text-frost-faint">Match</span>
      </div>
    </div>
  );
}
