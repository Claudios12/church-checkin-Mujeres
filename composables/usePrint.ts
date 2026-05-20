export interface AttendeeData {
  firstName: string
  middleName: string
  lastName: string
}

export const usePrint = () => {
  const printStickers = (attendee: AttendeeData) => {
    const nameLine = [attendee.firstName, attendee.middleName, attendee.lastName]
      .filter(Boolean)
      .join(' ')
      .toUpperCase()

    const stickerHTML = `
      <div class="sticker">
        <div class="sticker-header">
          <span class="event-title">MUJERES M&amp;M</span>
          <span class="event-subtitle">Diseñadas para ascender</span>
        </div>
        <div class="name-box">
          <span class="attendee-name">${nameLine}</span>
        </div>
        <div class="sticker-footer">Cima Iglesia · Mayo 22, 2026</div>
      </div>
    `

    const stickerCSS = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; background: white; }
      .sticker {
        width: 101.6mm;
        height: 50.8mm;
        background: #ec4899 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        border: 1.5pt solid #be185d;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5mm;
        padding: 3mm 4mm;
        page-break-after: always;
        page-break-inside: avoid;
      }
      .sticker:last-child { page-break-after: avoid; }
      .sticker-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5mm;
      }
      .event-title {
        font-size: 8pt;
        font-weight: bold;
        color: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .event-subtitle {
        font-size: 5.5pt;
        color: rgba(255,255,255,0.85) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        letter-spacing: 0.5px;
      }
      .name-box {
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        border-radius: 3mm;
        padding: 2mm 6mm;
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }
      .attendee-name {
        font-size: 22pt;
        font-weight: bold;
        color: #1f2937 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1.1;
        word-break: break-word;
      }
      .sticker-footer {
        font-size: 5.5pt;
        color: rgba(255,255,255,0.85) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        letter-spacing: 0.5px;
      }
    `

    const printContainer = document.createElement('div')
    printContainer.id = 'sticker-print-container'
    printContainer.innerHTML = stickerHTML

    const printStyle = document.createElement('style')
    printStyle.id = 'sticker-print-styles'
    printStyle.textContent = `
      @page { size: 101.6mm 152.4mm; margin: 0; }
      #sticker-print-container { display: none; }
      @media print {
        body > *:not(#sticker-print-container) { display: none !important; }
        #sticker-print-container { display: block !important; }
        ${stickerCSS}
      }
    `

    document.head.appendChild(printStyle)
    document.body.appendChild(printContainer)

    const cleanup = () => {
      document.head.removeChild(printStyle)
      document.body.removeChild(printContainer)
    }

    window.addEventListener('afterprint', cleanup, { once: true })
    setTimeout(() => window.print(), 100)
  }

  return { printStickers }
}
