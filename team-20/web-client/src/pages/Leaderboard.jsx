import React from 'react';

const Leaderboard = ({ title, data = [], sortKey, unit = "" }) => {
  if (!Array.isArray(data)) {
    console.error(`Leaderboard "${title}" received non-array data:`, data);
    return <p className="text-red-500">Error: Invalid data provided for {title}</p>;
  }

  const sortedData = [...data].sort((a, b) => b[sortKey] - a[sortKey]);
  
  return (
    <div className="w-full bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[hsl(239,100%,71%)] py-3 px-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-sm">
              <th className="py-3 px-6 font-semibold">Rank</th>
              <th className="py-3 px-6 font-semibold">Name</th>
              <th className="py-3 px-6 font-semibold text-right">{title} {unit && `(${unit})`}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((volunteer, index) => {
              // Simple highlighting for top positions without complex classes
              let rowClass = "border-t border-gray-100 hover:bg-gray-50";
              if (index === 0) rowClass += " bg-yellow-50";
              else if (index === 1) rowClass += " bg-gray-50";
              else if (index === 2) rowClass += " bg-orange-50";
              
              return (
                <tr key={index} className={rowClass}>
                  <td className="py-3 px-6">
                    {index < 3 ? (
                      <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm text-center leading-8">
                        {index + 1}
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">{index + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-medium">{volunteer.name}</td>
                  <td className="py-3 px-6 font-semibold text-right">
                    {sortKey === "rating" ? volunteer[sortKey].toFixed(1) : volunteer[sortKey]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;