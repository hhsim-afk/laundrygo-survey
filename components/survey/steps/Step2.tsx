'use client'

import { useFormContext, Controller } from 'react-hook-form'
import type { SurveyData } from '@/types/survey'

const IMPORTANT_FACTORS = [
  { value: '세탁 품질',     emoji: '✨', desc: '깨끗하고 꼼꼼한 세탁' },
  { value: '빠른 처리',     emoji: '⚡', desc: '신속한 수거 및 배달' },
  { value: '가격 합리성',   emoji: '💰', desc: '합리적인 요금 체계' },
  { value: '비대면 편의성', emoji: '📱', desc: '앱으로 간편하게' },
  { value: '소재 안전성',   emoji: '🛡️', desc: '의류 손상 없는 케어' },
]

const ANXIETY_FACTORS = [
  { value: '세탁물 손상/변형', desc: '소재가 변하거나 줄어들까 걱정돼요' },
  { value: '분실 위험',        desc: '옷을 잃어버릴 수 있을 것 같아요' },
  { value: '위생 청결',        desc: '다른 옷과 같이 세탁될 것 같아요' },
  { value: '긴 처리 시간',     desc: '언제 받을 수 있는지 불확실해요' },
  { value: '높은 비용',        desc: '직접 세탁보다 비쌀 것 같아요' },
  { value: '서비스 신뢰도',    desc: '믿을 수 있는 서비스인지 모르겠어요' },
]

export default function Step2() {
  const { control, formState: { errors } } = useFormContext<SurveyData>()

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#004D43' }}>
          Pain Points
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
          세탁에 대한 솔직한 생각을 알려주세요.
        </p>
      </div>

      {/* Q5. 중요 요소 (최대 2개) */}
      <section>
        <QuestionLabel index={5} text="평소 세탁 시 가장 중요하게 생각하는 요소는?" required />
        <p className="text-xs mt-1 mb-3" style={{ color: '#9CA3AF' }}>최대 2개 선택</p>
        <Controller
          name="importantFactors"
          control={control}
          rules={{ validate: v => (v && v.length > 0) || '최소 1개를 선택해주세요' }}
          render={({ field }) => {
            const selected: string[] = field.value || []
            const toggle = (v: string) => {
              if (selected.includes(v)) {
                field.onChange(selected.filter(s => s !== v))
              } else if (selected.length < 2) {
                field.onChange([...selected, v])
              }
            }
            return (
              <div className="grid grid-cols-2 gap-2.5">
                {IMPORTANT_FACTORS.map(f => {
                  const active = selected.includes(f.value)
                  const maxed = selected.length >= 2 && !active
                  return (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => toggle(f.value)}
                      disabled={maxed}
                      className="flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-95"
                      style={{
                        borderColor: active ? '#00C7AE' : '#F3F4F6',
                        backgroundColor: active ? 'rgba(0,199,174,0.06)' : '#FAFAFA',
                        opacity: maxed ? 0.4 : 1,
                      }}
                    >
                      <span className="text-xl">{f.emoji}</span>
                      <span className="text-sm font-semibold" style={{ color: active ? '#004D43' : '#374151' }}>
                        {f.value}
                      </span>
                      <span className="text-xs" style={{ color: '#9CA3AF' }}>{f.desc}</span>
                    </button>
                  )
                })}
              </div>
            )
          }}
        />
        <ErrorMsg message={errors.importantFactors?.message as string} />
      </section>

      {/* Q6. 불안 요소 (복수 선택) */}
      <section>
        <QuestionLabel index={6} text="직접 세탁 또는 타 서비스 이용 시 가장 불안한 점은?" required />
        <Controller
          name="anxietyFactors"
          control={control}
          rules={{ validate: v => (v && v.length > 0) || '항목을 선택해주세요' }}
          render={({ field }) => {
            const selected: string[] = field.value || []
            const toggle = (v: string) => {
              if (selected.includes(v)) {
                field.onChange(selected.filter(s => s !== v))
              } else {
                field.onChange([...selected, v])
              }
            }
            return (
              <div className="mt-3 space-y-2">
                {ANXIETY_FACTORS.map(f => {
                  const active = selected.includes(f.value)
                  return (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => toggle(f.value)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200"
                      style={{
                        borderColor: active ? '#00C7AE' : '#F3F4F6',
                        backgroundColor: active ? 'rgba(0,199,174,0.06)' : 'transparent',
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          borderColor: active ? '#00C7AE' : '#D1D5DB',
                          backgroundColor: active ? '#00C7AE' : 'transparent',
                        }}
                      >
                        {active && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-medium" style={{ color: active ? '#004D43' : '#374151' }}>
                          {f.value}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{f.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )
          }}
        />
        <ErrorMsg message={errors.anxietyFactors?.message as string} />
      </section>
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

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs" style={{ color: '#F87171' }}>{message}</p>
}
