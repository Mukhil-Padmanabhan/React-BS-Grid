/*************************************************************************************
**    Date: 03/04/2018                                                              **
**    Filename: App.jsx                                                             **
**    Programmer: Mukhil.Padmanabhan                                                **
**    description:The Parent component to be rendered on to the DOM                 **
/*************************************************************************************/

import React from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import ChildTable from './ChildComponent.jsx'
import '../../index.css'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import AppView from '../Presentations/AppView.jsx';
import { connect} from 'react-redux';
import  _ from 'lodash';


function mapStateToProps(state) {
    return {
      count: state
     };
    }
function mapDispatchToProps(dispatch) {
    return {
        filter_1: (value) => dispatch({type: 'filter_1', value: value}),
        decrement: () => dispatch({type: 'DECREMENT'})
    };
}



class App extends React.Component {
    constructor(props){
        // console.log(props)
        super(props);
        this.state={
            flag:false, 
            filter_2: [],
            filter_1:"",
            keyValues:[], 
            total: 0, 
            revealDropDown: false, 
            products:[],
            subTypeFilter: [],
            displayProducts: [],
            filteredKeys: [],
            modalIsOpen: false,
            swapValues:[],
            toDisplay: [],
            openFilterBox: false,
            filteredProducts: [],
            pdfColumn:[]
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
    }

    /*
    function: componentWillMount
    @params: none
    description: Calls the function within it before the React
                Components are rendered.
    return: void
    */
    componentWillMount() {
        this.addProducts(100);
    }

    /*
    function: openModal
    @params: none
    description: Flag for closing and opening the modal.
    return: void
    */
    openModal() {
        this.setState({modalIsOpen: true});
    }

    /*
    function: closeModal
    @params: none
    description: Flag for closing and opening the modal.
    return: void
    */
    saveModal() {
        let that = this;
        let temp = [];
        let vals = this.state.valuesRemovedInBulk || [];
        let filteredProducts = this.state.filteredProducts || [];
        let subFilterValue = this.state.swapValues;
        filteredProducts = filteredProducts.concat(subFilterValue);
        filteredProducts = _.difference(filteredProducts, vals)
        let products = subFilterValue.length ? this.state.products :this.state.displayProducts || []
        products.map(function(data){
            filteredProducts.map(function(info){
                if (Object.values(data).indexOf(info) > -1) {
                        temp.push(data);
                    }
            });
        });
        temp =  Array.from(new Set(temp));
        this.setState({displayProducts:temp,modalIsOpen: false, filteredProducts});
    }

    /*
    function: closeModal
    @params: void 
    description: Modal closing is handled here
    return: void
    */
    closeModal() {
        this.setState({modalIsOpen: false});
    }

    /*
    function: addProducts
    @params: quantity :: type: Number
    description: Dummy data is generated here.
    return: void
    */
    addProducts(quantity) {
        let that = this;
        let productsArr= [];
        let {products} =  this.state;
        const startId =  products.length;
        for (let i = 0; i < quantity; i++) {
        const id = startId + i;
        productsArr.push({
            id: id,
            PlaceOfService: 'My Mental Health LLC'+" "+ i,
            BillingProvider: 'Billing Provider'+" "+ i,
            RenderingProvider: 'RenderingProvider' +" "+ i,
            CPTCode: 'CPTCode'+" "+ i,
            Units:  i + ".00",
            Charges: i
        });
        }
        console.log("productsArr", productsArr)
        this.setState({products: productsArr})
        this.setDropDownValue( productsArr)
    }


    /*
    function: setDropDownValue
    @params: products :: type: Array of Objects
    description: The keys of dummy data are extraced here
    return: void
    */
    setDropDownValue( products) {
        var keyValues1 = [];
        var product = products ? products : []
        products.map(function(data, index){
            if(keyValues1.length < 1) keyValues1 = Object.keys(data);
        });
        this.setState({keyValues: keyValues1})
        console.log("keyValues", keyValues1)
        let totalAmount = 0;
        products.map(function(data){
            totalAmount = totalAmount + parseInt(data.Charges);
        })
        this.setState({total: totalAmount, products: products, displayProducts: products})
        this.constructColumnForPdf(keyValues1);
    }

    constructColumnForPdf(column) {
        let pdfColumn = []
        column.map(function(data){
            pdfColumn.push({
                title: data,
                dataKey: data
            })
        })
        this.setState({pdfColumn})
    }

    /*
    function: isExpandableRow
    params: row :: type: Object
    description: Handler for row expansion
    return: void
    */
    isExpandableRow(row) {
        if (row.id > 0) return true;
        else return false;
    }


    /*
    function: expandComponent
    @params: row :: type: Object
    description: Component to be rendered on expansion of a row
    return: void
    */
    expandComponent(row) {
        return (
        <ChildTable data={ row.expand } />
        );
  }


    /*
    function: coulmnFilter
    @params: value :: type: String
    description: Type dropdown filteration
    return: void
    */
    coulmnFilter(value) {
        let that = this;
        let swapValue = [];
        let disp = this.state.toDisplay || [];
        let checkIfDataExists = false
        let tempObj = {
            title: value,
            value: []
        };
        disp.map(function(data){
            if(data.title === value){
                checkIfDataExists =  true;
                swapValue = data.value
            }
        })
        if(!checkIfDataExists) disp.push(tempObj);
        this.props.filter_1(value)
        this.setState({filter_1: value, revealDropDown: true, toDisplay: disp, swapValues:swapValue})
        let filter_2 = this.state.products.map(function(data){
            return data[value];
        })
        this.setState({filter_2:filter_2, subFilter_2:filter_2});
    }

    /*
    function: restData
    @params: void
    description: Resets every data
    return: void
    */
    restData() {
    this.setState({displayProducts: this.state.products, filter_1:"", toDisplay:[]})
    }

    /*
    function: onSelectingColumnsToDisplay
    @params: event :: type: EventObject
    description:Manipulates the coulmns to be displayed
    return: void
    */
    onSelectingColumnsToDisplay(event) {
        let isChecked = event.target.checked;
        let value = this.state.filteredKeys || [];
        value.push(event.target.value);
        value =  Array.from(new Set(value));
        let products = this.state.products || [];
        if(isChecked) {
            if(this.state.filter_1 && this.state.filter_2) this.saveModal()
            else this.setState({displayProducts:products,  filteredKeys:value})
        } 
        else {
        let keys = this.state.filteredKeys || [];
        keys = _.without(keys, event.target.value)
        this.setState({filteredKeys:keys})
        }
    }

    /*
    function: subTypeFilter
    @params: event :: type: EventObject
    description:Currently unused function(depreceated)
    return: void
    */
    subTypeFilter(event) {
        let that = this;
        let value = this.state.subTypeFilter || [];
        let products = value.length ? this.state.products :this.state.displayProducts || []
        value.push(event.target.value)
        let temp =[];
        let type = that.state.filter_1
        temp = products.filter(function(data){
            let val = data[type]
            return value.includes(val);
        });
        this.setState({subTypeFilter: value, displayProducts: temp})
    }

    openFilterBox() {
        this.setState({openFilterBox: !this.state.openFilterBox})
    }


    pdfAction() {
        let chooseCurrentPage = confirm("Export current page or entire pdf")
        var doc = new jsPDF('p', 'pt');
        var that = this;
        if(!chooseCurrentPage) {
                doc.autoTable(that.state.pdfColumn, that.state.products, {
                    styles: {fillColor: [147, 204, 234]},
                    columnStyles: {
                        id: {fillColor: 200 }
                    },
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("RxnT", 40, 30);
                    }
                });
                doc.save('rxnt.pdf');
        } else {
            let doc = new jsPDF('l');
            var getCurrentPage = document.getElementsByClassName('react-bs-table react-bs-table-bordered')
            that.setState({flag: true}, function(){
                    doc.addHTML(getCurrentPage, 0, 0, function(){
                        that.setState({flag:false})
                        doc.save('rxnt.pdf');
                    })
                }); 
            }
    } 



