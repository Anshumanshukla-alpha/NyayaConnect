import { Appointment, AuditLog, CaseDocument, CaseWorkspace, LawyerProfile, Notification, User, LegalTriageResult, CaseTimelineEvent } from './types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
let csrfToken = '';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (!['GET','HEAD','OPTIONS'].includes(method) && csrfToken) headers.set('X-CSRF-Token', csrfToken);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });
  const text = await response.text();
  let payload: any = {};
  try { payload = text ? JSON.parse(text) : {}; } catch { payload = { message: text }; }
  if (!response.ok) throw new ApiError(response.status, payload.code ?? 'REQUEST_FAILED', payload.message ?? 'Request failed');
  if (payload.csrfToken) csrfToken = payload.csrfToken;
  return payload as T;
}

export const api = {
  async me() { return request<{user: User; csrfToken: string}>('/api/v1/auth/me'); },
  async login(email: string, password: string) { return request<{user: User; csrfToken: string}>('/api/v1/auth/login', { method:'POST', body: JSON.stringify({email,password}) }); },
  async register(name: string, email: string, password: string, role: 'CLIENT'|'LAWYER', barCouncilNumber?: string) { return request<{id:string;message:string}>('/api/v1/auth/register', { method:'POST', body: JSON.stringify({name,email,password,role,barCouncilNumber}) }); },
  async logout() { const r = await request<{message:string}>('/api/v1/auth/logout', { method:'POST' }); csrfToken=''; return r; },
  async bootstrap() { return request<{user:User;users:User[];lawyers:LawyerProfile[];appointments:Appointment[];cases:CaseWorkspace[];timelineEvents:CaseTimelineEvent[];documents:CaseDocument[];notifications:Notification[];auditLogs:AuditLog[];csrfToken:string}>('/api/v1/bootstrap'); },
  async triage(query: string, language: string) { return request<LegalTriageResult>('/api/ai/triage', { method:'POST', body: JSON.stringify({query,language}) }); },
  async documentIntelligence(documentId: string) { return request<any>(`/api/ai/document-intelligence/${documentId}`, { method:'POST' }); },
  async consultationBrief(input: Record<string,unknown>) { return request<any>('/api/ai/consultation-brief', { method:'POST', body: JSON.stringify(input) }); },
  async chat(input: Record<string,unknown>) { return request<any>('/api/ai/chat', { method:'POST', body: JSON.stringify(input) }); },
  async bookAppointment(input: Record<string,unknown>) { return request<any>('/api/v1/appointments', { method:'POST', body: JSON.stringify(input) }); },
  async appointmentAction(id: string, action: 'confirm'|'reject'|'complete', notes?: string) { return request<any>(`/api/v1/appointments/${id}/${action}`, { method:'POST', body: action==='complete' ? JSON.stringify({notes:notes ?? ''}) : undefined }); },
  async markNotificationRead(id: string) { return request<any>(`/api/v1/notifications/${id}`, { method:'PATCH' }); },
  async toggleTask(caseId: string, taskId: string) { return request<any>(`/api/v1/cases/${caseId}/tasks/${taskId}`, { method:'POST' }); },
  async addTimeline(caseId: string, input: Record<string,unknown>) { return request<any>(`/api/v1/cases/${caseId}/timeline`, { method:'POST', body: JSON.stringify(input) }); },
  async toggleUserBlock(id: string) { return request<any>(`/api/v1/admin/${id}/block`, { method:'POST' }); },
  async updateLawyerStatus(id: string, status: string) { return request<any>(`/api/v1/admin/${id}/lawyer-status`, { method:'POST', body: JSON.stringify({status}) }); },
  async uploadDocument(caseId: string, file: File) {
    const form = new FormData(); form.append('caseId',caseId); form.append('file',file);
    return request<any>('/api/v1/documents', { method:'POST', body: form });
  },
};
