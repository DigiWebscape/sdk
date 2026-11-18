/**
 * DigiWebscape Platform — Official Isomorphic TypeScript SDK (@digiwebscape/sdk)
 * Provides high-level typed namespaces for AI Visibility, Private Insights Telemetry,
 * Webhooks, Workspace API Keys, and Model Context Protocol (MCP) integrations.
 */

import { ApiClient, ApiError } from '@digiwebscape/api-client';
import type {
  AIPrompt,
  AIPromptRun,
  AIVisibilityMetrics,
  AIVisibilityMetricsHistory,
  AIRecommendation,
  MultiEngineComparison,
  DomainAuditResult,
  CreatePromptInput,
  RunCheckInput,
  UpdateRecommendationInput,
  AuditDomainInput,
  AICompetitor,
  CompetitorGapIntelligence,
  AddCompetitorInput,
  RealtimePulseResponse,
  InsightsMetricsResponse,
  PrivacySettingsResponse,
  CollectEventPayload,
  WebhookEndpoint,
  CreateWebhookEndpointInput,
  UpdateWebhookEndpointInput,
  WebhookDelivery,
  WebhookEventType,
  WebhookPayloadFormat,
  WebhookEventEnvelope,
  WorkspaceApiKey,
  CreateApiKeyInput,
  CreateApiKeyResult,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  Organization,
  HeadlessCmsPagePayload,
  PageDocument,
  StudioExportFormat,
  StudioExportResult,
  StudioPageAnalytics,
  MediaAssetUploadResponse
} from '@digiwebscape/types';
import { exportPageDocument } from '@digiwebscape/types';

export interface DigiWebscapeOptions {
  apiKey?: string;
  organizationId?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export type MCPClientTarget = 'claude' | 'cursor' | 'cline' | 'generic';

export interface MCPConfigResult {
  clientType: MCPClientTarget;
  config: Record<string, unknown>;
  instructions: string;
}

export class DigiWebscape {
  private readonly client: ApiClient;
  private organizationId: string | null = null;
  private apiKey: string | null = null;
  private baseUrl: string;

  public readonly visibility: VisibilityNamespace;
  public readonly insights: InsightsNamespace;
  public readonly studio: StudioNamespace;
  public readonly webhooks: WebhooksNamespace;
  public readonly keys: KeysNamespace;
  public readonly projects: ProjectsNamespace;
  public readonly mcp: MCPNamespace;

  constructor(options: DigiWebscapeOptions = {}) {
    this.baseUrl = (options.baseUrl || 'https://api.digiwebscape.com').replace(/\/$/, '');
    this.organizationId = options.organizationId || null;
    this.apiKey = options.apiKey || null;

    this.client = new ApiClient({
      baseUrl: this.baseUrl,
      apiKey: this.apiKey,
      activeOrganizationId: this.organizationId,
      fetch: options.fetch
    });

    this.visibility = new VisibilityNamespace(this.client, () => this.organizationId);
    this.insights = new InsightsNamespace(this.client);
    this.studio = new StudioNamespace(this.client, () => this.organizationId);
    this.webhooks = new WebhooksNamespace(this.client, () => this.organizationId);
    this.keys = new KeysNamespace(this.client, () => this.organizationId);
    this.projects = new ProjectsNamespace(this.client, () => this.organizationId);
    this.mcp = new MCPNamespace(this.baseUrl, () => this.apiKey, () => this.organizationId);
  }

  setApiKey(apiKey: string | null): void {
    this.apiKey = apiKey;
    this.client.setApiKey(apiKey);
  }

  setOrganizationId(organizationId: string | null): void {
    this.organizationId = organizationId;
    this.client.setActiveOrganizationId(organizationId);
  }

  getOrganizationId(): string | null {
    return this.organizationId;
  }

  static verifyWebhookSignature(
    payload: string,
    signatureHeader: string,
    secret: string,
    toleranceSeconds: number = 300
  ): Promise<boolean> {
    return verifyWebhookSignature(payload, signatureHeader, secret, toleranceSeconds);
  }
}

export class VisibilityNamespace {
  constructor(
    private readonly client: ApiClient,
    private readonly getOrgId: () => string | null
  ) {}

  async getMetrics(projectId: string): Promise<AIVisibilityMetrics> {
    return this.client.getAIMetrics(projectId, this.getOrgId() || undefined);
  }

