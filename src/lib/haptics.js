export function tap() {
  try { navigator.vibrate?.(15) } catch {}
}
export function success() {
  try { navigator.vibrate?.([10, 20, 10]) } catch {}
}
export function errorBuzz() {
  try { navigator.vibrate?.([50, 30, 50]) } catch {}
}
