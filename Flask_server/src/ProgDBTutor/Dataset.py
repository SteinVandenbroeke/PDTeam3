import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from quote_data_access import DBConnection
from config import config_data
from psycopg2 import sql
import numpy
from psycopg2.extensions import register_adapter, AsIs

class Dataset():
    def __init__(self):
        print("")

    def add(self,datasetName, customerCSV, articleCSV, purchasesCSV, customerConnections, articleConnections, purchasesConnections):
        #connect to database
        database = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'], userPassword=config_data['password'], dbhost=config_data['host'], dbport=config_data['port'])
        connection = database.get_connection()
        cursor = connection.cursor()

        #customer table:
        customerTableName = datasetName+' customers'
        customerData = pd.read_csv(customerCSV)
        customerDf = pd.DataFrame(customerData)
        column_types = [sql.Identifier(c + " text") for c in customerDf.columns]
        cursor.execute(
            sql.SQL('CREATE TABLE {0}(id int PRIMARY KEY, age int, postal_code int);').format(sql.Identifier(customerTableName)))

        for row in customerDf.values:
            cursor.execute(
                sql.SQL('insert into {table} values (%s,%s,%s)').format(table=sql.Identifier(customerTableName)), row)

        #article table:
        print(articleConnections)
        articleTableName = datasetName+' articles'
        articleData = pd.read_csv(articleCSV)
        articleDf = pd.DataFrame(articleData)
        print(articleDf)

        column_types = [sql.Identifier(c + " text") for c in articleDf.columns]
        cursor.execute(
            sql.SQL('CREATE TABLE {0}(id int PRIMARY KEY, title text, description text);').format(sql.Identifier(articleTableName)))

        for row in articleDf.values:
            cursor.execute(
                sql.SQL('insert into {table} values (%s,%s,%s)').format(table=sql.Identifier(articleTableName)), row)


        #purchases table:





        connection.commit()
        connection.close()
        cursor.close()
        print("succes")




    def addapt_numpy_float64(numpy_float64):
        return AsIs(numpy_float64)

    def addapt_numpy_int64(numpy_int64):
        return AsIs(numpy_int64)

    register_adapter(numpy.float64, addapt_numpy_float64)
    register_adapter(numpy.int64, addapt_numpy_int64)










