import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { FaApple } from 'react-icons/fa'
import { RiQqFill, RiWechatFill } from 'react-icons/ri'
import { useAppStore } from '../store/useAppStore'
import { DEFAULT_AVATAR_ID } from '../types'

type LoginMode = 'code' | 'password'

/** 模拟登录接口返回结构 */
interface MockLoginResult {
  nickname: string
  isNewUser: boolean
}

/**
 * 模拟异步登录请求。
 * 开发测试：将 isNewUser 写死为 true（新手引导）或 false（直达发现页）。
 */
function mockLoginRequest(fallbackNickname: string): Promise<MockLoginResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const isNewUser = true
      resolve({
        nickname: fallbackNickname,
        isNewUser,
      })
    }, 600)
  })
}

const SOCIAL_ICON_CLASS = 'text-[26px] text-white'

type SocialLoginItem = {
  id: 'wechat' | 'qq' | 'apple'
  ariaLabel: string
  circleClass: string
  icon: React.ReactNode
}

const SOCIAL_LOGINS: SocialLoginItem[] = [
  {
    id: 'wechat',
    ariaLabel: '微信登录',
    circleClass:
      'bg-[#07C160] shadow-[0_8px_20px_rgba(7,193,96,0.4)] hover:shadow-[0_12px_28px_rgba(7,193,96,0.5)]',
    icon: <RiWechatFill className={SOCIAL_ICON_CLASS} aria-hidden />,
  },
  {
    id: 'qq',
    ariaLabel: 'QQ登录',
    circleClass:
      'bg-[#12B7F5] shadow-[0_8px_20px_rgba(18,183,245,0.4)] hover:shadow-[0_12px_28px_rgba(18,183,245,0.5)]',
    icon: <RiQqFill className={SOCIAL_ICON_CLASS} aria-hidden />,
  },
  {
    id: 'apple',
    ariaLabel: 'Apple登录',
    circleClass: 'bg-black shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)]',
    icon: <FaApple className={SOCIAL_ICON_CLASS} aria-hidden />,
  },
]

function AgreementCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
        checked
          ? 'border-emerald-500 bg-emerald-500'
          : 'border-gray-300 bg-transparent'
      }`}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden>
          <path
            d="M2.5 6.2 4.8 8.5 9.5 3.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

function UnderlineField({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex items-center border-b border-gray-100 pb-3 transition-colors duration-300 focus-within:border-emerald-400 ${className}`}
    >
      {children}
    </div>
  )
}