    /*
    function: createCustomButtonGroup
    @params: props :: type: propsObject
    description:Customized Button group(Tool bar) displayed above the tabular
    return: void
    */
    createCustomButtonGroup (props){
        console.log("createCustomButtonGroup",props)
        var { keyValues, toDisplay } =  this.state;
        var that = this;
        return (
        <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
            { props.exportCSVBtn }
            { props.deleteBtn }
            { props.showSelectedOnlyBtn }
            <button type='button'
            className={ `btn btn-danger` }
            onClick={ function(e) { that.pdfAction() }}
            ><span className="glyphicon glyphicon-export"> </span>
            Export to PDF
            </button>
            <DropdownButton bsStyle='default' title='Type' id='export'>
            {
                keyValues.map(function(info, id) {
                    return(
                        <MenuItem active={toDisplay.some(function(data){if(data.title === info) return true; else return false;})} eventKey={info} onSelect={function(value){that.coulmnFilter(value)}} >{info}</MenuItem>
                    )
                })
            }
            </DropdownButton>
            <button type='button'
            className={ `btn btn-danger` }
            onClick ={function() {
                that.restData()
            }}> Reset </button>
                <DropdownButton bsStyle='default' title='Columns' id='export'>
            {
                keyValues.map(function(info, i){
                    return(
                    <div>
                        <div> 
                            <input type="checkbox" key={i} onClick={function(e) {that.onSelectingColumnsToDisplay(e)}} value={info} /> {info} 
                        </div> 
                    </div>
                    )
                })
            }
            </DropdownButton>
            <button 
                type='button'
                className={ `btn btn-default` }
                onClick={this.openModal}>Sub-Type
            </button>
            {this.state.toDisplay.length ? <button 
                type='button'
                className={ `btn btn-default` }
                onClick= { this.openFilterBox.bind(this) }
               >Filter Selected
            </button>: ""}<br/>
            { this.state.openFilterBox && this.state.toDisplay.length ? 
            <div className="panel panel-primary" style = {{"margin-top":"14px", "overflow":"auto", "margin-bottom":"auto"}}>
                <div className="panel-body">
                {
                    this.state.toDisplay.map(function(data){
                        return(
                            <div className="page-header">
                                <b>{data.title}:</b><br/>
                                {
                                    data.value?data.value.map(function(info){
                                        return (<small>{info+" "+"|"+" "}</small>)
                                    }):[]
                                }
                            </div>
                    )
                })
            }
            </div> </div> : <div></div>}
        </ButtonGroup>
        );
    }


