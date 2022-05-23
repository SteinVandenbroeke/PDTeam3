import datetime

import psycopg2
from psycopg2 import sql
from psycopg2 import extras

from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess
from psycopg2 import sql
import pandas as pd
from collections import Counter
from iknn import ItemKNNIterative
from typing import List
from psycopg2 import sql
from Dataset import Dataset
import json


class ABTest():
    def __init__(self, abTestId=None):
        database = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'],
                                userPassword=config_data['password'], dbhost=config_data['host'],
                                dbport=config_data['port'])
        self.connection = database.get_connection()
        self.cursor = self.connection.cursor()
        self.abTestId = abTestId
        self.algorithms = []
        self.dataset = None
        self.beginTs = None
        self.endTs = None
        self.stepSize = None
        self.topK = None
        if abTestId != None:
            self.initialize()

    def history_from_subset_interactions(self, interactions, amt_users=5) -> List[List]:
        """ Take the history of the first users in the dataset and return as list of lists"""
        user_histories = dict()
        for user_id, item_id in interactions:
            if len(user_histories) < amt_users:
                user_histories[user_id] = list()

            if user_id in user_histories:
                user_histories[user_id].append(item_id)

        return list(user_histories.values())

    def createItems(self):
        print("nu aan het doen!")

    def create(self):
        for algo in self.algorithms:
            time = self.beginTs
            print(self.topK)
            while (time < self.endTs):
                results = self.execute(self.topK, time, time + datetime.timedelta(days=algo[1]), algo[0])
                if (algo[0] == 0 or algo[0] == 1) and len(results) != 0:
                    #niet knn
                    self.cursor.execute(
                        sql.SQL('insert into "abrec" ("abtest_algorithms_id","timestamp") values (%s,%s) RETURNING "idAbRec"'),
                        [algo[3], time + datetime.timedelta(days=algo[1])])
                    idAbRec = self.cursor.fetchone()[0]


                    '''self.cursor.execute(sql.SQL(
                        'insert into abrecid_personrecid("idAbRec", personid, test_name) SELECT abrec."idAbRec" ,id AS userId, test_name FROM {table}_customers,abrec,abtest WHERE abrec."idAbRec"=%s AND abtest.test_name=%s'.format(table=self.dataset)),
                                        [idAbRec, self.abTestId])'''

                    #niet nodig voor popularity en recency aangzien elke user hetzelfde is
                    #query = 'insert into abrecid_personrecid("idAbRec", personid, test_name) SELECT %s ,id AS userId, %s FROM {table}_customers'.format(table=self.dataset)
                    #items = [idAbRec, self.abTestId]
                    #psycopg2.extras.execute_batch(self.cursor,query, [items])

                    #zet person id op 0 aangezien dit voor elke user toch hetzelfde is
                    query = 'insert into abrecid_personrecid("idAbRec", personid, test_name) VALUES(%s,0, %s)'.format(
                        table=self.dataset)
                    items = [idAbRec, self.abTestId]
                    psycopg2.extras.execute_batch(self.cursor, query, [items])

                    sqlInstert = []
                    for item in results:
                        sqlInstert.append([idAbRec, item])
                    psycopg2.extras.execute_batch(self.cursor, 'insert into "abreclist" ("idAbRec","itemId") values (%s,%s)', sqlInstert)

                elif algo[0] == 2:
                    exit("knn moet nog geimplement worden")
                    #knn

                time += datetime.timedelta(days=self.stepSize)

        print("start")
        self.connection.commit()

        query = 'insert into abrecmetric(abtest_algorithms_id, timestamp, ctr, atr7, atr30, avargeuserrevenuectr, avargeuserrevenue7, avargeuserrevenue30) SELECT CTRTable.abtest_algorithms_id, CTRTable.timeStamp, (CTRTable.CTR::float/totalRecomendationsTable.totalRecomendations) * 100 AS CTR, (AR7Table.AR7::float)/(totalRecomendationsTable.totalRecomendations*7) * 100 AS AR7, (AR30Table.AR30::float)/(totalRecomendationsTable.totalRecomendations*30) * 100 AS AR30, (AR0UTable.avaragePriceAR0/totalRecomendationsTable.totalRecomendations) AS avaragePriceAR0, (AR7UTable.avaragePriceAR7/(totalRecomendationsTable.totalRecomendations*7)) AS avaragePriceAR7, (AR30UTable.avaragePriceAR30/(totalRecomendationsTable.totalRecomendations*30)) AS avaragePriceAR30 FROM ( SELECT abrec."idAbRec", abrec.timestamp AS timeStamp, COUNT("itemId") as CTR, abtest_algorithms_id FROM abrec, abreclist, abrecid_personrecid, {table}_purchases, abtest_algorithms WHERE abrec."idAbRec" = abreclist."idAbRec" and abrec."idAbRec" = abrecid_personrecid."idAbRec" and abrecid_personrecid.test_name=%s and "itemId"={table}_purchases.item_id and abtest_algorithms.id = abrec.abtest_algorithms_id and (abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) and abrec.timestamp={table}_purchases.timestamp GROUP BY abrec.timestamp, personid, abtest_algorithms.algorithmid, abrec."idAbRec") AS CTRTable, (SELECT abrec."idAbRec", abrec.timestamp, COUNT("itemId") as AR7 FROM abrec, abreclist, abrecid_personrecid, {table}_purchases, abtest_algorithms WHERE abrec."idAbRec" = abreclist."idAbRec" and abrec."idAbRec" = abrecid_personrecid."idAbRec" and abrecid_personrecid.test_name=%s and "itemId"={table}_purchases.item_id and abtest_algorithms.id = abrec.abtest_algorithms_id and (abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) and {table}_purchases.timestamp>=abrec.timestamp and {table}_purchases.timestamp<abrec.timestamp + INTERVAL \'7 days\' GROUP BY abrec.timestamp, personid, abtest_algorithms.algorithmid, abrec."idAbRec") AS AR7Table, (SELECT abrec."idAbRec", abrec.timestamp, COUNT("itemId") as AR30 FROM abrec, abreclist, abrecid_personrecid, {table}_purchases, abtest_algorithms WHERE abrec."idAbRec" = abreclist."idAbRec" and abrec."idAbRec" = abrecid_personrecid."idAbRec" and abrecid_personrecid.test_name=%s and "itemId"={table}_purchases.item_id and abtest_algorithms.id = abrec.abtest_algorithms_id and (abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1)and {table}_purchases.timestamp>=abrec.timestamp and {table}_purchases.timestamp<abrec.timestamp + INTERVAL \'30 days\' GROUP BY abrec.timestamp, personid, abtest_algorithms.algorithmid, abrec."idAbRec") AS AR30Table, (SELECT abrec."idAbRec", abrec.timestamp, SUM({table}_purchases."parameter") as avaragePriceAR0 FROM abrec, abreclist, abrecid_personrecid, {table}_purchases, abtest_algorithms WHERE abrec."idAbRec" = abreclist."idAbRec" and abrec."idAbRec" = abrecid_personrecid."idAbRec" and abrecid_personrecid.test_name=%s and "itemId"={table}_purchases.item_id and abtest_algorithms.id = abrec.abtest_algorithms_id and (abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) and {table}_purchases.timestamp=abrec.timestamp GROUP BY abrec.timestamp, personid, abtest_algorithms.algorithmid, abrec."idAbRec") AS AR0UTable, (SELECT abrec."idAbRec", abrec.timestamp, SUM({table}_purchases."parameter") as avaragePriceAR7 FROM abrec, abreclist, abrecid_personrecid, {table}_purchases, abtest_algorithms WHERE abrec."idAbRec" = abreclist."idAbRec" and abrec."idAbRec" = abrecid_personrecid."idAbRec" and abrecid_personrecid.test_name=%s and "itemId"={table}_purchases.item_id and abtest_algorithms.id = abrec.abtest_algorithms_id and (abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) and {table}_purchases.timestamp>=abrec.timestamp and {table}_purchases.timestamp<abrec.timestamp + INTERVAL \'7 days\' GROUP BY abrec.timestamp, personid, abtest_algorithms.algorithmid, abrec."idAbRec") AS AR7UTable, (SELECT abrec."idAbRec", abrec.timestamp, SUM({table}_purchases."parameter") as avaragePriceAR30 FROM abrec, abreclist, abrecid_personrecid, {table}_purchases, abtest_algorithms WHERE abrec."idAbRec" = abreclist."idAbRec" and abrec."idAbRec" = abrecid_personrecid."idAbRec" and abrecid_personrecid.test_name=%s and "itemId"={table}_purchases.item_id and abtest_algorithms.id = abrec.abtest_algorithms_id and (abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) and {table}_purchases.timestamp>=abrec.timestamp and {table}_purchases.timestamp<abrec.timestamp + INTERVAL \'30 days\' GROUP BY abrec.timestamp, personid, abtest_algorithms.algorithmid, abrec."idAbRec") AS AR30UTable, (SELECT test."topK" * test1.totalUserCount AS totalRecomendations FROM (SELECT "topK" FROM abtest WHERE test_name=%s) as test, (SELECT COUNT("id") AS totalUserCount FROM {table}_customers) AS test1) AS totalRecomendationsTable WHERE CTRTable."idAbRec" = AR7Table."idAbRec" and AR7Table."idAbRec" = AR30Table."idAbRec" and AR30Table."idAbRec" = AR0UTable."idAbRec" and AR0UTable."idAbRec" = AR7UTable."idAbRec" and AR7UTable."idAbRec" = AR30UTable."idAbRec";'.format(
            table=self.dataset)
        self.cursor.execute(sql.SQL(query), [self.abTestId] * 7)

        self.connection.commit()
        print("nice")

    def delete(self):
        message = '{"message": "ABTest succesfully Deleted"}'
        errorCode = 201
        try:
            self.cursor.execute(sql.SQL('DELETE FROM abtest WHERE test_name=%s;'),[self.abTestId])
            self.connection.commit()
        except:
            message = '{"message": "AB Test: '+self.abTestId+' could not be deleted."}'
            errorCode = 500

        self.connection.commit()
        self.connection.close()
        self.cursor.close()
        return (message, errorCode)


    def execute(self, topKItemsCount, startDate, endDate, algorithm, users=1, k=1):
        """
        Create: function to create a new ABTest, and wil make the current ABTest te created ABTest
        @param topKItemsCount: top k items
        @param startDate: start date of the ABTest (must be between the dates of the Dataset)
        @param endDate: end date of ABTest (ust be between the dates of the Dataset and be larger than the startDate)
        @param algoritmes: algorithm id
        @param datasets: list of all used dataset id's
        """
        if (algorithm == 0):
            #popularity
            query = 'SELECT item_id, COUNT(item_id) AS itemIdCount FROM {table}_purchases WHERE "timestamp" >= %s AND "timestamp" <= %s GROUP BY item_id ORDER BY  itemIdCount DESC LIMIT %s;'.format(table=self.dataset)
            self.cursor.execute(sql.SQL(query), [startDate, endDate, topKItemsCount])
            sqlList = self.cursor.fetchall()
            topKItems = []
            for item in sqlList:
                topKItems.append(item[0])
            return topKItems
        elif (algorithm == 1):
            # recency
            query = 'SELECT timestamp, item_id FROM {table}_purchases WHERE "timestamp" >= %s AND "timestamp" <= %s'.format(
                table=self.dataset)
            self.cursor.execute(sql.SQL(query), [startDate, endDate])
            items = self.cursor.fetchall()
            sorted_result = sorted(items, key=lambda tup: tup[0])
            result = list(dict.fromkeys([x[1] for x in sorted_result]))
            result.reverse()
            return result[0:topKItemsCount]
        elif (algorithm == 2):
            alg = ItemKNNIterative(k=k, normalize=False)
            query = 'SELECT user_id, item_id FROM {table}_purchases WHERE "timestamp" >= %s AND "timestamp" <= %s'.format(
                table=self.dataset)
            self.cursor.execute(sql.SQL(query), [startDate, endDate])
            items = self.cursor.fetchall()
            alg.train(items)
            histories = self.history_from_subset_interactions(items, amt_users=users)
            recommendations = alg.recommend_all(histories, topKItemsCount)
            return recommendations

    def overviewPageData(self):
        """
        overviewPageData: gives a json format for the overview page in the interface
        """
        # print(self.abTestId)
        # print(self.dataset)
        dataSet = Dataset()
        allPoints = dataSet.getTimeStampList(self.dataset, list)

        query = 'SELECT abrecmetric.abtest_algorithms_id,timestamp,ctr,atr7,atr30, avargeuserrevenuectr, avargeuserrevenue7, avargeuserrevenue30, "interval", "K",name FROM abrecmetric, abtest_algorithms, algorithms WHERE abtest_algorithms.id=abrecmetric.abtest_algorithms_id and algorithms.id=abtest_algorithms.algorithmid and test_name=%s'
        self.cursor.execute(sql.SQL(query), [self.abTestId])
        itemssql = self.cursor.fetchall()

        algoritms = {}
        for itemsql in itemssql:

            timeItem = {}
            timeItem["ctr"] = itemsql[2]
            timeItem["ard7"] = itemsql[3]
            timeItem["ard30"] = itemsql[4]
            timeItem["arpu7"] = itemsql[5]
            timeItem["arpu30"] = itemsql[6]
            timeItem["mostRecomendedItems"] = []
            #timeItem["ctr"] = itemsql[2]
            #timeItem["ctr"] = itemsql[2]

            if itemsql[0] not in algoritms:
                algoritms[itemsql[0]] = {}
                algoritms[itemsql[0]]["trainingInterval"] = itemsql[8]
                algoritms[itemsql[0]]["points"] = {}
            algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")] = timeItem

        query = 'SELECT abtest_algorithms.id, abrec.timestamp, {dataset}_articles.title FROM abrec, abreclist, {dataset}_articles, abtest_algorithms WHERE {dataset}_articles.id=abreclist."itemId" and  abreclist."idAbRec"=abrec."idAbRec" and abrec.abtest_algorithms_id=abtest_algorithms.id and abtest_algorithms.test_name=%s;'.format(dataset=self.dataset.lower())
        self.cursor.execute(sql.SQL(query), [self.abTestId])
        itemssql = self.cursor.fetchall()
        counter = 0
        # print(algoritms)
        for itemsql in itemssql:
            if itemsql[1].strftime("%d/%m/%Y %H:%M:%S") not in algoritms[itemsql[0]]["points"]:
                algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")] = {"ctr": 0, "ard7": 0, "ard30": 0, "arpu7": 0, "arpu30":0}
            if "mostRecomendedItems" not in algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")]:
                algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")]["mostRecomendedItems"] = []
            algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")]["mostRecomendedItems"].append(itemsql[2])
            counter += 1


        query = 'SELECT dataset, stepsize, "topK" FROM abtest WHERE test_name=%s'
        self.cursor.execute(sql.SQL(query), [self.abTestId])
        itemsql = self.cursor.fetchone()
        parameters = {}
        parameters["datasetId"] = itemsql[0]
        parameters["stepSize"] = itemsql[1]
        parameters["topK"] = itemsql[2]

        query = 'SELECT abtest_algorithms.id, algorithms.name FROM abtest_algorithms, algorithms WHERE abtest_algorithms.algorithmid=algorithms.id and abtest_algorithms.test_name=%s;'
        self.cursor.execute(sql.SQL(query), [self.abTestId])
        itemssql = self.cursor.fetchall()
        parameters["idAlgorithm"] = {}
        for itemsql in itemssql:
            parameters["idAlgorithm"][itemsql[0]] = itemsql[1]

        query = 'SELECT timestamp, "Purchases", "Revenue", "activeUsersAmount" FROM "dataSetStat" WHERE "dataSetName"=%s;'
        self.cursor.execute(sql.SQL(query), [self.dataset])
        itemssql = self.cursor.fetchall()

        NotAlgDependent = {}
        for itemsql in itemssql:
            NotAlgDependent[itemsql[0].strftime("%d/%m/%Y %H:%M:%S")] = {"Purchases": itemsql[1], "Revenue": itemsql[2], "activeUsersAmount": itemsql[3]}

        NotAlgDependentList = []
        algoritmsList = {}
        for date in allPoints:
            for algoritmKey, algoritmKeyValue in algoritms.items():
                if algoritmKey not in algoritmsList:
                    algoritmsList[algoritmKey] = {"trainingInterval": algoritmKeyValue["trainingInterval"], "points": []}
                if date in algoritmKeyValue["points"]:
                    algoritmsList[algoritmKey]["points"].append(algoritmKeyValue["points"][date])
                else:
                    algoritmsList[algoritmKey]["points"].append({"ctr": 0, "ard7": 0, "ard30": 0, "arpu7": 0, "arpu30":0, "mostRecomendedItems": []})

            if date in NotAlgDependent:
                NotAlgDependentList.append(NotAlgDependent[date])
            else:
                NotAlgDependentList.append({"Purchases": 0, "Revenue": 0, "activeUsersAmount": 0})

        returnDict = {"NotAlgDependent":NotAlgDependentList, "parameters":parameters, "algorithms": algoritmsList, "points": allPoints}

        return (returnDict, 200)

    def getTotalActiveUsers(self, fromDate, toDate):
        query = 'SELECT count(user_id) AS activeUsersAmount FROM (SELECT DISTINCT user_id FROM {dataset}_purchases WHERE {dataset}_purchases.timestamp >= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') and {dataset}_purchases.timestamp <= to_date(%s, \'DD/MM/YYYY HH24:MI:SS\')) AS temp;'.format(dataset=self.dataset.lower())
        self.cursor.execute(sql.SQL(query), [fromDate, toDate])
        itemsql = self.cursor.fetchone()
        return (json.dumps(itemsql[0]), 200)

    def userOverviewData(self, min=None, max=None):
        """
        userOverviewData: gives a json format for the user page from AB test
        @param min: from where (used to limit the user list)
        @param max: to where (used to limit the user list)
        @return: json for all users in ABTest
        """
        print("User data in ABtest")

    def itemOverviewData(self, min, max):
        """
        vitemOverviewData: gives a json format for the item page from AB test
        @param min:from where (used to limit the user list)
        @param max:to where (used to limit the user list)
        @return:json for all items in ABTest
        """
        print("item data in ABtest")

    def getABtests(self):
        self.cursor.execute(sql.SQL('SELECT * FROM "abtest"'))
        data = self.cursor.fetchall()
        returnList = []
        max_alg_count = 0
        for row in data:
            alg_count = 0
            item = [row[0], row[1], row[4]]
            query = 'SELECT * FROM "abtest_algorithms" WHERE test_name=%s'
            self.cursor.execute(sql.SQL(query), [row[0]])
            alg_data = self.cursor.fetchall()
            for alg_row in alg_data:
                alg_count += 1
                query = 'SELECT name FROM "algorithms" WHERE id=%s'
                self.cursor.execute(sql.SQL(query), [alg_row[2]])
                alg_name = self.cursor.fetchall()[0][0]
                alg_object = alg_name + ", interval: " + str(alg_row[3])
                if alg_row[4] > 0:
                    alg_object += ", K: " + str(alg_row[4])
                item.append(alg_object)
            if alg_count > max_alg_count:
                max_alg_count = alg_count
            returnList.append(item)
        returnList.append(max_alg_count)
        return (json.dumps(returnList), 200)

    def getUsersFromABTest(self, startDate, endDate):
        self.cursor.execute(sql.SQL('SELECT id, SUM(p.parameter),COUNT(p.user_id),SUM(case when p.timestamp >= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') AND p.timestamp <= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') then 1 else 0 end) FROM {table}_customers,{table}_purchases AS p WHERE id = user_id GROUP BY id'.format(table=self.dataset)), [startDate,endDate])
        users = self.cursor.fetchall()
        returnList = []
        for row in users:
            returnList.append(row)
        return (json.dumps([returnList]), 200)

    def getItemsFromABTest(self, startDate, endDate):
        self.cursor.execute(sql.SQL('SELECT a.id,a.title, COUNT(p.item_id), SUM(case when p.timestamp >= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') AND p.timestamp <= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') then 1 else 0 end) FROM {table}_articles AS a, {table}_purchases AS p WHERE p.item_id = a.id GROUP BY a.id'.format(table=self.dataset)), [startDate,endDate])
        items = self.cursor.fetchall()
        returnList = []
        for row in items:
            returnList.append(row)
        return (json.dumps(returnList), 200)

    def getDatasetIdFromABTest(self, abTestId):
        self.cursor.execute(sql.SQL('SELECT dataset FROM "abtest" WHERE test_name=%s'), [abTestId])
        setId = self.cursor.fetchall()[0][0]
        return (json.dumps(setId), 200)


    def initialize(self, abTestId=None, algorithms=None, dataset=None, beginTs=None, endTs=None, stepSize=None,
                   topK=None):
        """
        initializes the ABTest information, by default it will load the date on abTestId from the database
        @param abTestId: the id (name) of the ABTest
        @param algorithms: list of algoritmhs ([["name",[k]],["name",[k]]])
        @param dataset: the dataset id (name)
        @param beginTs: startdate
        @param endTs: endDate
        @param stepSize: the stepsize
        @return:
        """

        if self.abTestId == None and abTestId != None:
            self.abTestId = abTestId
            select = 'INSERT INTO abtest ("test_name", "dataset", "begin_ts", "end_ts", "topK", "stepsize") VALUES (%s,%s,to_date(%s, \'DD/MM/YYYY\'),to_date(%s, \'DD/MM/YYYY\'),%s,%s);'
            self.cursor.execute(sql.SQL(select), [abTestId, dataset, beginTs, endTs, topK, stepSize])

            for algorithm in algorithms:
                select = 'INSERT INTO abtest_algorithms ("test_name", "algorithmid", "interval", "K") VALUES (%s,%s,%s,%s);'
                self.cursor.execute(sql.SQL(select), [abTestId, algorithm[0], algorithm[1][0], algorithm[2]])
            self.connection.commit()
        elif self.abTestId == None and abTestId == None:
            exit("No data to initialize")

        select = 'SELECT "test_name", "dataset", "begin_ts", "end_ts", "topK", "stepsize" FROM abtest WHERE test_name = %s;'
        self.cursor.execute(sql.SQL(select).format(), [self.abTestId])
        data = self.cursor.fetchone()

        self.algorithms = []
        select = 'SELECT algorithmid, "interval", "K", id FROM abtest_algorithms WHERE test_name=%s;'
        self.cursor.execute(sql.SQL(select).format(), [self.abTestId])
        algdata = self.cursor.fetchall()
        for item in algdata:
            self.algorithms.append([item[0], item[1], item[2], item[3]])

        self.dataset = data[1]
        self.beginTs = data[2]
        self.endTs = data[3]
        self.topK = data[4]
        self.stepSize = data[5]