export function Login() {
  const completeLogin = useAppStore((s) => s.completeLogin)
  const showToast = useAppStore((s) => s.showToast)

  const [mode, setMode] = useState<LoginMode>('code')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [codeCooldown, setCodeCooldown] = useState(0)
  const [loggingIn, setLoggingIn] = useState(false)

  const validatePhone = () => /^1\d{10}$/.test(phone)

  const validateAgreement = () => {
    if (!agreed) {
      showToast('请先阅读并同意协议', 'info')
      return false
    }
    return true
  }

  const startCooldown = () => {
    setCodeCooldown(60)
    const timer = window.setInterval(() => {
      setCodeCooldown((s) => {
        if (s <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  const handleSendCode = () => {
    if (!validatePhone()) {
      showToast('请输入正确的手机号', 'info')
      return
    }
    if (!validateAgreement()) return
    if (codeCooldown > 0) return

    showToast('验证码已发送', 'success')
    setCodeSent(true)
    startCooldown()
  }

  const handlePhoneLogin = async () => {
    if (!validatePhone()) {
      showToast('请输入正确的手机号', 'info')
      return
    }
    if (!validateAgreement()) return

    if (mode === 'code') {
      if (!codeSent) {
        handleSendCode()
        return
      }
      if (!code.trim()) {
        showToast('请输入验证码', 'info')
        return
      }
    } else {
      if (!password.trim()) {
        showToast('请输入密码', 'info')
        return
      }
    }

    if (loggingIn) return
    setLoggingIn(true)

    try {
      const fallbackNickname = `用户${phone.slice(-4)}`
      // 1. 模拟登录请求，获取用户状态
      const result = await mockLoginRequest(fallbackNickname)

      // 2. 新老用户分流：新用户走 Onboarding，老用户直达发现页
      completeLogin(DEFAULT_AVATAR_ID, result.nickname, {
        phone,
        loginMethod: 'phone',
        isNewUser: result.isNewUser,
      })
      showToast('登录成功', 'success')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleSocialLogin = async (method: 'wechat' | 'qq' | 'apple') => {
    if (!validateAgreement()) return
    if (loggingIn) return

    setLoggingIn(true)
    try {
      const suffix = Math.random().toString(36).slice(2, 6)
      const nicknameMap = {
        wechat: `微信用户${suffix}`,
        qq: `QQ用户${suffix}`,
        apple: `Apple用户${suffix}`,
      }
      const fallbackNickname = nicknameMap[method]

      const result = await mockLoginRequest(fallbackNickname)
      completeLogin(DEFAULT_AVATAR_ID, result.nickname, {
        loginMethod: method,
        isNewUser: result.isNewUser,
      })
      showToast('登录成功', 'success')
    } finally {
      setLoggingIn(false)
    }
  }

  const switchMode = (next: LoginMode) => {
    setMode(next)
    setCodeSent(false)
    setCode('')
    setPassword('')
  }

  const primaryLabel = loggingIn
    ? '登录中...'
    : mode === 'password'
      ? '登录'
      : codeSent
        ? '登录'
        : '获取验证码'

  return (
    <div className="fixed inset-0 z-[70] mx-auto min-h-screen w-full max-w-lg bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative flex min-h-screen w-full flex-col px-8"
      >
        {/* 关闭按钮 */}
        <button
          type="button"
          aria-label="关闭"
          onClick={() => showToast('请先完成登录', 'info')}
          className="absolute left-6 top-12 text-gray-800 transition-opacity hover:opacity-70"
        >
          <X size={22} strokeWidth={1.75} />
        </button>

        {/* 头部标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="mt-32"
        >
          <h1 className="text-3xl font-bold tracking-wide text-gray-900">Hi, 欢迎来到植愈</h1>
          <p className="mt-2 text-sm text-gray-400">无需注册，手机号可直接登录</p>
        </motion.div>

        {/* 输入区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          className="mt-16"
        >
          <UnderlineField>
            <span className="mr-4 text-lg font-medium text-gray-900">+86</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="请输入您的手机号"
              className="w-full bg-transparent text-lg text-gray-900 outline-none placeholder:font-light placeholder:text-gray-300"
            />
          </UnderlineField>

          <AnimatePresence mode="wait">
            {mode === 'code' && codeSent && (
              <motion.div
                key="code"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <UnderlineField className="mt-8">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="请输入验证码"
                    className="w-full bg-transparent text-lg text-gray-900 outline-none placeholder:font-light placeholder:text-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={codeCooldown > 0}
                    className="shrink-0 text-sm font-medium text-emerald-500 transition-opacity disabled:opacity-40"
                  >
                    {codeCooldown > 0 ? `${codeCooldown}s` : '重新获取'}
                  </button>
                </UnderlineField>
              </motion.div>
            )}

            {mode === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <UnderlineField className="mt-8">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full bg-transparent text-lg text-gray-900 outline-none placeholder:font-light placeholder:text-gray-300"
                  />
                </UnderlineField>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 协议勾选 */}
          <div className="mt-6 flex items-center gap-2">
            <AgreementCheckbox checked={agreed} onChange={setAgreed} />
            <p className="text-xs leading-relaxed text-gray-400">
              我已阅读并同意
              <button
                type="button"
                className="cursor-pointer text-emerald-500 transition-opacity hover:opacity-80"
              >
                隐私政策
              </button>
              <span className="text-gray-400">和</span>
              <button
                type="button"
                className="cursor-pointer text-emerald-500 transition-opacity hover:opacity-80"
              >
                用户协议
              </button>
            </p>
          </div>

          {/* 主按钮 */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handlePhoneLogin}
            disabled={loggingIn}
            className="mt-6 w-full rounded-full bg-[#C6EBCD] py-4 text-base font-semibold text-white drop-shadow-sm transition-colors hover:bg-[#b5e4be] disabled:opacity-70"
          >
            {primaryLabel}
          </motion.button>

          {/* 密码 / 验证码切换 */}
          <button
            type="button"
            onClick={() => switchMode(mode === 'code' ? 'password' : 'code')}
            className="mt-4 text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            {mode === 'code' ? '密码登录' : '验证码登录'}
          </button>
        </motion.div>

        {/* 底部第三方登录：微信 / QQ / Apple */}
        <div className="absolute bottom-12 left-0 w-full px-8 pb-[env(safe-area-inset-bottom)]">
          <p className="mb-6 text-center text-xs text-gray-400">其他登录方式</p>
          <div className="flex items-center justify-center gap-8">
            {SOCIAL_LOGINS.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                aria-label={item.ariaLabel}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSocialLogin(item.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-[26px] transition-transform transition-shadow hover:-translate-y-0.5 ${item.circleClass}`}
              >
                {item.icon}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
