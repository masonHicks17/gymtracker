import React from 'react'
import Header from '../components/layout/Header'
import SessionList from '../components/log/SessionList'

export default function Log() {
  return (
    <div className="flex flex-col full-height overflow-y-auto">
      <Header title="Log" />
      <SessionList />
    </div>
  )
}
