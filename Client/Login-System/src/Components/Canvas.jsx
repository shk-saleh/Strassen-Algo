import React, { useState } from "react";
import ResultDisplay from "./ResultDisplay";

const Canvas = () => {
  
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [results, setResults] = useState(null);

  const handleMultiply = async () => {
    const res = await fetch("http://localhost:8000/multiply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: +rows, cols: +cols }),
    });

    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Matrix Multiplication Timer</h1>

      <div className="flex justify-center gap-4 mb-4">
        <input
          type="number"
          value={rows}
          onChange={(e) => setRows(e.target.value)}
          className="border p-2 rounded w-24"
          placeholder="Rows"
        />
        <input
          type="number"
          value={cols}
          onChange={(e) => setCols(e.target.value)}
          className="border p-2 rounded w-24"
          placeholder="Cols"
        />
        <button
          onClick={handleMultiply}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          Multiply
        </button>
      </div>

      {results && <ResultDisplay traditional={results.traditional} strassen={results.strassen} />}
    </div>
  );
};

export default Canvas;
