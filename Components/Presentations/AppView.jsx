/*************************************************************************************
**    Date: 03/04/2018                                                              **
**    Filename: AppView.jsx                                                         **
**    Programmer: Mukhil.Padmanabhan                                                **
**    description:The Presentation layer of the App.jsx Container                   **
/*************************************************************************************/
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../index.css';
import Modal from 'react-modal';
import ScrollArea from 'react-scrollbar';
import { Tabs, Tab } from 'react-bootstrap'; // Tabs to be Added for each table


/*
Object: customStyles
@params: none
description: Setting the style of the Modal.
*/
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  Modal.setAppElement('#app')

export default class AppView extends React.Component {
    constructor(props) {
        super(props);  
        console.log("props", props)
    }

    /*
    function: createCustomToolBar
    @params: props :: type: PropObject
    description: Setting up the tool bar and search filed 
    return: void
    */
    createCustomToolBar(props) {
        return (
            <div style={ { margin: '1px' } }>
                { props.components.btnGroup }
            <div className='col-xs-8 col-sm-4 col-md-4 col-lg-2'>
                { props.components.searchField }
            </div>
            </div>
        );
    }

    subTypeColumn() {
        var { filter_2 } = this.props;
        filter_2.map(function(data,i){
            return(
            <div>
                <div value={data} className="modal-column1 list-group-item " onClick={function(e){ handleModalSubTypes(e,data,i) }}> {data} </div>
            </div>
            )
        })
        return filter_2;
    }

    render() {
        let that = this;
        var {filter_1, selectionAction, clearAllModalColumn2, handleModalSelectedColumnSubTypesSearch, handleModalSubTypesSearch,saveModal,handleModalSubTypesRemoval, swapValues, handleModalSubTypes, filter_2, closeModal, afterOpenModal, modalIsOpen, closeModal, flag, isExpandableRow, data, expandComponent, restData, footerData, filteredKeys, keyValues} = this.props;
        console.log("filter_1", filter_1.value)
        var mappingData = filteredKeys.length ? filteredKeys : keyValues;
        const selectRow = {
          mode: 'checkbox',
          showOnlySelected: true,
          clickToExpand: true
        };
     
        const options = {
          toolBar: this.createCustomToolBar,
          saveText: 'my_save',
          printToolBar: false,
          btnGroup: this.props.createCustomButtonGroup
        };
    
        const autoOptions = {
          sort: true,
          filter: true,
          search: true
        };  
        var modalFilter = filter_2;
        
        return ( 
            <div>
                <Modal
                isOpen={ modalIsOpen }
                onAfterOpen={ afterOpenModal }
                onRequestClose={ closeModal }
                style={customStyles}
                contentLabel="Sub-Type Selection"
                >
                    <div className="panel panel-default">
                        <div className="panel panel-primary">
                            <h2 style={{"marginLeft": "158px"}}><b>Sub-Types</b></h2>
                            <h4 style={{"marginLeft": "158px"}}><b>Type: {filter_1}</b></h4>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="column" style ={{"overflow-y":"scroll" , "height":"400px", "width": "auto"}}>
                                    <div> 
                                        <input type="search" className="form-control" placeholder="Search.." onChange={ function(e) {handleModalSubTypesSearch(e.target.value)}}/>
                                        <button className="btn btn-primary" type="button" onClick={ function(){ selectionAction("select")}}><span>Select All</span></button>
                                    </div>
                                    {
                                        modalFilter.map(function(data,i){
                                            return(
                                            <div>
                                                <div value={data} className="modal-column1 list-group-item " onClick={function(e){ handleModalSubTypes(e,data,i) }}> {data} </div>
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="column" style={{"overflow-y":"scroll" , "height":"400px", "width": "auto"}}>
                                    <div> 
                                        <input type="search"  placeholder="Search.." className="form-control" onChange={ function(e) {handleModalSelectedColumnSubTypesSearch(e.target.value)}}/> 
                                        <button className="btn btn-primary" type="button" onClick={ function(){ selectionAction("deselect")}} ><span>Deselect All</span></button>
                                    </div>
                                    {
                                        swapValues.map(function(info, id){
                                            return(
                                            <div>
                                                <div value={info} className="modal-column1 list-group-item" onClick={function(e){ handleModalSubTypesRemoval(e,info,id) }}> {info} </div>
                                            </div> 
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button"  style = {{"margin-right" : "351px"}}className="btn btn-danger" onClick={ closeModal }>Cancel</button>
                    <button type="button" className="btn btn-success" onClick={ saveModal }>Save</button>
                </Modal>
                
                <BootstrapTable 
                tableHeaderClass='my-header-class'
                containerClass  = 'my_test'
                headerContainerClass  = 'my_test'
                tableBodyClass='my-body-class'
                tableFooterClass = 'my-body-class'
                data = { data }
                expandableRow={ isExpandableRow }
                expandComponent={ expandComponent }
                options={ options }
                selectRow={ !flag?selectRow:{} }
                autoCollapse = {autoOptions}
                deleteRow
                // insertRow
                keyField="id" 
                exportCSV
                pagination 
                footerData={ footerData }
                footer
                ref='bsTable'
                striped={ true }
                searchPlaceholder = {"Search Here"} 
                search>
                {
                    mappingData.map(function(info, index){
                        return (
                        <TableHeaderColumn  striped={ true }  key={index} dataField={info} hover filter={ { type: !flag ? 'TextFilter': null, delay: 500 } } dataSort={!flag? true : false} >{info}</TableHeaderColumn>
                        )
                    })
                }
                </BootstrapTable>
            </div>
        );    
    }
}