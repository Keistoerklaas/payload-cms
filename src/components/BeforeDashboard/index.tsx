'use client'

import { Banner } from '@payloadcms/ui/elements/Banner'
import React, { useEffect, useMemo, useState } from 'react'

import './index.scss'

const baseClass = 'dashboard'

type DashboardStats = {
  openOrders: number
  revenueToday: number
  completedThisWeek: number
  averageOrderValue: number
}

type DashboardUser = {
  name?: string
  email?: string
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value)

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<DashboardUser | null>(null)

  const now = useMemo(() => new Date(), [])
  const startOfToday = useMemo(() => {
    const date = new Date(now)
    date.setHours(0, 0, 0, 0)
    return date
  }, [now])

  const startOfWeek = useMemo(() => {
    const date = new Date(now)
    const day = date.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    date.setDate(date.getDate() + diff)
    date.setHours(0, 0, 0, 0)
    return date
  }, [now])

  const sevenDaysAgo = useMemo(() => {
    const date = new Date(now)
    date.setDate(date.getDate() - 7)
    date.setHours(0, 0, 0, 0)
    return date
  }, [now])

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me')
        const data = await response.json()
        if (isMounted) {
          setUser(data?.user || null)
        }
      } catch (error) {
        if (isMounted) {
          setUser(null)
        }
      }
    }

    const fetchStats = async () => {
      try {
        const [openOrdersResponse, recentOrdersResponse] = await Promise.all([
          fetch(`/api/orders?limit=0&where[status][in]=pending,processing`).then((res) =>
            res.json(),
          ),
          fetch(
            `/api/orders?limit=1000&depth=0&where[date][greater_than_equal]=${encodeURIComponent(
              sevenDaysAgo.toISOString(),
            )}`,
          ).then((res) => res.json()),
        ])

        const recentOrders = Array.isArray(recentOrdersResponse?.docs)
          ? recentOrdersResponse.docs
          : []

        const revenueToday = recentOrders.reduce((sum: number, order: any) => {
          const orderDate = new Date(order?.date || order?.createdAt || 0)
          if (orderDate >= startOfToday) {
            return sum + Number(order?.pricing?.total || 0)
          }
          return sum
        }, 0)

        const completedThisWeek = recentOrders.filter((order: any) => {
          const orderDate = new Date(order?.date || order?.createdAt || 0)
          return orderDate >= startOfWeek && order?.status === 'completed'
        }).length

        const recentTotals = recentOrders
          .map((order: any) => Number(order?.pricing?.total || 0))
          .filter((value: number) => Number.isFinite(value) && value > 0)

        const averageOrderValue =
          recentTotals.length > 0
            ? recentTotals.reduce((sum, value) => sum + value, 0) / recentTotals.length
            : 0

        if (isMounted) {
          setStats({
            openOrders: Number(openOrdersResponse?.totalDocs || 0),
            revenueToday,
            completedThisWeek,
            averageOrderValue,
          })
        }
      } catch (error) {
        if (isMounted) {
          setStats({
            openOrders: 0,
            revenueToday: 0,
            completedThisWeek: 0,
            averageOrderValue: 0,
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void fetchUser()
    void fetchStats()

    return () => {
      isMounted = false
    }
  }, [sevenDaysAgo, startOfToday, startOfWeek])

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welkom terug {user?.name || user?.email}!</h4>
      </Banner>

      <section className={`${baseClass}__stats`} aria-label="Dashboard statistieken">
        <div className={`${baseClass}__stat`}>
          <p className={`${baseClass}__stat-label`}>Open bestellingen</p>
          <p className={`${baseClass}__stat-value`}>{loading ? '—' : stats?.openOrders}</p>
          <p className={`${baseClass}__stat-meta`}>Status: in afwachting of verwerking</p>
        </div>
        <div className={`${baseClass}__stat`}>
          <p className={`${baseClass}__stat-label`}>Omzet vandaag</p>
          <p className={`${baseClass}__stat-value`}>
            {loading ? '—' : formatCurrency(stats?.revenueToday || 0)}
          </p>
          <p className={`${baseClass}__stat-meta`}>Sinds middernacht</p>
        </div>
        <div className={`${baseClass}__stat`}>
          <p className={`${baseClass}__stat-label`}>Afgehandeld</p>
          <p className={`${baseClass}__stat-value`}>{loading ? '—' : stats?.completedThisWeek}</p>
          <p className={`${baseClass}__stat-meta`}>Deze week</p>
        </div>
        <div className={`${baseClass}__stat`}>
          <p className={`${baseClass}__stat-label`}>Gem. orderwaarde</p>
          <p className={`${baseClass}__stat-value`}>
            {loading ? '—' : formatCurrency(stats?.averageOrderValue || 0)}
          </p>
          <p className={`${baseClass}__stat-meta`}>Laatste 7 dagen</p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
