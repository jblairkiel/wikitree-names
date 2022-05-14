import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.dark.css';
import './App.css';
import React from 'react';
import CustomStore from 'devextreme/data/custom_store';
import Form from 'devextreme-react/form';
import Button from 'devextreme-react/button'
import { Popup, Position } from 'devextreme-react/popup';
import { TextBox  } from 'devextreme-react/text-box';
import DataGrid, { 
  Column, 
  ColumnChooser,
  ColumnFixing,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  Summary, 
  TotalItem,
  SortByGroupSummaryInfo,
  GroupItem
} from 'devextreme-react/data-grid';




class App extends React.Component {
  constructor(props){
    super(props);

    this.popupState = {
      popupVisible: true,
    };

    this.textBoxState = {
      wikitreeID: 'Kiel-273'
    };
    this.wikitreeLevels = 5;

    this.handleTextBoxChange = function(event) {
      this.textBoxState({wikitreeID: event.currentTarget.value});
    };
    this.gridURL = `http://localhost:3001/GetNames?name=` + this.textBoxState.wikitreeID + '&levels=' + this.wikitreeLevels;
    this.store = new CustomStore({
      key: 'Id',
      load(loadOptions) {
        return fetch(this.gridURL)
          .then((response) => response.json())
          .then((data) => ({
            data: data 
          }))
          .catch(() => { throw new Error('Data Loading Error'); });
      },
    });

    this.dataGrid = React.createRef();
    this.onStateResetClick = this.onStateResetClick.bind(this);
    this.state = {
      autoExpandAll: true,
    };
    this.onAutoExpandAllChanged = this.onAutoExpandAllChanged.bind(this);
  }

  popupTemplate = (button) => {
    return (
      <div>
        <div className="dx-field">
          <div className="dx-field-label">Wikitree ID</div>
          <div className="dx-field-value">
            <TextBox 
              placeholder="Enter Wikitree ID here ...." 
              textBoxState={this.textBoxState}
              onChange={this.handleTextBoxChange}/>
          </div>
        </div>
        <Button
          width={140}
          text="Analyze Names"
          type="default"
          stylingMode="contained"
          onClick={this.submitName()}
        />
      </div>
    ); 
  };
  
  
  submitName = () => {
   
    //this.dataGrid.instance.refresh()
    // this.store = new CustomStore({
    //   key: 'Id',
    //   load(loadOptions) {
    //     return fetch(`http://localhost:3001/GetNames?name=` + this.textBoxState.wikitreeID + '&levels=' + this.wikitreeLevels)
    //       .then((response) => response.json())
    //       .then((data) => ({
    //         data: data 
    //       }))
    //       .catch(() => { throw new Error('Data Loading Error'); });
    //   },
    // });
    this.store.load();
    
  };
  
  onRefreshClick() {
    window.location.reload();
  }

  onClick(e) {
    const buttonText = e.component.option('text');
    //notify(`The ${capitalize(buttonText)} button was clicked`);
  }


  wikitreeHtmlRenderer(data) {
    const hrefStr = 'https://www.wikitree.com/wiki/' + data.value
    return <a href={hrefStr} target='_blank'>{data.value}</a>
  }

  onStateResetClick() {
    this.dataGrid.current.instance.state(null);
  }
  render() {
    return (
      <div id="container">
        <Popup
          visible={this.popupState.popupVisible}
          dragEnabled={true}
          closeOnOutsideClick={true}
          showCloseButton={true}
          contentRender = {this.popupTemplate}
          showTitle={true}
          title="Wikitree Naming Analysis"
          container=".dx-viewport"
          width={350}
          height={280} >
            
        </Popup>
        <DataGrid
          dataSource={this.store}
          showBorders={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={true}
        >
          <GroupPanel visible={true} />
          <SearchPanel visible={true} />
          <Grouping autoExpandAll={this.state.autoExpandAll} />
          <Paging defaultPageSize={100} />
          <ColumnChooser enabled={true} />
          <ColumnFixing enabled={true} />
          <Column 
            dataField="Id"
            visible={false} />
          <Column
            dataField="FirstName" 
            width={'100'} />
          <Column
            dataField="MiddleName" 
            width={'100'} />
          <Column
            dataField="LastNameAtBirth"  
            width={'100'} />
          <Column
            dataField="LastNameCurrent" 
            width={'100'} />
          <Column
            dataField="LongName" />
          <Column
            dataField="Name" 
            cell-template="wikitreeName-cell"
            cellRender={this.wikitreeHtmlRenderer}
            caption="WikitreeID"  />
          <Column
            dataField="BirthDate" 
            dataType="date" />
          <Column
            dataField="DeathDate" 
            dataType="date" />
          <Column
            dataField="BirthLocation" />
          <Column
            dataField="DeathLocation" />

          <Summary>
              <GroupItem
                column="FirstName"
                summaryType="count"
                displayFormat="Total: {0}"
                showInGroupFooter={true} />
              <GroupItem
                column="MiddleName"
                summaryType="count"
                displayFormat="Total: {0}"
                showInGroupFooter={true} />
                <GroupItem
                  column="LastNameAtBirth"
                  summaryType="count"
                  displayFormat="Total: {0}"
                  showInGroupFooter={true} />
                <GroupItem
                  column="LastNameCurrent"
                  summaryType="count"
                  displayFormat="Total: {0}"
                  showInGroupFooter={true} />
            </Summary>
            <SortByGroupSummaryInfo summaryItem="count" />
        </DataGrid> 
      </div>
    );
  }

  onAutoExpandAllChanged() {
    this.setState({
      autoExpandAll: !this.state.autoExpandAll,
    });
  }

}

export default App;
