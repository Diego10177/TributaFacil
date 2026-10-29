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

describe('Pruebas Unitarias del Modelo de Datos (TributaFácil)', () => {
  describe('Constantes de Demostración', () => {
    it('debe tener definida la fecha fija del caso como 29/10/2026', () => {
      assert.equal(DEMO_DATE, '29/10/2026');
    });

    it('debe tener el DNI ficticio de Carlos Ramírez como 00000001', () => {
      assert.equal(DEMO_DNI, '00000001');
    });

    it('debe tener la municipalidad fija del caso como Municipalidad de Miraflores', () => {
      assert.equal(DEMO_MUNICIPALITY, 'Municipalidad de Miraflores');
    });
  });

  describe('Función money()', () => {
    it('formatea números enteros con dos decimales y prefijo S/', () => {
      assert.equal(money(420), 'S/ 420.00');
    });

    it('formatea números con decimales correctamente', () => {
      assert.equal(money(187.5), 'S/ 187.50');
      assert.equal(money(427.5), 'S/ 427.50');
    });

    it('formatea el valor cero con dos decimales', () => {
      assert.equal(money(0), 'S/ 0.00');
    });
  });

  describe('Función initialDebts()', () => {
    it('retorna 4 obligaciones iniciales con los campos esperados', () => {
      const debts = initialDebts();
      assert.equal(debts.length, 4);

      const [predial, arb1, arb2, lic] = debts;
      assert.deepEqual(predial, {
        id: 'predial',
        name: 'Impuesto predial',
        period: 'Anual 2026',
        due: '2026-10-15',
        amount: 420,
        interest: 0,
        status: 'Vencido'
      });

      assert.deepEqual(arb1, {
        id: 'arbitrios-1',
        name: 'Arbitrios municipales',
        period: 'Noviembre 2026',
        due: '2026-11-15',
        amount: 187.5,
        interest: 0,
        status: 'Pendiente'
      });

      assert.deepEqual(arb2, {
        id: 'arbitrios-2',
        name: 'Arbitrios municipales',
        period: 'Diciembre 2026',
        due: '2026-12-15',
        amount: 240,
        interest: 0,
        status: 'Pendiente'
      });

      assert.deepEqual(lic, {
        id: 'licencia',
        name: 'Licencia de funcionamiento',
        period: 'Anual 2026',
        due: '2026-09-30',
        amount: 350,
        interest: 0,
        status: 'Pagado'
      });
    });

    it('garantiza inmutabilidad devolviendo instancias independientes en cada llamada', () => {
      const d1 = initialDebts();
      const d2 = initialDebts();
      d1[0].status = 'Pagado';
      assert.equal(d2[0].status, 'Vencido', 'Modificar d1 no debe alterar una nueva llamada a initialDebts');
    });
  });

  describe('Función debtTotal()', () => {
    it('calcula la suma acumulada de amount e interest correctamente', () => {
      const debts = initialDebts();
      assert.equal(debtTotal(debts), 1197.5);
    });

    it('retorna 0 para un listado vacío', () => {
      assert.equal(debtTotal([]), 0);
    });

    it('maneja deudas con interés si llegaran a existir', () => {
      const sample = [
        { id: '1', amount: 100, interest: 15 },
        { id: '2', amount: 200, interest: 5 }
      ];
      assert.equal(debtTotal(sample), 320);
    });
  });

  describe('Función outstanding()', () => {
    it('excluye las obligaciones que tienen estado Pagado', () => {
      const debts = initialDebts();
      const pending = outstanding(debts);
      assert.equal(pending.length, 3);
      assert.ok(pending.every(d => d.status !== 'Pagado'));
      assert.equal(debtTotal(pending), 847.5);
    });

    it('retorna un array vacío si todas las deudas están pagadas', () => {
      const allPaid = initialDebts().map(d => ({ ...d, status: 'Pagado' }));
      assert.equal(outstanding(allPaid).length, 0);
    });
  });

  describe('Función visibleDebts()', () => {
    it('filtra por estado cuando se especifica Vencido', () => {
      const debts = initialDebts();
      const vencidos = visibleDebts(debts, 'Vencido');
      assert.equal(vencidos.length, 1);
      assert.equal(vencidos[0].id, 'predial');
    });

    it('filtra por estado cuando se especifica Pendiente', () => {
      const debts = initialDebts();
      const pendientes = visibleDebts(debts, 'Pendiente');
      assert.equal(pendientes.length, 2);
      assert.deepEqual(pendientes.map(d => d.id), ['arbitrios-1', 'arbitrios-2']);
    });

    it('filtra por estado cuando se especifica Pagado', () => {
      const debts = initialDebts();
      const pagados = visibleDebts(debts, 'Pagado');
      assert.equal(pagados.length, 1);
      assert.equal(pagados[0].id, 'licencia');
    });

    it('ordena deudas impagas por fecha de vencimiento y coloca las pagadas al final (HU-01)', () => {
      const debts = initialDebts();
      const visible = visibleDebts(debts, 'Todos');
      assert.equal(visible.length, 4);
      // Impagas en orden cronológico: 2026-10-15 -> 2026-11-15 -> 2026-12-15
      assert.equal(visible[0].id, 'predial');
      assert.equal(visible[1].id, 'arbitrios-1');
      assert.equal(visible[2].id, 'arbitrios-2');
      // Pagadas al final, aunque su fecha sea anterior (2026-09-30)
      assert.equal(visible[3].id, 'licencia');
      assert.equal(visible[3].status, 'Pagado');
    });

    it('retorna array vacío si el filtro no coincide con ningún estado', () => {
      const debts = initialDebts();
      assert.equal(visibleDebts(debts, 'Inexistente').length, 0);
    });
  });

  describe('Función confirmPayment()', () => {
    it('procesa el pago simulado y actualiza el estado de las obligaciones a Pagado', () => {
      const debts = initialDebts();
      const res = confirmPayment(debts, ['predial'], 'Tarjeta', 1);
      assert.equal(res.debts.find(d => d.id === 'predial').status, 'Pagado');
      assert.equal(res.debts.find(d => d.id === 'arbitrios-1').status, 'Pendiente');
      assert.equal(res.receipt.reference, 'DEMO-2026-0001');
      assert.equal(res.receipt.total, 420);
      assert.equal(res.receipt.method, 'Tarjeta');
    });

    it('soporta métodos válidos: Tarjeta, Yape y Plin', () => {
      const debts = initialDebts();
      assert.doesNotThrow(() => confirmPayment(debts, ['predial'], 'Tarjeta', 1));
      assert.doesNotThrow(() => confirmPayment(debts, ['predial'], 'Yape', 2));
      assert.doesNotThrow(() => confirmPayment(debts, ['predial'], 'Plin', 3));
    });

    it('rechaza métodos no soportados', () => {
      const debts = initialDebts();
      assert.throws(() => confirmPayment(debts, ['predial'], 'Efectivo'), /Elige un método de demostración/);
      assert.throws(() => confirmPayment(debts, ['predial'], ''), /Elige un método de demostración/);
      assert.throws(() => confirmPayment(debts, ['predial'], null), /Elige un método de demostración/);
    });

    it('rechaza selecciones vacías', () => {
      const debts = initialDebts();
      assert.throws(() => confirmPayment(debts, [], 'Yape'), /Selecciona al menos una obligación pendiente/);
    });

    it('rechaza selecciones con IDs duplicados', () => {
      const debts = initialDebts();
      assert.throws(() => confirmPayment(debts, ['predial', 'predial'], 'Yape'), /Selecciona al menos una obligación pendiente/);
    });

    it('rechaza selecciones que contengan obligaciones ya pagadas', () => {
      const debts = initialDebts();
      assert.throws(() => confirmPayment(debts, ['licencia'], 'Yape'), /Selecciona al menos una obligación pendiente/);
    });

    it('rechaza selecciones con IDs que no existen en el listado', () => {
      const debts = initialDebts();
      assert.throws(() => confirmPayment(debts, ['id-falso'], 'Yape'), /Selecciona al menos una obligación pendiente/);
    });

    it('genera secuencias numéricas con relleno a cuatro dígitos (pad)', () => {
      const debts = initialDebts();
      const res1 = confirmPayment(debts, ['predial'], 'Yape', 5);
      assert.equal(res1.receipt.reference, 'DEMO-2026-0005');
      const res2 = confirmPayment(debts, ['predial'], 'Yape', 123);
      assert.equal(res2.receipt.reference, 'DEMO-2026-0123');
    });
  });

  describe('Función receiptHtml()', () => {
    it('genera un documento HTML estructurado con todos los datos requeridos', () => {
      const debts = initialDebts();
      const res = confirmPayment(debts, ['predial'], 'Yape', 1);
      const html = receiptHtml(res.receipt);

      assert.ok(html.startsWith('<!doctype html>'), 'Debe iniciar con doctype html');
      assert.ok(html.includes('DEMO-2026-0001'), 'Debe incluir la referencia');
      assert.ok(html.includes('29/10/2026'), 'Debe incluir la fecha fija');
      assert.ok(html.includes('Carlos Ramírez'), 'Debe incluir el nombre del contribuyente');
      assert.ok(html.includes('DNI 00000001'), 'Debe incluir el DNI');
      assert.ok(html.includes('Municipalidad de Miraflores'), 'Debe incluir la municipalidad');
      assert.ok(html.includes('Yape'), 'Debe indicar el método utilizado');
      assert.ok(html.includes('Impuesto predial'), 'Debe indicar el nombre del tributo');
      assert.ok(html.includes('Anual 2026'), 'Debe indicar el periodo');
      assert.ok(html.includes('S/ 420.00'), 'Debe mostrar el total formateado');
      assert.ok(html.includes('no tiene validez tributaria'), 'Debe contener el aviso de simulación');
    });
  });
});
