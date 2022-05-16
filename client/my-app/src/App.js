import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.dark.css';
import './App.css';
import React from 'react';
import CustomStore from 'devextreme/data/custom_store';
import Button from 'devextreme-react/button'
import { Slider, Label, Tooltip } from 'devextreme-react/slider';
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
    this.contentReady = this.contentReady.bind(this);
    this.state = {
      autoExpandAll: false,
      popupVisible: true,
      textBoxValue: '',
      wikitreeLevels: 3
    };

    this.wikitreeID = '';
    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);

    const nameValue = this.state.textBoxValue;
    const treeLevels = this.state.wikitreeLevels;
    this.dataGridStore = new CustomStore({
      key: 'Id',
      load(loadOptions) {
        return fetch('http://localhost:3001/GetNames?name=' + nameValue + '&levels=' + treeLevels)
          .then((response) => response.json())
          .then((data) => ({
            data: [] 
          }))
          .catch(() => { throw new Error('Data Loading Error'); });
      }
    });
    //this.gridURL = `http://localhost:3001/GetNames?name=` + this.textBoxState.wikitreeID + '&levels=' + this.wikitreeLevels;
    this.gridURL = `http://localhost:3001/GetNames`;
  
    this.dataGrid = React.createRef();
    this.onStateResetClick = this.onStateResetClick.bind(this);
    this.onAutoExpandAllChanged = this.onAutoExpandAllChanged.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.setSliderValue = this.setSliderValue.bind(this);
  }

  render() {
    return (
      <div id="container">
        <Button icon="preferences"
          type="default"
          text="Done"
          onClick={this.showPopup} />
        <Popup
          visible={this.state.popupVisible}
          dragEnabled={false}
          closeOnOutsideClick={false}
          showCloseButton={false}
          contentRender = {this.popupTemplate}
          showTitle={true}
          title="Wikitree Naming Analysis"
          popupState={this.popupState}
          container=".dx-viewport"
          width={350}
          height={280} >
            
        </Popup>
        <DataGrid
          dataSource={this.dataGridStore}
          onContentReady={this.contentReady}
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
            groupIndex={0}
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
                />
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
            <SortByGroupSummaryInfo summaryItem="count" sortOrder="desc"/>
        </DataGrid> 
      </div>
    );
  }

  handleTextBoxChange(newValue){
    this.setState({
      textBoxValue: newValue
    });
    // const eventValue = e;
    // const anotherTarget = e.target;
    // const eventTarget = eventValue.currentTarget;
    // const newValue = eventTarget.value;
    // this.wikitreeID = newValue;
  };

  popupTemplate = (button) => {
    return (
      <div>
        <div className="dx-field">
          <div className="dx-field-label">Wikitree ID</div>
          <div className="dx-field-value">
            <TextBox 
              placeholder="Enter Wikitree ID here ...." 
              textBoxState={this.state.textBoxValue}
              onValueChange={this.handleTextBoxChange}/>
          </div>
        </div>
        <div className="dx-field">
            <div className="dx-field-label">Tree Depth</div>
            <div className="dx-field-value">
              <Slider min={0} max={15} defaultValue={this.state.wikitreeLevels} step={1} onValueChanged={this.setSliderValue}>
                <Tooltip enabled={true} />
              </Slider>
            </div>
          </div>
        <Button
          width={140}
          text="Analyze Names"
          type="default"
          stylingMode="contained"
          onClick={this.submitName}
        />
      </div>
    ); 
  };

  showPopup() {
    this.setState({
      popupVisible: true
    });
  }

  hidePopup() {
      this.setState({
        popupVisible: false
      });
  }

  setSliderValue({ value }) {
    this.setState({ wikitreeLevels: value });
  }
  
  contentReady = (e) => {
    if (!e.component.getSelectedRowKeys().length) { 
      //e.component.expandRow(e.component.getKeyByRowIndex(0));   For showing first row
      //console.log("do nothing") 
    }
  }
  
  submitName = () => {
   
    const nameValue = this.state.textBoxValue;
    const treeLevels = this.state.wikitreeLevels;
    this.dataGridStore = new CustomStore({
      key: 'Id',
      load(loadOptions) {
        return fetch('http://localhost:3001/GetNames?name=' + nameValue + '&levels=' + treeLevels)
          .then((response) => response.json())
          .then((data) => ({
            data: data
          }))
          .catch(() => { throw new Error('Data Loading Error'); });
      }
    });
    this.dataGridStore.load();
    this.hidePopup();
    
  };
  
  onRefreshClick() {
    window.location.reload();
  }


  wikitreeHtmlRenderer(data) {
    const hrefStr = 'https://www.wikitree.com/wiki/' + data.value
    return <a href={hrefStr} target='_blank'>{data.value}</a>
  }

  onStateResetClick() {
    this.dataGrid.current.instance.state(null);
  }
  onAutoExpandAllChanged() {
    this.setState({
      autoExpandAll: !this.state.autoExpandAll,
    });
  }

}

export default App;
