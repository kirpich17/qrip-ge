export default function PlanSkeleton() {
  return (
    <div className="p-4 w-full max-w-[1000px] animate-pulse">
      <div className="flex flex-col bg-white dark:bg-background-dark/50 shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="bg-primary/20 dark:bg-background-light/20 rounded w-32 h-6"></div>
              <div className="bg-primary/20 dark:bg-background-light/20 rounded w-24 h-6"></div>
            </div>

            <div className="bg-primary/20 dark:bg-background-light/20 rounded w-full h-4"></div>
          </div>

          <hr className="border-primary/20 dark:border-background-light/20 border-dashed" />

          <div className="flex flex-col gap-4">
            <div className="bg-primary/20 dark:bg-background-light/20 rounded w-40 h-5"></div>

            <div className="gap-x-6 gap-y-3 grid grid-cols-1 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-3">
                      <div className="bg-primary/20 dark:bg-background-light/20 rounded-full w-5 h-5"></div>
                      <div className="bg-primary/20 dark:bg-background-light/20 rounded w-32 h-4"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/20 dark:bg-background-light/20 rounded-lg w-full h-12"></div>
        </div>
      </div>
    </div>
  );
}
