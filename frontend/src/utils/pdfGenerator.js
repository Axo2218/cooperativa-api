import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configuración de estilo y colores institucionales
const colors = {
  primary: [16, 185, 129], // Emerald 500
  dark: [9, 9, 11], // Zinc 950
  gray: [113, 113, 122], // Zinc 500
  lightGray: [244, 244, 245], // Zinc 100
  blue: [59, 130, 246] // Blue 500
};

const drawHeader = (doc, title, subtitle) => {
  // Banner superior
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, doc.internal.pageSize.width, 35, 'F');
  
  // Título Institucional
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('COOPESCA', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema Operativo de Cooperativas Pesqueras', 65, 22);

  // Título del documento
  doc.setTextColor(...colors.dark);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 50);
  
  if (subtitle) {
    doc.setTextColor(...colors.gray);
    doc.setFontSize(10);
    doc.text(subtitle, 14, 56);
  }
};

const drawFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...colors.dark);
    doc.rect(0, doc.internal.pageSize.height - 15, doc.internal.pageSize.width, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Documento generado por CooPesca - Registro Oficial',
      14,
      doc.internal.pageSize.height - 6
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 6
    );
  }
};

export const generateVentaPDF = (venta, detalles = []) => {
  const doc = new jsPDF();
  try {
    const fecha = new Date(venta.ven_fecha).toLocaleString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    drawHeader(doc, 'Recibo de Venta General', `Folio: #${venta.ven_id} | Fecha: ${fecha}`);

    // Detalles Principales
    doc.setFontSize(10);
    doc.setTextColor(...colors.dark);
    doc.setFont('helvetica', 'bold');
    doc.text('Información de la Operación:', 14, 68);

    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${venta.cli_nombre || 'Desconocido'}`, 14, 76);
    doc.text(`Cooperativa Origen: ${venta.coop_nombre || 'No asignada'}`, 14, 82);
    doc.text(`Método de Pago: ${venta.ven_tipo_pago}`, 14, 88);

    // Tabla de Detalles
    let finalY = 95;
    if (detalles && detalles.length > 0) {
      const tableData = detalles.map(d => [
        d.esp_nombre_comun || 'Desconocida',
        `${d.ven_det_kg} KG`,
        `$${parseFloat(d.ven_det_precio_kg_venta).toLocaleString('es-MX')}/KG`,
        `$${parseFloat(d.ven_det_subtotal).toLocaleString('es-MX')}`
      ]);

      if (typeof autoTable === 'function') {
        autoTable(doc, {
          startY: finalY,
          head: [['Especie', 'Cantidad', 'Precio Unitario', 'Subtotal']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: colors.dark, textColor: 255 },
          styles: { fontSize: 9 },
        });
        finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : finalY + 30;
      } else {
        doc.text("Error: autoTable plugin no cargado", 14, finalY);
        finalY += 15;
      }
    }

    // Totales
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...colors.primary);
    doc.text(`Total Recibido: $${parseFloat(venta.ven_total).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, 14, finalY);

    // Cuadro legal
    doc.setDrawColor(...colors.gray);
    doc.setLineWidth(0.2);
    doc.rect(14, finalY + 10, doc.internal.pageSize.width - 28, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.gray);
    const legalText = `Este documento es un comprobante de operación interna de la cooperativa. \nLa mercancía ha sido entregada a satisfacción del cliente.\nFirma de conformidad: ___________________________`;
    doc.text(legalText, 18, finalY + 17);

    drawFooter(doc);
    doc.save(`Recibo_Venta_${venta.ven_id}.pdf`);
  } catch (error) {
    doc.text(`ERROR AL GENERAR RECIBO: ${error.message}`, 14, 20);
    doc.save(`Error_Recibo_${venta.ven_id || 0}.pdf`);
  }
};

