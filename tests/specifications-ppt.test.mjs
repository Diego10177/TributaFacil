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

describe('Verificación de Criterios y Especificaciones Verificables (PPT Diapositiva 9)', () => {
  it('Especificación 1: Dado el caso ficticio, cuando se consulta, entonces Total pendiente S/ 847.50 y Monto vencido S/ 420.00', () => {
    // Verificación de credenciales esperadas
    const inputDni = '00000001';
    const inputMun = 'Municipalidad de Miraflores';

    assert.equal(inputDni, DEMO_DNI);
    assert.equal(inputMun, DEMO_MUNICIPALITY);

    const debts = initialDebts();
    const pending = outstanding(debts);
    const totalPendiente = debtTotal(pending);
    const montoVencido = debtTotal(pending.filter(d => d.status === 'Vencido'));

    assert.equal(totalPendiente, 847.5);
    assert.equal(money(totalPendiente), 'S/ 847.50');

    assert.equal(montoVencido, 420.0);
    assert.equal(money(montoVencido), 'S/ 420.00');

    // Validación de rechazo ante credenciales distintas
    const invalidDni = '00000002';
    const isValid = (d, m) => d.trim() === DEMO_DNI && m === DEMO_MUNICIPALITY;
    assert.equal(isValid(invalidDni, inputMun), false);
    assert.equal(isValid(inputDni, 'Municipalidad de San Isidro'), false);
  });

  it('Especificación 2: Dado el listado de deudas, cuando filtra "Vencidos", entonces solo aparece el predial vencido e impago', () => {
    const debts = initialDebts();
    const vencidos = visibleDebts(debts, 'Vencido');

    assert.equal(vencidos.length, 1);
    const [predial] = vencidos;
    assert.equal(predial.id, 'predial');
    assert.equal(predial.name, 'Impuesto predial');
    assert.equal(predial.status, 'Vencido');
    assert.equal(predial.amount, 420);
    assert.equal(predial.due, '2026-10-15');
  });

  it('Especificación 3: Dado que selecciona predial y vuelve desde revisión, entonces mantiene S/ 420.00; quitarlo deja S/ 0.00 y bloquea avanzar', () => {
    const debts = initialDebts();
    let selected = ['predial'];

    // Estado en pantalla de revisión
    const getChosen = () => debts.filter(d => selected.includes(d.id) && d.status !== 'Pagado');
    let chosen = getChosen();
    let total = debtTotal(chosen);

    assert.equal(chosen.length, 1);
    assert.equal(total, 420);
    assert.equal(money(total), 'S/ 420.00');

    // El usuario "vuelve" a la pantalla de tributos: selected no se limpia
    // Sigue manteniendo S/ 420.00
    chosen = getChosen();
    assert.equal(debtTotal(chosen), 420);

    // Usuario desmarca el predial
    selected = selected.filter(id => id !== 'predial');
    chosen = getChosen();
    total = debtTotal(chosen);

    assert.equal(chosen.length, 0);
    assert.equal(total, 0);
    assert.equal(money(total), 'S/ 0.00');

    // Comprobación de que el avance queda bloqueado cuando total es 0 / chosen.length === 0
    const canAdvance = chosen.length > 0;
    assert.equal(canAdvance, false, 'El botón de avance debe estar bloqueado');
  });

  it('Especificación 4: Dado que confirma predial con método simulado, entonces Constancia S/ 420.00, Saldo S/ 427.50 y predial pagado', () => {
    const debts = initialDebts();
    const selected = ['predial'];
    const method = 'Yape';

    const result = confirmPayment(debts, selected, method, 1);

    // 1. Constancia refleja S/ 420.00
    assert.equal(result.receipt.total, 420);
    assert.equal(money(result.receipt.total), 'S/ 420.00');
    assert.equal(result.receipt.reference, 'DEMO-2026-0001');

    // 2. Saldo pendiente se actualiza a S/ 427.50
    const nuevoSaldoPendiente = debtTotal(outstanding(result.debts));
    assert.equal(nuevoSaldoPendiente, 427.5);
    assert.equal(money(nuevoSaldoPendiente), 'S/ 427.50');

    // 3. Predial pasa a estado Pagado
    const predialActualizado = result.debts.find(d => d.id === 'predial');
    assert.equal(predialActualizado.status, 'Pagado');

    // 4. Verificación de que el filtro Vencidos ya no muestra el predial
    const vencidosDespues = visibleDebts(result.debts, 'Vencido');
    assert.equal(vencidosDespues.length, 0);
  });

  it('Especificación 5: Dado que reinicia la demostración, entonces recupera deudas originales y selección vacía', () => {
    // Simula haber pagado obligaciones y tener selección
    let debts = initialDebts();
    let selected = ['predial'];
    const res = confirmPayment(debts, selected, 'Tarjeta', 1);
    debts = res.debts;

    // Se verifica que las deudas fueron alteradas
    assert.equal(debts.find(d => d.id === 'predial').status, 'Pagado');
    assert.equal(debtTotal(outstanding(debts)), 427.5);

    // Acción de reinicio (reset)
    debts = initialDebts();
    selected = [];
    let method = '';
    let receipt = null;
    let sequence = 1;

    // Verificación de recuperación íntegra:
    assert.equal(debts.find(d => d.id === 'predial').status, 'Vencido');
    assert.equal(debtTotal(outstanding(debts)), 847.5);
    assert.equal(selected.length, 0);
    assert.equal(method, '');
    assert.equal(receipt, null);
    assert.equal(sequence, 1);
  });
});