  async getMetricsHistory(
    projectId: string,
    range: '7d' | '30d' | '90d' = '30d'
  ): Promise<AIVisibilityMetricsHistory> {
    return this.client.getAIMetricsHistory(projectId, range, this.getOrgId() || undefined);
  }

  async listPrompts(projectId: string, category?: string): Promise<AIPrompt[]> {
    return this.client.listAIPrompts(projectId, category, this.getOrgId() || undefined);
  }

  async createPrompt(input: CreatePromptInput): Promise<AIPrompt> {
    return this.client.createAIPrompt(input, this.getOrgId() || undefined);
  }

  async deletePrompt(promptId: string): Promise<void> {
    return this.client.deleteAIPrompt(promptId, this.getOrgId() || undefined);
  }

  async runCheck(input: RunCheckInput): Promise<MultiEngineComparison> {
    return this.client.runAICheck(input, this.getOrgId() || undefined);
  }

  async listRuns(projectId: string): Promise<AIPromptRun[]> {
    return this.client.listAIRuns(projectId, this.getOrgId() || undefined);
  }

  async getRun(runId: string): Promise<MultiEngineComparison> {
    return this.client.getAIRunDetails(runId, this.getOrgId() || undefined);
  }

  async listRecommendations(projectId: string): Promise<AIRecommendation[]> {
    return this.client.listAIRecommendations(projectId, this.getOrgId() || undefined);
  }

  async updateRecommendation(
    recommendationId: string,
    input: UpdateRecommendationInput
  ): Promise<void> {
    return this.client.updateAIRecommendation(recommendationId, input, this.getOrgId() || undefined);
  }

  async auditDomain(input: AuditDomainInput): Promise<DomainAuditResult> {
    return this.client.auditDomain(input, this.getOrgId() || undefined);
  }

  async listCompetitors(projectId: string): Promise<AICompetitor[]> {
    return this.client.listCompetitors(projectId, this.getOrgId() || undefined);
  }

  async addCompetitor(input: AddCompetitorInput): Promise<AICompetitor> {
    return this.client.addCompetitor(input, this.getOrgId() || undefined);
  }

  async deleteCompetitor(competitorId: string): Promise<void> {
    return this.client.deleteCompetitor(competitorId, this.getOrgId() || undefined);
  }

  async getCompetitorGapIntelligence(projectId: string): Promise<CompetitorGapIntelligence> {
    return this.client.getCompetitorGapIntelligence(projectId, this.getOrgId() || undefined);
  }
}

export class InsightsNamespace {
  constructor(private readonly client: ApiClient) {}

  async getRealtime(
    projectId: string,
    window: '1h' | '24h' = '24h'
  ): Promise<RealtimePulseResponse> {
    return this.client.getInsightsRealtime(projectId, window);
  }

  async getMetrics(
    projectId: string,
    range: '24h' | '7d' | '30d' = '7d'
  ): Promise<InsightsMetricsResponse> {
    return this.client.getInsightsMetrics(projectId, range);
  }

  async getPrivacySettings(projectId: string): Promise<PrivacySettingsResponse> {
    return this.client.getPrivacySettings(projectId);
  }

  async updatePrivacySettings(
    projectId: string,
    input: {
      retention_days?: number;
      collection_mode?: 'essential' | 'standard' | 'advanced';
      privacy_mode?: 'stateless' | 'strict';
    }
  ): Promise<PrivacySettingsResponse> {
    return this.client.updatePrivacySettings(projectId, input);
  }

  async track(payload: CollectEventPayload): Promise<{ success: boolean; ok: boolean }> {
    return this.client.collectEvent(payload);
  }
}

export class StudioNamespace {
  constructor(
    private readonly client: ApiClient,
    private readonly getOrgId: () => string | null
  ) {}

  /**
   * Retrieves full headless page payload (compiled HTML, Markdown, Schema JSON-LD, AST blocks).
   */
  async getPage(slugOrId: string): Promise<HeadlessCmsPagePayload> {
    return this.client.getStudioHeadlessPage(slugOrId, this.getOrgId() || undefined);
  }

  /**
   * Imports content (Markdown with frontmatter, WordPress WXR XML, or AST JSON) into a PageDocument.
   */
  async importContent(input: {
    content: string;
    format?: 'markdown' | 'wxr' | 'ast' | 'json';
    tenantId?: string;
    projectId?: string;
    slug?: string;
  }): Promise<{ document: PageDocument; blockCount: number; format: string }> {
    return this.client.importStudioHeadlessContent(input, this.getOrgId() || undefined);
  }

