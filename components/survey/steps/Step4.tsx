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
          소중한 의견을 남겨주시면 추첨을 통해 경품을 드립니다.
        </p>
      </div>

      {/* Q11. 추가 희망 서비스 */}
      <section>
        <QuestionLabel index={11} text="앞으로 laundrygo에 추가되었으면 하는 서비스가 있나요?" />
        <textarea
          {...register('additionalServices')}
          placeholder="예: 신발 세탁, 정기구독 패키지, 드라이클리닝..."
          rows={3}
          className="w-full mt-3 px-4 py-3.5 rounded-xl border text-sm outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
          style={{ borderColor: '#F3F4F6', color: '#1F2937' }}
          onFocus={e => (e.target.style.borderColor = '#00C7AE')}
          onBlur={e => (e.target.style.borderColor = '#F3F4F6')}
        />
      </section>

      {/* Q12. 자유 의견 */}
      <section>
        <QuestionLabel index={12} text="laundrygo 서비스에 대해 자유롭게 의견을 남겨주세요" />
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

      {/* Q13. 연락처 */}
      <section>
        <QuestionLabel index={13} text="연락처 (경품 발송용)" required />
        <p className="text-xs mt-1 mb-3" style={{ color: '#9CA3AF' }}>
          이메일 또는 휴대폰 번호를 입력해주세요. 당첨 시 연락드립니다.
        </p>
        <input
          {...register('contact', {
            required: '연락처를 입력해주세요',
            validate: v => {
              const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '')
              const isPhone = /^01[0-9]-?\d{3,4}-?\d{4}$/.test((v || '').replace(/\s/g, ''))
              return isEmail || isPhone || '유효한 이메일 또는 휴대폰 번호를 입력해주세요'
            },
          })}
          placeholder="예: user@email.com 또는 010-1234-5678"
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
          입력하신 연락처는 경품 발송 목적으로만 사용되며, 이벤트 종료 후 즉시 파기됩니다.
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
