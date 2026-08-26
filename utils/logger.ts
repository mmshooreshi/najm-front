// utils/logger.ts
/**
 * Najm Unified Hierarchical & Colorized Logger
 * Supports both Browser (CSS Badges & Collapsible Groups) and Server/Terminal (ANSI).
 */

export type LogLevel = "debug" | "info" | "success" | "warn" | "error";

export type LogCategory =
  | "Admin:Auth"
  | "Admin:Edit"
  | "Admin:Sync"
  | "Admin:Inspector"
  | "Content:Hydrate"
  | "Content:Locale"
  | "Catalog:Products"
  | "Blog:Posts"
  | "System:Router"
  | "System:General";

const CATEGORY_COLORS: Record<LogCategory, { bg: string; text: string; ansi: string; icon: string }> = {
  "Admin:Auth": { bg: "#059669", text: "#ffffff", ansi: "\x1b[42m\x1b[37m", icon: "🛡️" },
  "Admin:Edit": { bg: "#6366f1", text: "#ffffff", ansi: "\x1b[45m\x1b[37m", icon: "✏️" },
  "Admin:Sync": { bg: "#0284c7", text: "#ffffff", ansi: "\x1b[44m\x1b[37m", icon: "💾" },
  "Admin:Inspector": { bg: "#8b5cf6", text: "#ffffff", ansi: "\x1b[45m\x1b[37m", icon: "🔍" },
  "Content:Hydrate": { bg: "#d97706", text: "#ffffff", ansi: "\x1b[43m\x1b[30m", icon: "📦" },
  "Content:Locale": { bg: "#7c3aed", text: "#ffffff", ansi: "\x1b[45m\x1b[37m", icon: "🌐" },
  "Catalog:Products": { bg: "#10b981", text: "#ffffff", ansi: "\x1b[42m\x1b[30m", icon: "🏷️" },
  "Blog:Posts": { bg: "#0d9488", text: "#ffffff", ansi: "\x1b[46m\x1b[30m", icon: "📰" },
  "System:Router": { bg: "#475569", text: "#ffffff", ansi: "\x1b[47m\x1b[30m", icon: "🧭" },
  "System:General": { bg: "#334155", text: "#ffffff", ansi: "\x1b[40m\x1b[37m", icon: "⚡" }
};

const isBrowser = typeof window !== "undefined";

class NajmLogger {
  private enabled: boolean = true;
  private minLevel: LogLevel = "debug";

  constructor() {
    if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
      this.minLevel = "info";
    }
  }

  private formatBadge(cat: LogCategory, level: LogLevel): { prefix: string; styles: string[] } {
    const config = CATEGORY_COLORS[cat] || CATEGORY_COLORS["System:General"];
    const levelMarker = level === "success" ? "✓" : level === "warn" ? "▲" : level === "error" ? "✖" : "●";

    if (isBrowser) {
      const badgeStyle = `background: ${config.bg}; color: ${config.text}; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-size: 11px;`;
      const tagStyle = "background: #1e293b; color: #94a3b8; padding: 2px 5px; border-radius: 3px; font-size: 10px; margin-right: 4px;";
      const timeStyle = "color: #64748b; font-size: 10px; font-family: monospace;";
      const now = new Date().toLocaleTimeString("en-US", { hour12: false });

      return {
        prefix: `%c${config.icon} ${cat}%c ${levelMarker} ${level.toUpperCase()}%c ${now}`,
        styles: [badgeStyle, tagStyle, timeStyle]
      };
    } else {
      const now = new Date().toLocaleTimeString("en-US", { hour12: false });
      return {
        prefix: `${config.ansi} ${config.icon} ${cat} \x1b[0m [\x1b[36m${now}\x1b[0m] [${level.toUpperCase()}]`,
        styles: []
      };
    }
  }

  public debug(cat: LogCategory, message: string, ...details: any[]) {
    if (!this.enabled) return;
    const { prefix, styles } = this.formatBadge(cat, "debug");
    if (isBrowser) {
      console.debug(prefix, ...styles, message, ...(details.length > 0 ? details : []));
    } else {
      console.log(prefix, message, ...(details.length > 0 ? details : []));
    }
  }

  public info(cat: LogCategory, message: string, ...details: any[]) {
    if (!this.enabled) return;
    const { prefix, styles } = this.formatBadge(cat, "info");
    if (isBrowser) {
      console.info(prefix, ...styles, message, ...(details.length > 0 ? details : []));
    } else {
      console.log(prefix, message, ...(details.length > 0 ? details : []));
    }
  }

  public success(cat: LogCategory, message: string, ...details: any[]) {
    if (!this.enabled) return;
    const { prefix, styles } = this.formatBadge(cat, "success");
    if (isBrowser) {
      console.log(prefix, ...styles, `%c${message}`, "color: #10b981; font-weight: 600;", ...(details.length > 0 ? details : []));
    } else {
      console.log(prefix, "\x1b[32m" + message + "\x1b[0m", ...(details.length > 0 ? details : []));
    }
  }

  public warn(cat: LogCategory, message: string, ...details: any[]) {
    const { prefix, styles } = this.formatBadge(cat, "warn");
    if (isBrowser) {
      console.warn(prefix, ...styles, message, ...(details.length > 0 ? details : []));
    } else {
      console.warn(prefix, "\x1b[33m" + message + "\x1b[0m", ...(details.length > 0 ? details : []));
    }
  }

  public error(cat: LogCategory, message: string, ...details: any[]) {
    const { prefix, styles } = this.formatBadge(cat, "error");
    if (isBrowser) {
      console.error(prefix, ...styles, message, ...(details.length > 0 ? details : []));
    } else {
      console.error(prefix, "\x1b[31m" + message + "\x1b[0m", ...(details.length > 0 ? details : []));
    }
  }

  public group(cat: LogCategory, title: string, fn: () => void, collapsed: boolean = true) {
    if (!this.enabled) return;
    const { prefix, styles } = this.formatBadge(cat, "info");
    if (isBrowser) {
      if (collapsed) {
        console.groupCollapsed(prefix, ...styles, title);
      } else {
        console.group(prefix, ...styles, title);
      }
      try {
        fn();
      } finally {
        console.groupEnd();
      }
    } else {
      console.log(prefix, "--- " + title + " ---");
      fn();
      console.log("------------------------------------------");
    }
  }
}

export const logger = new NajmLogger();
