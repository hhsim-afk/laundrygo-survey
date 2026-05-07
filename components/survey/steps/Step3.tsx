'use client'

import { useFormContext, Controller } from 'react-hook-form'
import type { SurveyData } from '@/types/survey'

const DETAIL_ITEMS = [
  { key: 'convenience',   label: '접수 편의성' },
  { key: 'cleanliness',   label: '청결도' },
  { key: 'durability',    label: '유지력' },
  { key: 'deliverySpeed', label: '배송 속도' },
] as const

const RATING_LABELS = ['매우\n불만족', '불만족', '보통', '만족', '매우\n만족']
const STAR_LABELS   = ['', '매우 불만족', '불만족', '보통', '만족', '매우 만족']

const npsColor = (i: number) =>
  i <= 6 ? '#EF4444' : i <= 8 ? '#F59E0B' : '#00C7AE'

export default function Step3() {
  const { control, register, formState: { errors } } = useFormContext<SurveyData>()

  const hasDetailError =
    errors.detailedRatings?.convenience ||
    errors.detailedRatings?.cleanliness ||
    errors.detailedRatings?.durability  ||
    errors.detailedRatings?.deliverySpeed

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#004D43' }}>
          만족도 조사
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
          Korea 50K 현장 세탁 서비스를 평가해주세요.
        </p>
      </div>

      {/* Q7. 종합 만족도 – 별점 */}
      <section>
        <QuestionLabel index={7} text="Korea 50K 현장 세탁 서비스 종합 만족도" required />
        <Controller
          name="overallSatisfaction"
          control={control}
          rules={{ validate: v => (v && v > 0) || '별점을 선택해주세요' }}
          render={({ field }) => (
            <div className="mt-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => field.onChange(star)}
                    className="transition-transform active:scale-90"
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill={field.value && field.value >= star ? '#00C7AE' : '#E5E7EB'}
                      />
                    </svg>
                  </button>
                ))}
              </div>
              {field.value !== undefined && field.value > 0 && (
                <p className="text-center mt-2 text-sm font-semibold" style={{ color: '#004D43' }}>
                  {STAR_LABELS[field.value]}
                </p>
              )}
            </div>
          )}
        />
        {errors.overallSatisfaction && (
          <p className="mt-2 text-xs text-center" style={{ color: '#F87171' }}>
            {errors.overallSatisfaction.message as string}
          </p>
        )}
      </section>

      {/* Q8. 상세 항목 평가 – 그리드 */}
      <section>
        <QuestionLabel index={8} text="상세 항목 평가" required />
        <div className="mt-4 overflow-x-auto -mx-5 px-5">
          <div style={{ minWidth: '320px' }}>
            {/* 헤더 행 */}
            <div className="grid items-center mb-3" style={{ gridTemplateColumns: '6rem repeat(5, 1fr)' }}>
              <div />
              {RATING_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="text-center text-[10px] leading-tight whitespace-pre-line"
                  style={{ color: '#9CA3AF' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* 항목 행 */}
            {DETAIL_ITEMS.map(item => (
              <Controller
                key={item.key}
                name={`detailedRatings.${item.key}`}
                control={control}
                rules={{ validate: v => (v && v > 0) || ' ' }}
                render={({ field }) => (
                  <div
                    className="grid items-center py-3"
                    style={{
                      gridTemplateColumns: '6rem repeat(5, 1fr)',
                      borderBottom: '1px solid #F9FAFB',
                    }}
                  >
                    <span className="text-xs font-medium pr-2" style={{ color: '#374151' }}>
                      {item.label}
                    </span>
                    {[1, 2, 3, 4, 5].map(n => {
                      const active = field.value === n
                      return (
                        <div key={n} className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => field.onChange(n)}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all active:scale-90"
                            style={{
                              borderColor: active ? '#00C7AE' : '#E5E7EB',
                              backgroundColor: active ? '#00C7AE' : 'transparent',
                            }}
                          >
                            {active && <span className="w-3 h-3 rounded-full bg-white" />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              />
            ))}
          </div>
        </div>
        {hasDetailError && (
          <p className="mt-2 text-xs" style={{ color: '#F87171' }}>모든 항목을 평가해주세요</p>
        )}
      </section>

      {/* Q9. 차별점 Textarea */}
      <section>
        <QuestionLabel index={9} text="laundrygo만의 차별점이 있다면?" />
        <textarea
          {...register('differentiator')}
          placeholder="자유롭게 작성해주세요"
          rows={4}
          className="w-full mt-3 px-4 py-3.5 rounded-xl border text-sm outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
          style={{ borderColor: '#F3F4F6', color: '#1F2937' }}
          onFocus={e => (e.target.style.borderColor = '#00C7AE')}
          onBlur={e => (e.target.style.borderColor = '#F3F4F6')}
        />
      </section>

      {/* Q10. NPS 0~10 */}
      <section>
        <QuestionLabel index={10} text="laundrygo를 주변에 추천할 의향이 있으신가요?" required />
        <p className="text-xs mt-1 mb-4" style={{ color: '#9CA3AF' }}>0 = 전혀 없음 · 10 = 강력 추천</p>
        <Controller
          name="nps"
          control={control}
          rules={{ validate: v => (v !== undefined && v !== null) || 'NPS 점수를 선택해주세요' }}
          render={({ field }) => (
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 11 }, (_, i) => {
                  const active = field.value === i
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => field.onChange(i)}
                      className="flex-1 py-3 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      style={{
                        backgroundColor: active ? npsColor(i) : '#F9FAFB',
                        color: active ? 'white' : '#9CA3AF',
                      }}
                    >
                      {i}
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px]" style={{ color: '#9CA3AF' }}>전혀 없음</span>
                <span className="text-[10px]" style={{ color: '#9CA3AF' }}>강력 추천</span>
              </div>
            </div>
          )}
        />
        {errors.nps && (
          <p className="mt-1.5 text-xs" style={{ color: '#F87171' }}>
            {errors.nps.message as string}
          </p>
        )}
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
