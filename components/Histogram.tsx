"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function Histogram({ items }: { items: { amount: number; count: number }[] }) {
  return (
    <Bar
      data={{ labels: items.map((i) => `${i.amount.toLocaleString("vi-VN")}`), datasets: [{ data: items.map((i) => i.count), backgroundColor: "#f97316" }] }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}
