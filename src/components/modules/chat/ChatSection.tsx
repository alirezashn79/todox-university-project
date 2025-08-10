'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css' // یا هر استایل دلخواه برای هایلایت
import { useGetSessionMessages } from '@/hooks/queries/chat/useGetSessionMessages'
import Logo from '@/assets/images/chatGPT.webp'

interface IProps {
  id?: string
  avatar?: string | null
}

export default function ChatSection({ id, avatar }: IProps) {
  const {
    data: messages,
    isFetched,
    isPending,
    isRefetching,
  } = useGetSessionMessages({
    sessionId: id as string,
  })
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // اسکرول به آخر پس از بارگذاری یا آپدیت پیام‌ها
  useEffect(() => {
    if ((isFetched || isRefetching) && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [isFetched, messages, isRefetching])

  if (isPending)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-t-[6px] border-t-primary" />
      </div>
    )

  return (
    <div ref={chatContainerRef} className="flex h-full flex-col gap-4 overflow-y-auto p-4 pb-32">
      {messages?.messages.map((item, index) => (
        <div key={index + messages.sessionId}>
          {item.role === 'user' ? (
            <div className="chat chat-start">
              <div className="avatar chat-image">
                <div className="w-10 rounded-full">
                  {avatar ? (
                    <img height={40} width={40} alt="avatar" src={avatar} />
                  ) : (
                    <img alt="avatar" src="/img/user-no-avatar.png" />
                  )}
                </div>
              </div>
              <div className="chat-bubble whitespace-pre-wrap">{item.content}</div>
              <div className="chat-footer opacity-50">
                <time className="text-xs opacity-50">
                  {new Date(item.createdAt).toLocaleString('fa-IR')}
                </time>
              </div>
            </div>
          ) : item.role === 'assistant' ? (
            <div className="chat chat-end">
              <div className="avatar chat-image">
                <div className="w-10 rounded-full">
                  <Image height={40} width={40} src={Logo} alt="AI" />
                </div>
              </div>
              <div
                className="prose-sm dark:prose-invert !hide-scrollbar chat-bubble prose max-w-[calc(100vw-8rem)] overflow-x-auto bg-base-300 !text-base-content"
                dir="ltr"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                >
                  {item.content}
                </ReactMarkdown>
              </div>
              <div className="chat-footer opacity-50">
                <time className="text-xs opacity-50">
                  {new Date(item.createdAt).toLocaleString('fa-IR')}
                </time>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500">{item.content}</div>
          )}
        </div>
      ))}
      {isRefetching && (
        <div className="flex w-full justify-center">
          <div className="size-6 animate-spin rounded-full border-t-4 border-t-primary" />
        </div>
      )}
    </div>
  )
}
