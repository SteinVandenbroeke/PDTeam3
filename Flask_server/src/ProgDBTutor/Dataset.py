import json
import math
from datetime import datetime,timedelta
import pandas as pd
from quote_data_access import DBConnection
from config import config_data
import psycopg2
from psycopg2 import sql
from psycopg2 import extras
import numpy
from psycopg2.extensions import register_adapter, AsIs

class Dataset():
    def __init__(self, datasetId=None):
        # connect to self.database
        database = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'],
                                userPassword=config_data['password'], dbhost=config_data['host'],
                                dbport=config_data['port'])
        self.connection = database.get_connection()
        self.cursor = self.connection.cursor()
        self.datasetId = datasetId

    def __del__(self):
        """
        Database connectie correct sluiten
        """
        self.cursor.close()
        self.connection.close()

    def add(self, customerCSV, articleCSV, purchasesCSV, customerConnections, articleConnections,
            purchaseConnections, userName):
        """
        add: Adds a dataset with the given parameters to the database
        @param datasetName: Name of the dataset
        @param customerCSV: csv file containing customer information
        @param articleCSV: csv file containing article information
        @param purchasesCSV: csv file contianing customer/article interactions
        @param customerConnections:
        @param articleConnections:
        @param purchaseConnections:
        @param userName: username of the user creating the dataset
        """

        # customer table:
        print("add Customers")
        customerTableName = self.datasetId.lower() + '_customers'
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
                elif customerConnections['connections'][param] == 'extra info (double)':
                    type = 'float'
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
        print("customers added")

        # article table:
        print("add articles")
        articleTableName = self.datasetId + '_articles'
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
                elif articleConnections['connections'][param] == 'extra info (double)':
                    articleParameters += ', ' + param + ' float'
                elif articleConnections['connections'][param] == 'extra info (varchar)':
                    articleParameters += ', ' + param + ' varchar'
                elif articleConnections['connections'][param] == 'extra info (image)':
                    articleParameters += ', image varchar'
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
        print("articles added")

        # purchase table:
        print("add purchases")
        purchaseTableName = self.datasetId + '_purchases'
        purchaseData = pd.read_csv(purchasesCSV)
        purchaseDf = pd.DataFrame(purchaseData)
        purchaseConnections = json.loads(purchaseConnections)


        tableDict = {'timestamp': "timestamp timestamp", 'user_id': " user_id int",'item_id': "item_id int",'parameter': " parameter float",'timestamp': "timestamp timestamp"}
        volgordeTables = ""
        for param in purchaseConnections['csv']:
            if param in purchaseConnections['connections']:
                volgordeTables += tableDict[purchaseConnections['connections'][param]] + ', '

        createCustomersTable = 'CREATE TABLE ' + purchaseTableName + '(' + volgordeTables + 'FOREIGN KEY (user_id) REFERENCES ' + customerTableName + '(id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (item_id) REFERENCES ' + articleTableName + '(id) ON UPDATE CASCADE ON DELETE CASCADE);'
        self.cursor.execute(sql.SQL(createCustomersTable))

        procentString = ("%s," * 4)
        procentString = procentString[:-1]
        createPurchaseInsert = 'insert into ' + purchaseTableName + ' values (' + procentString + ' )'

        customerAmpunt = len(customerDf.values)
        articleAmount = len(articleDf.values)
        purchaseAmount = len(purchaseDf.values)
        # finalData.append(tuple(sortedData))
        psycopg2.extras.execute_batch(self.cursor,createPurchaseInsert, purchaseDf.values)
        self.cursor.execute(sql.SQL('insert into "datasets" ("name","customerAmount","itemAmount","purchaseAmount","createdBy") values (%s,%s,%s,%s,%s)'),[self.datasetId.lower(), customerAmpunt, articleAmount,purchaseAmount, userName])
        print("purchases added")

        self.connection.commit()

        dataSetStats = 'INSERT INTO "dataSetStat" ("dataSetName", timestamp, "Purchases", "Revenue", "activeUsersAmount") SELECT \'{table1}\' AS datasetname, {table1}_purchases.timestamp AS timestamp, COUNT({table1}_purchases.item_id) AS purchases, SUM({table1}_purchases.parameter) AS Revenue, COUNT(DISTINCT {table1}_purchases.user_id) AS activeusersamount FROM {table1}_purchases GROUP BY {table1}_purchases.timestamp;'.format(table1=self.datasetId.lower())
        self.cursor.execute(sql.SQL(dataSetStats))

        self.connection.commit()
        self.connection.close()
        self.cursor.close()

    def change(self, table, colm, value, id):
        """
        Edits a record in the dataset.
        The value of the given column of the row with the given id in the given table of the dataset is changed to the given value.
        @param datasetName Name of the dataset
        @param table Name of the table
        @param colm Name of the column
        @param value Value to change to
        @param id Identifier to match the row with
        """

        if not table in ["articles", "customers"]:
            return ('{"message": "Worng table type"}', 500)

        table = self.datasetId + "_" + table
        self.cursor.execute(sql.SQL("UPDATE {table} SET {col}=%s WHERE id=%s").format(table=sql.Identifier(table), col=sql.Identifier(colm)), [value, id])
        self.connection.commit()
        if colm == "id":
            self.setAllABTestsOutdated()
        self.connection.close()
        self.cursor.close()
        return ('{"message": "Record succesfully edit"}', 201)

    def changeApiWrapper(self, request):
        """
        Function to change data of the dataset with a request: with form data: table, colmName, value, id
        @param request:
        @return:
        """
        if request.method == 'POST':
            if 'dataSet' not in request.form or 'id' not in request.form or 'table' not in request.form or 'colmName' not in request.form or 'value' not in request.form:
                return ('"message":{"Missing form data."}', 400)
            table = request.form.get('table')
            colmName = request.form.get('colmName')
            value = request.form.get('value')
            itemId = request.form.get('id')

            returnValue = self.change(table, colmName, value, itemId)
            return (returnValue[0], returnValue[1])
        else:
            return ('"message":{"Wrong request"}', 400)

    def getRecordById(self, table, id):
        """
        Get an dataset item of table by id
        @param table: table of the item (articles, customers, purchases)
        @param id: id of thr record
        @return: (json info, html code)
        """
        if not table in ["articles", "customers", "purchases"]:
            return ('Worng table type', 500)
        table = self.datasetId + "_" + table
        columnNames = self.getColumnNames(table)
        columnString = ''
        for column in columnNames:
            columnString += column
            columnString += ', '
        columnString = columnString[:-2]

        if table == self.datasetId + "_purchases":
            select = 'SELECT '+columnString+' FROM {table} WHERE user_id=%s; '
        else:
            select = 'SELECT '+columnString+' FROM {table} WHERE id=%s; '
        self.cursor.execute(sql.SQL(select).format(table=sql.Identifier(table)), [id])
        allrows = self.cursor.fetchall()

        if len(allrows) <= 0:
            return ("Id {id} not found in {table}".format(id=id, table=table), 400)


        returnObject = []
        for i in range (len(allrows[0])):
            value = allrows[0][i]
            if type(value) is not str:
                if math.isnan(value):
                    value = "NONE"
            if type(allrows[0][i]) is datetime:
                value = value.strftime("%m/%d/%Y %H:%M:%S")
            returnObject.append({"dbName": columnNames[i], "dbValue": value})
        self.cursor.close()
        self.connection.close()
        return (json.dumps(returnObject), 200)

    def getColumnNames(self, table):
        """
        Return a list of all column names of the given table of the dataset
        @param table: name of the table
        """
        select = 'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N%s;'
        self.cursor.execute(sql.SQL(select).format(), [table])
        allrows = self.cursor.fetchall()
        returnList = []
        for row in allrows:
            returnList.append(row[0])
        return returnList

    def getDatasets(self):
        """
        Return the list of dataset names of all datasets in the database
        """
        self.cursor.execute(sql.SQL('SELECT * FROM "datasets"'))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            item = [row[0], row[4], row[5].strftime("%d/%m/%Y %H:%M:%S")]
            returnList.append(item)
        return (json.dumps(returnList), 200)

    def deleteDataset(self):
        """
        Deletes the dataset with the given name
        """
        message = '{"message": "Dataset succesfully Deleted"}'
        errorCode = 201
        try:
            query = 'DROP TABLE ' + self.datasetId + '_articles CASCADE'
            self.cursor.execute(sql.SQL(query))
            self.connection.commit()
        except:
            message = '{"message": "Dataset Table ' + self.datasetId + '_articles was not found."}'
            errorCode = 500
        try:
            query = 'DROP TABLE ' + self.datasetId + '_customers CASCADE'
            self.cursor.execute(sql.SQL(query))
            self.connection.commit()
        except:
            message = '{"message": "Dataset Table ' + self.datasetId + '_customers was not found."}'
            errorCode = 500
        try:
            query = 'DROP TABLE ' + self.datasetId + '_purchases CASCADE'
            self.cursor.execute(sql.SQL(query))
            self.connection.commit()
        except:
            message = '{"message": "Dataset Table ' + self.datasetId + '_purchases was not found."}'
            errorCode = 500
        try:
            self.cursor.execute(sql.SQL('DELETE FROM datasets WHERE name=%s'), [self.datasetId])
            self.connection.commit()
        except:
            message = '{"message": "Dataset ' + self.datasetId + ' was not found"}'
            errorCode = 500

        self.connection.close()
        self.cursor.close()
        return (message, errorCode)

    def deletePerson(self, personId):
        """
        Deletes a person from the given dataset
        @param personId: Identifier for the person
        """
        try:
            self.cursor.execute(sql.SQL('DELETE FROM {table}_customers WHERE id=%s'.format(table=self.datasetId)), [personId])
            self.cursor.execute(sql.SQL('UPDATE datasets SET "customerAmount"="customerAmount"-1 WHERE name=%s'),[self.datasetId])
            self.connection.commit()
        except:
            return ('{"message": "Could not delete user: "'+personId+'}', 500)
        finally:
            self.setAllABTestsOutdated()
            self.connection.close()
            self.cursor.close()
        return ('{"message": "User succesfully deleted"}', 201)

    def deleteItem(self, itemId):
        """
        Deletes an item from the given dataset
        @param itemId: Identifier for the item
        """
        query = 'DELETE FROM ' + self.datasetId + '_articles WHERE id=' + itemId
        try:
            self.cursor.execute(sql.SQL('DELETE FROM {table}_articles WHERE id=%s'.format(table=self.datasetId)), [itemId])
            self.cursor.execute(sql.SQL('UPDATE datasets SET "itemAmount"="itemAmount"-1 WHERE name=%s'), [self.datasetId])
            self.connection.commit()
        except:
            return ('{"message": "Could not delete item: "'+itemId+'}', 500)
        finally:
            self.setAllABTestsOutdated()
            self.connection.close()
            self.cursor.close()
        return ('{"message": "User succesfully deleted"}', 201)


    def getItemList(self, offset):
        """
        Gets a list of items in the given dataset, limited to 40 from the given offset
        @param offset: Given offset to start list from
        """
        query = 'SELECT id,title,description FROM ' + self.datasetId + '_articles LIMIT 40 OFFSET ' + offset
        self.cursor.execute(sql.SQL(query))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            item = {"itemid": row[0], "name": row[1], "desc": row[2]}
            returnList.append(item)
        return (json.dumps(returnList), 200)

    def getPeopleList(self, offset):
        """
        Gets a list of people in the given dataset, limited to 40 from the given offset
        @param offset: Given offset to start list from
        """
        query = 'SELECT id FROM ' + self.datasetId + '_customers LIMIT 40 OFFSET ' + offset
        self.cursor.execute(sql.SQL(query))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            item = {"personid": row[0]}
            returnList.append(item)
        return (json.dumps(returnList), 200)

    def getPurchases(self, userName):
        """
        Gets a list of interactions (purchases) in the given dataset for the given user.
        @param userName: customer in the dataset to return purchases for
        """
        columnNames = self.getColumnNames(self.datasetId + '_purchases')
        query = 'SELECT * FROM ' + self.datasetId + '_purchases WHERE user_id=' + userName
        self.cursor.execute(sql.SQL(query))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            returnItem = {}
            for i in range(len(row)):
                if type(row[i]) is datetime:
                    returnItem[columnNames[i]] = row[i].strftime("%d/%m/%Y %H:%M:%S")
                else:
                    returnItem[columnNames[i]] = row[i]
            returnList.append(returnItem)
        return (json.dumps(returnList), 200)

    def getTimeStampList(self, format=list, fromDate = None, toDate = None):
        """
        Returns an ordered list of the different timestamps that are present in the dataset between the given starting
        and ending dates.
        @param format: format to return list in (json or python list)
        @param fromDate: starting date
        @param toDate: ending date
        """
        #if dataset != None and not dataset.isalnum():
           # return ('"message":{"Wrong dataset name"}', 412)


        try:
            if fromDate == None:
                self.cursor.execute(sql.SQL('SELECT timestamp FROM  {table}_purchases ORDER BY timestamp ASC LIMIT 1'.format(table=self.datasetId)))
                fromDate = self.cursor.fetchone()[0]
            if toDate == None:
                self.cursor.execute(sql.SQL('SELECT timestamp FROM  {table}_purchases ORDER BY timestamp DESC LIMIT 1'.format(table=self.datasetId)))
                toDate = self.cursor.fetchone()[0]

            delta = toDate - fromDate  # as timedelta
            returnList = [(fromDate + timedelta(days=i)).strftime("%d/%m/%Y %H:%M:%S") for i in range(delta.days + 1)]
            if format == json:
                return (json.dumps(returnList), 200)
            elif format == list:
                return returnList
        except:
            return ('"message":{"Wrong dataset name"}', 412)

    def getArticleCount(self):
        """
        Returns total amount of articles in the given dataset
        """
        self.cursor.execute(sql.SQL('SELECT "itemAmount" FROM datasets WHERE name=%s'), [self.datasetId])
        count = self.cursor.fetchall()[0][0]
        return (json.dumps(count), 200)

    def getCustomerCount(self, webReturn=True):
        """
        Returns total amount of customers in the given dataset
        """
        self.cursor.execute(sql.SQL('SELECT "customerAmount" FROM datasets WHERE name=%s'),[self.datasetId])
        count = self.cursor.fetchall()[0][0]
        if not webReturn:
            return count
        return (json.dumps(count), 200)

    def getAmounts(self):
        """
        Returns total amount of articles, customers and purchases in the given dataset
        """

        self.cursor.execute(sql.SQL('SELECT "customerAmount", "itemAmount", "purchaseAmount" FROM datasets WHERE name=%s'),[self.datasetId])
        amounts = self.cursor.fetchall()
        return (json.dumps(amounts[0]), 200)

    def setAllABTestsOutdated(self):
        """
        Set all abTests linked to current datasetId to outdated
        @return:
        """
        self.cursor.execute(sql.SQL('UPDATE abtest SET status=0 WHERE dataset=%s'), [self.datasetId])
        self.connection.commit()

    def addapt_numpy_float64(numpy_float64):
        return AsIs(numpy_float64)

    def addapt_numpy_int64(numpy_int64):
        return AsIs(numpy_int64)


    register_adapter(numpy.float64, addapt_numpy_float64)
    register_adapter(numpy.int64, addapt_numpy_int64)










