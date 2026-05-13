"""
Closed-class seed: common uncountable (mass) nouns.
Used as a heuristic complement to LemmInflect's plural-form check.
"""
from typing import FrozenSet

UNCOUNTABLE_NOUNS: FrozenSet[str] = frozenset({
    # Liquids / substances
    "water", "air", "oil", "gas", "steam", "ice", "snow", "rain", "sunshine",
    "electricity", "oxygen", "hydrogen", "cotton", "silk", "wool", "leather",
    "rubber", "glass", "iron", "gold", "silver", "copper", "sand", "soil",
    "dust", "mud", "smoke", "wood", "paper", "plastic",
    # Food / drink
    "rice", "bread", "butter", "sugar", "salt", "flour", "cheese", "meat",
    "fish", "coffee", "tea", "milk", "wine", "beer", "grass",
    # Abstract
    "music", "money", "information", "knowledge", "advice", "news", "progress",
    "weather", "traffic", "health", "happiness", "love", "beauty", "education",
    "research", "evidence", "laughter", "thunder",
    # Collective
    "food", "furniture", "luggage", "equipment",
})
