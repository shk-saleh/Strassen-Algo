import React from "react";

const MatrixInput = ({ matrix, setMatrix, title }) => {
    
  const updateCell = (i, j, value) => {
    const updated = matrix.map((row, r) => row.map((cell, c) => (r === i && c === j ? +value : cell)));
    setMatrix(updated);
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              value={val}
              onChange={(e) => updateCell(i, j, e.target.value)}
              className="w-16 h-12 text-center border border-gray-400 rounded"
              type="number"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MatrixInput;
