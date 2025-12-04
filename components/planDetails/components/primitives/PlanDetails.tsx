'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';

const PlanDetails = ({
  data,
  isLoading,
  isError,
}: {
  data: any[];
  isLoading: boolean;
  isError: boolean;
}) => {
  if (!data) return null;
  return (
    <div className="p-4 w-full max-w-[1000px]">
      <div className="flex flex-col bg-white dark:bg-background-dark/50 shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-bold text-primary dark:text-background-light text-2xl">
                Medium Plan
              </p>
              <p className="font-bold text-primary dark:text-background-light text-2xl">
                $29
                <span className="font-normal text-primary/70 dark:text-background-light/70 text-base">
                  /month
                </span>
              </p>
            </div>

            <p className="text-primary/70 dark:text-background-light/70 text-base">
              Lorem ipsum...
            </p>
          </div>

          <hr className="border-primary/20 dark:border-background-light/20 border-dashed" />

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-primary dark:text-background-light text-lg">
              What's Included
            </h3>

            <div className="gap-x-6 gap-y-3 grid grid-cols-1 sm:grid-cols-2">
              {data?.map((eachPlan) => (
                <div key={eachPlan._id} className="flex flex-col gap-2">
                  {eachPlan.features?.map((feature) => (
                    <label
                      key={feature._id}
                      className="flex items-center gap-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary dark:text-background-light" />
                      <span className="text-primary dark:text-background-light text-base">
                        {feature.text}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button className="bg-primary hover:bg-primary/90 dark:bg-background-light dark:hover:bg-background-light/90 mt-2 rounded-lg w-full h-12 font-bold text-white dark:text-primary transition">
            Select Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
