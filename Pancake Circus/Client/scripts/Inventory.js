
let config = {
    // [REQUIRED] Set the row height
    rowHeight: '50px',
    // (optional) Title to display
    title: 'Inventory',
    // (optional) Display refresh button
    refresh: true,
    // (optional)
    // User will be able to choose which columns
    // should be displayed
    columnPicker: true,
    // (optional) How many columns from the left are sticky
    leftStickyColumns: 0,
    // (optional) How many columns from the right are sticky
    rightStickyColumns: 2,
    // (optional)
    // Styling the body of the data table;
    // "minHeight", "maxHeight" or "height" are important
    bodyStyle: {
        maxHeight: '500px'
    },
    // (optional) By default, Data Table is responsive,
    // but you can disable this by setting the property to "false"
    responsive: true,
    // (optional) Use pagination. Set how many rows per page
    // and also specify an additional optional parameter ("options")
    // which forces user to make a selection of how many rows per
    // page he wants from a specific list
    pagination: {
        rowsPerPage: 15,
        options: [5, 10, 15, 30, 50, 500]
    },
    // (optional) User can make selections. When "single" is specified
    // then user will be able to select only one row at a time.
    // Otherwise use "multiple".
    selection: 'multiple',
    // (optional) Override default messages when no data is available
    // or the user filtering returned no results.
    messages: {
        noData: '<i>warning</i> No data available to show.',
        noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
    },
    // (optional) Override default labels. Useful for I18n.
    labels: {
        columns: 'Coluuuuumns',
        allCols: 'Eeeeeeeeevery Cols',
        rows: 'Rooows',
        selected: {
            singular: 'item selected.',
            plural: 'items selected.'
        },
        clear: 'clear',
        search: 'Search',
        all: 'All'
    }
}

export default {
  
}