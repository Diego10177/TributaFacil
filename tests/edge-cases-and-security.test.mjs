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

describe('Pruebas de Casos Borde, Integridad y Prevención de Errores', () => {
  it('impide el doble pago de un tributo ya pagado en una transacción previa', () => {
    const debts = initialDebts();
    // Transacción 1: paga predial
    const step1 = confirmPayment(debts, ['predial'], 'Yape', 1);
    assert.equal(step1.debts.find(d => d.id === 'predial').status, 'Pagado');

    // Transacción 2: intento de volver a pagar predial
    assert.throws(
      () => confirmPayment(step1.debts, ['predial'], 'Yape', 2),
      /Selecciona al menos una obligación pendiente/
    );
  });

  it('permite liquidación completa en pagos escalonados hasta llegar a saldo S/ 0.00', () => {
    let currentDebts = initialDebts();
    assert.equal(debtTotal(outstanding(currentDebts)), 847.5);

    // Pago 1: Predial
    const t1 = confirmPayment(currentDebts, ['predial'], 'Yape', 1);
    currentDebts = t1.debts;
    assert.equal(debtTotal(outstanding(currentDebts)), 427.5);

    // Pago 2: Arbitrios Noviembre
    const t2 = confirmPayment(currentDebts, ['arbitrios-1'], 'Tarjeta', 2);
    currentDebts = t2.debts;
    assert.equal(debtTotal(outstanding(currentDebts)), 240.0);

    // Pago 3: Arbitrios Diciembre
    const t3 = confirmPayment(currentDebts, ['arbitrios-2'], 'Plin', 3);
    currentDebts = t3.debts;

    // Saldo final debe ser exactamente 0
    assert.equal(debtTotal(outstanding(currentDebts)), 0);
    assert.equal(money(debtTotal(outstanding(currentDebts))), 'S/ 0.00');
    assert.equal(outstanding(currentDebts).length, 0);

    // Las 4 deudas ahora deben estar en Pagado
    assert.ok(currentDebts.every(d => d.status === 'Pagado'));
    assert.equal(visibleDebts(currentDebts, 'Vencido').length, 0);
    assert.equal(visibleDebts(currentDebts, 'Pendiente').length, 0);
    assert.equal(visibleDebts(currentDebts, 'Pagado').length, 4);
  });

  it('rechaza cualquier intento de pago cuando el saldo pendiente es 0', () => {
    const debts = initialDebts();
    // Pagar todas las pendientes
    const allPendingIds = outstanding(debts).map(d => d.id);
    const settled = confirmPayment(debts, allPendingIds, 'Tarjeta', 1);

    // Intento con array vacío
    assert.throws(() => confirmPayment(settled.debts, [], 'Tarjeta', 2), /Selecciona al menos una obligación pendiente/);
    // Intento con IDs anteriores
    assert.throws(() => confirmPayment(settled.debts, ['predial'], 'Tarjeta', 2), /Selecciona al menos una obligación pendiente/);
  });

  it('garantiza unicidad y orden secuencial en las referencias de constancias', () => {
    const debts = initialDebts();
    const r1 = confirmPayment(debts, ['predial'], 'Tarjeta', 1);
    const r2 = confirmPayment(r1.debts, ['arbitrios-1'], 'Yape', 2);
    const r3 = confirmPayment(r2.debts, ['arbitrios-2'], 'Plin', 3);

    assert.equal(r1.receipt.reference, 'DEMO-2026-0001');
    assert.equal(r2.receipt.reference, 'DEMO-2026-0002');
    assert.equal(r3.receipt.reference, 'DEMO-2026-0003');

    const refs = new Set([r1.receipt.reference, r2.receipt.reference, r3.receipt.reference]);
    assert.equal(refs.size, 3, 'Cada constancia debe tener un código único');
  });

  it('la constancia generada es segura: no contiene scripts y es apta para impresión', () => {
    const debts = initialDebts();
    const res = confirmPayment(debts, ['predial'], 'Tarjeta', 1);
    const html = receiptHtml(res.receipt);

    // No debe contener scripts ejecutables
    assert.ok(!html.includes('<script'), 'No debe contener etiquetas <script>');
    assert.ok(!html.includes('javascript:'), 'No debe contener URLs javascript:');

    // Debe contener estilos específicos para impresión
    assert.ok(html.includes('@media print'), 'Debe incluir soporte CSS de impresión');
  });

  it('soporta ordenamiento consistente con múltiples deudas en fechas idénticas o desordenadas', () => {
    const customDebts = [
      { id: 'd3', name: 'Tributo 3', due: '2026-11-20', amount: 100, interest: 0, status: 'Pendiente' },
      { id: 'd1', name: 'Tributo 1', due: '2026-10-01', amount: 100, interest: 0, status: 'Vencido' },
      { id: 'd2', name: 'Tributo 2', due: '2026-10-01', amount: 100, interest: 0, status: 'Vencido' },
      { id: 'd4', name: 'Tributo 4', due: '2026-09-01', amount: 100, interest: 0, status: 'Pagado' }
    ];

    const visible = visibleDebts(customDebts, 'Todos');
    // Las impagas deben venir primero ordenadas por fecha
    assert.equal(visible[0].due, '2026-10-01');
    assert.equal(visible[1].due, '2026-10-01');
    assert.equal(visible[2].due, '2026-11-20');
    // La pagada al final a pesar de ser de 2026-09-01
    assert.equal(visible[3].id, 'd4');
    assert.equal(visible[3].status, 'Pagado');
  });
});
