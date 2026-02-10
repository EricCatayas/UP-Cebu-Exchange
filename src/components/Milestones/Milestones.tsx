'use client';
import React from 'react';
import { funnelStages } from '@/lib/labels';
import type { MilestoneMetrics } from '@/types/analytics';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import { fmtDate } from '@/lib/formatter';

interface UserMilestonesProps {
  milestones: MilestoneMetrics;
}

function UserMilestones({ milestones }: UserMilestonesProps) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-start justify-between gap-2 overflow-x-auto pb-4">
        {funnelStages.map((stage, index) => {
          const hasReached = milestones[stage.value]?.hasReached || false;
          const reachedAt = milestones[stage.value]?.reachedAt;
          const isLast = index === funnelStages.length - 1;

          return (
            <div key={stage.value} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-2 min-w-[80px]">
                {hasReached ? (
                  <FaCheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <FaCircle className="w-8 h-8 text-gray-300" />
                )}
                <div className="text-center">
                  <p className={`text-xs font-medium ${hasReached ? 'text-gray-900' : 'text-gray-400'}`}>
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">{hasReached ? 'Completed' : 'Not reached'}</p>
                  {reachedAt && <p className="text-[10px] text-gray-400 mt-1">{fmtDate(reachedAt)}</p>}
                </div>
              </div>
              {!isLast && <div className={`h-0.5 w-8 mx-1 ${hasReached ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserMilestones;
