import React from 'react'
import Header from '../components/layout/Header'
import LiftChart from '../components/progress/LiftChart'
import VolumeChart from '../components/progress/VolumeChart'
import PRHistory from '../components/progress/PRHistory'

export default function Progress() {
  return (
    <div className="flex flex-col full-height overflow-y-auto">
      <Header title="Progress" />
      <div className="flex-1 px-4 pb-safe pt-2 space-y-5">
        <LiftChart />
        <VolumeChart />
        <PRHistory />
      </div>
    </div>
  )
}
