import Component from '@glimmer/component';

export default class TableWithToolbarComponent extends Component {
  get columns() {
    const _columns = [...this.args.columns];
    if (this.args.canSelect) {
      _columns.splice(0, 0, {
        name: '',
        valuePath: 'selection',
        // component: 'table/cell/checkbox',
        width: 40,
      });
    }
    return _columns;
  }

  // TODO: Move into a table model to manage the whole table state
  get selectionState() {
    if (this.args.selection.length === 0) return 'none';

    return this.args.selection.length === this.args.rows.length
      ? 'all'
      : 'indeterminate';
  }
}
