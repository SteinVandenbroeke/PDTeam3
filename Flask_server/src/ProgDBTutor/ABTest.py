from Flask_server.src.ProgDBTutor.config import config_data
from Flask_server.src.ProgDBTutor.quote_data_access import DBConnection


class ABTest():
    def __init__(self, abTestId=None):
        if abTestId != None:
            database = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'],
                                    userPassword=config_data['password'], dbhost=config_data['host'],
                                    dbport=config_data['port'])
            connection = database.get_connection()
            cursor = connection.cursor()

    def create(self, topKItemsCount, startDate, endDate, stepSize, trainingInterval, algoritmes, datasets):
        """
        Create: function to create a new ABTest, and wil make the current ABTest te created ABTest
        @param topKItemsCount: top k items
        @param startDate: start date of the ABTest (must be between the dates of the Dataset)
        @param endDate: end date of ABTest (ust be between the dates of the Dataset and be larger than the startDate)
        @param stepSize: how often must the data be safed in the db
        @param trainingInterval: how often the algorithm must be trained
        @param algoritmes: list of all used algoritmes id's
        @param datasets: list of all used dataset id's
        """

        print("aanmaken ABTest")#TODO

    def overviewPageData(self):
        """
        overviewPageData: gives a json format for the overview page in the interface
        """
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