    /*
    function: handleModalSubTypes
    @params: event :: type: EventObject
             val :: type: String
             index :: type: Number
    description: Swapping of sub-types on selection are handled here.
    return: void
    */
    handleModalSubTypes(event,val, index) {
        let that = this;
        var type = this.state.filter_2 || [];
        var temp = this.state.swapValues || [];
        let display = this.state.toDisplay || [];
        var shiftValues = [];
            this.setState({lastChecked: index})
        if(event.shiftKey) {
            var start = this.state.lastChecked;
            var end = index;
            shiftValues = type.slice(start, end+1)
            temp = temp.concat(shiftValues)
            display.map(function(data){
                if(data.title === that.state.filter_1) {
                    data.value = data.value.concat(shiftValues)
                }
            })
            this.setState({lastChecked: index})
        } else {
            display.map(function(data){
                if(data.title === that.state.filter_1) { 
                    data.value.push(val)
                }
            })
            temp.push(val)  
        }
        temp =  Array.from(new Set(temp));
        type = type.filter(function(data){
            return !(temp.includes(data));
        });
        this.setState({swapValues: temp, subSwapValues:temp, filter_2:type, toDisplay: display })
    }

     /*
    function: handleModalSubTypesSearch
    @params: val :: type: String
    description: Searching functionality on unselected sub-types within the modal
    return: void
    */
    handleModalSubTypesSearch(val) {
        let fil = this.state.subFilter_2 || [];
        if(val) {
            fil =  fil.filter(function(data){
                return data.includes(val)
            })
            this.setState({filter_2:fil});
        } else {
            this.setState({filter_2:this.state.subFilter_2});
        }
    }

    /*
    function: handleModalSelectedColumnSubTypesSearch
    @params: val :: type: String
    description: Searching functionality on selected sub-types within the modal
    return: void
    */
    handleModalSelectedColumnSubTypesSearch(val) {
        let fil = this.state.subSwapValues || [];
        if(val) {
            fil =  fil.filter(function(data){
                return data.includes(val)
            })
            this.setState({swapValues:fil});
        } else {
            this.setState({swapValues:this.state.subSwapValues});   
        }
    }

