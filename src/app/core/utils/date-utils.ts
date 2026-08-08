/**
 * Utility functions for Cancun Timezone (GMT-5 / America/Cancun)
 * GMT-5 is standard time UTC-5 year-round (no daylight saving time in Quintana Roo).
 */

/**
 * Returns a Date object representing current time in GMT-5 (Cancún),
 * derived directly from UTC time regardless of device timezone settings.
 */
export function getCancunDate(date: Date = new Date()): Date {
    const utcMs = date.getTime();
    // Offset for GMT-5 (UTC-5): -5 hours = -18,000,000 ms
    const gmt5OffsetMs = -5 * 60 * 60 * 1000;
    return new Date(utcMs + gmt5OffsetMs);
}

/**
 * Returns current Cancun date and time values formatted:
 * - fecha: 'YYYY-MM-DD'
 * - hora: 'HH:mm'
 * - horaConSegundos: 'HH:mm:ss'
 * - fechaLarga: 'sábado, 8 de agosto de 2026'
 */
export function getCancunNow() {
    const cancunDate = getCancunDate();
    const iso = cancunDate.toISOString(); // 'YYYY-MM-DDTHH:mm:ss.sssZ'
    const fecha = iso.split('T')[0];
    const timeParts = iso.split('T')[1].split('.')[0]; // 'HH:mm:ss'
    const hora = timeParts.substring(0, 5); // 'HH:mm'
    const horaConSegundos = timeParts;

    let fechaLarga = '';
    try {
        fechaLarga = new Intl.DateTimeFormat('es-MX', {
            timeZone: 'America/Cancun',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    } catch {
        fechaLarga = fecha;
    }

    return {
        fecha,
        hora,
        horaConSegundos,
        fechaLarga,
        cancunDate
    };
}
