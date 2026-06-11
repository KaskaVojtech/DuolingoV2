import { ZodError } from 'zod';

export function getExerciseValidationMessage(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return 'Chyba při validaci cvičení';

  const path = issue.path;

  if (path[0] === 'title') {
    if (issue.code === 'too_small') return 'Název cvičení nesmí být prázdný';
    if (issue.code === 'too_big') return 'Název cvičení je příliš dlouhý (max 200 znaků)';
  }

  if (path[0] === 'items' && path.length === 1) {
    return 'Přidej alespoň jeden blok do cvičení';
  }

  if (path[0] === 'items' && typeof path[1] === 'number') {
    const n = (path[1] as number) + 1;
    const field = path[2];
    const subField = path[3];
    const deepField = path[4];

    if (field === 'url') return `Blok ${n}: chybí URL adresa`;

    if (field === 'question') return `Blok ${n}: otázka nesmí být prázdná`;
    if (field === 'options' && deepField === 'value') return `Blok ${n}: jedna z možností odpovědi je prázdná`;
    if (field === 'options') return `Blok ${n}: přidej alespoň 2 možnosti odpovědí`;

    if (field === 'content') return `Blok ${n}: zvýrazňování nemá žádný text`;

    if (field === 'source' && subField === 'words') return `Blok ${n}: přetahování nemá žádná slova`;
    if (field === 'targets') return `Blok ${n}: přetahování nemá žádné cíle`;

    if (field === 'columns') return `Blok ${n}: tabulka nemá žádné sloupce`;
    if (field === 'rows') return `Blok ${n}: tabulka nemá žádné řádky`;

    if (field === 'nodes') return `Blok ${n}: text s doplňováním je prázdný`;
  }

  return 'Cvičení obsahuje chybu — zkontroluj všechny bloky';
}