  /**
   * Exports a PageDocument locally or via AST converter into any supported format.
   */
  exportPage(
    doc: PageDocument,
    format: StudioExportFormat = 'markdown',
    options?: { siteOrigin?: string; compiledHtml?: string }
  ): StudioExportResult {
    return exportPageDocument(doc, format, options);
  }

  /**
   * Fetches real-time cookieless Private Insights Telemetry™ metrics for a published Studio page.
   */
  async getAnalytics(slug: string, range = '7d'): Promise<StudioPageAnalytics> {
    return this.client.getStudioAnalytics(slug, range, this.getOrgId() || undefined);
  }

  /**
   * Uploads an asset (WebP, SVG, PNG, ICO, WOFF2) to self-hosted, content-addressable storage.
   */
  async uploadAsset(file: {
    name: string;
    type: string;
    base64: string;
    sizeBytes?: number;
  }): Promise<MediaAssetUploadResponse> {
    return this.client.uploadStudioMediaAsset(file, this.getOrgId() || undefined);
  }
}

export class WebhooksNamespace {
  constructor(
    private readonly client: ApiClient,
    private readonly getOrgId: () => string | null
  ) {}

  async list(): Promise<WebhookEndpoint[]> {
    return this.client.listWebhooks(this.getOrgId() || undefined);
  }

  async create(input: CreateWebhookEndpointInput): Promise<WebhookEndpoint> {
    const res = await this.client.createWebhook(input, this.getOrgId() || undefined);
    return res.endpoint;
  }

  async update(webhookId: string, input: UpdateWebhookEndpointInput): Promise<WebhookEndpoint> {
    const res = await this.client.updateWebhook(webhookId, input, this.getOrgId() || undefined);
    return res.endpoint;
  }

  async delete(webhookId: string): Promise<{ success: boolean; deleted_id: string }> {
    return this.client.deleteWebhook(webhookId, this.getOrgId() || undefined);
  }

  async test(
    webhookId: string
  ): Promise<{ success: boolean; status_code?: number; duration_ms?: number; error?: string }> {
    const res = await this.client.testWebhook(webhookId, this.getOrgId() || undefined);
    return res.result;
  }

  async listDeliveries(webhookId: string): Promise<WebhookDelivery[]> {
    return this.client.listWebhookDeliveries(webhookId, this.getOrgId() || undefined);
  }
}

export class KeysNamespace {
  constructor(
    private readonly client: ApiClient,
    private readonly getOrgId: () => string | null
  ) {}

  async list(): Promise<WorkspaceApiKey[]> {
    return this.client.listApiKeys(this.getOrgId() || undefined);
  }

  async create(input: CreateApiKeyInput): Promise<CreateApiKeyResult> {
    return this.client.createApiKey(input, this.getOrgId() || undefined);
  }

  async revoke(keyId: string): Promise<{ success: boolean; revoked_id: string }> {
    return this.client.revokeApiKey(keyId, this.getOrgId() || undefined);
  }
}

export class ProjectsNamespace {
  constructor(
    private readonly client: ApiClient,
    private readonly getOrgId: () => string | null
  ) {}

  async list(): Promise<Project[]> {
    return this.client.listProjects(this.getOrgId() || undefined);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    return this.client.createProject(input, this.getOrgId() || undefined);
  }

  async get(projectId: string): Promise<Project> {
    return this.client.getProject(projectId, this.getOrgId() || undefined);
  }

  async update(projectId: string, input: UpdateProjectInput): Promise<Project> {
    return this.client.updateProject(projectId, input, this.getOrgId() || undefined);
  }

  async delete(projectId: string): Promise<{ success: boolean; deleted_id: string }> {
    return this.client.deleteProject(projectId, this.getOrgId() || undefined);
  }
}

export class MCPNamespace {
  constructor(
    private readonly baseUrl: string,
    private readonly getApiKey: () => string | null,
    private readonly getOrgId: () => string | null
  ) {}

