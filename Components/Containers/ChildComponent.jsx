import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class ChildTable extends React.Component {
    render() {

        const childProduct = [
            {id:1,PlaceOfService:'My Mental Health LLC', BillingProvider:'Testing, T First', RenderingProvider:'Acevedo, Tara', CPTCode:'AS- Testing001', Units:'1.00',Charges:'500.00'},
            {id:2,PlaceOfService:'My Mental Health LLC', BillingProvider:'Testing, T First', RenderingProvider:'Acevedo, Tara', CPTCode:'H0001 H2', Units:'1.00',Charges:'500.00'},
            {id:3,PlaceOfService:'My Mental Health LLC', BillingProvider:'Testing, T First', RenderingProvider:'Chhabra, S Hanita', CPTCode:'0220', Units:'1.00',Charges:'500.00'}
        ];



      if (true) {
        return (
          <BootstrapTable data={ childProduct } striped={true}>
          <TableHeaderColumn dataField='id' dataSort={true} isKey={ true }>Product ID</TableHeaderColumn>
          <TableHeaderColumn dataField='PlaceOfService'  dataSort={true} >Place Of Service</TableHeaderColumn>
          <TableHeaderColumn dataField='BillingProvider' dataSort={true}>Billing Provider</TableHeaderColumn>
          <TableHeaderColumn dataField='RenderingProvider' dataSort={true}>Rendering Provider</TableHeaderColumn>
          <TableHeaderColumn dataField='CPTCode' dataSort={true}>CPT Code</TableHeaderColumn>
          <TableHeaderColumn dataField='Units' dataSort={true}>Units</TableHeaderColumn>
          <TableHeaderColumn dataField='Charges' dataSort={true}>Charges</TableHeaderColumn>
          </BootstrapTable>);
      } else {
        return (<p>?</p>);
      }
    }
  }