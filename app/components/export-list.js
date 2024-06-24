import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TableWithToolbarComponent extends Component {
  columns = [
    {
      name: `Name`,
      valuePath: 'name',
      width: 120,
    },
    {
      name: `Device`,
      valuePath: 'device',
      width: 120,
    },
    {
      name: `Path`,
      valuePath: 'path',
      width: 550,
    },
    {
      name: `Status`,
      valuePath: 'status',
      width: 120,
    },
  ];

  // TODO: Move into a table model to manage the whole table state
  @tracked selection = [];

  get rows() {
    // TODO: Add some logic here
    return [...this.args.model];
  }

  get canExport() {
    // TODO: Add user-management logic here
    return this.selection.some((item) => item.status === 'available');
  }

  // TODO: use ember-concurrency
  @action
  exportList() {
    const exportableRows = this.selection.filter(
      (row) => row.status === 'available',
    );
    alert(
      exportableRows.map((row) => [row.device, row.path].join(',')).join('\n'),
    );
  }
}
