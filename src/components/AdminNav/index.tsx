'use client'

import React from 'react'
import { Link, useAuth, useConfig, useNav, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from '@payloadcms/ui/shared'
import { getTranslation } from '@payloadcms/translations'
import Image from 'next/image'

import './index.scss'

const baseClass = 'admin-nav'

const AdminNav: React.FC = () => {
  const { config } = useConfig()
  const { permissions } = useAuth()
  const { i18n, t } = useTranslation()
  const { navRef, navOpen, shouldAnimate } = useNav()
  const adminRoute = config?.routes?.admin || '/admin'
  const accountRoute = config?.admin?.routes?.account || '/account'

  const collectionLinks = (config?.collections || [])
    .filter((collection) => {
      if (!collection.admin) return false
      if (!collection.admin.custom) return false
      if (!collection.admin.custom.showInMenu) return false
      return Boolean(permissions?.collections?.[collection.slug]?.read)
    })
    .map((collection) => {
      const label = getTranslation(collection.labels?.plural, i18n)
      const href = formatAdminURL({ adminRoute, path: `/collections/${collection.slug}` })

      return (
        <li key={collection.slug} className={`${baseClass}__item`}>
          <Link className={`${baseClass}__link`} href={href}>
            {label}
          </Link>
        </li>
      )
    })

  const globalLinks = (config?.globals || [])
    .filter((global) => {
      if (!permissions?.globals) return true
      return Boolean(permissions.globals?.[global.slug]?.read)
    })
    .map((global) => {
      const label = getTranslation(global.label, i18n)
      const href = formatAdminURL({ adminRoute, path: `/globals/${global.slug}` })

      return (
        <li key={global.slug} className={`${baseClass}__item`}>
          <Link className={`${baseClass}__link`} href={href}>
            {label}
          </Link>
        </li>
      )
    })

  return (
    <nav
      className={[
        baseClass,
        navOpen && `${baseClass}--open`,
        shouldAnimate && `${baseClass}--animate`,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={navRef}
    >
      <div className={`${baseClass}__header`}>
        <Image
          alt="Verhoeven"
          className={`${baseClass}__logo`}
          src="/logo.svg"
          width={180}
          height={180}
        ></Image>
      </div>
      <ul className={`${baseClass}__list`}>
        <li className={`${baseClass}__item`}>
          <Link className={`${baseClass}__link`} href={formatAdminURL({ adminRoute, path: '/' })}>
            {t('general:dashboard')}
          </Link>
        </li>
        {collectionLinks}
        {globalLinks}
        <li className={`${baseClass}__item`}>
          <Link
            className={`${baseClass}__link`}
            href={formatAdminURL({ adminRoute, path: accountRoute })}
          >
            {t('authentication:account')}
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default AdminNav
