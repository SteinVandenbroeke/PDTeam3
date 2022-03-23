import {React} from "react";

export class UploadDataSet{
    fileReader = new FileReader();
    file = null;
    previewFileText = null;
    setPreviewTableFunction = () => {}
    constructor(file, setPreviewTableFunction = () => {}, setConnectionHeadersFunction = ()=>{}){
        this.file = file;
        this.setPreviewTableFunction = setPreviewTableFunction;
        this.setConnectionHeadersFunction = setConnectionHeadersFunction;
    }

    setPreviewTabel = () =>{
        alert("test");
    };

    readFileText(){
        if(this.file){
            this.fileReader.onload = async function (event) {
                let previewFileText = event.target.result;
                this.loadMatrix(previewFileText, this.setTable, this.loadConnections, this.setConnectionHeaders);
            }
            this.fileReader.loadMatrix = this.loadMatrix;
            this.fileReader.setTable = this.setPreviewTableFunction;
             this.fileReader.loadConnections = this.loadConnections;
            this.fileReader.setConnectionHeaders = this.setConnectionHeadersFunction;
            this.fileReader.readAsText(this.file.slice(0,500));
        }
    }

    loadMatrix(csvFileText, setTable, loadConnections, setConnectionHeaders){
        let matrix = [];
        let rows = csvFileText.split("\n")

        loadConnections(rows[0].split(","), setConnectionHeaders)
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

    loadConnections(headers, setConnectionHeaders){
        setConnectionHeaders({"database": ["timestamp", "user_id", "item_id", "parameter"], "cvs": headers})
    }

    getUploadFile(){
        return this.file;
    }
}