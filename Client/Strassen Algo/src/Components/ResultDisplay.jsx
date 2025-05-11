import React from "react";


const ResultDisplay = ({ traditional, strassen }) => {

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Traditional Multiplication</h2>
        <p className="mb-1 text-sm text-gray-500">Time Taken: {traditional.time} ms</p>
        {/* <table className="border border-gray-300 mb-4">
          <tbody>
            {traditional.result.map((row, i) => (
              <tr key={i}>{row.map((val, j) => <td key={j} className="border px-2 py-1">{val}</td>)}</tr>
            ))}
          </tbody>
        </table> */}
  
        <h2 className="text-xl font-bold mb-2">Strassen’s Multiplication</h2>
        <p className="mb-1 text-sm text-gray-500">Time Taken: {strassen.time} ms</p>
        {/* <table className="border border-gray-300">
          <tbody>
            {strassen.result.map((row, i) => (
              <tr key={i}>{row.map((val, j) => <td key={j} className="border px-2 py-1">{val}</td>)}</tr>
            ))}
          </tbody>
        </table> */}
  
        <div className="mt-4 text-sm text-gray-700">
          <p><strong>Traditional Complexity:</strong> O(n³)</p>
          <p><strong>Strassen’s Complexity:</strong> ~O(n^2.81)</p>
          <p className="mt-1">As the matrix size grows, Strassen’s method becomes significantly faster due to fewer recursive multiplications.</p>
        </div>
      </div>
    );
  };
  
  export default ResultDisplay;