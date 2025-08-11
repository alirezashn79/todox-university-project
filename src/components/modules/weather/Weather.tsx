'use client'

import { useQuery } from '@tanstack/react-query'
import { Locate } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PulseLoader } from 'react-spinners'

interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: {
    description: string
    icon: string
  }[]
}

const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'خطا در دریافت اطلاعات آب و هوا')
  }
  return data
}

export default function Weather() {
  const [coords, setCoords] = useState({ lat: 35.6892, lon: 51.389 })
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    const savedCoords = localStorage.getItem('coords')
    if (savedCoords) {
      try {
        const parsed = JSON.parse(savedCoords)
        if (parsed.lat && parsed.lon) {
          setCoords(parsed)
        }
      } catch {}
    }
  }, [])

  const findMyLocation = () => {
    console.log('Requesting location...')
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('Location allowed:', pos)
          const newCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
          setCoords(newCoords)
          localStorage.setItem('coords', JSON.stringify(newCoords))
        },
        (err) => {
          console.error('Location error:', err)
          setPermissionDenied(true)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', coords.lat, coords.lon],
    queryFn: () => fetchWeather(coords.lat, coords.lon),
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading)
    return (
      <div className="mt-2 flex w-full items-center justify-center md:min-w-40">
        <PulseLoader color="#7480ff" size={8} />
      </div>
    )
  if (error) return <p>{(error as Error).message}</p>
  if (!data) return <p>اطلاعاتی موجود نیست.</p>

  const { name, main, weather } = data
  const desc = weather[0]?.description
  const iconUrl = weather[0] ? `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png` : ''

  return (
    <>
      <div className="mx-auto flex w-fit items-center rounded-lg bg-base-200 px-2 py-1">
        <button className="btn btn-square btn-ghost btn-sm me-2" onClick={findMyLocation}>
          <Locate className="size-4" />
        </button>
        <h1 className="text-sm">{name}</h1>
        {iconUrl && <img src={iconUrl} alt={desc} className="h-10" />}
        <div className="flex flex-col text-xs">
          <p>{main.temp.toFixed(1)}°C</p>
          <p>{desc}</p>
        </div>
      </div>
      {permissionDenied && (
        <p className="mt-0.5 text-center text-xs text-warning">
          برای دقت بیشتر، اجازه دسترسی به موقعیت را فعال کنید.
        </p>
      )}
    </>
  )
}
