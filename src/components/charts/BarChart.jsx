"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";

const BarChartCard = ({ data, title, subtitle, total }) => {
  return (
    <div className="mx-2 my-4 rounded-xl border-[#f1f1f1] shadow-[0px_2px_10px_rgba(202,202,202,1)] p-4 sm:max-w-[80%] sm:mx-auto">
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
          {total} 
        </h2>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={({ payload, x, y, textAnchor }) => {
              const isToday = payload.value.toLowerCase() === "today";
              return (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor={textAnchor}
                  fill="#333"
                  fontWeight={isToday ? "bold" : "normal"}
                  fontSize={12}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="value" radius={[10, 10, 10, 10]} fill="#5B2ECC">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="border-t mt-4" />
    </div>
  );
};

export default BarChartCard;
