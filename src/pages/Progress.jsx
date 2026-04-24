import React from 'react'
import Header from '../components/layout/Header'
import LiftChart from '../components/progress/LiftChart'
import VolumeChart from '../components/progress/VolumeChart'
import PRHistory from '../components/progress/PRHistory'

export default function Progress() {
  return (
    <div className="flex flex-col full-height" style={{ background: '#0A0A0A' }}>
      <Header title="Progress" eyebrow="Your lifts over time" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <LiftChart />
        <VolumeChart />
        <PRHistory />
        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}
