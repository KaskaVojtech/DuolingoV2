export interface ConstrainedItem {
  id: string;
  order: number;
  title: string;
  constraintGroups: Array<{
    id: string;
    rules: Array<{
      id: string;
      sourceId: string;
    }>;
  }>;
}

export interface ConstraintImpact {
  affectedItemId: string;
  affectedItemTitle: string;
  constraintRuleId: string;
  isAutoResolvable: boolean;
  autoResolveDescription?: string;
}

export function wouldCreateCycle<T extends ConstrainedItem>(
  targetId: string,
  sourceId: string,
  items: T[]
): boolean {
  if (sourceId === targetId) return true;

  const visited = new Set<string>();
  const stack = [targetId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === sourceId) return true;
    if (visited.has(current)) continue;
    visited.add(current);

    const item = items.find((i) => i.id === current);
    if (!item) continue;

    for (const group of item.constraintGroups) {
      for (const rule of group.rules) {
        stack.push(rule.sourceId);
      }
    }
  }

  return false;
}

export function getConstraintImpacts<T extends ConstrainedItem>(
  deletedId: string,
  items: T[]
): ConstraintImpact[] {
  const impacts: ConstraintImpact[] = [];
  const deletedItem = items.find((i) => i.id === deletedId);
  if (!deletedItem) return impacts;

  const maxOrder = Math.max(...items.map((i) => i.order));
  const isLastItem = deletedItem.order === maxOrder;

  for (const item of items) {
    if (item.id === deletedId) continue;

    for (const group of item.constraintGroups) {
      for (const rule of group.rules) {
        if (rule.sourceId !== deletedId) continue;

        const isAutoResolvable = isLastItem;
        const prevItem = isAutoResolvable
          ? items
              .filter((i) => i.id !== deletedId)
              .sort((a, b) => b.order - a.order)[0]
          : null;

        impacts.push({
          affectedItemId: item.id,
          affectedItemTitle: item.title,
          constraintRuleId: rule.id,
          isAutoResolvable,
          autoResolveDescription: prevItem
            ? `Podmínka se přesune na "${prevItem.title}"`
            : undefined,
        });
      }
    }
  }

  return impacts;
}

export function resolveConstraintImpacts<T extends ConstrainedItem>(
  impacts: ConstraintImpact[],
  deletedId: string,
  items: T[]
): T[] {
  const prevItem = items
    .filter((i) => i.id !== deletedId)
    .sort((a, b) => b.order - a.order)[0];

  return items.map((item) => {
    const hasImpact = impacts.some(
      (impact) => impact.affectedItemId === item.id && impact.isAutoResolvable
    );
    if (!hasImpact) return item;

    return {
      ...item,
      constraintGroups: item.constraintGroups.map((group) => ({
        ...group,
        rules: group.rules.map((rule) =>
          rule.sourceId === deletedId && prevItem
            ? { ...rule, sourceId: prevItem.id }
            : rule
        ),
      })),
    };
  });
}
