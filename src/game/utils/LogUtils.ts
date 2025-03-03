/**
 * Utility class for logging in a consistent way across the application
 */
export class Logger {
  private static debugActive: boolean = false;
  private static systems: Record<string, boolean> = {};

  /**
   * Enable or disable debug logging globally
   */
  public static setDebug(enabled: boolean): void {
    Logger.debugActive = enabled;
  }

  /**
   * Enable or disable debug logging for a specific system
   */
  public static setSystemDebug(systemName: string, enabled: boolean): void {
    Logger.systems[systemName] = enabled;
  }

  /**
   * Log a message if debugging is enabled for the system
   */
  public static log(systemName: string, message: string): void {
    if (Logger.debugActive && (Logger.systems[systemName] || Logger.systems[systemName] === undefined)) {
      console.log(`${systemName}: ${message}`);
    }
  }

  /**
   * Log an error message (always shown, regardless of debug settings)
   */
  public static error(systemName: string, message: string): void {
    console.error(`${systemName}: ${message}`);
  }

  /**
   * Log a warning message (always shown, regardless of debug settings)
   */
  public static warn(systemName: string, message: string): void {
    console.warn(`${systemName}: ${message}`);
  }
} 