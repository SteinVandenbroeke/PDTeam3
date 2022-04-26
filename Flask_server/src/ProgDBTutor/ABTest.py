from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess
from psycopg2 import sql
import pandas as pd
from collections import Counter
from iknn import ItemKNNIterative
from typing import List
from psycopg2 import sql
from Dataset import Dataset


class ABTest():
    def __init__(self, abTestId=None):
        database = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'],
                                userPassword=config_data['password'], dbhost=config_data['host'],
                                dbport=config_data['port'])
        connection = database.get_connection()
        self.cursor = connection.cursor()
        self.abTestId = abTestId
        self.algorithms = []
        self.dataset = None
        self.beginTs = None
        self.endTs = None
        self.stepSize = None
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

    def execute(self, topKItemsCount, startDate, endDate, algorithm, datasets, users=1, k=1):
        """
        Create: function to create a new ABTest, and wil make the current ABTest te created ABTest
        @param topKItemsCount: top k items
        @param startDate: start date of the ABTest (must be between the dates of the Dataset)
        @param endDate: end date of ABTest (ust be between the dates of the Dataset and be larger than the startDate)
        @param algoritmes: algorithm id
        @param datasets: list of all used dataset id's
        """
        query = 'SELECT name FROM algorithms WHERE id = ' + str(algorithm)
        self.cursor.execute(sql.SQL(query))
        algoname = self.cursor.fetchall()[0][0]

        if (algoname == "Popularity"):
            query = 'SELECT item_id FROM data_purchases WHERE "timestamp" > \'' + startDate + '\' AND "timestamp" < \''+ endDate +"\'"
            self.cursor.execute(sql.SQL(query))
            interactions = [r[0] for r in self.cursor.fetchall()]
            result = [item for items, c in Counter(interactions).most_common()
                                            for item in [items] * c]
            return result[:topKItemsCount]
        elif (algoname == "Recency"):
            query = 'SELECT timestamp, item_id FROM data_purchases WHERE "timestamp" > \'' + startDate + '\' AND "timestamp" < \''+ endDate +"\'"
            self.cursor.execute(sql.SQL(query))
            items = self.cursor.fetchall()
            sorted_result = sorted(items, key=lambda tup: tup[0])
            result = list(dict.fromkeys([x[1] for x in sorted_result]))
            result.reverse()
            return result[:topKItemsCount]
        elif (algoname == "ItemKNN"):
            alg = ItemKNNIterative(k=k, normalize=False)
            query = 'SELECT user_id, item_id FROM data_purchases WHERE "timestamp" > \'' + startDate + '\' AND "timestamp" < \''+ endDate +"\'"
            self.cursor.execute(sql.SQL(query))
            items = self.cursor.fetchall()
            alg.train(items)
            histories = self.history_from_subset_interactions(items, amt_users=users)
            recommendations = alg.recommend_all(histories, topKItemsCount)
            return recommendations

    def overviewPageData(self):
        """
        overviewPageData: gives a json format for the overview page in the interface
        """
        ABTestInformation = self._getAbTestInformation()
        dataSet = Dataset()
        dataSet.getPeopleList()
        allPoints = dataSet.getTimeStampList(dataSet, list)
        print("Data for overview page")#TODO

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

    def initialize(self, abTestId=None, algorithms = None, dataset = None, beginTs = None, endTs = None, stepSize = None):
        if self.abTestId == None and abTestId != None:
            self.abTestId = abTestId
            self.algorithms = []

            for algorithm in algorithms:
                self.algorithms.append([algorithm[0], algorithm[1][0]])
            self.dataset = dataset
            self.beginTs = beginTs
            self.endTs = endTs
            self.stepSize = stepSize
        elif self.abTestId == None and abTestId == None:
            exit("No data to initialize")
        else:
            print(self.abTestId)
            select = 'SELECT * FROM abtest WHERE test_name = %s;'
            self.cursor.execute(sql.SQL(select).format(), [self.abTestId])
            data = self.cursor.fetchone()
            self.algorithms = data[1]
            self.dataset = data[2]
            self.beginTs = data[3]
            self.endTs = data[4]
            self.stepSize = data[5]