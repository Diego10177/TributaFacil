import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_DATE,
  DEMO_DNI,
  DEMO_MUNICIPALITY,
  money,
  initialDebts,
  debtTotal,
  outstanding,
  visibleDebts,
  confirmPayment,
  receiptHtml
} from '../src/app/demo.mjs';

describe('Auditoría de Historias de Usuario (HU-01 a HU-04)', () => {
  describe('HU-01 · H1: Ver deudas por fecha para priorizar y evitar moras', () => {
    it('muestra las deudas impagas ordenadas cronológicamente por vencimiento y las pagadas al final', () => {
      const debts = initialDebts();
      const visible = visibleDebts(debts, 'Todos');

      assert.equal(visible.length, 4);

      // Verificación de orden:
      // 1. Predial (Vence 2026-10-15 - Vencido)
      assert.equal(visible[0].id, 'predial');
      assert.equal(visible[0].due, '2026-10-15');
      assert.equal(visible[0].status, 'Vencido');

      // 2. Arbitrios Noviembre (Vence 2026-11-15 - Pendiente)
      assert.equal(visible[1].id, 'arbitrios-1');
      assert.equal(visible[1].due, '2026-11-15');
      assert.equal(visible[1].status, 'Pendiente');

      // 3. Arbitrios Diciembre (Vence 2026-12-15 - Pendiente)
      assert.equal(visible[2].id, 'arbitrios-2');
      assert.equal(visible[2].due, '2026-12-15');
      assert.equal(visible[2].status, 'Pendiente');

      // 4. Licencia (Vence 2026-09-30 - Pagado): debe ubicarse al final a pesar de tener fecha anterior
      assert.equal(visible[3].id, 'licencia');
      assert.equal(visible[3].status, 'Pagado');
    });

    it('recalcula el orden y ubica al final las deudas cuando pasan a estado Pagado', () => {
      const debts = initialDebts();
      // Simula pago del predial
      const { debts: updatedDebts } = confirmPayment(debts, ['predial'], 'Tarjeta', 1);

      const visible = visibleDebts(updatedDebts, 'Todos');
      // Ahora las dos primeras deben ser los arbitrios impagos
      assert.equal(visible[0].id, 'arbitrios-1');
      assert.equal(visible[1].id, 'arbitrios-2');
      // Y las dos últimas deben ser las pagadas (licencia y predial)
      assert.equal(visible[2].status, 'Pagado');
      assert.equal(visible[3].status, 'Pagado');
      const paidIds = [visible[2].id, visible[3].id];
      assert.ok(paidIds.includes('licencia') && paidIds.includes('predial'));
    });

    it('presenta métricas de resumen claras: total pendiente, monto vencido y ya pagado', () => {
      const debts = initialDebts();
      const pending = outstanding(debts);
      const totalPendiente = debtTotal(pending);
      const montoVencido = debtTotal(pending.filter(d => d.status === 'Vencido'));
      const yaPagado = debtTotal(debts.filter(d => d.status === 'Pagado'));

      assert.equal(totalPendiente, 847.5);
      assert.equal(montoVencido, 420.0);
      assert.equal(yaPagado, 350.0);

      assert.equal(money(totalPendiente), 'S/ 847.50');
      assert.equal(money(montoVencido), 'S/ 420.00');
      assert.equal(money(yaPagado), 'S/ 350.00');
    });
  });

  describe('HU-02 · H2: Distinguir y filtrar vencidos para no revisar todo', () => {
    it('el filtro "Vencidos" aísla únicamente las obligaciones vencidas', () => {
      const debts = initialDebts();
      const vencidos = visibleDebts(debts, 'Vencido');

      assert.equal(vencidos.length, 1);
      assert.equal(vencidos[0].id, 'predial');
      assert.equal(vencidos[0].amount, 420);
      assert.equal(vencidos[0].status, 'Vencido');
    });

    it('el filtro "Pendientes" muestra solo las obligaciones pendientes no vencidas', () => {
      const debts = initialDebts();
      const pendientes = visibleDebts(debts, 'Pendiente');

      assert.equal(pendientes.length, 2);
      assert.ok(pendientes.every(d => d.status === 'Pendiente'));
      assert.deepEqual(pendientes.map(d => d.id), ['arbitrios-1', 'arbitrios-2']);
    });

    it('el filtro "Pagados" muestra únicamente las obligaciones pagadas', () => {
      const debts = initialDebts();
      const pagados = visibleDebts(debts, 'Pagado');

      assert.equal(pagados.length, 1);
      assert.equal(pagados[0].id, 'licencia');
      assert.equal(pagados[0].status, 'Pagado');
    });

    it('tras pagar la única obligación vencida, el filtro "Vencidos" produce un estado vacío', () => {
      const debts = initialDebts();
      const { debts: updatedDebts } = confirmPayment(debts, ['predial'], 'Yape', 1);

      const vencidosDespues = visibleDebts(updatedDebts, 'Vencido');
      assert.equal(vencidosDespues.length, 0, 'No deben quedar obligaciones vencidas');

      const lateTotalDespues = debtTotal(outstanding(updatedDebts).filter(d => d.status === 'Vencido'));
      assert.equal(lateTotalDespues, 0);
      assert.equal(money(lateTotalDespues), 'S/ 0.00');
    });
  });

  describe('HU-03 · H3/H5: Conocer el importe exacto para decidir con confianza', () => {
    it('calcula un resumen exacto con desglose de monto base, intereses y total coherente', () => {
      const debts = initialDebts();
      const selectedIds = ['predial', 'arbitrios-1'];
      const chosen = debts.filter(d => selectedIds.includes(d.id));

      const montoBase = chosen.reduce((s, d) => s + d.amount, 0);
      const intereses = chosen.reduce((s, d) => s + d.interest, 0);
      const total = debtTotal(chosen);

      assert.equal(montoBase, 607.5);
      assert.equal(intereses, 0);
      assert.equal(total, 607.5);
      assert.equal(total, montoBase + intereses);

      assert.equal(money(montoBase), 'S/ 607.50');
      assert.equal(money(intereses), 'S/ 0.00');
      assert.equal(money(total), 'S/ 607.50');
    });

    it('exige la selección de un método de demostración antes de confirmar el pago', () => {
      const debts = initialDebts();
      const selectedIds = ['predial'];

      // Sin método
      assert.throws(() => confirmPayment(debts, selectedIds, ''), /Elige un método de demostración/);
      // Método inválido
      assert.throws(() => confirmPayment(debts, selectedIds, 'Bitcoin'), /Elige un método de demostración/);

      // Métodos válidos
      const rTarjeta = confirmPayment(debts, selectedIds, 'Tarjeta', 1);
      assert.equal(rTarjeta.receipt.method, 'Tarjeta');
      const rYape = confirmPayment(debts, selectedIds, 'Yape', 2);
      assert.equal(rYape.receipt.method, 'Yape');
      const rPlin = confirmPayment(debts, selectedIds, 'Plin', 3);
      assert.equal(rPlin.receipt.method, 'Plin');
    });

    it('la constancia de pago refleja con exactitud los conceptos pagados, importes y leyenda de simulación', () => {
      const debts = initialDebts();
      const res = confirmPayment(debts, ['predial'], 'Yape', 1);
      const html = receiptHtml(res.receipt);

      assert.equal(res.receipt.total, 420);
      assert.equal(res.receipt.reference, 'DEMO-2026-0001');
      assert.equal(res.receipt.date, '29/10/2026');
      assert.equal(res.receipt.items.length, 1);
      assert.equal(res.receipt.items[0].name, 'Impuesto predial');

      assert.ok(html.includes('DEMO-2026-0001'));
      assert.ok(html.includes('S/ 420.00'));
      assert.ok(html.includes('Carlos Ramírez'));
      assert.ok(html.includes('no tiene validez tributaria'));
      assert.ok(html.includes('No se realizó ningún cobro'));
    });
  });

  describe('HU-04 · H6: Elegir periodos para ponerme al día poco a poco', () => {
    it('permite seleccionar obligaciones individuales sin obligar a pagar la totalidad de la deuda', () => {
      const debts = initialDebts();

      // Paga solo el predial (S/ 420.00)
      const res1 = confirmPayment(debts, ['predial'], 'Tarjeta', 1);
      const saldoRestante1 = debtTotal(outstanding(res1.debts));
      assert.equal(saldoRestante1, 427.5);
      assert.equal(money(saldoRestante1), 'S/ 427.50');

      // Paga solo un arbitrio (S/ 187.50)
      const res2 = confirmPayment(debts, ['arbitrios-1'], 'Yape', 1);
      const saldoRestante2 = debtTotal(outstanding(res2.debts));
      assert.equal(saldoRestante2, 660.0);
      assert.equal(money(saldoRestante2), 'S/ 660.00');

      // Paga ambos arbitrios (S/ 427.50)
      const res3 = confirmPayment(debts, ['arbitrios-1', 'arbitrios-2'], 'Plin', 1);
      const saldoRestante3 = debtTotal(outstanding(res3.debts));
      assert.equal(saldoRestante3, 420.0);
      assert.equal(money(saldoRestante3), 'S/ 420.00');
    });

    it('actualiza dinámicamente el total seleccionado al agregar y quitar periodos', () => {
      const debts = initialDebts();
      let selected = [];

      const getSubtotal = () => {
        const chosen = debts.filter(d => selected.includes(d.id) && d.status !== 'Pagado');
        return debtTotal(chosen);
      };

      assert.equal(getSubtotal(), 0);

      // Agregar predial
      selected.push('predial');
      assert.equal(getSubtotal(), 420);

      // Agregar arbitrios-1
      selected.push('arbitrios-1');
      assert.equal(getSubtotal(), 607.5);

      // Agregar arbitrios-2
      selected.push('arbitrios-2');
      assert.equal(getSubtotal(), 847.5);

      // Quitar arbitrios-1
      selected = selected.filter(id => id !== 'arbitrios-1');
      assert.equal(getSubtotal(), 660);

      // Quitar predial
      selected = selected.filter(id => id !== 'predial');
      assert.equal(getSubtotal(), 240);

      // Quitar arbitrios-2 (deja vacío)
      selected = selected.filter(id => id !== 'arbitrios-2');
      assert.equal(getSubtotal(), 0);
    });

    it('impide seleccionar obligaciones que ya se encuentran pagadas', () => {
      const debts = initialDebts();
      // licencia ya está pagada
      const licencia = debts.find(d => d.id === 'licencia');
      assert.equal(licencia.status, 'Pagado');

      // La lógica de negocio rechaza pagar una deuda con status Pagado
      assert.throws(() => confirmPayment(debts, ['licencia'], 'Tarjeta'), /Selecciona al menos una obligación pendiente/);
      assert.throws(() => confirmPayment(debts, ['predial', 'licencia'], 'Tarjeta'), /Selecciona al menos una obligación pendiente/);
    });
  });
});
