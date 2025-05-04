"use client";

import React from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Info, ArrowDown, ArrowUp } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface Section {
  id: string;
  title: string;
}

interface DomainDataVisualizerProps {
  domain: string;
  subdomain: string;
  data: any;
  sections: Section[];
  locale: string;
}

export default function DomainDataVisualizer({
  domain,
  subdomain,
  data,
  sections,
  locale,
}: DomainDataVisualizerProps) {
  // Function to generate random colors for charts
  const generateColors = (count: number) => {
    const colors = [];
    const baseColors = [
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 99, 132, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
      "rgba(199, 199, 199, 0.6)",
    ];

    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-40 bg-gray-200 rounded mb-6"></div>
      <div className="h-60 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const renderDataSection = () => {
    if (!data) {
      return renderSkeleton();
    }

    // Specific renderers by domain and subdomain
    if (domain === "demographics") {
      switch (subdomain) {
        case "caste":
          return renderCasteData();
        case "gender":
          return renderGenderData();
        case "age-distribution":
          return renderAgeDistributionData();
        case "religion":
          return renderReligionData();
        case "mother-tongue":
          return renderMotherTongueData();
        default:
          return renderGenericData();
      }
    } else if (domain === "health") {
      switch (subdomain) {
        case "facilities":
          return renderHealthFacilitiesData();
        case "indicators":
          return renderHealthIndicatorsData();
        default:
          return renderGenericData();
      }
    } else if (domain === "cooperatives") {
      switch (subdomain) {
        case "list":
          return renderCooperativesListData();
        case "statistics":
          return renderCooperativesStatsData();
        default:
          return renderGenericData();
      }
    }

    return renderGenericData();
  };

  // Renderer for caste data
  const renderCasteData = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center items-center">
            <Info className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            डाटा उपलब्ध छैन
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            जातीय विवरण सम्बन्धी डाटा हाल उपलब्ध छैन।
          </p>
        </div>
      );
    }

    // Prepare data for charts
    const labels = data.map(
      (item: any) => item.casteTypeDisplay || item.casteType,
    );
    const populations = data.map((item: any) => item.totalPopulation);
    const colors = generateColors(data.length);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "जनसंख्या",
          data: populations,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace("0.6", "1")),
          borderWidth: 1,
        },
      ],
    };

    const totalPopulation = populations.reduce((sum, val) => sum + val, 0);

    return (
      <div className="space-y-8 mt-8">
        {/* Overview section */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            समग्र जातीय विवरण
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  कुल जनसंख्या
                </span>
                <span className="text-3xl font-bold text-blue-900">
                  {totalPopulation.toLocaleString("ne-NP")}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">
                  प्रमुख जाति
                </span>
                <span className="text-3xl font-bold text-green-900">
                  {data.sort(
                    (a: any, b: any) => b.totalPopulation - a.totalPopulation,
                  )[0]?.casteTypeDisplay || "-"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-700">
                  जातीय विविधता
                </span>
                <span className="text-3xl font-bold text-purple-900">
                  {data.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Charts section */}
        <section id="charts" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            चार्ट तथा ग्राफहरू
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium mb-4">जातीय वितरण चार्ट</h3>
              <div className="h-80">
                <Pie
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium mb-4">
                जातीय वितरण बार चार्ट
              </h3>
              <div className="h-80">
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Table section */}
        <section id="table" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">तालिका</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 border">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    क्र.स.
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    जाति
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900"
                  >
                    जनसंख्या
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900"
                  >
                    प्रतिशत (%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((item: any, index: number) => (
                  <tr
                    key={item.casteType}
                    className={index % 2 === 0 ? "" : "bg-gray-50"}
                  >
                    <td className="whitespace-nowrap py-2 px-4 text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-gray-700">
                      {item.casteTypeDisplay || item.casteType}
                    </td>
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-700">
                      {item.totalPopulation.toLocaleString("ne-NP")}
                    </td>
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-700">
                      {((item.totalPopulation / totalPopulation) * 100).toFixed(
                        2,
                      )}
                      %
                    </td>
                  </tr>
                ))}
                <tr className="bg-green-50 font-medium">
                  <td
                    colSpan={2}
                    className="whitespace-nowrap py-2 px-4 text-sm text-gray-700"
                  >
                    कुल
                  </td>
                  <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-700">
                    {totalPopulation.toLocaleString("ne-NP")}
                  </td>
                  <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-700">
                    100%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Ward-wise section */}
        <section id="ward-wise" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            वडा अनुसार जातीय विवरण
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">
              वडा अनुसार जातीय विवरण यहाँ प्रस्तुत गरिएको छ।
            </p>
            {/* Additional ward-wise visualization could be added here */}
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500 text-sm">
                <Info className="h-5 w-5 inline-block mr-2" />
                वडा अनुसार विस्तृत तथ्यांक हेर्न कृपया आफ्नो इच्छा अनुसारको वडा
                चयन गर्नुहोस्।
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // Renderer for gender data
  const renderGenderData = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center items-center">
            <Info className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            डाटा उपलब्ध छैन
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            लिङ्ग अनुसार विवरण सम्बन्धी डाटा हाल उपलब्ध छैन।
          </p>
        </div>
      );
    }

    // Prepare data for charts
    const genderLabels = data.map((item: any) => {
      if (item.gender === "MALE") return "पुरुष";
      if (item.gender === "FEMALE") return "महिला";
      if (item.gender === "OTHER") return "अन्य";
      return item.gender;
    });

    const populations = data.map(
      (item: any) => item.total_population || item.population,
    );

    const genderColors = [
      "rgba(54, 162, 235, 0.6)", // Blue for male
      "rgba(255, 99, 132, 0.6)", // Pink for female
      "rgba(255, 206, 86, 0.6)", // Yellow for other
    ];

    const chartData = {
      labels: genderLabels,
      datasets: [
        {
          label: "जनसंख्या",
          data: populations,
          backgroundColor: genderColors,
          borderColor: genderColors.map((color) => color.replace("0.6", "1")),
          borderWidth: 1,
        },
      ],
    };

    const totalPopulation = populations.reduce((sum, val) => sum + val, 0);

    // Get gender percentages
    const maleData = data.find((item: any) => item.gender === "MALE");
    const femaleData = data.find((item: any) => item.gender === "FEMALE");
    const malePopulation = maleData
      ? maleData.total_population || maleData.population
      : 0;
    const femalePopulation = femaleData
      ? femaleData.total_population || femaleData.population
      : 0;

    const malePercentage = totalPopulation
      ? ((malePopulation / totalPopulation) * 100).toFixed(2)
      : 0;
    const femalePercentage = totalPopulation
      ? ((femalePopulation / totalPopulation) * 100).toFixed(2)
      : 0;

    // Calculate gender ratio (females per 100 males)
    const genderRatio = malePopulation
      ? ((femalePopulation / malePopulation) * 100).toFixed(2)
      : 0;

    return (
      <div className="space-y-8 mt-8">
        {/* Overview section */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            समग्र लिङ्ग अनुसार विवरण
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">पुरुष</span>
                <span className="text-3xl font-bold text-blue-900">
                  {malePopulation.toLocaleString("ne-NP")}
                </span>
                <span className="text-sm text-blue-700">
                  ({malePercentage}%)
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-lg">
                <span className="text-sm font-medium text-pink-700">महिला</span>
                <span className="text-3xl font-bold text-pink-900">
                  {femalePopulation.toLocaleString("ne-NP")}
                </span>
                <span className="text-sm text-pink-700">
                  ({femalePercentage}%)
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">
                  कुल जनसंख्या
                </span>
                <span className="text-3xl font-bold text-green-900">
                  {totalPopulation.toLocaleString("ne-NP")}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-700">
                  लैङ्गिक अनुपात
                </span>
                <span className="text-3xl font-bold text-purple-900">
                  {genderRatio}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Charts section */}
        <section id="charts" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            चार्ट तथा ग्राफहरू
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium mb-4">लिङ्ग अनुसार वितरण</h3>
              <div className="h-80">
                <Doughnut
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium mb-4">
                लिङ्ग अनुसार बार चार्ट
              </h3>
              <div className="h-80">
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // Renderer for age distribution data
  const renderAgeDistributionData = () => {
    if (!data || !data.byAgeAndGender || !Array.isArray(data.byAgeAndGender)) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center items-center">
            <Info className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            डाटा उपलब्ध छैन
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            उमेर अनुसार जनसंख्या विवरण सम्बन्धी डाटा हाल उपलब्ध छैन।
          </p>
        </div>
      );
    }

    const ageGroups = Array.from(
      new Set(data.byAgeAndGender.map((item: any) => item.age_group)),
    ).sort() as string[];

    // Prepare data for stacked bar chart by gender
    const maleData = ageGroups.map((age) => {
      const match = data.byAgeAndGender.find(
        (item: any) => item.age_group === age && item.gender === "MALE",
      );
      return match ? match.total_population : 0;
    });

    const femaleData = ageGroups.map((age) => {
      const match = data.byAgeAndGender.find(
        (item: any) => item.age_group === age && item.gender === "FEMALE",
      );
      return match ? match.total_population : 0;
    });

    const chartData = {
      labels: ageGroups,
      datasets: [
        {
          label: "पुरुष",
          data: maleData,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 1,
        },
        {
          label: "महिला",
          data: femaleData,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
      ],
    };

    // Calculate total population by age group
    const totalByAgeGroup = ageGroups.map((age) => {
      return data.byAgeAndGender
        .filter((item: any) => item.age_group === age)
        .reduce(
          (sum: number, item: any) => sum + (item.total_population || 0),
          0,
        );
    });

    const pieData = {
      labels: ageGroups,
      datasets: [
        {
          data: totalByAgeGroup,
          backgroundColor: generateColors(ageGroups.length),
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="space-y-8 mt-8">
        {/* Overview section */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            समग्र उमेर विवरण
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-600 mb-6">
              यस खण्डमा खजुरा गाउँपालिकाको उमेर समूह अनुसार जनसंख्यको वितरण
              प्रस्तुत गरिएको छ।
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900"
                    >
                      उमेर समूह
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900"
                    >
                      पुरुष
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900"
                    >
                      महिला
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-right text-sm font-semibold text-gray-900"
                    >
                      जम्मा
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {ageGroups.map((age, index) => {
                    const maleCount = maleData[index] || 0;
                    const femaleCount = femaleData[index] || 0;
                    const total = maleCount + femaleCount;

                    return (
                      <tr
                        key={age}
                        className={index % 2 === 0 ? "" : "bg-gray-50"}
                      >
                        <td className="whitespace-nowrap py-2 px-4 text-sm font-medium text-gray-900">
                          {age}
                        </td>
                        <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-700">
                          {maleCount.toLocaleString("ne-NP")}
                        </td>
                        <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-700">
                          {femaleCount.toLocaleString("ne-NP")}
                        </td>
                        <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-700 font-medium">
                          {total.toLocaleString("ne-NP")}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-green-50 font-medium">
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-gray-900">
                      जम्मा
                    </td>
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-900">
                      {maleData
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString("ne-NP")}
                    </td>
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-900">
                      {femaleData
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString("ne-NP")}
                    </td>
                    <td className="whitespace-nowrap py-2 px-4 text-sm text-right text-gray-900">
                      {(
                        maleData.reduce((a, b) => a + b, 0) +
                        femaleData.reduce((a, b) => a + b, 0)
                      ).toLocaleString("ne-NP")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Charts section */}
        <section id="charts" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            चार्ट तथा ग्राफहरू
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium mb-4">
                उमेर समूह अनुसार वितरण
              </h3>
              <div className="h-80">
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium mb-4">
                उमेर समूह अनुसार पाई चार्ट
              </h3>
              <div className="h-80">
                <Pie
                  data={pieData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Age group details */}
        <section id="age-groups" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            उमेर समूह अनुसार जनसंख्या
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ageGroups.map((age, index) => {
              const total = totalByAgeGroup[index];
              const percentage = (
                (total / totalByAgeGroup.reduce((a, b) => a + b, 0)) *
                100
              ).toFixed(1);

              return (
                <div
                  key={age}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {age}
                  </h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {total.toLocaleString("ne-NP")}
                  </p>
                  <p className="text-sm text-gray-500">
                    कुल जनसंख्याको {percentage}%
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">पुरुष</p>
                      <p className="text-sm font-medium">
                        {maleData[index].toLocaleString("ne-NP")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">महिला</p>
                      <p className="text-sm font-medium">
                        {femaleData[index].toLocaleString("ne-NP")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">अनुपात</p>
                      <p className="text-sm font-medium">
                        {maleData[index]
                          ? (
                              (femaleData[index] / maleData[index]) *
                              100
                            ).toFixed(0)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  };

  // Renderer for religion data
  const renderReligionData = () => {
    // Similar implementation as caste data, adapted for religion
    return renderGenericData();
  };

  // Renderer for mother tongue data
  const renderMotherTongueData = () => {
    // Similar implementation as caste data, adapted for mother tongue
    return renderGenericData();
  };

  // Renderer for health facilities data
  const renderHealthFacilitiesData = () => {
    return renderGenericData();
  };

  // Renderer for health indicators data
  const renderHealthIndicatorsData = () => {
    return renderGenericData();
  };

  // Renderer for cooperatives list data
  const renderCooperativesListData = () => {
    return renderGenericData();
  };

  // Renderer for cooperatives statistics data
  const renderCooperativesStatsData = () => {
    return renderGenericData();
  };

  // Generic renderer for when no specific renderer is available
  const renderGenericData = () => (
    <div className="space-y-8 mt-8">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {section.title}
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                विकासको क्रममा
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                यो खण्ड विकासको क्रममा छ। चाँडै नै थप तथ्याङ्कहरू उपलब्ध
                गराइनेछ।
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );

  return <div className="mt-6">{renderDataSection()}</div>;
}
