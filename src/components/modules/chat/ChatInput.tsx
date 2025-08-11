'use client'

import useCreateSession from '@/hooks/queries/chat/useCreateSession'
import useSendSessionMessage from '@/hooks/queries/chat/useSendSessionMessage'
import { useSessionIsExist } from '@/hooks/queries/chat/useSessionIsExist'
import { ArrowUp } from 'lucide-react'
import { notFound, usePathname } from 'next/navigation'
import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

interface ChatInputProps {
  disabled?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useState('')
  const pathname = usePathname()

  const paramId = pathname.split('/ai-assistant/')[1]

  const { refetch, data: session, isError } = useSessionIsExist({ sessionId: paramId })

  useEffect(() => {
    if (paramId) {
      refetch()
    }
  }, [paramId, refetch])

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = '0px'
    ta.style.height = ta.scrollHeight + 'px'
  }, [])

  useLayoutEffect(() => {
    resizeTextarea()
  }, [message, resizeTextarea])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = async () => {
    const text = message.trim()
    if (!text || disabled) return
    await onSend(text)
    setMessage('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const { mutateAsync: createSession, isPending: isCreatingSession } = useCreateSession()
  const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendSessionMessage()
  const isLoading = isCreatingSession || isSendingMessage

  const onSend = async (text: string) => {
    if (paramId && session) {
      await sendMessage({
        id: session.id,
        message: text,
      })
    } else {
      await createSession(
        {
          title: text.substring(0, 20),
        },
        {
          onSuccess: async (response) => {
            await sendMessage({
              id: response.id,
              message: text,
            })
          },
        }
      )
    }
  }

  if (isError) return notFound()

  return (
    <div className="flex items-end gap-2 rounded-lg border border-base-100 bg-base-100 p-3 shadow-lg">
      <textarea
        autoFocus
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="پیام خود را بنویسید..."
        rows={1}
        className="max-h-60 flex-1 resize-none overflow-y-auto bg-transparent text-sm leading-6 text-base-content focus:outline-none"
        disabled={disabled}
      />

      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled || isLoading}
        className="btn btn-circle btn-sm shrink-0 bg-[#4ca07f] text-base-300"
      >
        {isLoading ? (
          <div className="size-5 animate-spin rounded-full border-t-4 border-t-primary" />
        ) : (
          <ArrowUp className="size-5" />
        )}
      </button>
    </div>
  )
}

export default ChatInput
