import Header from '@/components/header/page';
import PlansPrice from '@/components/planDetails/components/composites/PlansPrice';
import React from 'react';

const PlanDetails = () => {
  return (
    <div className="bg-[#ecefdc]">
      <Header />
      <PlansPrice />
    </div>
  );
};

export default PlanDetails;
