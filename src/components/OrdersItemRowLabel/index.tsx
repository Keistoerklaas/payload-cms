'use client'

import React, { useEffect, useState } from 'react'
import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

type ProductValue =
  | string
  | {
      id?: string | number
      name?: string
      title?: string
    }

type ItemRow = {
  product?: ProductValue
  quantity?: number
}

const OrdersItemRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<ItemRow>()
  const [resolvedName, setResolvedName] = useState<string | number | undefined>(undefined)

  const productValue = data?.data?.product
  const productLabel =
    typeof productValue === 'object'
      ? productValue?.name || productValue?.title || productValue?.id
      : productValue

  useEffect(() => {
    if (!productValue) {
      setResolvedName(undefined)
      return
    }

    if (typeof productValue === 'object') {
      setResolvedName(productValue?.name || productValue?.title || productValue?.id)
      return
    }

    let isMounted = true

    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productValue}?depth=0`)
        if (!response.ok) return
        const result = await response.json()
        if (isMounted) {
          setResolvedName(result?.name || result?.title || result?.id)
        }
      } catch {
        if (isMounted) setResolvedName(productValue)
      }
    }

    void loadProduct()

    return () => {
      isMounted = false
    }
  }, [productValue])

  const quantity = data?.data?.quantity
  const indexLabel = data?.rowNumber !== undefined ? data.rowNumber + 1 : undefined

  if (resolvedName || productLabel) {
    const label = resolvedName || productLabel
    return (
      <div>
        {quantity ? `${quantity} × ` : ''}
        {label}
      </div>
    )
  }

  return <div>{indexLabel ? `Item ${indexLabel}` : 'Item'}</div>
}

export default OrdersItemRowLabel
