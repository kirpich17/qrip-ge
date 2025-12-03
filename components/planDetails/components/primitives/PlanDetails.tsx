'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { PlanApi } from '../../api/panApi';

const PlanDetails = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['plans'],
    queryFn: PlanApi,
  });
  console.log(data);
  return <div></div>;
};

export default PlanDetails;