  getConfig(
    clientType: MCPClientTarget = 'cursor',
    options?: { binaryPath?: string; sseUrl?: string }
  ): MCPConfigResult {
    const key = this.getApiKey() || 'YOUR_WORKSPACE_API_KEY';
    const org = this.getOrgId() || 'YOUR_ORGANIZATION_ID';
    const command = options?.binaryPath ? options.binaryPath.split(' ')[0] : 'npx';
    const args = options?.binaryPath ? options.binaryPath.split(' ').slice(1) : ['-y', '@digiwebscape/mcp'];
    const sseUrl = options?.sseUrl || `${this.baseUrl}/v1/mcp/sse`;

    if (clientType === 'cursor') {
      return {
        clientType: 'cursor',
        config: {
          mcpServers: {
            'digiwebscape': {
              command,
              args,
              env: {
                DWS_API_KEY: key,
                DWS_ORG_ID: org,
                DWS_API_URL: this.baseUrl
              }
            }
          }
        },
        instructions: 'Add this snippet to your Cursor configuration at .cursor/mcp.json'
      };
    }

    if (clientType === 'claude') {
      return {
        clientType: 'claude',
        config: {
          mcpServers: {
            'digiwebscape': {
              command,
              args,
              env: {
                DWS_API_KEY: key,
                DWS_ORG_ID: org,
                DWS_API_URL: this.baseUrl
              }
            }
          }
        },
        instructions: 'Paste this snippet into ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\Claude\\claude_desktop_config.json (Windows)'
      };
    }

    if (clientType === 'cline') {
      return {
        clientType: 'cline',
        config: {
          mcpServers: {
            'digiwebscape': {
              command,
              args,
              env: {
                DWS_API_KEY: key,
                DWS_ORG_ID: org,
                DWS_API_URL: this.baseUrl
              }
            }
          }
        },
        instructions: 'Configure this in VS Code under Cline MCP settings.'
      };
    }

    // Generic / SSE swarm
    return {
      clientType: 'generic',
      config: {
        server_url: sseUrl,
        transport: 'sse',
        headers: {
          Authorization: `Bearer ${key}`,
          'x-organization-id': org
        }
      },
      instructions: 'Use this endpoint and authorization headers for remote agent swarms and SSE transport.'
    };
  }
}

/**
 * Isomorphic, constant-time verification of webhook signatures conforming to the
 * Standard Webhooks specification using the Web Crypto API.
 */
export async function verifyWebhookSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
  toleranceSeconds: number = 300
): Promise<boolean> {
  if (!signatureHeader || !secret) {
    return false;
  }

  const parts = signatureHeader.split(',');
  let timestamp = 0;
  let receivedSignature = '';

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith('t=')) {
      timestamp = parseInt(trimmed.slice(2), 10);
    } else if (trimmed.startsWith('v1=')) {
      receivedSignature = trimmed.slice(3);
    }
  }

  if (!timestamp || !receivedSignature || isNaN(timestamp)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const cleanSecret = secret.startsWith('whsec_') ? secret.slice(6) : secret;
    const keyData = encoder.encode(cleanSecret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signedPayload = `${timestamp}.${payload}`;
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      encoder.encode(signedPayload)
    );

    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    if (expectedSignature.length !== receivedSignature.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      result |= expectedSignature.charCodeAt(i) ^ receivedSignature.charCodeAt(i);
    }

    return result === 0;
  } catch {
    return false;
  }
}

export { ApiError };
export type {
  AIPrompt,
  AIPromptRun,
  AIVisibilityMetrics,
  AIVisibilityMetricsHistory,
  AIRecommendation,
  MultiEngineComparison,
  DomainAuditResult,
  CreatePromptInput,
  RunCheckInput,
  UpdateRecommendationInput,
  AuditDomainInput,
  AICompetitor,
  CompetitorGapIntelligence,
  AddCompetitorInput,
  RealtimePulseResponse,
  InsightsMetricsResponse,
  PrivacySettingsResponse,
  CollectEventPayload,
  WebhookEndpoint,
  CreateWebhookEndpointInput,
  UpdateWebhookEndpointInput,
  WebhookDelivery,
  WebhookEventType,
  WebhookPayloadFormat,
  WebhookEventEnvelope,
  WorkspaceApiKey,
  CreateApiKeyInput,
  CreateApiKeyResult,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  Organization,
  HeadlessCmsPagePayload,
  PageDocument,
  StudioExportFormat,
  StudioExportResult,
  StudioPageAnalytics,
  MediaAssetUploadResponse
};
