import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
export default function DeviceStats({ stats }) {
  const res = stats?.reduce((acc, item, i) => {
    if (acc[item.device]) {
        acc[item.device] += 1;
    } else {
        acc[item.device] = 1;
    }
    return acc;
  }, {});

  let deviceCount;

  if (res) {
    deviceCount = Object.entries(res).map(([device, count]) => ({
      device,
      count,
    }));
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart width={700} height={400}>
          <Pie
            data={deviceCount}
            labelLine={false}
            label={({ device, percent }) =>
              `${device}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {deviceCount?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
