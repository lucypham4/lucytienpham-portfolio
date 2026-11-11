// A demo on the left and its description on the right, kept side by side
// even on a phone so the two are on screen together. The phone is capped to
// the viewport's height so the whole recording fits in view beside its copy,
// and the copy steps down a size in a phone's narrow right-hand column.
export const sideBySide =
  "grid grid-cols-[45%_1fr] items-center gap-5 sm:gap-10 [&_.phone]:mx-0 [&_.phone]:max-w-[min(360px,calc(72svh*804/1748))] [&_.prose-body]:max-sm:text-base [&_.prose-body]:max-sm:leading-6";
