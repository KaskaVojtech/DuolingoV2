import nlp from 'compromise'

function detectPOS(word: string) {
    const doc = nlp(word)
    const results = []

    if (doc.verbs().found) results.push('verb')
    if (doc.nouns().found) results.push('noun')
    if (doc.adjectives().found) results.push('adjective')
    if (doc.adverbs().found) results.push('adverb')
    if (doc.prepositions().found) results.push('preposition')
    if (doc.conjunctions().found) results.push('conjunction')
    if (doc.pronouns().found) results.push('pronoun')

    return results
}

detectPOS('eat')    // → ['verb']
detectPOS('run')    // → ['verb', 'noun']
detectPOS('fast')   // → ['adjective', 'adverb']
detectPOS('at')     // → ['preposition']