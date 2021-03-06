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
from flask import make_response, abort


class ABTest():
    def __init__(self, abTestId=None, userName=None):
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
        self.lastSendTime = None
        self.userName = userName

        if self.userName != None and self.abTestId != None:
            self.checkUser()

        if abTestId != None:
            self.initialize()

    def __del__(self):
        """
        Closes the Database connection
        """
        print("close db connection")
        self.cursor.close()
        self.connection.close()

    def checkUser(self):
        """
        checkUser: checks and returns if the user has no permissions to watch te AB-test
        """
        select = 'SELECT COUNT(test_name) FROM abtest WHERE test_name = %s and username = %s;'
        self.cursor.execute(sql.SQL(select).format(), [self.abTestId, self.userName])
        data = self.cursor.fetchone()
        if data[0] != 1:
            abort(make_response("No permission to this A/B test", 401))

    def history_from_subset_interactions(self, interactions, amt_users=5) -> List[List]:
        """
        history_from_subset_interactions: Take the history of the first users in the dataset and return as list of lists
        @param interactions: all previous interaction of users
        @param amt_users: How many users that have to be checked
        """
        user_histories = dict()

        for user_id, item_id in interactions:
            if len(user_histories) < amt_users and user_id not in user_histories:
                user_histories[user_id] = list()

            if user_id in user_histories:
                user_histories[user_id].append(item_id)

        return list(user_histories.keys()), list(user_histories.values())

    def reset(self, loadingSocket = None):
        """
        reset: Re-runs the AB-Test
        @param loadingSocket: WebSocket for sending the time estimation about the AB-test creation
        """
        self.delete()
        algTemp = []
        for alg in self.algorithms:
            algTemp.append([alg[0],[alg[1]],alg[2]])
        abTestId = self.abTestId
        self.abTestId = None
        self.initialize(abTestId, algTemp, self.dataset, self.beginTs.strftime("%d/%m/%Y"), self.endTs.strftime("%d/%m/%Y"), self.stepSize, self.topK, self.userName)
        self.create(loadingSocket)

    def create(self, loadingSocket = None):
        """
        Create and runs the AB test. After running the algorithms, calculated information is inserted into the database.
        @param loadingSocket: WebSocket for sending the time estimation about the AB-test creation
        """
        try:
            print("calculate insert recomended")
            self.calculateAndInsertRecomended(loadingSocket)
            self.sendTimeEstimation(loadingSocket, None, "Almost")
            print("calculate metrics")
            self.calculateMetrics()
            self.sendTimeEstimation(loadingSocket, None, "Done")
            self.updateStatus(1)
        except:
            print("failed")
            self.sendTimeEstimation(loadingSocket, None, "Failed")
            self.updateStatus(3)

    def calculateAndInsertRecomended(self, loadingSocket):
        """
        Runs all recomendation algoritms for the ab test, and insert them into the DB
        @param loadingSocket: WebSocket for sending the time estimation about the AB-test creation
        """
        totalDurationMicroSec = 0
        lastXDurationsMicroSec = []
        xDurations = ((self.endTs - self.beginTs) / self.stepSize).days
        loopCounter = 0
        algoritmCounter = 0
        for algo in self.algorithms:
            time = self.beginTs
            algoritmCounter += 1

            startTime = datetime.datetime.now()
            while (time + datetime.timedelta(days=algo[1]) <= self.endTs):
                loopCounter += 1

                results = self.execute(self.topK, time, time + datetime.timedelta(days=algo[1]), algo[0], algo[2])
                if (algo[0] == 0 or algo[0] == 1) and len(results) != 0:
                    # niet knn
                    self.cursor.execute(
                        sql.SQL(
                            'insert into "abrec" ("abtest_algorithms_id","timestamp") values (%s,%s) RETURNING "idAbRec"'),
                        [algo[3], time + datetime.timedelta(days=algo[1])])
                    idAbRec = self.cursor.fetchone()[0]

                    # zet person id op 0 aangezien dit voor elke user toch hetzelfde is
                    query = 'insert into abrecid_personrecid("idAbRec", personid, test_name) VALUES(%s,0, %s)'.format(
                        table=self.dataset)
                    items = [idAbRec, self.abTestId]
                    psycopg2.extras.execute_batch(self.cursor, query, [items])

                    sqlInstert = []
                    for item in results:
                        sqlInstert.append([idAbRec, item])
                    psycopg2.extras.execute_batch(self.cursor,
                                                  'insert into "abreclist" ("idAbRec","itemId") values (%s,%s)',
                                                  sqlInstert)

                elif algo[0] == 2:
                    for customer, recommendations in results.items():
                        if len(recommendations) > 0:
                            self.cursor.execute(
                                sql.SQL(
                                    'insert into "abrec" ("abtest_algorithms_id","timestamp") values (%s,%s) RETURNING "idAbRec"'),
                                [algo[3], time + datetime.timedelta(days=algo[1])])
                            idAbRec = self.cursor.fetchone()[0]


                            query = 'insert into abrecid_personrecid("idAbRec", personid, test_name) VALUES(%s, %s, %s)'.format(
                            table=self.dataset)
                            items = [idAbRec, customer, self.abTestId]
                            psycopg2.extras.execute_batch(self.cursor, query, [items])

                            for rec in recommendations:
                                self.cursor.execute(sql.SQL(
                                'insert into "abreclist" ("idAbRec","itemId") values (%s,%s)'), [idAbRec, rec])

                print(time, "done")

                time += datetime.timedelta(days=self.stepSize)
                endTime = datetime.datetime.now()
                difference = endTime - startTime
                startTime = datetime.datetime.now()
                totalDurationMicroSec += difference.total_seconds() * 1000000
                lastXDurationsMicroSec.insert(0, difference.total_seconds() * 1000000)
                if len(lastXDurationsMicroSec) >= xDurations:
                    lastXDurationsMicroSec.pop()

                gemDurationMicroSecPerDay = sum(lastXDurationsMicroSec) / len(
                    lastXDurationsMicroSec)  # totalDurationMicroSec/loopCounter
                toGoDays = ((self.endTs - time) / self.stepSize).days + (
                            (self.endTs - self.beginTs) / self.stepSize).days * (len(self.algorithms) - algoritmCounter)
                timeEstimation = gemDurationMicroSecPerDay * toGoDays
                self.sendTimeEstimation(loadingSocket, timeEstimation, totalDurationMicroSec)
        self.connection.commit()

    def calculateMetrics(self):
        """
        calculateMetrics: Inserts calculations of information about the recommendations of this AB-Test into the database
        """
        query = 'insert into abrecmetric(abtest_algorithms_id, timestamp, ctr, atr7, atr30, revenuectr, revenue7, revenue30, purchases) SELECT CTRTable.abtest_algorithms_id, CTRTable.timeStamp, (CTRTable.CTR::float/totalRecomendationsTable.totalRecomendations) * 100 AS CTR,        (AR7Table.AR7::float)/(totalRecomendationsTable.totalRecomendations*7) * 100 AS AR7,        (AR30Table.AR30::float)/(totalRecomendationsTable.totalRecomendations*30) * 100 AS AR30,        (AR0UTable.avaragePriceAR0) AS PriceAR0, (AR7UTable.avaragePriceAR7) AS PriceAR7,        (AR30UTable.avaragePriceAR30) AS PriceAR30, CTRTable.CTR AS purchases FROM      (SELECT test."topK" * test1.totalUserCount AS totalRecomendations FROM (SELECT "topK" FROM abtest WHERE test_name=%s) as test,                                                                             (SELECT COUNT("id") AS totalUserCount FROM  {table}_customers) AS test1) AS totalRecomendationsTable,      (SELECT abrec."abtest_algorithms_id", abrec.timestamp AS timeStamp, COUNT("itemId") as CTR      FROM abrec,abreclist,abrecid_personrecid,abtest, {table}_purchases,abtest_algorithms      WHERE abrec."idAbRec" = abreclist."idAbRec" and        abrec."idAbRec" = abrecid_personrecid."idAbRec" and        abrecid_personrecid.test_name=%s and        "itemId"= {table}_purchases.item_id and        abtest_algorithms.id = abrec.abtest_algorithms_id and        ((abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) or (abtest_algorithms.algorithmid = 2 and abrecid_personrecid."idAbRec"=abreclist."idAbRec" and  {table}_purchases.user_id=abrecid_personrecid.personid)) and        abtest.test_name=abrecid_personrecid.test_name and         {table}_purchases.timestamp>=abrec.timestamp and         {table}_purchases.timestamp<abrec.timestamp + (abtest."stepsize" || \' days\')::interval      GROUP BY abrec.timestamp, abtest_algorithms.algorithmid, abrec.abtest_algorithms_id) AS CTRTable      FULL JOIN       (SELECT abrec."abtest_algorithms_id", abrec.timestamp, COUNT("itemId") as AR7      FROM abrec, abreclist, abrecid_personrecid, abtest,  {table}_purchases, abtest_algorithms      WHERE abrec."idAbRec" = abreclist."idAbRec" and        abrec."idAbRec" = abrecid_personrecid."idAbRec" and        abrecid_personrecid.test_name=%s and        "itemId"= {table}_purchases.item_id and        abtest_algorithms.id = abrec.abtest_algorithms_id and        ((abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) or (abtest_algorithms.algorithmid = 2 and abrecid_personrecid."idAbRec"=abreclist."idAbRec" and  {table}_purchases.user_id=abrecid_personrecid.personid)) and        abtest.test_name=abrecid_personrecid.test_name and         {table}_purchases.timestamp>=abrec.timestamp and         {table}_purchases.timestamp<abrec.timestamp + ((7 + abtest.stepsize) || \' days\')::interval      GROUP BY abrec.timestamp, abtest_algorithms.algorithmid, abrec."abtest_algorithms_id") AS AR7Table           ON CTRTable."abtest_algorithms_id"=AR7Table."abtest_algorithms_id" and CTRTable."timestamp"= AR7Table."timestamp"      FULL JOIN       (SELECT abrec."abtest_algorithms_id", abrec.timestamp, COUNT("itemId") as AR30      FROM abrec, abreclist, abrecid_personrecid, abtest, {table}_purchases, abtest_algorithms      WHERE abrec."idAbRec" = abreclist."idAbRec" and        abrec."idAbRec" = abrecid_personrecid."idAbRec" and        abrecid_personrecid.test_name=%s and        "itemId"= {table}_purchases.item_id and        abtest_algorithms.id = abrec.abtest_algorithms_id and        ((abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) or (abtest_algorithms.algorithmid = 2 and abrecid_personrecid."idAbRec"=abreclist."idAbRec" and  {table}_purchases.user_id=abrecid_personrecid.personid)) and        abtest.test_name=abrecid_personrecid.test_name and         {table}_purchases.timestamp>=abrec.timestamp and         {table}_purchases.timestamp<abrec.timestamp + ((30 + abtest.stepsize) || \' days\')::interval      GROUP BY abrec.timestamp, abtest_algorithms.algorithmid, abrec."abtest_algorithms_id") AS AR30Table           ON AR7Table."abtest_algorithms_id"=AR30Table."abtest_algorithms_id" and AR7Table."timestamp"= AR30Table."timestamp"      FULL JOIN       (SELECT abrec."abtest_algorithms_id", abrec.timestamp, (SUM( {table}_purchases."parameter")) as avaragePriceAR0      FROM abrec, abreclist, abrecid_personrecid, abtest, {table}_purchases, abtest_algorithms      WHERE abrec."idAbRec" = abreclist."idAbRec" and        abrec."idAbRec" = abrecid_personrecid."idAbRec" and        abrecid_personrecid.test_name=%s and        "itemId"= {table}_purchases.item_id and        abtest_algorithms.id = abrec.abtest_algorithms_id and        ((abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) or (abtest_algorithms.algorithmid = 2 and abrecid_personrecid."idAbRec"=abreclist."idAbRec" and  {table}_purchases.user_id=abrecid_personrecid.personid)) and        abtest.test_name=abrecid_personrecid.test_name and         {table}_purchases.timestamp>=abrec.timestamp and         {table}_purchases.timestamp<abrec.timestamp + (abtest.stepsize || \' days\')::interval      GROUP BY abrec.timestamp, abtest_algorithms.algorithmid, abrec."abtest_algorithms_id") AS AR0UTable           ON AR30Table."abtest_algorithms_id"=AR0UTable."abtest_algorithms_id" and AR30Table."timestamp"= AR0UTable."timestamp"      FULL JOIN       (SELECT abrec."abtest_algorithms_id", abrec.timestamp,(SUM( {table}_purchases."parameter")) as avaragePriceAR7      FROM abrec, abreclist, abrecid_personrecid, abtest, {table}_purchases, abtest_algorithms      WHERE abrec."idAbRec" = abreclist."idAbRec" and        abrec."idAbRec" = abrecid_personrecid."idAbRec" and        abrecid_personrecid.test_name=%s and        "itemId"= {table}_purchases.item_id and        abtest_algorithms.id = abrec.abtest_algorithms_id and        ((abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) or (abtest_algorithms.algorithmid = 2 and abrecid_personrecid."idAbRec"=abreclist."idAbRec" and  {table}_purchases.user_id=abrecid_personrecid.personid)) and        abtest.test_name=abrecid_personrecid.test_name and         {table}_purchases.timestamp>=abrec.timestamp and         {table}_purchases.timestamp<abrec.timestamp + ((7 + abtest.stepsize) || \' days\')::interval      GROUP BY abrec.timestamp, abtest_algorithms.algorithmid, abrec."abtest_algorithms_id") AS AR7UTable           ON AR0UTable."abtest_algorithms_id"=AR7UTable."abtest_algorithms_id" and AR0UTable."timestamp"= AR7UTable."timestamp"      FULL JOIN       (SELECT abrec."abtest_algorithms_id", abrec.timestamp, (SUM( {table}_purchases."parameter")) as avaragePriceAR30      FROM abrec, abreclist, abrecid_personrecid, abtest,  {table}_purchases, abtest_algorithms      WHERE abrec."idAbRec" = abreclist."idAbRec" and        abrec."idAbRec" = abrecid_personrecid."idAbRec" and        abrecid_personrecid.test_name=%s and        "itemId"= {table}_purchases.item_id and        abtest_algorithms.id = abrec.abtest_algorithms_id and        ((abtest_algorithms.algorithmid = 0 or abtest_algorithms.algorithmid = 1) or (abtest_algorithms.algorithmid = 2 and abrecid_personrecid."idAbRec"=abreclist."idAbRec" and  {table}_purchases.user_id=abrecid_personrecid.personid)) and        abtest.test_name=abrecid_personrecid.test_name and         {table}_purchases.timestamp>=abrec.timestamp and         {table}_purchases.timestamp<abrec.timestamp + ((30 + abtest.stepsize) || \' days\')::interval      GROUP BY abrec.timestamp, abtest_algorithms.algorithmid, abrec."abtest_algorithms_id") AS AR30UTable          ON AR7UTable."abtest_algorithms_id"=AR30UTable."abtest_algorithms_id" and AR7UTable."timestamp"= AR30UTable."timestamp"  WHERE CTRTable.abtest_algorithms_id is not null  and CTRTable.timeStamp is not null;'.format(
            table=self.dataset)
        self.cursor.execute(sql.SQL(query), [self.abTestId] * 7)
        self.connection.commit()

    def sendTimeEstimation(self,loadingSocket, estTimeMicroSec, totalMicroSecDone):
        """
        sendTimeEstimation: Sends an estimation of how long the AB-test has left to create
        @param loadingSocket:
        @param estTimeMicroSec:
        @param totalMicroSecDone:
        """
        if self.lastSendTime != None and estTimeMicroSec != None and (datetime.datetime.now() - self.lastSendTime).total_seconds() <= 1:
            return
        loadingSocket.emit('newData', [self.abTestId, estTimeMicroSec, totalMicroSecDone])
        self.lastSendTime = datetime.datetime.now()

    def delete(self):
        """
        delete: Deletes the AB test.
        @return: a message whether the deletion failed or succeeded
        """
        message = '{"message": "ABTest succesfully Deleted"}'
        errorCode = 201
        try:
            self.cursor.execute(sql.SQL('DELETE FROM abtest WHERE test_name=%s;'),[self.abTestId])
            self.connection.commit()
        except:
            message = '{"message": "AB Test: '+self.abTestId+' could not be deleted."}'
            errorCode = 500

        self.connection.commit()
        return (message, errorCode)

    def execute(self, topKItemsCount, startDate, endDate, algorithm, k=1):
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
            print("start")
            print(k)
            alg = ItemKNNIterative(k=k)

            # This one is faster, but requires more memory
            #alg = ItemKNN(k=k, normalize=normalize)

            query = 'SELECT user_id, item_id FROM {table}_purchases WHERE "timestamp" >= %s AND "timestamp" <= %s'.format(
                table=self.dataset)
            self.cursor.execute(sql.SQL(query), [startDate, endDate])
            interactions = self.cursor.fetchall()

            if len(interactions) > 0:
                user_ids, item_ids = zip(*interactions)
                unique_item_ids = list(set(item_ids))
                alg.train(interactions, unique_item_ids)
                query = 'SELECT COUNT(*) FROM {table}_customers'.format(
                    table=self.dataset)
                self.cursor.execute(sql.SQL(query), [])
                amt_users = self.cursor.fetchone()[0]

                histories_keys, histories_values = self.history_from_subset_interactions(interactions, amt_users)
                recommendations = alg.recommend_all(histories_values, k)

                recommendations_dict = dict()
                for count, value in enumerate(histories_keys):
                    if len(recommendations[count]) > 0:
                        recommendations_dict[value] = recommendations[count]
                return recommendations_dict

            return dict()

    def overviewPageData(self):
        """
        overviewPageData: returns a json format of data for the overview page in the interface
        """
        dataSet = Dataset(self.dataset)
        allPoints = dataSet.getTimeStampList(list, self.beginTs, self.endTs)

        query = 'SELECT abtest_algorithms.id,timestamp,ctr,atr7,atr30, revenuectr,revenue7, revenue30, purchases, "interval", "K",name FROM abtest_algorithms LEFT OUTER JOIN abrecmetric ON abtest_algorithms.id=abrecmetric.abtest_algorithms_id, algorithms WHERE algorithms.id=abtest_algorithms.algorithmid and test_name=%s'
        self.cursor.execute(sql.SQL(query), [self.abTestId])
        itemssql = self.cursor.fetchall()

        algoritms = {}
        for itemsql in itemssql:
            timeItem = {}
            timeItem["ctr"] = itemsql[2]
            timeItem["ard7"] = itemsql[3]
            timeItem["ard30"] = itemsql[4]
            timeItem["revenue0"] = itemsql[5]
            timeItem["revenue7"] = itemsql[6]
            timeItem["revenue30"] = itemsql[7]
            timeItem["purchases"] = itemsql[8]
            timeItem["mostRecomendedItems"] = []

            if itemsql[0] not in algoritms:
                algoritms[itemsql[0]] = {}
                algoritms[itemsql[0]]["trainingInterval"] = itemsql[9]
                algoritms[itemsql[0]]["points"] = {}

            if itemsql[1] != None:
                algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")] = timeItem

        """
        query = 'SELECT abtest_algorithms.id, abrec.timestamp, {dataset}_articles.title FROM abrec, abreclist, {dataset}_articles, abtest_algorithms WHERE {dataset}_articles.id=abreclist."itemId" and  abreclist."idAbRec"=abrec."idAbRec" and abrec.abtest_algorithms_id=abtest_algorithms.id and abtest_algorithms.test_name=%s;'.format(dataset=self.dataset.lower())
        self.cursor.execute(sql.SQL(query), [self.abTestId])
        itemssql = self.cursor.fetchall()
        counter = 0
        for itemsql in itemssql:
            if itemsql[1].strftime("%d/%m/%Y %H:%M:%S") not in algoritms[itemsql[0]]["points"]:
                algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")] = {"ctr": 0, "ard7": 0, "ard30": 0, "arpu7": 0, "arpu30":0, "revenue0":0, "revenue7": 0,"revenue30": 0,"purchases": 0}
            if "mostRecomendedItems" not in algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")]:
                algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")]["mostRecomendedItems"] = []
            algoritms[itemsql[0]]["points"][itemsql[1].strftime("%d/%m/%Y %H:%M:%S")]["mostRecomendedItems"].append(itemsql[2])
            counter += 1
"""

        query = 'SELECT dataset, stepsize, "topK" FROM abtest WHERE test_name=%s'
        self.cursor.execute(sql.SQL(query), [self.abTestId])
        itemsql = self.cursor.fetchone()
        parameters = {}
        parameters["datasetId"] = itemsql[0]
        parameters["stepSize"] = itemsql[1]
        parameters["topK"] = itemsql[2]
        parameters["userCount"] = Dataset(self.dataset).getCustomerCount(False)

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
                    algoritmsList[algoritmKey]["points"].append({"ctr": 0, "ard7": 0, "ard30": 0, "arpu7": 0, "arpu30":0, "mostRecomendedItems": [], "revenue0":0, "revenue7": 0,"revenue30": 0,"purchases": 0})

            if date in NotAlgDependent:
                NotAlgDependentList.append(NotAlgDependent[date])
            else:
                NotAlgDependentList.append({"Purchases": 0, "Revenue": 0, "activeUsersAmount": 0})

        returnDict = {"dataSet": self.dataset, "NotAlgDependent": NotAlgDependentList, "parameters": parameters, "algorithms": algoritmsList, "points": allPoints}

        return (returnDict, 200)

    def getTotalActiveUsers(self, fromDate, toDate):
        """
        getTotalActiveUsers: Returns a json format containing the number of active users within the given time interval
        @param fromDate The starting date of the time interval
        @param toDate  The ending date of the time interval
        """
        query = 'SELECT count(user_id) AS activeUsersAmount FROM (SELECT DISTINCT user_id FROM {dataset}_purchases WHERE {dataset}_purchases.timestamp >= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') and {dataset}_purchases.timestamp <= to_date(%s, \'DD/MM/YYYY HH24:MI:SS\')) AS temp;'.format(dataset=self.dataset.lower())
        self.cursor.execute(sql.SQL(query), [fromDate, toDate])
        itemsql = self.cursor.fetchone()
        return (json.dumps(itemsql[0]), 200)

    def getABtests(self):
        """
        getABtests: Returns a json format containing a list of information about all the AB-tests
        """
        self.cursor.execute(sql.SQL('SELECT * FROM "abtest" WHERE username=%s'), [self.userName])
        data = self.cursor.fetchall()
        returnList = []
        max_alg_count = 0
        for row in data:
            alg_count = 0
            item = [row[6], row[0], row[1], row[4], row[5]]
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
        """
        getUsersFromABTest: Returns a json format for the most active users page of the AB Test.
                            Certain data is calculated within the given time interval
        @param startDate The starting date of the time interval
        @param endDate  The ending date of the time interval
        """
        self.cursor.execute(sql.SQL('SELECT stepsize FROM "abtest" WHERE test_name=%s;'),[self.abTestId])
        stepSize = self.cursor.fetchone()[0]
        self.cursor.execute(sql.SQL('SELECT algId.id, algName.name, algId.interval FROM abtest_algorithms as algId, algorithms as algName WHERE test_name=%s AND algId.algorithmid=algName.id'),[self.abTestId])
        algorithms = self.cursor.fetchall()
        self.cursor.execute(sql.SQL('SELECT * FROM (SELECT id, SUM(p.parameter),COUNT(p.user_id),SUM(case when p.timestamp >= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') AND p.timestamp <= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') then 1 else 0 end) FROM {table}_customers, {table}_purchases AS p WHERE id = user_id GROUP BY id) AS Info LEFT OUTER JOIN (SELECT Succes.id, Succes.algId, CAST((Succes.TotalSuccesRecommend*100) AS float) / CAST(Recommend.TotalRecommend AS float), CAST((Succes.IntervalSuccesRecommend*100) AS float) / CAST(Recommend.IntervalRecommend AS float) FROM(SELECT c.id, r.algId, r.TotalSuccesRecommend, r.IntervalSuccesRecommend FROM {table}_customers AS c LEFT OUTER JOIN (SELECT p.user_id AS userId, algs.id AS algId, COUNT(i."itemId") AS TotalSuccesRecommend, SUM(case when p.timestamp>=to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') AND p.timestamp<=to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') then 1 else 0 end) as IntervalSuccesRecommend FROM abreclist AS i, abrec AS ab, abtest_algorithms AS algs, abtest AS test, {table}_purchases AS p, abrecid_personrecid AS RecByPerson WHERE ((algs.algorithmid = 0 or algs.algorithmid = 1) or (algs.algorithmid = 2 and p.user_id=RecByPerson.personid)) AND RecByPerson."idAbRec"=i."idAbRec" AND test.test_name=%s AND algs.test_name=test.test_name AND algs.id=ab.abtest_algorithms_id AND ab."idAbRec"=i."idAbRec" AND i."itemId"=p.item_id AND ab.timestamp<=p.timestamp AND ab.timestamp + INTERVAL \'%s days\' >p.timestamp GROUP BY p.user_id, algs.id) as r ON c.id=r.userId) AS Succes LEFT OUTER JOIN (SELECT algs.id, NULLIF(count(i."idAbRec"),0) AS TotalRecommend, NULLIF(SUM(case when ab.timestamp>=to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') AND ab.timestamp<=to_date(%s, \'dd/mm/yyyy HH24:MI:SS\')  then 1 else 0 end),0) AS IntervalRecommend FROM abrec AS ab, abreclist AS i, abtest_algorithms AS algs, abtest AS test WHERE test.test_name=%s AND algs.test_name=test.test_name AND algs.id=ab.abtest_algorithms_id AND ab."idAbRec"=i."idAbRec" group by algs.id) AS Recommend ON Succes.algId=Recommend.id) AS CTR ON Info.id=CTR.id'.format(table=self.dataset)),[startDate, endDate,startDate,endDate, self.abTestId, stepSize, startDate,endDate,self.abTestId])
        users = self.cursor.fetchall()
        usersOnId = {}
        for row in users:
            if row[0] not in usersOnId:
                usersOnId[row[0]] = {"info": row[0:4]}
            if row[5] is not None:
                div1 = row[6]
                div2 = row[7]
                if div1 is None:
                    div1 = 0
                if div2 is None:
                    div2 = 0
                usersOnId[row[0]][row[5]] = [div1,div2]
        returnList = []
        header = ["User Id", "Purchase Amount", "Total Purchases", "Purchases In Range"]
        for algo in algorithms:
            header.append('Total CTR '+str(algo[1])+'('+str(algo[0])+')')
            header.append('CTR in Interval '+str(algo[1])+'('+str(algo[0])+')')
        returnList.append(header)
        for row in usersOnId:
            fullRow = list(usersOnId[row]["info"])
            for alg in algorithms:
                if alg[0] in usersOnId[row]:
                    fullRow.extend(usersOnId[row][alg[0]])
                else:
                    fullRow.extend([0,0])
            returnList.append(fullRow)
        return (json.dumps(returnList), 200)

    def getItemsFromABTest(self, startDate, endDate):
        """
        getItemsFromABTest: Returns a json format for the most bought items page of the AB test.
                            Certain data is calculated within the given time interval
        @param startDate The starting date of the time interval
        @param endDate  The ending date of the time interval
        """
        self.cursor.execute(sql.SQL('SELECT algId.id, algName.name, algId.interval FROM abtest_algorithms as algId, algorithms as algName WHERE test_name=%s AND algId.algorithmid=algName.id'),[self.abTestId])
        algorithms = self.cursor.fetchall()
        self.cursor.execute(sql.SQL('SELECT * FROM (SELECT a.id,a.title, COUNT(p.item_id), SUM(case when p.timestamp >= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') AND p.timestamp <= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') then 1 else 0 end) FROM {table}_articles AS a LEFT OUTER JOIN  {table}_purchases AS p ON a.id=p.item_id GROUP BY a.id) as items LEFT OUTER JOIN (SELECT i."itemId", algs.id as algorithmID, COUNT(i."itemId"), SUM(case when ab.timestamp >= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') AND ab.timestamp <= to_date(%s, \'dd/mm/yyyy HH24:MI:SS\') then 1 else 0 end) FROM "abreclist" AS i, "abtest_algorithms" AS algs, "abrec" as ab WHERE algs.test_name=%s AND i."idAbRec"=ab."idAbRec" AND ab.abtest_algorithms_id=algs.id GROUP BY i."itemId", algs.id) AS algorithms ON items.id=algorithms."itemId"'.format(table=self.dataset)), [startDate,endDate,startDate,endDate, self.abTestId])
        items = self.cursor.fetchall()
        itemsOnId = {}
        for row in items:
            if row[0] not in  itemsOnId:
                itemsOnId[row[0]] = {"info": row[0:4]}
            itemsOnId[row[0]][row[5]] = [row[6],row[7]]
        returnList = []
        header = ['Item Id', 'Title', 'Total Buy Rate', 'Buy Rate In Range']
        for algo in algorithms:
            header.append('Total Recommend Rate '+str(algo[1])+'('+str(algo[0])+')')
            header.append('Recommend Rate in Interval '+str(algo[1])+'('+str(algo[0])+')')
        returnList.append(header)
        for row in itemsOnId:
            fullRow = list(itemsOnId[row]["info"])
            for alg in algorithms:
                if alg[0] in itemsOnId[row]:
                    fullRow.extend(itemsOnId[row][alg[0]])
                else:
                    fullRow.extend([0,0])
            returnList.append(fullRow)
        return (json.dumps(returnList), 200)

    def getDatasetIdFromABTest(self):
        """
        getDatasetIdFromABTest: Returns a json format containing the identifier for the dataset used by this AB test.
        @param abTestId The ID of this AB test
        """
        self.cursor.execute(sql.SQL('SELECT dataset FROM "abtest" WHERE test_name=%s'), [self.abTestId])
        setId = self.cursor.fetchall()[0][0]
        return (json.dumps(setId), 200)

    def updateStatus(self, statusCode):
        """
        Updates the status of the AbTest.
        @param statusCode Determines in which status the Abtest will be
        @return: False if the param statusCode is not a valid state, True if it is valid (between 0 and 4)
        """
        if statusCode in range(4):
            self.cursor.execute(sql.SQL('UPDATE abtest SET status=%s WHERE abtest.test_name=%s'), [statusCode, self.abTestId])
            self.connection.commit()
            return True
        return False

    def initialize(self, abTestId=None, algorithms=None, dataset=None, beginTs=None, endTs=None, stepSize=None,
                   topK=None, username=None):
        """
        initializes the ABTest information, by default it will load the date on abTestId from the database
        @param abTestId: the id (name) of the ABTest
        @param algorithms: list of algoritmhs ([["name",interval, K],["name",interval, K]])
        @param dataset: the dataset id (name)
        @param beginTs: startdate
        @param endTs: endDate
        @param stepSize: the stepsize
        """

        if self.abTestId == None and abTestId != None:
            self.abTestId = abTestId
            select = 'INSERT INTO abtest ("test_name", "dataset", "begin_ts", "end_ts", "topK", "stepsize", "username") VALUES (%s,%s,to_date(%s, \'DD/MM/YYYY\'),to_date(%s, \'DD/MM/YYYY\'),%s,%s, %s);';
            self.cursor.execute(sql.SQL(select), [abTestId, dataset, beginTs, endTs, topK, stepSize, username])

            for algorithm in algorithms:
                select = 'INSERT INTO abtest_algorithms ("test_name", "algorithmid", "interval", "K") VALUES (%s,%s,%s,%s);'
                self.cursor.execute(sql.SQL(select), [abTestId, algorithm[0], algorithm[1][0], algorithm[2]])
            self.connection.commit()
        elif self.abTestId == None and abTestId == None:
            exit("No data to initialize")

        select = 'SELECT "test_name", "dataset", "begin_ts", "end_ts", "topK", "stepsize", "username" FROM abtest WHERE test_name = %s;'
        self.cursor.execute(sql.SQL(select).format(), [self.abTestId])
        data = self.cursor.fetchone()

        self.algorithms = []
        select = 'SELECT algorithmid, "interval", "K", "id" FROM abtest_algorithms WHERE test_name=%s;'
        self.cursor.execute(sql.SQL(select).format(), [self.abTestId])
        algdata = self.cursor.fetchall()
        for item in algdata:
            self.algorithms.append([item[0], item[1], item[2], item[3]])

        self.dataset = data[1]
        self.beginTs = data[2]
        self.endTs = data[3]
        self.topK = data[4]
        self.stepSize = data[5]
        self.userName = data[6]

    def getAllPendingOrBrokenAbTests(self):
        """
        Returns Returns a json format of a list of all AbTests that are currently inactive.
        """
        self.cursor.execute(sql.SQL('SELECT test_name, status FROM "abtest" WHERE status=2 or status=3'))
        data = self.cursor.fetchall()
        returnData = []
        for row in data:
            returnData.append([row[0], row[1]])
        return (json.dumps(returnData), 200)