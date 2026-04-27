"use client";

import { PieChart, Pie, Cell, Label } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
} from "@/shared/components/ui/chart";

const chartConfig: ChartConfig = {
  correct: { label: "Correct", color: "#22c55e" },
  incorrect: { label: "Incorrect", color: "#ef4444" },
};

interface ResultsPieChartProps {
  correct: number;
  total: number;
}

const ResultsPieChart = ({ correct, total }: ResultsPieChartProps) => {
  const wrong = total - correct;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const chartData = [
    { name: "correct", value: correct, fill: "#22c55e" },
    { name: "incorrect", value: wrong > 0 ? wrong : 0.001, fill: "#ef4444" },
  ];

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-45 w-45">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={82}
          paddingAngle={wrong > 0 ? 3 : 0}
          startAngle={90}
          endAngle={-270}
        >
          
          
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default ResultsPieChart;
