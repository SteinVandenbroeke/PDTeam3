import pandas as pd



class Dataset():
    def __init__(self):
        print("")

    def add(self, customerCSV, articleCSV, purchasesCSV, customerConnections, articleConnections, purchasesConnections):
        print("abc")
        f = open("./testDatasetupload.txt","w")
        data = pd.read_csv (customerCSV)
        df = pd.DataFrame(data)
        f.write(str(df))
        print(customerConnections)


        f.close()


