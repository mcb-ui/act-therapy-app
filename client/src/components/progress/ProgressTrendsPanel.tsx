interface WeeklyDataPoint {
  day: string;
  completed: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
  total: number;
  color: string;
}

interface ProgressTrendsPanelProps {
  weeklyData: WeeklyDataPoint[];
  categoryData: CategoryDataPoint[];
}

const buildConicGradient = (categoryData: CategoryDataPoint[]) => {
  const totalValue = categoryData.reduce((sum, category) => sum + category.value, 0);

  if (totalValue === 0) {
    return 'conic-gradient(#E8E3EA 0deg 360deg)';
  }

  let currentAngle = 0;
  const stops = categoryData.map((category) => {
    const start = currentAngle;
    currentAngle += (category.value / totalValue) * 360;
    return `${category.color} ${start.toFixed(2)}deg ${currentAngle.toFixed(2)}deg`;
  });

  return `conic-gradient(${stops.join(', ')})`;
};

export default function ProgressTrendsPanel({
  weeklyData,
  categoryData,
}: ProgressTrendsPanelProps) {
  const maxWeeklyCount = Math.max(...weeklyData.map((item) => item.completed), 1);
  const weeklyTotal = weeklyData.reduce((sum, item) => sum + item.completed, 0);
  const busiestDay =
    [...weeklyData].sort((left, right) => right.completed - left.completed)[0] ?? null;
  const totalCategoryCompletions = categoryData.reduce((sum, category) => sum + category.value, 0);
  const donutBackground = buildConicGradient(categoryData);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-subheader text-xl uppercase text-midnight-purple">
              Weekly Activity
            </h2>
            <p className="mt-2 font-body text-sm leading-6 text-gray-600">
              Scan consistency at a glance instead of reading a full chart.
            </p>
          </div>
          <div className="rounded-2xl bg-midnight-purple/5 px-4 py-3 text-right">
            <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
              7-day total
            </p>
            <p className="mt-1 font-header text-3xl text-midnight-purple">{weeklyTotal}</p>
          </div>
        </div>

        <div className="grid grid-cols-7 items-end gap-3">
          {weeklyData.map((item) => {
            const height = `${Math.max((item.completed / maxWeeklyCount) * 100, item.completed > 0 ? 18 : 8)}%`;

            return (
              <div key={item.day} className="flex flex-col items-center">
                <div className="flex h-56 w-full max-w-[3.5rem] items-end justify-center rounded-[1.5rem] bg-midnight-purple/5 p-2">
                  <div
                    className="flex w-full items-start justify-center rounded-[1rem] bg-electric-blue text-[11px] font-subheader uppercase tracking-[0.14em] text-white transition-all duration-700"
                    style={{ height }}
                  >
                    {item.completed > 0 ? <span className="pt-2">{item.completed}</span> : null}
                  </div>
                </div>
                <p className="mt-3 font-subheader text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {item.day}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4">
            <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
              Strongest day
            </p>
            <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
              {busiestDay ? `${busiestDay.day} with ${busiestDay.completed} reps` : 'No activity yet'}
            </p>
          </div>
          <div className="rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4">
            <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
              Average pace
            </p>
            <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
              {(weeklyTotal / Math.max(weeklyData.length, 1)).toFixed(1)} reps per day
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-subheader text-xl uppercase text-midnight-purple">
              Category Balance
            </h2>
            <p className="mt-2 font-body text-sm leading-6 text-gray-600">
              See where your practice is concentrated and where it still needs depth.
            </p>
          </div>
          <div className="rounded-2xl bg-midnight-purple/5 px-4 py-3 text-right">
            <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
              Logged completions
            </p>
            <p className="mt-1 font-header text-3xl text-midnight-purple">{totalCategoryCompletions}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center justify-center">
            <div
              className="relative flex h-56 w-56 items-center justify-center rounded-full"
              style={{ background: donutBackground }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  Total
                </p>
                <p className="mt-1 font-header text-3xl text-midnight-purple">
                  {totalCategoryCompletions}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {categoryData.map((category) => {
              const percent = Math.round((category.value / Math.max(category.total, 1)) * 100);

              return (
                <div
                  key={category.name}
                  className="rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <p className="font-subheader text-xs uppercase tracking-[0.18em] text-midnight-purple">
                        {category.name}
                      </p>
                    </div>
                    <span className="font-subheader text-[11px] uppercase tracking-[0.16em] text-gray-500">
                      {category.value}/{category.total}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-midnight-purple/5">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${percent}%`, backgroundColor: category.color }}
                    />
                  </div>

                  <p className="mt-3 font-body text-sm text-gray-600">
                    {percent}% of this ACT process has been practiced.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
