import json
import pandas as pd
from quote_data_access import DBConnection
from config import config_data
from psycopg2 import sql
import numpy
from psycopg2.extensions import register_adapter, AsIs

class Dataset():
    def __init__(self):
        # connect to self.database
        database = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'],
                                userPassword=config_data['password'], dbhost=config_data['host'],
                                dbport=config_data['port'])
        self.connection = database.get_connection()
        self.cursor = self.connection.cursor()

    def add(self, datasetName, customerCSV, articleCSV, purchasesCSV, customerConnections, articleConnections,
            purchaseConnections, userName):

        # customer table:

        customerTableName = datasetName.lower() + '_customers'
        customerData = pd.read_csv(customerCSV)
        customerDf = pd.DataFrame(customerData)
        customerConnections = json.loads(customerConnections)
        customerParamaters = 'id int PRIMARY KEY'
        id = ''
        customerDataOrder = {}
        for param in customerConnections['connections']:
            if customerConnections['connections'][param] == "id":
                if id != '':
                    print('Error: more than one linked id found while uploading customers to database.')
                    return
                customerDataOrder[param] = 0
                id = param
        if id == '':
            print('Error: no linked id found while uploading customers to database.')
            return
        for param in customerDf.columns:
            if param != id and param in customerConnections['connections']:
                type = ""
                if customerConnections['connections'][param] == 'extra info (int)':
                    type = 'int'
                elif customerConnections['connections'][param] == 'extra info (varchar)':
                    type = 'varchar'
                elif customerConnections['connections'][param] == 'extra info (datetime)':
                    type = 'datetime'
                customerDataOrder[param] = len(customerDataOrder)
                customerParamaters += ', ' + param + ' ' + type
        createCustomersTable = 'CREATE TABLE ' + customerTableName + '(' + customerParamaters + ');'
        self.cursor.execute(sql.SQL(createCustomersTable))
        for row in customerDf.values:
            sortedData = []
            for i in range(len(row)):
                if customerConnections['csv'][i] in customerDataOrder:
                    sortedData.insert(customerDataOrder[customerConnections['csv'][i]], row[i])
            procentString = ("%s," * len(sortedData))
            procentString = procentString[:-1]
            createCustomerInsert = 'insert into ' + customerTableName + ' values (' + procentString + ' )'
            self.cursor.execute(createCustomerInsert, tuple(sortedData))

        # article table:
        articleTableName = datasetName + '_articles'
        articleData = pd.read_csv(articleCSV)
        articleDf = pd.DataFrame(articleData)
        articleConnections = json.loads(articleConnections)
        articleParameters = 'id int PRIMARY KEY'
        id = ''
        articleDataOrder = {}
        for param in articleConnections['connections']:
            if articleConnections['connections'][param] == "id":
                if id != '':
                    print('Error: more than one linked id found while uploading customers to database.')
                    return
                articleDataOrder[param] = 0
                id = param
        if id == '':
            print('Error: no linked id found while uploading articles to database.')
            return
        for param in articleDf.columns:
            if param != id and param in articleConnections['connections']:
                if articleConnections['connections'][param] == 'title':
                    articleParameters += ', title varchar'
                elif articleConnections['connections'][param] == 'description':
                    articleParameters += ', description varchar'
                elif articleConnections['connections'][param] == 'extra info (int)':
                    articleParameters += ', ' + param + ' int'
                elif articleConnections['connections'][param] == 'extra info (varchar)' or \
                        articleConnections['connections'][param] == 'extra info (image)':
                    articleParameters += ', ' + param + ' varchar'
                elif articleConnections['connections'][param] == 'extra info (datetime)':
                    articleParameters += ', ' + param + ' datetime'
                articleDataOrder[param] = len(articleDataOrder)

        createArticlesTable = 'CREATE TABLE ' + articleTableName + '(' + articleParameters + ');'
        self.cursor.execute(sql.SQL(createArticlesTable))
        for row in articleDf.values:
            sortedData = []
            for i in range(len(row)):
                if articleConnections['csv'][i] in articleDataOrder:
                    sortedData.insert(articleDataOrder[articleConnections['csv'][i]], row[i])
            procentString = ("%s," * len(sortedData))
            procentString = procentString[:-1]
            createArticleInsert = 'insert into ' + articleTableName + ' values (' + procentString + ' )'
            self.cursor.execute(createArticleInsert, tuple(sortedData))

        # purchase table:
        purchaseTableName = datasetName + '_purchases'
        purchaseData = pd.read_csv(purchasesCSV)
        purchaseDf = pd.DataFrame(purchaseData)
        purchaseConnections = json.loads(purchaseConnections)
        createCustomersTable = 'CREATE TABLE ' + purchaseTableName + '(timestamp timestamp, user_id int, item_id int, parameter int, FOREIGN KEY (user_id) REFERENCES ' + customerTableName + '(id), FOREIGN KEY (item_id) REFERENCES ' + articleTableName + '(id));'
        self.cursor.execute(sql.SQL(createCustomersTable))

        purchaseDataOrder = {}
        for param in purchaseConnections['connections']:
            if purchaseConnections['connections'][param] == 'timestamp':
                purchaseDataOrder[param] = 0
            if purchaseConnections['connections'][param] == 'user_id':
                purchaseDataOrder[param] = 1
            if purchaseConnections['connections'][param] == 'item_id':
                purchaseDataOrder[param] = 2
            if purchaseConnections['connections'][param] == 'parameter':
                purchaseDataOrder[param] = 3

        for row in purchaseDf.values:
            sortedData = []
            for i in range(len(row)):
                if purchaseConnections['csv'][i] in purchaseDataOrder:
                    sortedData.insert(purchaseDataOrder[purchaseConnections['csv'][i]], row[i])

            procentString = ("%s," * len(sortedData))
            procentString = procentString[:-1]
            createPurchaseInsert = 'insert into ' + purchaseTableName + ' values (' + procentString + ' )'
            self.cursor.execute(createPurchaseInsert, tuple(sortedData))



        self.cursor.execute(sql.SQL('insert into "datasets" ("name","createdBy") values (%s,%s)'),[datasetName.lower(), userName])

        self.connection.commit()
        self.connection.close()
        self.cursor.close()
        print("succes")

    def change(self, datasetName, table, colm, value, id):

        if not table in ["articles", "customers"]:
            return ('{"message": "Worng table type"}', 500)

        table = datasetName + "_" + table
        self.cursor.execute(sql.SQL("UPDATE {table} SET {col}=%s WHERE id=%s").format(table=sql.Identifier(table), col=sql.Identifier(colm)),[value, id])
        self.connection.commit()
        self.connection.close()
        self.cursor.close()
        return ('{"message": "Record succesfully edit"}', 201)

    def changeApiWrapper(self, request):
        if request.method == 'POST':
            if 'dataSet' not in request.form or 'id' not in request.form or 'table' not in request.form or 'colmName' not in request.form or 'value' not in request.form:
                return ('"message":{"Missing form data."}', 400)
            table = request.form.get('table')
            colmName = request.form.get('colmName')
            value = request.form.get('value')
            itemId = request.form.get('id')
            dataSet = request.form.get('dataSet')

            returnValue = self.change(dataSet, table, colmName, value, itemId)
            return (returnValue[0], returnValue[1])
        else:
            return ('"message":{"Wrong request"}', 400)

    def getRecordById(self, datasetName, table, id):
        if not table in ["articles", "customers"]:
            return ('Worng table type', 500)
        table = datasetName + "_" + table
        columnNames = self.getColumnNames(table)

        select = 'SELECT * FROM {table} WHERE id=%s; '
        self.cursor.execute(sql.SQL(select).format(table=sql.Identifier(table)), [id])
        allrows = self.cursor.fetchall()

        if len(allrows) <= 0:
            return ("Id {id} not found in {table}".format(id=id, table=table), 400)


        returnObject = []
        for i in range (len(allrows[0])):
            returnObject.append({"dbName": columnNames[i], "dbValue": allrows[0][i]})
        self.cursor.close()
        self.connection.close()
        return (json.dumps(returnObject), 200)


    def getColumnNames(self, table):
        select = 'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N%s;'
        self.cursor.execute(sql.SQL(select).format(), [table])
        allrows = self.cursor.fetchall()
        returnList = []
        for row in allrows:
            returnList.append(row[0])
        return returnList


    def getDatasets(self):
        self.cursor.execute(sql.SQL('SELECT * FROM "datasets"'))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            item = [row[0], row[1], row[2].strftime("%m/%d/%Y %H:%M:%S")]
            returnList.append(item)
        return (json.dumps(returnList), 200)


    def getItemList(self, datasetName, offset):
        query = 'SELECT id,title,description FROM '+ datasetName +'_articles LIMIT 40 OFFSET '+offset
        self.cursor.execute(sql.SQL(query))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            item = {"itemid":row[0], "name":row[1], "desc":row[2]}
            returnList.append(item)
        return (json.dumps(returnList), 200)

    def getPeopleList(self, datasetName, offset):
        query = 'SELECT id FROM '+ datasetName +'_customers LIMIT 40 OFFSET '+offset
        self.cursor.execute(sql.SQL(query))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            item = {"personid":row[0]}
            returnList.append(item)
        return (json.dumps(returnList), 200)


    def addapt_numpy_float64(numpy_float64):
        return AsIs(numpy_float64)

    def addapt_numpy_int64(numpy_int64):
        return AsIs(numpy_int64)


    register_adapter(numpy.float64, addapt_numpy_float64)
    register_adapter(numpy.int64, addapt_numpy_int64)