export const generateLiquidacionPDF = (viaje, capturas, tripulacion) => {
  const doc = new jsPDF();
  
  try {
    const fechaLlegada = viaje.via_fecha_llegada ? new Date(viaje.via_fecha_llegada).toLocaleDateString('es-MX') : new Date().toLocaleDateString('es-MX');
    const fechaSalida = viaje.via_fecha_salida ? new Date(viaje.via_fecha_salida).toLocaleDateString('es-MX') : 'N/A';
    
    drawHeader(doc, 'Liquidación Oficial de Viaje', `Bitácora: #${viaje.via_id || 'N/A'} | Embarcación: ${viaje.barco || 'N/A'}`);

    // 1. Resumen Operativo
    doc.setFontSize(11);
    doc.setTextColor(...colors.dark);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Resumen de Producción', 14, 68);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de Zarpe: ${fechaSalida}`, 14, 76);
    doc.text(`Fecha de Arribo: ${fechaLlegada}`, 100, 76);
    doc.text(`Zona de Captura: ${viaje.zona_nombre || 'N/A'}`, 14, 82);
    doc.text(`Total Capturado: ${viaje.via_total_kg || 0} KG`, 100, 82);

    // Tabla de Capturas
    const capturaData = (capturas || []).map(c => [
      c.esp_nombre_comun || 'Desconocida',
      `${c.det_cap_kilogramos || 0} KG`,
      `$${c.det_cap_precio_pactado || 0}/KG`,
      `$${Number(c.det_cap_subtotal || 0).toLocaleString('es-MX')}`
    ]);

    if (typeof autoTable === 'function') {
      if (capturaData.length > 0) {
        autoTable(doc, {
          startY: 90,
          head: [['Especie', 'Kilogramos', 'Precio Ref.', 'Subtotal']],
          body: capturaData,
          theme: 'grid',
          headStyles: { fillColor: colors.dark, textColor: 255 },
          styles: { fontSize: 8 },
        });
      } else {
        doc.text('No hay capturas registradas para este viaje.', 14, 90);
        autoTable(doc, { startY: 90, head: [], body: [] }); // Solo para actualizar finalY
      }
    }

    // 2. Liquidación Financiera
    let finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : 105;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('2. Resumen Financiero', 14, finalY);

    finalY += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ingresos Brutos Totales: $${parseFloat(viaje.via_total_ingresos || 0).toLocaleString('es-MX')}`, 14, finalY);
    finalY += 6;
    doc.text(`Presupuesto/Gastos Operativos: -$${parseFloat(viaje.via_presupuesto_estimado || 0).toLocaleString('es-MX')}`, 14, finalY);
    finalY += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Ganancia Neta (A Repartir): $${parseFloat(viaje.via_ganancia_neta || 0).toLocaleString('es-MX')}`, 14, finalY);
    
    finalY += 15;
    doc.setFontSize(11);
    doc.text('3. Desglose de Reparto', 14, finalY);

    const repartoData = [
      ['Fondo Cooperativa', `$${parseFloat(viaje.via_reparto_cooperativa || 0).toLocaleString('es-MX')}`],
      ['Participación Capitán', `$${parseFloat(viaje.via_reparto_capitan || 0).toLocaleString('es-MX')}`],
      ['Participación Tripulación', `$${parseFloat(viaje.via_reparto_tripulacion || 0).toLocaleString('es-MX')}`]
    ];

    if (typeof autoTable === 'function') {
      autoTable(doc, {
        startY: finalY + 5,
        body: repartoData,
        theme: 'plain',
        styles: { fontSize: 9, fontStyle: 'bold' },
        columnStyles: { 1: { halign: 'right', textColor: colors.primary } }
      });
      finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : finalY + 30;
    } else {
      finalY += 30;
    }

    // 4. Tripulación y Salarios
    // Si no hay suficiente espacio en la hoja, agregar una nueva
    if (finalY > doc.internal.pageSize.height - 40) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('4. Detalle de Tripulación (Pagos Finales)', 14, finalY);

    // Calcular días del viaje
    const start = new Date(viaje.via_fecha_salida || new Date());
    const end = viaje.via_fecha_llegada ? new Date(viaje.via_fecha_llegada) : new Date();
    const diffTime = Math.abs(end - start);
    const diasViaje = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Calcular la parte proporcional de la tripulación
    let totalPuntos = 0;
    const tripulacionConPuntos = (tripulacion || []).filter(t => t.id !== 'cap').map(t => {
      let puntos = parseFloat(t.rol_puntos_reparto);
      if (isNaN(puntos) || puntos === 0) puntos = 1;
      
      totalPuntos += puntos;
      return { ...t, puntos };
    });

    const tripulacionData = tripulacionConPuntos.map(t => {
      const participacion = totalPuntos > 0 ? (parseFloat(viaje.via_reparto_tripulacion || 0) * (t.puntos / totalPuntos)) : 0;
      const salarioMensual = parseFloat(t.salario_base || 0);
      const pagoProporcional = (salarioMensual / 30) * diasViaje;
      
      return [
        t.nombre || 'Desconocido',
        t.rol || 'N/A',
        `$${salarioMensual.toLocaleString('es-MX')}`,
        `$${pagoProporcional.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        `$${participacion.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        `$${(pagoProporcional + participacion).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
      ];
    });
    
    // Agregar al Capitán
    const capSalarioMensual = parseFloat(viaje.capitan_salario_base || 0);
    const capPagoProporcional = (capSalarioMensual / 30) * diasViaje;
    const capParticipacion = parseFloat(viaje.via_reparto_capitan || 0);

    tripulacionData.unshift([
      viaje.capitan || 'No asignado',
      'Capitán',
      `$${capSalarioMensual.toLocaleString('es-MX')}`,
      `$${capPagoProporcional.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      `$${capParticipacion.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      `$${(capPagoProporcional + capParticipacion).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
    ]);

    if (typeof autoTable === 'function') {
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Nombre', 'Rol', 'Salario Base', 'Pago Prop.', 'Bono (Reparto)', 'Total a Pagar']],
        body: tripulacionData,
        theme: 'grid',
        headStyles: { fillColor: colors.blue, textColor: 255 },
        styles: { fontSize: 7 },
        columnStyles: { 
          2: { halign: 'right' }, 
          3: { halign: 'right' }, 
          4: { halign: 'right' }, 
          5: { halign: 'right', fontStyle: 'bold', textColor: colors.primary } 
        }
      });
    }

    drawFooter(doc);
    doc.save(`Liquidacion_Viaje_${viaje.via_id || '0'}.pdf`);
  } catch (error) {
    console.error("Error saving PDF:", error);
    doc.text(`ERROR AL GENERAR REPORTE: ${error.message}`, 14, 20);
    doc.save(`Error_Liquidacion_${viaje.via_id || 0}.pdf`);
  }
};
