"""
Fallback seed for animate noun detection when WordNet is unavailable.
Primary detection uses WordNet hypernym chains (person.n.01, animal.n.01).
"""
from typing import FrozenSet

ANIMATE_SEED: FrozenSet[str] = frozenset({
    # People
    "person", "man", "woman", "child", "boy", "girl", "baby", "adult",
    "human", "people", "student", "teacher", "doctor", "nurse", "patient",
    "friend", "enemy", "soldier", "king", "queen", "president", "player",
    "worker", "actor", "author", "artist", "musician", "athlete", "parent",
    "mother", "father", "brother", "sister", "son", "daughter",
    # Animals
    "animal", "dog", "cat", "bird", "fish", "horse", "cow", "pig", "sheep",
    "lion", "tiger", "elephant", "monkey", "bear", "wolf", "fox", "rabbit",
    "deer", "eagle", "snake", "whale", "dolphin", "insect", "bee", "ant",
})
