import type { JavaCodeSnippet } from './javaSourceCode';

const javaFiles = import.meta.glob('../../backend/src/main/java/**/*.java', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const resourceFiles = import.meta.glob('../../backend/src/main/resources/{schema.sql,logback.xml}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const pomFiles = import.meta.glob('../../backend/pom.xml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const category = (path: string): JavaCodeSnippet['category'] => {
  if (path.includes('/config/')) return 'CONFIG';
  if (path.includes('/security/') || path.includes('Filter.java')) return 'FILTER';
  if (path.includes('/appointment/') || path.includes('/auth/') || path.includes('/ai/') || path.includes('/web/')) return 'CONTROLLER';
  if (path.includes('/document/') || path.includes('/casemgmt/')) return 'SERVICE';
  if (path.includes('/user/')) return 'DAO';
  return 'SERVICE';
};

const toSnippet = (path: string, code: string, idPrefix: string): JavaCodeSnippet => {
  const normalized = path.replace(/^\.\//, '');
  const fileName = normalized.split('/').pop() ?? normalized;
  return { id: `${idPrefix}_${normalized.replace(/[^A-Za-z0-9]+/g, '_')}`, category: category(normalized), fileName, filePath: normalized, description: `Live source from the current NyayaConnect 4.1 codebase: ${fileName}`, code };
};

export const LIVE_JAVA_PROJECT_FILES: JavaCodeSnippet[] = [
  ...Object.entries(javaFiles).map(([path, code]) => toSnippet(path, code, 'java')),
  ...Object.entries(pomFiles).map(([path, code]) => ({ id:'pom_live', category:'MAVEN' as const, fileName:'pom.xml', filePath:'backend/pom.xml', description:'Live Maven configuration used by the backend.', code })),
  ...Object.entries(resourceFiles).map(([path, code]) => ({ id:`resource_${path}`, category:'SQL' as const, fileName:path.split('/').pop() ?? path, filePath:path, description:'Live backend resource from the current codebase.', code }))
].sort((a,b) => a.filePath.localeCompare(b.filePath));
