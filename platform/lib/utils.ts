export function now() {
    const d = new Date();
    const Y = String(d.getFullYear());
    const M = String(d.getMonth()).padStart(2, '0');
    const D = String(d.getDay()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
  
    return `${Y}-${M}-${D}T${h}:${m}:${s}`;
  }
  