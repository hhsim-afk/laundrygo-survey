'use client'

import { useFormContext } from 'react-hook-form'
import type { SurveyData } from '@/types/survey'

export default function Step4() {
  const { register, formState: { errors } } = useFormContext<SurveyData>()

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#004D43' }}>
          제언 및 이벤트
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
          소중한 의견을 남겨주시면 추첨을 통해 포인트를 지급해드립니다.
        </p>
      </div>

      {/* Q11. 자유 의견 */}
      <section>
        <QuestionLabel index={11} text="laundrygo 서비스에 대해 자유롭게 의견을 남겨주세요" />
        <textarea
          {...register('freeOpinion')}
          placeholder="칭찬, 개선사항, 건의사항 모두 환영합니다 :)"
          rows={4}
          className="w-full mt-3 px-4 py-3.5 rounded-xl border text-sm outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
          style={{ borderColor: '#F3F4F6', color: '#1F2937' }}
          onFocus={e => (e.target.style.borderColor = '#00C7AE')}
          onBlur={e => (e.target.style.borderColor = '#F3F4F6')}
        />
      </section>

      {/* Q12. 연락처 (휴대폰 번호) */}
      <section>
        <QuestionLabel index={12} text="휴대폰 번호 (포인트 지급용)" required />
        <p className="text-xs mt-1 mb-3" style={{ color: '#9CA3AF' }}>
          당첨 시 입력하신 번호로 포인트를 지급해드립니다.
        </p>
        <input
          {...register('contact', {
            required: '휴대폰 번호를 입력해주세요',
            validate: v => {
              const isPhone = /^01[0-9]-?\d{3,4}-?\d{4}$/.test((v || '').replace(/\s/g, ''))
              return isPhone || '올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)'
            },
          })}
          placeholder="010-1234-5678"
          inputMode="tel"
          className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all placeholder:text-gray-300"
          style={{ borderColor: errors.contact ? '#FCA5A5' : '#F3F4F6', color: '#1F2937' }}
          onFocus={e => (e.target.style.borderColor = '#00C7AE')}
          onBlur={e => (e.target.style.borderColor = errors.contact ? '#FCA5A5' : '#F3F4F6')}
        />
        {errors.contact && (
          <p className="mt-1.5 text-xs" style={{ color: '#F87171' }}>{errors.contact.message}</p>
        )}
      </section>

      {/* 개인정보 안내 */}
      <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F9FAFB' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
          입력하신 휴대폰 번호는 포인트 지급 목적으로만 사용되며, 이벤트 종료 후 즉시 파기됩니다.
          laundrygo는 개인정보보호법을 준수합니다.
        </p>
      </div>
    </div>
  )
}

function QuestionLabel({ index, text, required }: { index: number; text: string; required?: boolean }) {
  return (
    <label className="flex items-start gap-1.5 text-sm font-semibold" style={{ color: '#111827' }}>
      <span
        className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold text-white flex-shrink-0 mt-0.5"
        style={{ backgroundColor: '#00C7AE' }}
      >
        {index}
      </span>
      <span>{text}{required && <span style={{ color: '#00C7AE' }}> *</span>}</span>
    </label>
  )
}
