"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CodeActivityCard = ({ title = "Code Activity", data = [], totalUses = 0 }) => {
  return (
    <div className="mx-2 my-4 rounded-xl border-[#f1f1f1] shadow-[0px_2px_10px_rgba(202,202,202,1)] p-4">
      <h2 className="text-center text-lg font-semibold mb-4">{title}</h2>

      <ResponsiveContainer width="100%" height={150}>
        <ComposedChart data={data}>
          {/* Background Grid */}
          <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 12, fill: "#999" }}
            ticks={[0, 30, 50]}
            domain={[0, 50]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />

          {/* Hide X Axis */}
          <XAxis hide />

          {/* Light Background Bar */}
          <Bar dataKey="value" barSize={20} fill="#E5E7EB" radius={[4, 4, 0, 0]} />

          {/* Purple Line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6C33FF"
            strokeWidth={2}
            dot={{ r: 4, fill: "#ffffff", stroke: "#6C33FF", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="text-center mt-4">
        <h3 className="text-2xl font-bold">{totalUses.toLocaleString()}</h3>
        <p className="text-sm text-gray-500">Uses This week</p>
      </div>
    </div>
  );
};

export default CodeActivityCard;
