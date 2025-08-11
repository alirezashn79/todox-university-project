'use client'

import { useLottie } from 'lottie-react'
import * as animationData from '@/animation/list.json'

export default function Animation() {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  }

  const { View } = useLottie(defaultOptions)
  return <div className="w-36 shrink-0 lg:w-80">{View}</div>
}
