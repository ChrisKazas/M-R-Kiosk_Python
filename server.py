from flask import Flask, render_template, request, jsonify, redirect, url_for
from datetime import date
from pymongo import MongoClient
from bson import ObjectId as ObjectId
import pprint as p

# Create app instance
app = Flask(__name__)

# Create a Client Connection to MongoDB
conn = MongoClient(host='localhost', port=27017)

# Create a DB Handle
dbh = conn['KioskTestDB']

# Home route
@app.route('/')
@app.route('/home')
def home():

	pri1 =  dbh.workordermodels.count_documents({'pri':'1','workDone':{'$exists': False}})
	pri2 =  dbh.workordermodels.count_documents({'pri':'2','workDone':{'$exists': False}})
	pri3 =  dbh.workordermodels.count_documents({'pri':'3','workDone':{'$exists': False}})
	pri4 =  dbh.workordermodels.count_documents({'pri':'4','workDone':{'$exists': False}})

        pris = []
        pris.append(pri1)
        pris.append(pri2)
        pris.append(pri3)
        pris.append(pri4)

	# Get todays date
	d = date.today()
	today = d.strftime("%A %B %d %Y")

	return render_template("home.html", today=today, pris=pris)

# New Work Order Page
@app.route('/newWrkOrd')
def newWrkOrd():
	shops = dbh.shopmodels.find({}).sort('shopName')
	mechs = dbh.mechmodels.find({}).sort('mechanicName')

	return render_template("newWrkOrd.html", shops=shops, mechs=mechs )

# Generate new Open Work Order
@app.route('/genNewWrkOrd', methods=['POST'])
def genNewWrkOrd():

	data = request.form

	priority    = data['priority']
	shopName    = data['shopName']
        mechName    = data['mechName']
	workTodo    = data['workTodo']
	dateOpened  = data['dateOpened']


 	mechanic = dbh.mechmodels.find_one({'mechanicName' : mechName})
 	shop = dbh.shopmodels.find_one({'shopName' : shopName})

	dbh.workordermodels.insert_one({ 'mechanicID' : ObjectId(mechanic['_id']),'shopID' : ObjectId(shop['_id']), 'pri' : priority, 'dateOpened' : dateOpened,'workTodo': workTodo})

	return jsonify(data)


# Create and Close new Work Order
@app.route('/addWorkOrder', methods=['POST'])
def addWorkOrder():

	data = request.form

	priority    = data['priority']
	shopName    = data['shopName']
        mechName    = data['mechName']
        workDone    = data['workDone']
	workTodo    = data['workTodo']
	dateOpened  = data['dateOpened']
	dateClosed  = data['dateClosed']

 	mechanic = dbh.mechmodels.find_one({'mechanicName' : mechName})
 	shop = dbh.shopmodels.find_one({'shopName' : shopName})

	dbh.workordermodels.insert_one({ 'mechanicID' : ObjectId(mechanic['_id']),'shopID' : ObjectId(shop['_id']), 'pri' : priority, 'dateOpened' : dateOpened, 'dateClosed': dateClosed,'workTodo': workTodo, 'workDone': workDone})


	# Unit Testing
        print(ObjectId(mechanic['_id']))
        print(ObjectId(shop['_id']))

	return jsonify(data)


# get names of shops from ObjectId
def getShopName(id):
	shops = dbh.shopmodels.find({})
	for shop in shops:
		if ObjectId(id) == ObjectId(shop['_id']):
			return shop['shopName']

# get names of mechanics from ObjectId
def getMechName(id):
	mechs = dbh.mechmodels.find({})
	for mech in mechs:
		if ObjectId(id) == ObjectId(mech['_id']):
			return mech['mechanicName']


# Edit open work order page
# By default loads all open work orders
@app.route('/editWorkOrder')
def editWorkOrder():

	# Get data from db
	mechs = dbh.mechmodels.find({})
	shops = dbh.shopmodels.find({})
	openWos = dbh.workordermodels.find({'workDone':{'$exists':False}})

	shopNames = []
	mechNames = []

	for wo in openWos:
	# Itr through open work orders grabbing
	# shop && mech names based objectIds from DB
		shops.rewind()
		mechs.rewind()
		shopNames.append(getShopName(ObjectId(wo['shopID'])))
		mechNames.append(getMechName(ObjectId(wo['mechanicID'])))

	# reset DB curser
	shops.rewind()
	mechs.rewind()
	openWos.rewind()

	# ompact cursor objs into single iterable container
	data = zip(shopNames, mechNames, openWos)

	return render_template("editWorkOrder.html", data=data, mechs=mechs, shops=shops)


