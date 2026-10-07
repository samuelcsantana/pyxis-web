import {
  BUTTON_ICON,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  BUTTON_STRONG,
  CONTROL_BUSY,
  CONTROL_DISABLED,
  PILL,
  PILL_IDLE,
  PILL_SELECTED,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  TAB,
  TAB_IDLE,
  TAB_SELECTED,
} from '@/components/ui/control-classes';

export const BUTTON_RECIPES = [
  { name: 'Primary', className: `min-h-11 rounded-input px-4 text-sm ${BUTTON_PRIMARY}` },
  { name: 'Strong', className: `min-h-11 rounded-input px-4 text-sm ${BUTTON_STRONG}` },
  {
    name: 'Secondary',
    className: `min-h-11 rounded-input px-4 text-sm font-medium ${BUTTON_SECONDARY}`,
  },
] as const;

const PLUS_ICON = 'M12 5v14 M5 12h14';
const ROW = 'flex flex-wrap items-center gap-3';

export function ControlRecipes() {
  return (
    <div className="flex max-w-4xl flex-col gap-8 bg-bg p-6 text-ink">
      <section aria-labelledby="buttons-heading" className="flex flex-col gap-4">
        <h2 id="buttons-heading" className="text-lg font-semibold">
          Buttons
        </h2>
        <ul className="flex flex-col gap-3">
          {BUTTON_RECIPES.map((recipe) => (
            <li key={recipe.name} className={ROW}>
              <button type="button" className={recipe.className}>
                {recipe.name}
              </button>
              <button type="button" disabled className={`${recipe.className} ${CONTROL_DISABLED}`}>
                {recipe.name}, unavailable
              </button>
              <button
                type="button"
                disabled
                aria-busy="true"
                className={`${recipe.className} ${CONTROL_BUSY}`}
              >
                {recipe.name}, busy…
              </button>
            </li>
          ))}
          <li className={ROW}>
            <button type="button" className={`size-11 rounded-input ${BUTTON_ICON}`}>
              <span className="sr-only">Icon</span>
              <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d={PLUS_ICON}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </li>
        </ul>
      </section>
      <section aria-labelledby="choices-heading" className="flex flex-col gap-4">
        <h2 id="choices-heading" className="text-lg font-semibold">
          Choices
        </h2>
        <div role="group" aria-label="Segmented" className={`w-fit ${SEGMENTED_GROUP}`}>
          <button
            type="button"
            aria-pressed="true"
            className={`min-h-9 px-3.5 ${SEGMENTED_OPTION} ${SEGMENTED_SELECTED}`}
          >
            Selected
          </button>
          <button
            type="button"
            aria-pressed="false"
            className={`min-h-9 px-3.5 ${SEGMENTED_OPTION} ${SEGMENTED_IDLE}`}
          >
            Idle
          </button>
        </div>
        <div role="group" aria-label="Tabs" className="flex gap-1 border-b border-line">
          <button
            type="button"
            aria-pressed="true"
            className={`min-h-11 px-4 ${TAB} ${TAB_SELECTED}`}
          >
            Selected tab
          </button>
          <button type="button" aria-pressed="false" className={`min-h-11 px-4 ${TAB} ${TAB_IDLE}`}>
            Idle tab
          </button>
        </div>
        <div role="group" aria-label="Pills" className={ROW}>
          <button
            type="button"
            aria-pressed="true"
            className={`min-h-9 px-3.5 ${PILL} ${PILL_SELECTED}`}
          >
            Selected pill
          </button>
          <button
            type="button"
            aria-pressed="false"
            className={`min-h-9 px-3.5 ${PILL} ${PILL_IDLE}`}
          >
            Idle pill
          </button>
        </div>
      </section>
    </div>
  );
}
