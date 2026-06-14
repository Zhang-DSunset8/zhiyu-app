import { useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import {
  GroupListItem,
  SettingsGroupCard,
  SubPageHeader,
  Toggle,
} from './profileShared'

interface ProfileSettingsViewProps {
  onBack: () => void
  onOpenAccount: () => void
  onLogout: () => void
}

export function ProfileSettingsView({
  onBack,
  onOpenAccount,
  onLogout,
}: ProfileSettingsViewProps) {
  const vibrationEnabled = useAppStore((s) => s.vibrationEnabled)
  const setVibrationEnabled = useAppStore((s) => s.setVibrationEnabled)
  const exportData = useAppStore((s) => s.exportData)
  const importData = useAppStore((s) => s.importData)
  const showToast = useAppStore((s) => s.showToast)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emotion-orchard-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('数据已导出')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importData(reader.result as string)
      showToast(ok ? '数据已恢复' : '文件格式错误', ok ? 'success' : 'error')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <SubPageHeader title="设置" onBack={onBack} />

      <div className="flex flex-1 flex-col px-5 pb-10">
        <div className="space-y-4">
          <SettingsGroupCard>
            <GroupListItem label="账号与安全" onClick={onOpenAccount} showChevron />
          </SettingsGroupCard>

          <SettingsGroupCard>
            <GroupListItem
              label="震动反馈"
              trailing={<Toggle checked={vibrationEnabled} onChange={setVibrationEnabled} />}
            />
            <GroupListItem label="数据备份" onClick={handleExport} showChevron />
            <GroupListItem
              label="数据恢复"
              onClick={() => fileRef.current?.click()}
              showChevron
            />
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </SettingsGroupCard>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-white py-4 text-base font-medium text-red-400 transition-colors active:bg-gray-50"
        >
          退出登录
        </button>
      </div>
    </>
  )
}
