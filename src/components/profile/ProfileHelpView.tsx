import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { FAQ_ITEMS } from '../../data/content'
import { GroupListItem, ProfileSubPanel, SettingsGroupCard, SubPageHeader } from './profileShared'

interface ProfileHelpViewProps {
  open: boolean
  onBack: () => void
  onOpenFeedback: () => void
}

export function ProfileHelpView({ open, onBack, onOpenFeedback }: ProfileHelpViewProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <ProfileSubPanel open={open}>
      <SubPageHeader title="帮助与反馈" onBack={onBack} />

      <div className="space-y-4 px-5 pb-10">
        <SettingsGroupCard>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-gray-50 last:border-0">
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                <span className="pr-4 text-sm text-gray-800">{item.q}</span>
                <ChevronRight
                  size={16}
                  strokeWidth={1.75}
                  className={`shrink-0 text-gray-300 transition-transform ${
                    expandedFaq === i ? 'rotate-90' : ''
                  }`}
                  aria-hidden
                />
              </button>
              {expandedFaq === i && (
                <p className="pb-4 text-sm leading-relaxed text-gray-500">{item.a}</p>
              )}
            </div>
          ))}
          <GroupListItem label="意见反馈" onClick={onOpenFeedback} showChevron />
        </SettingsGroupCard>
      </div>
    </ProfileSubPanel>
  )
}
