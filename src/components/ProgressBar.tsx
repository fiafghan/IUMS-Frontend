import { CheckCircle } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;      
  totalSteps: number;        
  stepsLabels: string[];    
}

export function ProgressBar({ currentStep, totalSteps, stepsLabels }: ProgressBarProps) {
  return (
    <nav aria-label="Progress" className="w-full max-w-7xl mx-auto my-8 px-6">
      <ol className="flex justify-between items-center relative">
        <div
          aria-hidden="true"
          className="absolute top-4 left-0 right-0 h-1 rounded-full bg-gray-300"
        />
        <div
          aria-hidden="true"
          className="absolute top-4 left-0 h-1 rounded-full bg-gradient-to-r from-blue-400 to-green-300 transition-all duration-700 ease-in-out"
          style={{ width: `${((currentStep) / (totalSteps - 1)) * 100}%` }}
        />

        {stepsLabels.map((label, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <li
              key={label}
              className="flex-1 flex flex-col items-center relative z-10"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-4
                  shadow-lg
                  transition-all duration-500 ease-in-out
                  ${isCompleted ? "bg-gradient-to-br from-amber-500 to-amber-100 border-blue-400 shadow-green-400/60" : ""}
                  ${isActive && !isCompleted ? "border-amber-400 bg-white shadow-blue-500/50" : ""}
                  ${!isCompleted && !isActive ? "bg-white border-gray-300" : ""}
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" aria-hidden="true" />
                ) : (
                  <span
                    className={`font-bold select-none text-lg
                      ${isActive ? "text-blue-600" : "text-gray-400"}
                    `}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* لیبل مرحله */}
              <span
                className={`
                  mt-3 text-sm font-semibold text-center select-none max-w-[80px]
                  ${isCompleted ? "text-gradient bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent" : ""}
                  ${isActive ? "text-blue-600" : "text-gray-400"}
                `}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
