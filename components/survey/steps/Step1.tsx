'use client'

import { useFormContext, Controller } from 'react-hook-form'
import type { SurveyData } from '@/types/survey'

const GENDERS = [
  { value: '남성',        label: '남성',     emoji: '👔' },
  { value: '여성',        label: '여성',     emoji: '👗' },
  { value: '응답하지 않음', label: '응답 안 함', emoji: '✦' },
]

const AGE_GROUPS = ['20대 이하', '20대', '30대', '40대', '50대', '60대 이상']

const TRAIL_EXPERIENCES = [
  { value: '1년 미만', desc: '막 시작한 단계예요' },
  { value: '1~2년',   desc: '기초를 다지는 중이에요' },
  { value: '2~3년',   desc: '꾸준히 즐기고 있어요' },
  { value: '3~5년',   desc: '다양한 코스를 경험했어요' },
  { value: '5년 이상', desc: '베테랑 트레일 러너예요' },
]

export default function Step1() {
  const { control, register, formState: { errors } } = useFormContext<SurveyData>()

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#004D43' }}>
          기본 정보
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
          솔직한 응답이 더 나은 서비스를 만듭니다.
        </p>
      </div>

      {/* Q1. 성별 */}
      <section>
        <QuestionLabel index={1} text="성별" required />
        <Controller
          name="gender"
          control={control}
          rules={{ required: '성별을 선택해주세요' }}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2.5 mt-3">
              {GENDERS.map(g => {
                const active = field.value === g.value
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => field.onChange(g.value)}
                    className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all duration-200 active:scale-95"
                    style={{
                      borderColor: active ? '#00C7AE' : '#F3F4F6',
                      backgroundColor: active ? 'rgba(0,199,174,0.06)' : '#FAFAFA',
                    }}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <span className="text-xs font-medium" style={{ color: active ? '#004D43' : '#6B7280' }}>
                      {g.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        />
        <ErrorMsg message={errors.gender?.message} />
      </section>

      {/* Q2. 연령대 */}
      <section>
        <QuestionLabel index={2} text="연령대" required />
        <Controller
          name="ageGroup"
          control={control}
          rules={{ required: '연령대를 선택해주세요' }}
          render={({ field }) => (
            <div className="mt-3 space-y-2">
              {AGE_GROUPS.map(age => {
                const active = field.value === age
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => field.onChange(age)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200"
                    style={{
                      borderColor: active ? '#00C7AE' : '#F3F4F6',
                      backgroundColor: active ? 'rgba(0,199,174,0.06)' : 'transparent',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: active ? '#004D43' : '#374151' }}>
                      {age}
                    </span>
                    <RadioDot active={active} />
                  </button>
                )
              })}
            </div>
          )}
        />
        <ErrorMsg message={errors.ageGroup?.message} />
      </section>

      {/* Q3. 거주 지역 */}
      <section>
        <QuestionLabel index={3} text="거주 지역" required />
        <input
          {...register('residence', { required: '거주 지역을 입력해주세요' })}
          placeholder="예: 서울시 마포구"
          className="w-full mt-3 px-4 py-3.5 rounded-xl border text-sm outline-none transition-all placeholder:text-gray-300"
          style={{ borderColor: errors.residence ? '#FCA5A5' : '#F3F4F6', color: '#1F2937' }}
          onFocus={e => (e.target.style.borderColor = '#00C7AE')}
          onBlur={e => (e.target.style.borderColor = errors.residence ? '#FCA5A5' : '#F3F4F6')}
        />
        <ErrorMsg message={errors.residence?.message} />
      </section>

      {/* Q4. 트레일 러닝 경력 */}
      <section>
        <QuestionLabel index={4} text="트레일 러닝 경력" required />
        <Controller
          name="trailExperience"
          control={control}
          rules={{ required: '경력을 선택해주세요' }}
          render={({ field }) => (
            <div className="mt-3 space-y-2">
              {TRAIL_EXPERIENCES.map(exp => {
                const active = field.value === exp.value
                return (
                  <button
                    key={exp.value}
                    type="button"
                    onClick={() => field.onChange(exp.value)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200"
                    style={{
                      borderColor: active ? '#00C7AE' : '#F3F4F6',
                      backgroundColor: active ? 'rgba(0,199,174,0.06)' : 'transparent',
                    }}
                  >
                    <RadioDot active={active} />
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: active ? '#004D43' : '#374151' }}>
                        {exp.value}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{exp.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        />
        <ErrorMsg message={errors.trailExperience?.message} />
      </section>
    </div>
  )
}

function QuestionLabel({ index, text, required }: { index: number; text: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#111827' }}>
      <span
        className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold text-white flex-shrink-0"
        style={{ backgroundColor: '#00C7AE' }}
      >
        {index}
      </span>
      {text}
      {required && <span style={{ color: '#00C7AE' }}>*</span>}
    </label>
  )
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <span
      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
      style={{ borderColor: active ? '#00C7AE' : '#D1D5DB' }}
    >
      {active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00C7AE' }} />}
    </span>
  )
}

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs" style={{ color: '#F87171' }}>{message}</p>
}
