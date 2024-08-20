import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LocationStats({ stats }) {
  const res = stats?.reduce((acc, item, i) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else {
      acc[item.city] = 1;
    }

    return acc;
  }, {});

  console.log(res);

  const cityCount = Object.entries(res).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart width={500} height={300} data={cityCount}>
          <XAxis dataKey="city" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip labelStyle={{ color: "green" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