# get names of shops from ObjectId
def getShopId(name):
	shops = dbh.shopmodels.find({})
        for shop in shops:
                if name == shop['shopName']:
                        return shop['_id']

# get names of mechanics from ObjectId
def getMechId(name):
	mechs = dbh.mechmodels.find({})
        for mech in mechs:
                if name == mech['mechanicName']:
                        return mech['_id']



# Search open Work Orders by user input criteria
@app.route('/searchOpenWorkOrders', methods=['POST'])
def searchOpenWorkOrders():

	data = request.form
	query = {}

	if data['mechName'] != "Mechanics":
		mechID = getMechId(data['mechName'])
		query['mechanicID'] = ObjectId(mechID)

	query['workDone'] = {'$exists':False}

	# Get data from db
	mechs = dbh.mechmodels.find({})
	shops = dbh.shopmodels.find({})
	openWos = dbh.workordermodels.find(query)

	shopNames = []
	mechNames = []

	for wo in openWos:
	# Itr through open work orders grabbing
	# shop && mech names based objectIds from DB
		shops.rewind()
		mechs.rewind()
		shopNames.append(getShopName(ObjectId(wo['shopID'])))
		mechNames.append(getMechName(ObjectId(wo['mechanicID'])))

	# reset DB curser
	shops.rewind()
	mechs.rewind()
	openWos.rewind()

	# ompact cursor objs into single iterable container
	data = zip(shopNames, mechNames, openWos)

#	return render_template("editWorkOrder.html", data=data, mechs=mechs, shops=shops)
	return jsonify(data)


# Closes a work order that was incomplete
@app.route('/closeOpenWorkOrder', methods=['POST'])
def closeOpenWorkOrder():

	data = request.form
	workDone = data['workDone']
	woId = data['id']

	dbh.workordermodels.find_one_and_update({'_id': ObjectId(woId)},{'$set':{'workDone':workDone}})

	return jsonify(data)


# Load Shops Admin page
@app.route('/shopsAdmin')
def shopsAdmin():

	shops = dbh.shopmodels.find({}).sort('shopName')

	return render_template('shopsAdmin.html', shops=shops)

# Add shop on Admin page
@app.route('/addShop', methods=['POST'])
def addShop():

	data = request.form
	dbh.shopmodels.insert_one({'shopName': data['newShop'], 'active': True})

	return jsonify(data)

# Delete shop from Admin page
@app.route('/delShop', methods=['DELETE'])
def delShop():

	data = request.form
	dbh.shopmodels.find_one_and_delete({'_id': ObjectId(data['shopId'])})

	return jsonify(data)


# Load Mechanics Admin
@app.route('/mechsAdmin')
def mechsAdmin():

	mechs = dbh.mechmodels.find({}).sort('mechanicName')

	return render_template('mechsAdmin.html', mechs=mechs)

#Add Mechanic on Admin Page
@app.route('/addMech', methods=['POST'])
def addMech():

	data = request.form

	dbh.mechmodels.insert_one({'mechanicName': data['newMech'], 'active': True})

	# Unit Testin
	#print(data['newMech'])

	return jsonify(data)

# Delete Mechanic from Admin Page
@app.route('/delMech', methods=['DELETE'])
def delMech():

	data = request.form
	dbh.mechmodels.find_one_and_delete({'_id': ObjectId(data['mechId'])})

	# Unit Testing
	#print(data['mechId'])

	return jsonify(data)

# Injury Report route
@app.route('/injuryReport')
def injuryReport():
	shops = dbh.shopmodels.find({})
	mechs = dbh.mechmodels.find({})
	return render_template("injury.html", shops=shops, mechs=mechs )



if __name__ == "__main__":
	app.run(debug=True)
