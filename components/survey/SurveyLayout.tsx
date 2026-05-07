'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import ProgressBar from './ProgressBar'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import type { SurveyData } from '@/types/survey'

const STEPS = ['기본 정보', 'Pain Points', '만족도 조사', '제언 및 이벤트']

function getValidationFields(step: number): (keyof SurveyData)[] {
  switch (step) {
    case 0: return ['gender', 'ageGroup', 'residence', 'trailExperience']
    case 1: return ['importantFactors', 'anxietyFactors']
    case 2: return ['overallSatisfaction', 'detailedRatings', 'nps']
    case 3: return ['contact']
    default: return []
  }
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
}

const stepComponents = [<Step1 key="1" />, <Step2 key="2" />, <Step3 key="3" />, <Step4 key="4" />]

export default function SurveyLayout() {
  const [step, setStep]           = useState(0)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const methods = useForm<SurveyData>({
    defaultValues: {
      gender: undefined, ageGroup: undefined, residence: '', trailExperience: undefined,
      importantFactors: [], anxietyFactors: [],
      overallSatisfaction: 0,
      detailedRatings: { convenience: 0, cleanliness: 0, durability: 0, deliverySpeed: 0 },
      differentiator: '', nps: undefined,
      additionalServices: '', freeOpinion: '', contact: '',
    },
  })

  const goNext = async () => {
    const valid = await methods.trigger(getValidationFields(step))
    if (!valid) return

    if (step < STEPS.length - 1) {
      setDirection(1)
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      await handleSubmit()
    }
  }

  const goPrev = () => {
    setDirection(-1)
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const data = methods.getValues()
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('서버 오류')
      setSubmitted(true)
    } catch {
      setSubmitError('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  // 완료 화면
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: '#00C7AE' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#004D43' }}>
            소중한 의견 감사합니다
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
            응답이 정상적으로 제출되었습니다.<br />
            laundrygo가 더 나은 서비스로 보답하겠습니다.
          </p>
          <Image src="/logo.png" alt="laundrygo" width={100} height={26} className="mt-10 opacity-80" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-white flex flex-col">

        {/* 헤더 + Progress Bar */}
        <header
          className="sticky top-0 z-20 bg-white px-5 pt-5 pb-4"
          style={{ boxShadow: '0 1px 0 #F9FAFB' }}
        >
          <div className="max-w-lg mx-auto">
            <Image src="/logo.png" alt="laundrygo" width={120} height={32} priority style={{ mixBlendMode: 'multiply' }} />
            <ProgressBar currentStep={step} totalSteps={STEPS.length} stepLabels={STEPS} />
          </div>
        </header>

        {/* Step 콘텐츠 */}
        <main className="flex-1 overflow-hidden">
          <div className="max-w-lg mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="px-5 py-8"
              >
                {stepComponents[step]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* 하단 고정 네비게이션 */}
        <div
          className="sticky bottom-0 z-20 bg-white px-5 pt-3 pb-6"
          style={{ boxShadow: '0 -1px 0 #F9FAFB' }}
        >
          <div className="max-w-lg mx-auto">
            {submitError && (
              <p className="text-xs text-center mb-2" style={{ color: '#F87171' }}>{submitError}</p>
            )}
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={submitting}
                  className="flex-1 py-4 rounded-2xl text-sm font-medium border-2 transition-all active:scale-95 disabled:opacity-50"
                  style={{ borderColor: '#004D43', color: '#004D43' }}
                >
                  이전
                </button>
              )}
              <button
                type="button"
                onClick={goNext}
                disabled={submitting}
                className="flex-[2] py-4 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-70"
                style={{ backgroundColor: '#004D43' }}
              >
                {submitting ? '제출 중...' : step === STEPS.length - 1 ? '제출하기' : '다음으로'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </FormProvider>
  )
}
