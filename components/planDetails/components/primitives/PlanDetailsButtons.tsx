'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

const PlanDetailsButtons = () => {
  const [active, setActive] = useState('Basic');

  const planVariants = {
    Basic: { x: 0 },
    Medium: { x: 'calc(100% - 0%)' },
    Premium: { x: 'calc(200% - 0px)' },
  };
  return (
    <div className="relative flex flex-col bg-background-light w-full h-auto min-h-screen overflow-x-hidden font-display text-gray-800 dark:text-gray-200">
      <div className="flex flex-1 justify-center py-10 sm:py-16 md:py-20">
        <div className="flex flex-col flex-1 px-4 max-w-4xl">
          <div className="flex flex-col items-center gap-3 mb-6 text-center">
            <p className="font-black text-[#0e1b0e] text-4xl md:text-5xl leading-tight tracking-[-0.033em]">
              Choose Your Plan
            </p>
            <p className="max-w-md font-normal text-green-800 text-base leading-normal">
              Compare Basic, Medium, and Premium features to find the right
              option for you.
            </p>
          </div>
          <div className="flex items-center gap-4 mb-6 w-full max-w-4xl">
            <div className="flex-1 bg-gradient-to-r from-transparent via-[#547455]/30 to-[#547455]/30 h-px"></div>
            <div className="bg-[#547455]/40 rounded-full w-2 h-2"></div>
            <div className="bg-[#547455]/40 rounded-full w-2 h-2"></div>
            <div className="bg-[#547455]/40 rounded-full w-2 h-2"></div>
            <div className="flex-1 bg-gradient-to-l from-transparent via-[#547455]/30 to-[#547455]/30 h-px"></div>
          </div>
          <div className="flex justify-center">
            <div className="flex justify-center items-center bg-[#ecefdc] shadow-lg px-[4px] rounded-[30px] w-full max-w-[608px] min-h-[55px]">
              <div className="relative flex justify-center items-center rounded-[30px] w-full max-w-[600px] min-h-[55px]">
                <motion.div
                  className="left-0 absolute rounded-[30px] w-1/3 h-[48px] -translate-y-1/2"
                  variants={planVariants}
                  animate={active}
                  transition={{ type: 'spring', stiffness: 300, damping: 40 }}
                  style={{ background: '#243b31' }}
                />
                <button
                  className={`flex justify-center relative z-[10] hover:ease-in-out duration-300 items-center rounded-[12px] ${
                    active === 'Basic' ? 'text-[#FFFFFF]' : 'text-[#243b31]'
                  } w-1/2 font-bold  cursor-pointer`}
                  onClick={() => setActive('Basic')}
                >
                  Basic
                </button>
                <button
                  className={`flex justify-center relative z-[10] hover:ease-in-out duration-300 items-center rounded-[12px] ${
                    active === 'Medium' ? 'text-[#FFFFFF]' : 'text-[#243b31]'
                  } w-1/2 font-bold  cursor-pointer`}
                  onClick={() => setActive('Medium')}
                >
                  Medium
                </button>
                <button
                  className={`flex justify-center relative z-[10] hover:ease-in-out duration-300 items-center rounded-[12px] ${
                    active === 'Premium' ? 'text-[#FFFFFF]' : 'text-[#243b31]'
                  } w-1/2 font-bold  cursor-pointer`}
                  onClick={() => setActive('Premium')}
                >
                  Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsButtons;
