import {React} from "react";

export class UploadDataSet{
    fileReader = new FileReader();
    file = null;
    previewFileText = null;
    setPreviewTableFunction = () => {}
    constructor(file, setPreviewTableFunction = () => {}, setConnectionHeadersFunction = ()=>{}, connectionHeaders = {}){
        this.file = file;
        this.setPreviewTableFunction = setPreviewTableFunction;
        this.setConnectionHeadersFunction = setConnectionHeadersFunction;
        this.connectionHeaders = connectionHeaders;
    }

    setPreviewTabel = () =>{
        alert("test");
    };

    readFileText(){
        if(this.file){
            this.fileReader.onload = async function (event) {
                let previewFileText = event.target.result;
                this.loadMatrix(previewFileText, this.setTable, this.loadConnections, this.setConnectionHeaders, this.connectionHeaders);
            }
            this.fileReader.loadMatrix = this.loadMatrix;
            this.fileReader.setTable = this.setPreviewTableFunction;
             this.fileReader.loadConnections = this.loadConnections;
            this.fileReader.setConnectionHeaders = this.setConnectionHeadersFunction;
            this.fileReader.connectionHeaders = this.connectionHeaders;
            this.fileReader.readAsText(this.file);
        }
    }

    loadMatrix(csvFileText, setTable, loadConnections, setConnectionHeaders, connectionHeaders){
        let matrix = [];
        let rows = csvFileText.split("\n")

        loadConnections(rows[0].split(","), setConnectionHeaders, connectionHeaders)
        rows.map((row) => {
            let column = row.split(",")
            let rowArray = [];
            column.map((value) => {
                rowArray.push(value);
            })
            matrix.push(rowArray);
        })
        matrix.push(["..."])
        setTable(matrix);
    }

    loadConnections(headers, setConnectionHeaders, connectionHeaders){
        let tempConnectionHeaders = connectionHeaders;
        tempConnectionHeaders.csv = headers;
        setConnectionHeaders(tempConnectionHeaders);
       // setConnectionHeaders({"database": ["timestamp", "user_id", "item_id", "parameter"], "csv": headers, "connections": {}})
    }

    getUploadFile(){
        return this.file;
    }
}