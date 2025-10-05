import { memo, useState, useEffect } from 'react'

interface TutorialStep {
  title: string
  description: string
  targetId?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Tere tulemast!',
    description: 'See on Rae KOV2025 erakondade võrdluse rakendus. Tutorialiga tutvustan, kuidas rakendust kasutada.',
    position: 'center',
  },
  {
    title: 'Filtrid',
    description: 'Vasak paneel sisaldab filtreid: vali kuni 3 erakonda võrdluseks, määra lubaduste staatused, teemafookus ja sortimisjärjestus. Filtrid mõjutavad kohe kõiki graafikuid ja vaadet.',
    targetId: 'filters-panel',
    position: 'right',
  },
  {
    title: 'Otsing ja ekspordid',
    description: 'Ülariba sisaldab otsingut (otsib üle erakondade nimede, ettepanekute, lubaduste ja teemade kirjelduste - proovi näiteks "tramm", "lasteaed" või "maamaks"), PNG eksporti (salvesta graafik pildina) ja vaate jagamise nuppu (kopeeri URL filtritega). Klõpsa otsinguväljale, et näha näidisotsinguid!',
    targetId: 'header-actions',
    position: 'bottom',
  },
  {
    title: 'Vahelehti',
    description: 'Kolme tabi vahel saad lülituda: "Ülevaade" näitab graafikuid ja statistikat, "Kõrvutus" näitab valitud erakondi detailselt kõrvuti (max 3), "Programm" võimaldab valida ühe erakonna ja lugeda tema täielikku programmi.',
    targetId: 'tabs-section',
    position: 'bottom',
  },
  {
    title: 'Graafikud',
    description: 'Kõik graafikud reageerivad filtritele reaalajas: kui valid erakondi või teemasid, näitavad graafikud ainult valitud andmeid. Hoia hiir graafiku kohal täiendava info saamiseks.',
    targetId: 'charts-area',
    position: 'top',
  },
  {
    title: 'Valmis!',
    description: 'Nüüd oled valmis rakendust kasutama! Tutoriali saad alati uuesti vaadata, klõpsates paremal all olevat "?" nuppu. Head võrdlemist!',
    position: 'center',
  },
]

interface TutorialProps {
  isOpen: boolean
  onClose: () => void
}

export const Tutorial = memo(function Tutorial({ isOpen, onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0)
      setHighlightRect(null)
      return
    }

    const step = TUTORIAL_STEPS[currentStep]
    if (step.targetId) {
      const element = document.getElementById(step.targetId)
      if (element) {
        const rect = element.getBoundingClientRect()
        setHighlightRect(rect)
      } else {
        setHighlightRect(null)
      }
    } else {
      setHighlightRect(null)
    }
  }, [isOpen, currentStep])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const step = TUTORIAL_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const getTooltipPosition = (): React.CSSProperties => {
    if (!highlightRect || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const padding = 20

    switch (step.position) {
      case 'right':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.right + padding}px`,
          transform: 'translateY(-50%)',
        }
      case 'left':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          right: `${window.innerWidth - highlightRect.left + padding}px`,
          transform: 'translateY(-50%)',
        }
      case 'top':
        return {
          bottom: `${window.innerHeight - highlightRect.top + padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        }
      case 'bottom':
        return {
          top: `${highlightRect.bottom + padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        }
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={handleSkip} />

      {/* Highlight spotlight */}
      {highlightRect && (
        <div
          className="absolute border-4 border-blue-500 rounded-lg pointer-events-none shadow-2xl"
          style={{
            top: `${highlightRect.top - 4}px`,
            left: `${highlightRect.left - 4}px`,
            width: `${highlightRect.width + 8}px`,
            height: `${highlightRect.height + 8}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-white rounded-lg shadow-2xl p-6 max-w-md z-10"
        style={getTooltipPosition()}
      >
        {/* Step indicator */}
        <div className="text-sm text-gray-500 mb-2">
          Samm {currentStep + 1} / {TUTORIAL_STEPS.length}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>

        {/* Description */}
        <p className="text-gray-700 mb-6">{step.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
            aria-label="Jäta vahele"
          >
            Jäta vahele
          </button>

          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Eelmine"
              >
                Eelmine
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isLastStep ? 'Valmis' : 'Järgmine'}
            >
              {isLastStep ? 'Valmis' : 'Järgmine'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})
