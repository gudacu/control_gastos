export const COLOR_OPTIONS = [
    { label: 'Rojo', value: 'red' },
    { label: 'Naranja', value: 'orange' },
    { label: 'Ámbar', value: 'amber' },
    { label: 'Amarillo', value: 'yellow' },
    { label: 'Lima', value: 'lime' },
    { label: 'Esmeralda', value: 'emerald' },
    { label: 'Teal', value: 'teal' },
    { label: 'Cyan', value: 'cyan' },
    { label: 'Azul', value: 'blue' },
    { label: 'Índigo', value: 'indigo' },
    { label: 'Violeta', value: 'violet' },
    { label: 'Púrpura', value: 'purple' },
    { label: 'Rosa', value: 'pink' },
    { label: 'Rosado', value: 'rose' },
] as const

type ColorClasses = {
    bg: string
    text: string
    border: string
    bgLight: string
}

export const colorMap: Record<string, ColorClasses> = {
    red:     { bg: 'bg-red-500',     text: 'text-red-400',     border: 'border-red-500',     bgLight: 'bg-red-500/20' },
    orange:  { bg: 'bg-orange-500',  text: 'text-orange-400',  border: 'border-orange-500',  bgLight: 'bg-orange-500/20' },
    amber:   { bg: 'bg-amber-500',   text: 'text-amber-400',   border: 'border-amber-500',   bgLight: 'bg-amber-500/20' },
    yellow:  { bg: 'bg-yellow-500',  text: 'text-yellow-400',  border: 'border-yellow-500',  bgLight: 'bg-yellow-500/20' },
    lime:    { bg: 'bg-lime-500',    text: 'text-lime-400',    border: 'border-lime-500',    bgLight: 'bg-lime-500/20' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', bgLight: 'bg-emerald-500/20' },
    teal:    { bg: 'bg-teal-500',    text: 'text-teal-400',    border: 'border-teal-500',    bgLight: 'bg-teal-500/20' },
    cyan:    { bg: 'bg-cyan-500',    text: 'text-cyan-400',    border: 'border-cyan-500',    bgLight: 'bg-cyan-500/20' },
    blue:    { bg: 'bg-blue-500',    text: 'text-blue-400',    border: 'border-blue-500',    bgLight: 'bg-blue-500/20' },
    indigo:  { bg: 'bg-indigo-500',  text: 'text-indigo-400',  border: 'border-indigo-500',  bgLight: 'bg-indigo-500/20' },
    violet:  { bg: 'bg-violet-500',  text: 'text-violet-400',  border: 'border-violet-500',  bgLight: 'bg-violet-500/20' },
    purple:  { bg: 'bg-purple-500',  text: 'text-purple-400',  border: 'border-purple-500',  bgLight: 'bg-purple-500/20' },
    pink:    { bg: 'bg-pink-500',    text: 'text-pink-400',    border: 'border-pink-500',    bgLight: 'bg-pink-500/20' },
    rose:    { bg: 'bg-rose-500',    text: 'text-rose-400',    border: 'border-rose-500',    bgLight: 'bg-rose-500/20' },
}

export function getColorClasses(color: string): ColorClasses {
    return colorMap[color] || colorMap.indigo
}
