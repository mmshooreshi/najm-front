// composables/useStackedCards.ts
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

type Dir = 'x' | '-x' | 'y' | '-y'

export function useStackedCards (
  cards: Ref<(HTMLElement | null)[]>,
  opts: { snap: Ref<boolean>; gap: Ref<number>; topOffset: Ref<number> }
) {
  let ctx: gsap.Context | undefined

  /** Rebuild timeline every time reactive inputs change */
  const rebuild = () => {
    ctx?.revert()
    const els = cards.value.filter(
      (n): n is HTMLElement => n instanceof HTMLElement
    )
    if (!els.length) return                    // nothing to animate yet

    ctx = gsap.context(() => {
      els.forEach((card, i) => {
        const dirAttr = card.getAttribute('data-dir') as Dir | null
        const dir: Dir = dirAttr ?? 'y'

        const fromVars: gsap.TweenVars = {
            opacity: 0,
            [dir]: 100,
            y: dir === 'y' || dir === '-y' ? 0 : i * opts.gap.value + opts.topOffset.value
          }
          
        const toVars: gsap.TweenVars = {
          opacity: 1,
          [dir]: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=25%',
            toggleActions: 'play none none reverse', // ✅ entry animation only
                    }
        }

        gsap.fromTo(card, fromVars, toVars)
      })
    })
  }

  onMounted(async () => {
    await nextTick()             // wait for refs
    rebuild()
    watch([cards, opts.snap, opts.gap, opts.topOffset], rebuild, {
      flush: 'post'
    })
  })

  onBeforeUnmount(() => ctx?.revert())
}
