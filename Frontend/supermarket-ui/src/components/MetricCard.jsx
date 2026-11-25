import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

function MetricCard({ label, value, formatter, note, icon: Icon, tone, index }) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    if (value === undefined) return undefined

    const startedAt = performance.now()
    let frameId
    const animate = (now) => {
      const progress = Math.min((now - startedAt) / 650, 1)
      setAnimatedValue(value * (1 - ((1 - progress) ** 3)))
      if (progress < 1) frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [value])

  return (
    <motion.article
      className="metric-card surface"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}`}><Icon size={17} strokeWidth={1.8} /></span>
      </div>
      <strong className="metric-value">{value === undefined ? '—' : formatter(animatedValue)}</strong>
      <span className="metric-note"><span className="neutral-dot" />{note}</span>
    </motion.article>
  )
}

export default MetricCard
