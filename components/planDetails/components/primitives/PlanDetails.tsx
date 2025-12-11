'use client';
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import PlanSkeleton from './PlanSkeleton';
import { useTranslation } from '@/hooks/useTranslate';

const PlanDetails = ({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) => {
  const { t } = useTranslation();

  const plansTranslations = t('plansDetailsFeatures');
  const durationTranslations = t('plansDurations');

  const plan = data?.[0];
  const planType = plan?.planType || 'minimal';
  const planTrans = plansTranslations?.[planType] || {};

  const features = planTrans?.features ? Object.values(planTrans.features) : [];

  const firstDuration = plan?.durationOptions?.[0] || null;

  if (isLoading) return <PlanSkeleton />;
  if (!plan) return null;

  return (
    <div className="p-4 w-full max-w-[1000px]">
      <div className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <p className="font-bold text-primary text-2xl">
              {planTrans?.name || 'Plan Name'}
            </p>

            <p className="text-primary/70 text-base">
              {planTrans?.description || ''}
            </p>
          </div>

          <hr className="border-primary/20 border-dashed" />

          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-primary text-lg">
              {plansTranslations?.included || "What's Included"}
            </h3>

            <div className="gap-x-6 gap-y-3 grid grid-cols-1 sm:grid-cols-2">
              {features.map((txt, i) => (
                <div key={i} className="flex items-center gap-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-primary text-base">{txt}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="font-bold text-primary text-lg">
                {plansTranslations?.price || 'Price'}
              </h3>

              <ul className="flex flex-col gap-3">
                {plan?.durationOptions?.map((opt) => (
                  <li
                    key={opt._id}
                    className="bg-primary/5 p-4 border border-primary/10 rounded-xl text-primary"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-base">
                        {durationTranslations[opt.duration] || opt.duration}
                      </span>

                      <span className="font-semibold text-xl">
                        ₾{opt.price}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
