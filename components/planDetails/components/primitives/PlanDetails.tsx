'use client';
import React, { useState } from 'react';
import { CheckCircle, ChevronDown } from 'lucide-react';
import PlanSkeleton from './PlanSkeleton';
import { AnimatePresence, motion } from 'motion/react';

const PlanDetails = ({
  data,
  isLoading,
  isError,
}: {
  data: any[];
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return <PlanSkeleton />;
  }

  if (!data) {
    return null;
  }
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(
    data?.[0]?.durationOptions?.[0] || null
  );
  return (
    <div className="p-4 w-full max-w-[1000px]">
      <div className="flex flex-col bg-white dark:bg-background-dark/50 shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-bold text-primary dark:text-background-light text-2xl">
                Medium Plan
              </p>
              <div className="relative flex justify-between items-center px-[5px] border border-primary rounded-[5px] w-full max-w-[160px] min-h-[45px]">
                <div>
                  <p className="font-bold text-primary text-2xl">
                    ${selectedOption?.price}
                    <span className="font-normal text-primary/70 text-base">
                      /{selectedOption?.duration}
                    </span>
                  </p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(() => !isOpen)}
                  className="cursor-pointer"
                  animate={isOpen ? 'open' : 'closed'}
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-primary" />
                </motion.button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="top-[60px] left-0 z-10 absolute flex flex-col bg-[#ffffff] border border-primary rounded-[5px] w-full overflow-hidden"
                    >
                      {data?.[0]?.durationOptions?.map((opt) => (
                        <li
                          key={opt._id}
                          onClick={() => {
                            setSelectedOption(opt);
                            setIsOpen(false);
                          }}
                          className="hover:bg-[#ecefdc] px-[10px] py-[5px] cursor-pointer"
                        >
                          <span className="font-semibold text-[18px] text-primary">
                            ${opt.price}
                          </span>
                          <span className="font-light text-[14px] text-primary">
                            /{opt.duration}
                          </span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
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

          <button className="bg-primary hover:bg-primary/90 mt-2 rounded-lg w-full h-12 font-bold text-white transition">
            Select Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
