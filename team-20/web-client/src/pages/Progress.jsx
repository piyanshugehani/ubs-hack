import { useState, useEffect } from "react"
export default function Leaderboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Live Leaderboard (Global)</h1>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* 1st Place */}
        <div className="rounded-xl overflow-hidden border-2 border-yellow-400 shadow-md">
          <div className="bg-yellow-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <img
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="World map background"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img
                    src="/placeholder.svg?height=96&width=96"
                    width={96}
                    height={96}
                    alt="Yash Desai"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-800"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.074.206 2.166.166 3.266-.048 1.323-.046 2.653.096 3.973.204 1.882 2.043 3.17 3.92 3.17.464 0 .934-.105 1.354-.3.42.195.89.3 1.354.3 1.877 0 3.716-1.288 3.92-3.17.142-1.32.144-2.65.096-3.973-.04-1.1.016-2.192.166-3.265a6.937 6.937 0 006.229-6.711.75.75 0 00-.584-.86 47.054 47.054 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.91 49.91 0 00-6.184-.742.75.75 0 00-.5.106 49.897 49.897 0 00-6.184.742.75.75 0 00-.658.744zm4.334 1.366c.682.059 1.401.118 2.118.176a.75.75 0 01.624.74v.007a.75.75 0 01-.574.813 37.518 37.518 0 01-4.792.5.75.75 0 01-.77-.615 37.547 37.547 0 01-.5-4.792.75.75 0 01.815-.574c.058.003.115.008.174.011.92.055 1.857.11 2.78.176a.75.75 0 01.624.74v.007z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">Yash Desai</h2>
              <p className="text-sm text-center text-gray-600 mt-1 px-2">
                Symbiosis Centre for Management and Human Resource Development (SCMHRD)
              </p>
            </div>
          </div>
          <div className="bg-yellow-400 p-4 flex justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="bg-black bg-opacity-10 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-black"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.074.206 2.166.166 3.266-.048 1.323-.046 2.653.096 3.973.204 1.882 2.043 3.17 3.92 3.17.464 0 .934-.105 1.354-.3.42.195.89.3 1.354.3 1.877 0 3.716-1.288 3.92-3.17.142-1.32.144-2.65.096-3.973-.04-1.1.016-2.192.166-3.265a6.937 6.937 0 006.229-6.711.75.75 0 00-.584-.86 47.054 47.054 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.91 49.91 0 00-6.184-.742.75.75 0 00-.5.106 49.897 49.897 0 00-6.184.742.75.75 0 00-.658.744zm4.334 1.366c.682.059 1.401.118 2.118.176a.75.75 0 01.624.74v.007a.75.75 0 01-.574.813 37.518 37.518 0 01-4.792.5.75.75 0 01-.77-.615 37.547 37.547 0 01-.5-4.792.75.75 0 01.815-.574c.058.003.115.008.174.011.92.055 1.857.11 2.78.176a.75.75 0 01.624.74v.007z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg">610,037</span>
            </div>
          </div>
        </div>

        {/* 2nd Place */}
        <div className="rounded-xl overflow-hidden border-2 border-purple-400 shadow-md">
          <div className="bg-purple-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <img
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="World map background"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img
                    src="/placeholder.svg?height=96&width=96"
                    width={96}
                    height={96}
                    alt="Yash Parte"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.074.206 2.166.166 3.266-.048 1.323-.046 2.653.096 3.973.204 1.882 2.043 3.17 3.92 3.17.464 0 .934-.105 1.354-.3.42.195.89.3 1.354.3 1.877 0 3.716-1.288 3.92-3.17.142-1.32.144-2.65.096-3.973-.04-1.1.016-2.192.166-3.265a6.937 6.937 0 006.229-6.711.75.75 0 00-.584-.86 47.054 47.054 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.91 49.91 0 00-6.184-.742.75.75 0 00-.5.106 49.897 49.897 0 00-6.184.742.75.75 0 00-.658.744zm4.334 1.366c.682.059 1.401.118 2.118.176a.75.75 0 01.624.74v.007a.75.75 0 01-.574.813 37.518 37.518 0 01-4.792.5.75.75 0 01-.77-.615 37.547 37.547 0 01-.5-4.792.75.75 0 01.815-.574c.058.003.115.008.174.011.92.055 1.857.11 2.78.176a.75.75 0 01.624.74v.007z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">Yash Parte</h2>
              <p className="text-sm text-center text-gray-600 mt-1 px-2">
                Symbiosis Centre for Management and Human Resource Development (SCMHRD)
              </p>
            </div>
          </div>
          <div className="bg-purple-500 p-4 flex justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white bg-opacity-20 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.074.206 2.166.166 3.266-.048 1.323-.046 2.653.096 3.973.204 1.882 2.043 3.17 3.92 3.17.464 0 .934-.105 1.354-.3.42.195.89.3 1.354.3 1.877 0 3.716-1.288 3.92-3.17.142-1.32.144-2.65.096-3.973-.04-1.1.016-2.192.166-3.265a6.937 6.937 0 006.229-6.711.75.75 0 00-.584-.86 47.054 47.054 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.91 49.91 0 00-6.184-.742.75.75 0 00-.5.106 49.897 49.897 0 00-6.184.742.75.75 0 00-.658.744zm4.334 1.366c.682.059 1.401.118 2.118.176a.75.75 0 01.624.74v.007a.75.75 0 01-.574.813 37.518 37.518 0 01-4.792.5.75.75 0 01-.77-.615 37.547 37.547 0 01-.5-4.792.75.75 0 01.815-.574c.058.003.115.008.174.011.92.055 1.857.11 2.78.176a.75.75 0 01.624.74v.007z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg text-white">576,790</span>
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="rounded-xl overflow-hidden border-2 border-orange-400 shadow-md">
          <div className="bg-orange-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <img
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="World map background"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img
                    src="/placeholder.svg?height=96&width=96"
                    width={96}
                    height={96}
                    alt="Sidharth Acharya"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-orange-400 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-orange-800"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.074.206 2.166.166 3.266-.048 1.323-.046 2.653.096 3.973.204 1.882 2.043 3.17 3.92 3.17.464 0 .934-.105 1.354-.3.42.195.89.3 1.354.3 1.877 0 3.716-1.288 3.92-3.17.142-1.32.144-2.65.096-3.973-.04-1.1.016-2.192.166-3.265a6.937 6.937 0 006.229-6.711.75.75 0 00-.584-.86 47.054 47.054 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.91 49.91 0 00-6.184-.742.75.75 0 00-.5.106 49.897 49.897 0 00-6.184.742.75.75 0 00-.658.744zm4.334 1.366c.682.059 1.401.118 2.118.176a.75.75 0 01.624.74v.007a.75.75 0 01-.574.813 37.518 37.518 0 01-4.792.5.75.75 0 01-.77-.615 37.547 37.547 0 01-.5-4.792.75.75 0 01.815-.574c.058.003.115.008.174.011.92.055 1.857.11 2.78.176a.75.75 0 01.624.74v.007z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">Sidharth Acharya</h2>
              <p className="text-sm text-center text-gray-600 mt-1 px-2">
                K J Somaiya Institute of Management (KJ SIM), Mumbai
              </p>
            </div>
          </div>
          <div className="bg-orange-400 p-4 flex justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="bg-black bg-opacity-10 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-black"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.074.206 2.166.166 3.266-.048 1.323-.046 2.653.096 3.973.204 1.882 2.043 3.17 3.92 3.17.464 0 .934-.105 1.354-.3.42.195.89.3 1.354.3 1.877 0 3.716-1.288 3.92-3.17.142-1.32.144-2.65.096-3.973-.04-1.1.016-2.192.166-3.265a6.937 6.937 0 006.229-6.711.75.75 0 00-.584-.86 47.054 47.054 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.91 49.91 0 00-6.184-.742.75.75 0 00-.5.106 49.897 49.897 0 00-6.184.742.75.75 0 00-.658.744zm4.334 1.366c.682.059 1.401.118 2.118.176a.75.75 0 01.624.74v.007a.75.75 0 01-.574.813 37.518 37.518 0 01-4.792.5.75.75 0 01-.77-.615 37.547 37.547 0 01-.5-4.792.75.75 0 01.815-.574c.058.003.115.008.174.011.92.055 1.857.11 2.78.176a.75.75 0 01.624.74v.007z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg">309,318</span>
            </div>
          </div>
        </div>
      </div>

      {/* My Rank Section */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4 relative">
        <div className="absolute -left-2 -top-4 bg-blue-800 text-white py-1 px-3 rounded-r-lg shadow-md">
          <span className="text-sm font-semibold">My Rank</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-blue-100 overflow-hidden">
              <img
                src="/placeholder.svg?height=64&width=64"
                width={64}
                height={64}
                alt="Shreyas Naik"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">Shreyas Naik</h3>
              <p className="text-sm text-gray-600">Sardar Patel Institute of Technology (SPIT), Mumbai</p>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <div className="bg-gray-700 p-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.229 6.71c.15 1.074.206 2.166.166 3.266-.048 1.323-.046 2.653.096 3.973.204 1.882 2.043 3.17 3.92 3.17.464 0 .934-.105 1.354-.3.42.195.89.3 1.354.3 1.877 0 3.716-1.288 3.92-3.17.142-1.32.144-2.65.096-3.973-.04-1.1.016-2.192.166-3.265a6.937 6.937 0 006.229-6.711.75.75 0 00-.584-.86 47.054 47.054 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.91 49.91 0 00-6.184-.742.75.75 0 00-.5.106 49.897 49.897 0 00-6.184.742.75.75 0 00-.658.744zm4.334 1.366c.682.059 1.401.118 2.118.176a.75.75 0 01.624.74v.007a.75.75 0 01-.574.813 37.518 37.518 0 01-4.792.5.75.75 0 01-.77-.615 37.547 37.547 0 01-.5-4.792.75.75 0 01.815-.574c.058.003.115.008.174.011.92.055 1.857.11 2.78.176a.75.75 0 01.624.74v.007z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">175 Points</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-gray-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">1 Certificates</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-blue-800"
              >
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
              <span className="text-3xl font-bold text-blue-800">648518</span>
            </div>
            <span className="text-sm text-gray-600">Global Rank</span>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Rankings</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left p-4 border-b">Participant Name</th>
                <th className="p-4 border-b bg-blue-800 text-white">#Rank</th>
                <th className="p-4 border-b">Rank Change</th>
                <th className="p-4 border-b">Certificates</th>
                <th className="p-4 border-b text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                      SU
                    </div>
                    <div>
                      <div className="font-medium">Sunil Kumar Mehta</div>
                      <div className="text-sm text-gray-500">Lovely Professional University (LPU), Punjab</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b text-center font-medium"># 4</td>
                <td className="p-4 border-b text-center">-</td>
                <td className="p-4 border-b text-center">686</td>
                <td className="p-4 border-b text-right text-blue-600 font-medium">305787</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                      AB
                    </div>
                    <div>
                      <div className="font-medium">Abhishek Kumar</div>
                      <div className="text-sm text-gray-500">Shyamlal college Evening</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b text-center font-medium"># 5</td>
                <td className="p-4 border-b text-center">-</td>
                <td className="p-4 border-b text-center">617</td>
                <td className="p-4 border-b text-right text-blue-600 font-medium">276776</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                      AN
                    </div>
                    <div>
                      <div className="font-medium">Anmol Agarwal</div>
                      <div className="text-sm text-gray-500">National Institute of Technology (NIT), Delhi</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b text-center font-medium"># 6</td>
                <td className="p-4 border-b text-center">-</td>
                <td className="p-4 border-b text-center">916</td>
                <td className="p-4 border-b text-right text-blue-600 font-medium">250765</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

