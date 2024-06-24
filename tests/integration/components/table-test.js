import { module, test } from 'qunit';
import { render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { faker } from '@faker-js/faker';

import { setupRenderingTest } from 'crowd-table/tests/helpers';

module('Integration | Component | table', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.columns = [
      {
        name: 'Product Name',
        valuePath: 'productName',
      },
      {
        name: 'Product Material',
        valuePath: 'productMaterial',
      },
    ];

    this.rows = Array.from({ length: faker.number.int({ min: 2, max: 5 })}).map(row => ({
      productName: faker.commerce.productName(),
      productMaterial: faker.commerce.productMaterial(),
    }));
  });

  test(`
    Given a table component
      With basic columns and rows
    Then each column is displayed in the header
      And each rows is displayed in the header
      And it passes Axe HTML compliance testing
  `, async function (assert) {
    await render(hbs`
      <Table
        @columns={{this.columns}}
        @rows={{this.rows}}
        @summary="Addon isn't much accessible to screen readers."
      />
    `);

    // TODO: Investigate Table seems slow to render
    await waitFor('tr:nth-of-type(2)');

    this.columns.forEach((column, index) => {
      assert.dom(`th:nth-of-type(${index + 1})`).hasText(column.name);
    });

    this.rows.forEach((row, index) => {
      assert.dom(`tr:nth-of-type(${index + 1}) td:first-of-type`).hasText(row.productName);
      assert.dom(`tr:nth-of-type(${index + 1}) td:nth-of-type(2)`).hasText(row.productMaterial);
    });

    // TODO: Add Axe a11y testing
    // assert.dom('table').hasAttribute('summary', 'Should be accessible');
  });

  test(`
    Given a table component
      With empty rows
    Then no rows are displayed
      And an "empty table" message is displayed in the footer
  `, async function (assert) {
    this.rows = [];

    await render(hbs`
      <Table
        @columns={{this.columns}}
        @rows={{this.rows}}
        @summary="Addon isn't much accessible to screen readers."
      />
    `);

    assert.dom(`tr:nth-of-type(2)`).doesNotExist('No rows are rendered');
    assert.dom(`tfoot`).containsText('No results were found');
  });

  test(`
    Given a table component
      With a custom cell renderer
    Then each cell has its custom rendering
      And it passes Axe HTML compliance testing
  `, async function (assert) {
    // this.columns[1].component = TestCellRendererComponent;
    await render(hbs`<Table @columns={{this.columns}} @rows={{this.rows}} />`);
    await waitFor('tr:nth-of-type(2)');

    assert.true(false, 'Not implemented yet')

    // this.rows.forEach((row, index) => {
    //   assert.dom(`tr:nth-of-type(${index + 1}) td:nth-of-type(2)`).hasText('Test Cell Renderer Component content');
    // });

    // TODO: Add Axe a11y testing
  });

  test(`
    Given a table component
      With the ability to select rows
    Then the first column header has no visible text
      And the first column cells are checkboxes
  `, async function (assert) {
    await render(hbs`<Table @columns={{this.columns}} @rows={{this.rows}} @canSelect={{true}} />`);
    await waitFor('tr:nth-of-type(2)');

    assert.true(false, 'Not implemented yet')

    // this.rows.forEach((_row, index) => {
    //   assert.dom(`tr:nth-of-type(${index + 1}) td:nth-of-type(1) [role="checkbox"]`).isVisible();
    // });
  });
});
