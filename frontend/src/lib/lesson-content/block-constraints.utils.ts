import { Block, BlockConstraintImpact } from './lesson-content.types';

export function wouldCreateBlockCycle(
  targetBlockId: string,
  sourceBlockId: string,
  allBlocks: Block[]
): boolean {
  if (sourceBlockId === targetBlockId) return true;
  const visited = new Set<string>();
  const stack = [targetBlockId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === sourceBlockId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const block = allBlocks.find((b) => b.id === current);
    if (!block) continue;
    for (const g of block.lockConfig.constraintGroups) {
      for (const r of g.rules) stack.push(r.sourceBlockId);
    }
  }
  return false;
}

export function getBlockConstraintImpacts(
  deletedBlockId: string,
  allBlocks: Block[]
): BlockConstraintImpact[] {
  const impacts: BlockConstraintImpact[] = [];
  const deleted = allBlocks.find((b) => b.id === deletedBlockId);
  if (!deleted) return impacts;

  const maxOrder = Math.max(...allBlocks.map((b) => b.order));
  const isLast = deleted.order === maxOrder;

  for (const block of allBlocks) {
    if (block.id === deletedBlockId) continue;
    for (const g of block.lockConfig.constraintGroups) {
      for (const r of g.rules) {
        if (r.sourceBlockId !== deletedBlockId) continue;
        const prevBlock = isLast
          ? allBlocks.filter((b) => b.id !== deletedBlockId).sort((a, b) => b.order - a.order)[0]
          : null;
        impacts.push({
          affectedBlockId: block.id,
          affectedBlockTitle: block.title,
          constraintRuleId: r.id,
          isAutoResolvable: isLast,
          autoResolveDescription: prevBlock ? `Podmínka se přesune na "${prevBlock.title}"` : undefined,
        });
      }
    }
  }
  return impacts;
}

export function resolveBlockConstraintImpacts(
  impacts: BlockConstraintImpact[],
  deletedBlockId: string,
  allBlocks: Block[]
): Block[] {
  const prevBlock = allBlocks
    .filter((b) => b.id !== deletedBlockId)
    .sort((a, b) => b.order - a.order)[0];

  return allBlocks.map((block) => {
    const hasResolvable = impacts.some((i) => i.affectedBlockId === block.id && i.isAutoResolvable);
    return {
      ...block,
      lockConfig: {
        ...block.lockConfig,
        constraintGroups: block.lockConfig.constraintGroups.map((g) => ({
          ...g,
          rules: g.rules
            .filter((r) => !(!hasResolvable && r.sourceBlockId === deletedBlockId))
            .map((r) =>
              r.sourceBlockId === deletedBlockId && prevBlock
                ? { ...r, sourceBlockId: prevBlock.id, sourceBlockTitle: prevBlock.title }
                : r
            ),
        })).filter((g) => g.rules.length > 0),
      },
    };
  });
}
