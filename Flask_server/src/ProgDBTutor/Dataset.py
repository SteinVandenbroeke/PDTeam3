import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from quote_data_access import DBConnection
from config import config_data

class Dataset():
    def __init__(self):
        print("")

    def add(self, customerCSV, articleCSV, purchasesCSV, customerConnections, articleConnections, purchasesConnections):
        print("abc")
        f = open("./testDatasetupload.txt","w")
        data = pd.read_csv (customerCSV)
        df = pd.DataFrame(data)
        f.write(str(df))

        DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'], userPassword=config_data['password'], dbhost=config_data['host'], dbport=config_data['port'])
        print("succes")



        print(customerConnections)
        print(articleConnections)
        print(purchasesConnections)



        f.close()


