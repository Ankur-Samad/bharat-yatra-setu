export function interpretQuery(query = '') {
  const text = query.toLowerCase().trim()

  let destination = 'Any destination'
  let category = 'Any experience'
  let duration = 'Any duration'
  let maxBudget = 2000

  // Destination
  if (
    text.includes('jaipur') ||
    text.includes('जयपुर')
  ) {
    destination = 'Jaipur'
  }

  // Category
  if (
    text.includes('heritage') ||
    text.includes('history') ||
    text.includes('historical') ||
    text.includes('culture') ||
    text.includes('fort') ||
    text.includes('palace') ||
    text.includes('विरासत') ||
    text.includes('इतिहास') ||
    text.includes('संस्कृति') ||
    text.includes('किला')
  ) {
    category = 'Heritage & Culture'
  }

  // Budget
  const budgetMatch =
    text.match(/₹\s?(\d+)/) ||
    text.match(/under\s+₹?\s?(\d+)/) ||
    text.match(/below\s+₹?\s?(\d+)/) ||
    text.match(/(\d+)\s*(?:rupees|rs)/)

  if (budgetMatch) {
    maxBudget = Number(budgetMatch[1])
  }

  // Duration
  const durationMatch =
    text.match(/(\d+)\s*(?:hour|hours|hr|hrs)/)

  if (durationMatch) {
    const hours = Number(durationMatch[1])
    duration = `${hours} hour${hours === 1 ? '' : 's'}`
  }

  return {
    raw: query,
    destination,
    category,
    duration,
    maxBudget
  }
}

export function matchesQuery(item, interpretation) {
  if (!interpretation) {
    return true
  }

  const searchableText = `
    ${item.title || ''}
    ${item.description || ''}
    ${item.city || ''}
    ${item.location || ''}
    ${item.category || ''}
    ${(item.tags || []).join(' ')}
  `.toLowerCase()

  // Destination
  if (
    interpretation.destination === 'Jaipur' &&
    !searchableText.includes('jaipur')
  ) {
    return false
  }

  // Heritage / culture
  if (
    interpretation.category === 'Heritage & Culture'
  ) {
    const heritageWords = [
      'heritage',
      'history',
      'historical',
      'culture',
      'fort',
      'palace',
      'विरासत',
      'इतिहास',
      'संस्कृति',
      'किला'
    ]

    const isHeritage = heritageWords.some(
      (word) => searchableText.includes(word)
    )

    if (!isHeritage) {
      return false
    }
  }

  // Budget
  if (
    interpretation.maxBudget &&
    Number(item.price) > interpretation.maxBudget
  ) {
    return false
  }

  // Duration
  if (
    interpretation.duration !== 'Any duration'
  ) {
    const requestedHours = Number(
      interpretation.duration.match(/\d+/)?.[0]
    )

    const itemHours = Number(
      String(item.duration).match(/\d+/)?.[0]
    )

    if (
      requestedHours &&
      itemHours &&
      itemHours > requestedHours
    ) {
      return false
    }
  }

  return true
}