     /*
    function: handleModalSubTypesRemoval
    @params: event :: type: EventObject
             val :: type: String
             index :: type: Number
    description: Swapping of sub-types on deselection are handled here.
    return: void
    */
    handleModalSubTypesRemoval(event,val, index) {
        let that = this;
        let display = this.state.toDisplay || [];
        let filter_2 =  this.state.filter_2 || [];
        let swapValues = this.state.swapValues ||  [];
        let filteredProducts =  this.state.filteredProducts || [];
        swapValues = swapValues.filter(function(info){
            return info !== val;
        });
        display.map(function(data){
            if(data.title === that.state.filter_1) {
                if(data.value && data.value.length) { 
                    data.value = data.value.filter(function(info){
                           return info !== val 
                    })
                }
            }
            // if(!data.value.length) {
            //     _.omit(data)
            // }
        });
        // display = _.compact(display);
        filteredProducts = filteredProducts.filter(function(info){
            return info !== val
        })
        filter_2.push(val)
        filter_2.sort();
        this.setState({swapValues, filter_2, toDisplay: display, filteredProducts})
    }

    /*
    function: selectionAction
    @params: params :: type: String
    description: Selection and Deselction of all the elements in a sub-type modal is handled here.
    return: void
    */
    selectionAction(params) {
        let that = this;
        let temp = [];
        let products =  this.state.products || [];
        let filteredProducts = this.state.filteredProducts || [];
        let unSelectedSubTypeValues = this.state.filter_2 || [];
        let selectedSubTypeValues = this.state.swapValues || [];
        let filterInfoDisplay = this.state.toDisplay || [];
        if(params === "select") {
            filterInfoDisplay.map(function(data){
                if(data.title === that.state.filter_1) {
                    data.value = data.value.concat(unSelectedSubTypeValues);
                    return
                }  
            })
            this.setState({ swapValues: unSelectedSubTypeValues ,filter_2:[], filterInfoDisplay})
        } else {
            filterInfoDisplay.map(function(data){
                if(data.title === that.state.filter_1) {
                    temp = data.value;
                    data.value = [];
                    return
                }  
            })
            this.setState({ swapValues: [] ,filter_2: selectedSubTypeValues, filterInfoDisplay, valuesRemovedInBulk: temp})
        }
    }

    /*
    function: render
    @params: void
    description: This is where components to be renderedon the screen are placed.
    return: void
    */
    render() {
        const footerData = [
            [
            {
                label: 'Total Amount',
                columnIndex: 0,
                align: 'left',
                backgroundColor: 'white',
            },
            {
                label: 'Total Amount',
                columnIndex: 6,
                align: 'right',
                backgroundColor: 'white',
                formatter: (data) => {
                let total = 0;
                data.map(function(details){
                    total = total + parseInt(details.Charges);
                });
                return (
                    <div>
                    <strong>{ total+".00" }</strong>
                    <hr/>
                    <strong> {(this.state.total).toLocaleString()+".00"} </strong>
                    </div>
                );
                }
            }
            ]
        ]; 

        return (
        <AppView 
            data = {this.state.displayProducts } 
            isExpandableRow = { this.isExpandableRow.bind(this) }
            expandComponent = { this.expandComponent.bind(this) }
            footerData = { footerData }
            coulmnFilter = { this.coulmnFilter.bind(this) }
            keyValues = { this.state.keyValues }
            filteredKeys = { this.state.filteredKeys }
            createCustomButtonGroup = {this.createCustomButtonGroup.bind(this)}
            flag = { this.state.flag }
            closeModal = { this.closeModal }
            saveModal = { this.saveModal }
            afterOpenModal = { this.afterOpenModal }
            openModal = { this.openModal }
            modalIsOpen = { this.state.modalIsOpen }
            filter_2 = { this.state.filter_2 }
            handleModalSubTypes = { this.handleModalSubTypes.bind(this)}
            handleModalSubTypesSearch= { this.handleModalSubTypesSearch.bind(this) }
            handleModalSubTypesRemoval = { this.handleModalSubTypesRemoval.bind(this)}
            handleModalSelectedColumnSubTypesSearch = { this.handleModalSelectedColumnSubTypesSearch.bind(this)}
            swapValues = { this.state.swapValues }
            selectionAction = { this.selectionAction.bind(this) }
            filter_1 = { this.state.filter_1}
        />
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);