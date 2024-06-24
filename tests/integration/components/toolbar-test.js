/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { faker } from '@faker-js/faker';

import { setupRenderingTest } from 'crowd-table/tests/helpers';

module('Integration | Component | toolbar', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.onSelectAll = () => void 0;
    this.onUnselectAll = () => void 0;
  });

  test(`
    Given a toolbar component
      With a table-id property
      And a numberOfSelectedItems set to "0"
      And a selectionState set to "none"
    Then it is labelled by the table it is associated with
      And the checkbox has a checked value of "false"
      And its label displays "None selected"
      And the Export button is absent
  `, async function (assert) {
    await render(hbs`
      <Toolbar
        @numberOfSelectedItems={{0}}
        @selectionState="none"
        @tableId="table-id"
        @onSelectAll={{this.onSelectAll}}
        @onUnselectAll={{this.onUnselectAll}}
      />
    `);

    assert.dom('[role="toolbar"]').hasAttribute('aria-labelledby', 'table-id');
    assert.dom('[role="toolbar"] input[type="checkbox"]').isNotChecked();
    assert.dom('[role="toolbar"] label').containsText('None selected');
    assert.dom('[role="toolbar"] button').doesNotExist();

    // TODO: Add Axe a11y testing
  });

  test(`
    Given a basic toolbar component
      With a selection state of "all"
    Then the checkbox has a checked value of "true"
  `, async function (assert) {
    await render(hbs`
      <Toolbar
        @selectionState="all"
        @tableId="table-id"
        @onSelectAll={{this.onSelectAll}}
        @onUnselectAll={{this.onUnselectAll}}
      />
    `);

    assert.dom('[role="toolbar"] input[type="checkbox"]').isChecked();
  });

  test(`
    Given a basic toolbar component
      With a selection state of "indeterminate"
    Then the checkbox has a checked value of "true"
    Then the checkbox has an indeterminate value of "indeterminate"
  `, async function (assert) {
    await render(hbs`
      <Toolbar
        @selectionState="indeterminate"
        @tableId="table-id"
        @onSelectAll={{this.onSelectAll}}
        @onUnselectAll={{this.onUnselectAll}}
      />
    `);

    assert.dom('[role="toolbar"] input[type="checkbox"]').isChecked();
    assert
      .dom('[role="toolbar"] input[type="checkbox"]')
      .hasProperty('indeterminate', true);
  });

  test(`
    Given a toolbar component
      With a numberOfSelectedItems
    Then the label displays the number of selected items
  `, async function (assert) {
    this.numberOfSelectedItems = faker.number.int({ min: 1, max: 10 });
    await render(hbs`
      <Toolbar
        @numberOfSelectedItems={{this.numberOfSelectedItems}}
        @tableId="table-id"
        @onSelectAll={{this.onSelectAll}}
        @onUnselectAll={{this.onUnselectAll}}
      />
    `);

    assert
      .dom('[role="toolbar"] label')
      .containsText(`Selected ${this.numberOfSelectedItems}`);
  });

  test(`
    Given a toolbar component
      With an onSelectAll function
      And no selected items
    When I click on the checkbox
    Then the onSelectAll is called
  `, async function (assert) {
    this.onSelectAll = () => assert.ok('onSelectAll was called');
    await render(hbs`
      <Toolbar
        @numberOfSelectedItems={{0}}
        @selectionState="none"
        @tableId="table-id"
        @onSelectAll={{this.onSelectAll}}
        @onUnselectAll={{this.onUnselectAll}}
      />
    `);

    await click('[role="toolbar"] label');

    assert.expect(1);
  });

  test(`
    Given a toolbar component
      With an onUnselectAll function
      And selected items
    When I click on the checkbox
    Then the onUnselectAll is called
  `, async function (assert) {
    this.onSelectAll = () => assert.ok('onSelectAll was called');
    this.onUnselectAll = () => assert.ok('onUnselectAll was called');
    await render(hbs`
      <Toolbar
        @numberOfSelectedItems={{1}}
        @selectionState="all"
        @tableId="table-id"
        @onSelectAll={{this.onSelectAll}}
        @onUnselectAll={{this.onUnselectAll}}
      />
    `);

    await click('[role="toolbar"] label');

    assert.expect(1);
  });

  test(`
    Given a basic toolbar component
      With yielded content
    Then the content is displayed
  `, async function (assert) {
    this.customText = faker.lorem.sentence();
    await render(hbs`
      <Toolbar
        @canExport={{true}}
        @tableId="table-id"
        @onSelectAll={{this.onSelectAll}}
        @onUnselectAll={{this.onUnselectAll}}
      >
        <span data-test-yielded-content>{{this.customText}}</span>
      </Toolbar>
    `);

    assert.dom('[data-test-yielded-content]').hasText(this.customText);
  });
});
