// composables/useAdminLogger.ts
import { reactive, computed } from 'vue'

export type AdminLogLevel = 'info' | 'warn' | 'error' | 'network' | 'auth'

export interface LogEntry {
  id: string
  timestamp: string
  level: AdminLogLevel
  tag: string
  message: string
  details?: any
}

interface LoggerState {
  logs: LogEntry[]
  maxLogs: number
}

const state = reactive<LoggerState>({
  logs: [],
  maxLogs: 200,
})

function addLog(level: AdminLogLevel, tag: string, message: string, details?: any) {
  const entry: LogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0'),
    level,
    tag,
    message,
    details: details ? JSON.parse(JSON.stringify(details)) : undefined,
  }

  state.logs.unshift(entry)
  if (state.logs.length > state.maxLogs) {
    state.logs.pop()
  }

  if (process.dev) {
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    consoleMethod(`[AdminLogger:${level.toUpperCase()}][${tag}] ${message}`, details ?? '')
  }
}

export function useAdminLogger() {
  const logs = computed(() => state.logs)
  const errorCount = computed(() => state.logs.filter((l) => l.level === 'error').length)
  const warnCount = computed(() => state.logs.filter((l) => l.level === 'warn').length)

  function logInfo(tag: string, message: string, details?: any) {
    addLog('info', tag, message, details)
  }

  function logWarn(tag: string, message: string, details?: any) {
    addLog('warn', tag, message, details)
  }

  function logError(tag: string, message: string, details?: any) {
    addLog('error', tag, message, details)
  }

  function logNetwork(tag: string, message: string, details?: any) {
    addLog('network', tag, message, details)
  }

  function logAuth(tag: string, message: string, details?: any) {
    addLog('auth', tag, message, details)
  }

  function clearLogs() {
    state.logs = []
  }

  return {
    logs,
    errorCount,
    warnCount,
    logInfo,
    logWarn,
    logError,
    logNetwork,
    logAuth,
    clearLogs,
  }
}
