// types/telemetry.ts

export type TelemetryEventMap = {
  page_view: {
    title: string
    category: string
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
    utm_term?: string | null
    utm_content?: string | null
    search_query?: string | null
  }
  dieline_download: {
    box_type: string
    dimensions: string
    file_format: string
  }
  spec_configured: {
    packaging_type: string
    dimensions_cm: { l: number; w: number; h: number }
    paper_stock: string
    gsm: number
    finishing: string[]
  }
  volume_inquired: {
    packaging_type: string
    quantity: number
    is_custom_mold: boolean
  }
  sales_handoff: {
    channel: 'whatsapp' | 'call' | 'bale' | 'form'
    spec_summary?: string
  }
  hesitation_trigger: {
    component_id: string
    dwell_ms: number
    toggle_count: number
  }
  tap_heat: {
    target_id: string
    rx: number // normalized 0.00 to 1.00 relative x coordinate
    ry: number // normalized 0.00 to 1.00 relative y coordinate
    page_x?: number // document absolute X position for page-wide heatmap
    page_y?: number // document absolute Y position for page-wide heatmap
  }
  scroll_dwell: {
    path: string
    buckets: number[] // 20 vertical 5% viewport bins
    stopped_at_pct?: number // percentage depth where visitor paused/read
    dwell_sec?: number // duration of pause in seconds
    section?: string // nearest section or heading in view
    debounce_count?: number
  }
  mobile_issue: {
    type: 'keyboard_occlusion' | 'pinch_zoom' | 'horizontal_overflow'
    details: Record<string, any>
  }
  ui_error: {
    error_message: string
    stack?: string
  }
  field_perf: {
    metric: 'LCP' | 'CLS'
    value: number
  }
}

export type TelemetryEventName = keyof TelemetryEventMap

export interface ClientTelemetryPayload<K extends TelemetryEventName = TelemetryEventName> {
  event_name: K
  session_id: string
  timestamp: string // ISO 8601 string
  url: string
  referrer?: string | null
  fingerprint?: string | null
  is_excluded?: boolean
  properties: TelemetryEventMap[K]
}

export interface StoredAnalyticsEvent {
  id: string
  event_name: string
  session_id: string
  timestamp: string
  url: string
  referrer: string | null
  ip_hash: string
  user_agent: string | null
  fingerprint?: string | null
  is_excluded?: boolean
  properties: Record<string, any>
}

export interface ElementMetricSummary {
  target_id: string
  tap_count: number
  avg_dwell_ms: number
  hesitations: number
  errors: number
  last_interaction: string
}

export interface TelemetryLensResponse {
  recent_logs: StoredAnalyticsEvent[]
  element_metrics: Record<string, ElementMetricSummary>
  scroll_density: number[] // 20-bucket averaged intensity
}

/** Summary of a single visitor session shown in the Users tab */
export interface SessionSummary {
  session_id: string
  first_seen: string   // ISO timestamp of first event
  last_seen: string    // ISO timestamp of most recent event
  duration_sec: number // last_seen - first_seen in seconds
  page_count: number   // distinct URLs visited
  event_count: number  // total events
  tap_count: number
  referrer: string | null
  device_type: 'mobile' | 'desktop' | 'tablet' | 'unknown'
  user_agent: string | null
  fingerprint: string | null
  is_excluded?: boolean
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  search_query: string | null
  source_type: 'google_organic' | 'google_ads' | 'direct' | 'referral' | 'social' | 'utm' | 'other'
  pages: string[]      // list of distinct URLs visited (ordered)
}

/** Full event list for a single session, returned by /api/analytics/session/[id] */
export interface SessionDetail {
  session_id: string
  summary: SessionSummary
  events: StoredAnalyticsEvent[]
}

export interface TrafficStatsOverview {
  total_sessions: number
  total_pageviews: number
  total_events: number
  avg_duration_sec: number
  bounce_rate_pct: number
  utm_sources: Array<{ name: string; count: number; percentage: number }>
  google_queries: Array<{ query: string; count: number; landing_page: string }>
  source_breakdown: Array<{ type: string; label: string; count: number; percentage: number }>
  page_flows: Array<{ from: string; to: string; count: number }>
  top_landing_pages: Array<{ path: string; count: number }>
  debounce_stats: {
    total_debounced_scrolls: number
    avg_dwell_before_stop: number
    hesitations: number
  }
  excluded_fingerprints: string[]
}

