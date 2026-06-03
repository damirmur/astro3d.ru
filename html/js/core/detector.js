/**
 * Platform & Device Detector Module
 * Определяет параметры платформы и устройства
 */

class Detector {
  constructor() {
    this.userAgent = navigator.userAgent;
    this.platform = navigator.platform;
    this.detectPlatform();
  }

  /**
   * Определяет платформу
   */
  detectPlatform() {
    this.isAndroid = /Android|Linux/i.test(this.userAgent);
    this.isIOS = /iPhone|iPad|iPod/i.test(this.userAgent);
    this.isMobile = this.isAndroid || this.isIOS;
    this.isTablet = /iPad|Android(?!.*Mobile)/i.test(this.userAgent);
    this.isDesktop = !this.isMobile;
    this.isWindows = /Win/.test(this.platform);
    this.isMac = /Mac/.test(this.platform);
    this.isLinux = /Linux/.test(this.platform);
  }

  /**
   * Проверяет поддержку WebGL
   * @returns {boolean}
   */
  supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      ));
    } catch (e) {
      return false;
    }
  }

  /**
   * Проверяет поддержку ES Modules
   * @returns {boolean}
   */
  supportsESModules() {
    const script = document.createElement('script');
    return 'noModule' in script;
  }

  /**
   * Проверяет поддержку Web Components
   * @returns {boolean}
   */
  supportsWebComponents() {
    return 'customElements' in window;
  }

  /**
   * Получает информацию об устройстве
   * @returns {Object}
   */
  getDeviceInfo() {
    return {
      userAgent: this.userAgent,
      platform: this.platform,
      isAndroid: this.isAndroid,
      isIOS: this.isIOS,
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop,
      isWindows: this.isWindows,
      isMac: this.isMac,
      isLinux: this.isLinux,
      supportsWebGL: this.supportsWebGL(),
      supportsESModules: this.supportsESModules(),
      supportsWebComponents: this.supportsWebComponents()
    };
  }
}

export const detector = new Detector();
