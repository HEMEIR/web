import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import React, { useState } from "react";

// 1️⃣ 把计算器单独写成一个组件
function Calculator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calc = async () => {
    try {
      const res = await fetch("/api/calc", {   // ✅ 用 /api 避免跨域
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: Number(a), b: Number(b), op }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
        setError("");
      } else {
        setError(data.error);
        setResult(null);
      }
    } catch (err) {
      setError("请求失败");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">10以内加减法</h1>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="border p-1 w-20"
        />
        <select
          value={op}
          onChange={(e) => setOp(e.target.value)}
          className="border p-1"
        >
          <option value="+">+</option>
          <option value="-">-</option>
        </select>
        <input
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="border p-1 w-20"
        />
        <button
          onClick={calc}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          计算
        </button>
      </div>
      {result !== null && <p>结果: {result}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

// 2️⃣ 真正的 App 入口
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <HashRouter>
        <Routes>
          {/* 原有的导航路由 */}
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          {/* 新增一个计算器页面 */}
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
