import { useAppStore } from '../../store/useAppStore'
import {
  getAccountSecurityInfo,
  GroupListItem,
  ProfileSubPanel,
  SettingsGroupCard,
  SubPageHeader,
} from './profileShared'

interface ProfileAccountViewProps {
  open: boolean
  onBack: () => void
  onClearData: () => void
  onDeleteAccount: () => void
}

export function ProfileAccountView({
  open,
  onBack,
  onClearData,
  onDeleteAccount,
}: ProfileAccountViewProps) {
  const loginMethod = useAppStore((s) => s.loginMethod)
  const phone = useAppStore((s) => s.phone)
  const account = getAccountSecurityInfo(loginMethod, phone)

  return (
    <ProfileSubPanel open={open} zIndex={61}>
      <SubPageHeader title="账号与安全" onBack={onBack} />

      <div className="flex flex-1 flex-col px-5 pb-10">
        <SettingsGroupCard>
          <GroupListItem label={account.label} value={account.value} />
        </SettingsGroupCard>

        <div className="mt-auto flex flex-col items-center gap-6 pt-16">
          <button
            type="button"
            onClick={onClearData}
            className="py-2 text-sm text-gray-400 transition-colors hover:text-gray-500"
          >
            清除所有数据
          </button>
          <button
            type="button"
            onClick={onDeleteAccount}
            className="py-2 text-sm text-red-400/90 transition-colors hover:text-red-500"
          >
            注销账号
          </button>
        </div>
      </div>
    </ProfileSubPanel>
  )
}
