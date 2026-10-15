import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { LegalDocument } from './legal-documents';

export const LEGAL_TEXT_FOLDER = path.join(process.cwd(), 'content', 'legal');

export async function legalSourceOf(document: LegalDocument): Promise<string> {
  return readFile(path.join(LEGAL_TEXT_FOLDER, document.file), 'utf8');
}
