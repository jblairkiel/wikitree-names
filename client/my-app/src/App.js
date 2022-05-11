import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.dark.css';
import './App.css';

import React from 'react';

 
//import ODataStore from 'devextreme/data/odata/store';
//import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import DataGrid, { Column } from 'devextreme-react/data-grid';

const store = new CustomStore({
  key: 'Id',
  load(loadOptions) {
    return fetch(`http://localhost:3001/GetNames`)
      .then((response) => response.json())
      .then((data) => ({
        data: data.data,
        totalCount: data.totalCount,
        summary: data.summary,
        groupCount: data.groupCount,
      }))
      .catch(() => { throw new Error('Data Loading Error'); });
  },
});
// const dataSourceOptions = new DataSource({
//   store: new ODataStore({
//       url: 'http://localhost:3001/GetNames',
//       key: 'Id',
//       keyType: 'Int32',
//       // Other ODataStore properties go here
//   }),
//   // Other DataSource properties go here
// });


class App extends React.Component {
  render() {
    return (
      <DataGrid
        dataSource={store}
        showBorders={true}
      >
        <Column dataField="Id" />
        <Column
          dataField="Name"
          width={250}
        />
      </DataGrid>
    );
  }
}

export default App;
