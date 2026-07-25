export interface Session {
  id: string;
  sessionId: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  lastActivityAt: string;
  messageCount: number;
  createdAt: string;
}

export interface ChatHistory {
  id: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  docName: string;
  page: number;
  text?: string;
  confidence?: number;
}

export interface Message {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  citations?: Citation[];
  asiScore?: number;
  reasoningPath?: string[];
}

export interface RAGQueryResponse {
  answer: string;
  citations?: Citation[];
  confidence?: number;
  asiScore?: number;
  reasoningPath?: string[];
  sources?: string[];
  error?: string;
}

export interface AdminDocument {
  id: string;
  title: string;
  filename: string;
  type: string;
  total_pages?: number;
  total_images?: number;
  total_tables?: number;
  status: string;
  version?: number;
  created_at: string;
  updated_at: string;
}
