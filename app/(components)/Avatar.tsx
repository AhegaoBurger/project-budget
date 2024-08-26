'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

export default function AvatarComponent({ avatarUrl }: { avatarUrl: string }) {
  const supabase = createClient()
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }
        const objectUrl = URL.createObjectURL(data)
        setUrl(objectUrl)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (avatarUrl) downloadImage(avatarUrl)
  }, [avatarUrl, supabase])

  return url ? (
    <Image
      width={36}
      height={36}
      src={url}
      alt="Avatar"
      className="avatar image"
    />
  ) : (
    <div className="avatar no-image" style={{ height: 36, width: 36 }} />
  )
}
