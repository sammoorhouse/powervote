var mongo = require('mongodb');
var config = require('../config.dev.js');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

	var mongoHost = process.env.MONGO_HOST || config.mongo.host;
	var mongoPort = process.env.MONGO_PORT || config.mongo.port;
	var mongoDbName = process.env.MONGO_DBNAME || config.mongo.dbname;

var server = new Server(mongoHost, mongoPort, {auto_reconnect: true});
db = new Db(mongoDbName, server, {safe: true});

db.open(function(err, db) {
    if(!err) {
		var username = process.env.MONGO_USER || config.mongo.user;
		var password = process.env.MONGO_PASS || config.mongo.pass;
		console.log('logging in with user: ' + username + ' and password ' + password);
		db.authenticate(username, password, function(err, result){
			if(err){
                console.log("Problem authenticating against db server: " + err);
            }
			else{
		        console.log("Connected to 'issues' database");
		        db.collection('issues', {safe:true}, function(err, collection) {
		            if (err) {
		                console.log("The 'issues' collection doesn't exist. Creating it with sample data...");
		                populateIssues();
		            }
					else{
						console.log("issues collection: " +  + JSON.stringify(collection, null, '/t'));
					}
					db.collection('sets', {safe:true}, function(err, collection){
						if(err){
							console.log("The 'sets' collection doesn't exist. Creating with sample data...");
							populateSets();
						}
						else{
							console.log("sets collection: " + JSON.stringify(collection, null, '/t'));
						}
					})
		        });
			}
		});

    }
	else{console.log(err)};
});

exports.blast = function(){
	populateIssues();
	populateSets();
}

exports.addVote = function(req, res) {
    var id = req.params.id;
    var issue = req.body;
    delete issue._id;
    console.log('Updating issue: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('issues', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, issue, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating issues: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.getAll = function(callback){
	console.log('getAll');
    db.collection('issues', function(err, collection) {
        collection.find().toArray(function(err, items) {
			callback(items);
        });
    });
};

exports.getById = function(id, callback){
	console.log('getById ' + id);
	db.collection('issues', function(err, collection){
		collection.findOne({'id':id}, function(err, item){
			console.log(item);
			callback(item);
		});
	});
};

exports.userVotes = function(userId, callback){
	console.log('retrieving votes for user ' + userId);
	db.collection('votes', function(err, collection){
		collection.find({'_id':new BSON.ObjectID(userId)}, function(err, items){
			callback(items);
		});
	});
};

exports.addVote = function(userId, issueId, callback){
	console.log('adding vote for user ' + userId + ' and issue ' + issueId);
	var vote = '{id: ' + issueId + ', user: ' + userId + ' + voted: true}';
	db.collection('votes', function(err, collection){
		collection.upsert(vote)
	})
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateIssues = function() {
    var issues = [
		{id: "363",totalScore: "12", totalVoterCount: "320",description: "introducing <b>foundation hospitals</b>"},
		{id: "810",totalScore: "12", totalVoterCount: "320",description: "greater <b>regulation of gambling</b>"},
		{id: "811",totalScore: "12", totalVoterCount: "320",description: "<b>smoking bans</b>"},
		{id: "826",totalScore: "12", totalVoterCount: "320",description: "equal <b>gay rights</b>"},
		{id: "837",totalScore: "12", totalVoterCount: "320",description: "a <strong>wholly elected</strong> House of Lords"},
		{id: "975",totalScore: "12", totalVoterCount: "320",description: "an <strong>investigation</strong> into the Iraq war"},
		{id: "984",totalScore: "12", totalVoterCount: "320",description: "replacing <b>Trident</b> with a new nuclear weapons system"},
		{id: "996",totalScore: "12", totalVoterCount: "320",description: "a <b>transparent Parliament</b>"},
		{id: "1027",totalScore: "12", totalVoterCount: "320",description: "a referendum on the UK\'s membership of the <b>EU</b>"},
		{id: "1030",totalScore: "12", totalVoterCount: "320",description: "measures to <b>prevent climate change</b>"},
		{id: "1049",totalScore: "12", totalVoterCount: "320",description: "the <b>Iraq war</b>"},
		{id: "1050",totalScore: "12", totalVoterCount: "320",description: "the <b>hunting ban</b>"},
		{id: "1051",totalScore: "12", totalVoterCount: "320",description: "introducing <b>ID cards</b>"},
		{id: "1052",totalScore: "12", totalVoterCount: "320",description: "university <b>tuition fees</b>"},
		{id: "1053",totalScore: "12", totalVoterCount: "320",description: "Labour\'s <b title=\"Including voting to maintain them\">anti-terrorism laws</b>"},
		{id: "1065",totalScore: "12", totalVoterCount: "320",description: "more <b>EU integration</b>"},
		{id: "1071",totalScore: "12", totalVoterCount: "320",description: "allowing ministers to <b>intervene in inquests</b>"},
		{id: "1074",totalScore: "12", totalVoterCount: "320",description: "greater <b>autonomy for schools</b>"},
		{id: "1079",totalScore: "12", totalVoterCount: "320",description: "removing <b>hereditary peers</b> from the House of Lords"},
		{id: "1084",totalScore: "12", totalVoterCount: "320",description: "a more <a href=\"http://en.wikipedia.org/wiki/Proportional_representation\">proportional system</a> for electing MPs"},
		{id: "1087",totalScore: "12", totalVoterCount: "320",description: "a <b>stricter asylum system</b>"},
		{id: "1105",totalScore: "12", totalVoterCount: "320",description: "the privatisation of <b>Royal Mail</b>"},
		{id: "1109",totalScore: "12", totalVoterCount: "320",description: "encouraging <b>occupational pensions</b>"},
		{id: "1110",totalScore: "12", totalVoterCount: "320",description: "increasing the <b>rate of VAT</b>"},
		{id: "1113",totalScore: "12", totalVoterCount: "320",description: "an <b>equal number of electors</b> per parliamentary constituency"},
		{id: "1120",totalScore: "12", totalVoterCount: "320",description: "capping <b>civil service redundancy payments</b>"},
		{id: "1124",totalScore: "12", totalVoterCount: "320",description: "automatic enrolment in <b>occupational pensions</b>"},
		{id: "1132",totalScore: "12", totalVoterCount: "320",description: "raising England&rsquo;s <b>undergraduate tuition fee</b> cap to &pound;9,000 per year"},
		{id: "1136",totalScore: "12", totalVoterCount: "320",description: "<b>fewer MPs</b> in the House of Commons"},
		{id: "6670",totalScore: "12", totalVoterCount: "320",description: "a reduction in spending on <b>welfare benefits</b>"},
		{id: "6671",totalScore: "12", totalVoterCount: "320",description: "reducing central government <b>funding of local government</b>"},
		{id: "6672",totalScore: "12", totalVoterCount: "320",description: "reducing <b>housing benefit</b> for social tenants deemed to have excess bedrooms (which Labour describe as the \"bedroom tax\")"},
		{id: "6673",totalScore: "12", totalVoterCount: "320",description: "paying higher benefits over longer periods for those unable to work due to <b>illness or disability</b>"},
		{id: "6674",totalScore: "12", totalVoterCount: "320",description: "raising <b>welfare benefits</b> at least in line with prices"},
		{id: "6676",totalScore: "12", totalVoterCount: "320",description: "reforming the <b>NHS</b> so GPs buy services on behalf of their patients"},
		{id: "6677",totalScore: "12", totalVoterCount: "320",description: "restricting the provision of services to <b>private patients</b> by the NHS"},
		{id: "6678",totalScore: "12", totalVoterCount: "320",description: "greater restrictions on <b>campaigning by third parties</b>, such as charities, during elections"},
		{id: "6679",totalScore: "12", totalVoterCount: "320",description: "reducing the rate of <b>corporation tax</b>"},
		{id: "6680",totalScore: "12", totalVoterCount: "320",description: "raising the threshold at which people start to pay <b>income tax</b>"},
		{id: "6681",totalScore: "12", totalVoterCount: "320",description: "increasing the tax rate applied to <b>income over £150,000</b>"},
		{id: "6682",totalScore: "12", totalVoterCount: "320",description: "ending <b>financial support</b> for some 16-19 year olds in training and further education"},
		{id: "6683",totalScore: "12", totalVoterCount: "320",description: "local councils keeping money raised from <b>taxes on business premises</b> in their areas"},
		{id: "6684",totalScore: "12", totalVoterCount: "320",description: "making local councils responsible for helping those in <b>financial need</b> afford their <b>council tax</b> and reducing the amount spent on such support"},
		{id: "6685",totalScore: "12", totalVoterCount: "320",description: "a <b>banker&rsquo;s bonus tax</b>"},
		{id: "6686",totalScore: "12", totalVoterCount: "320",description: "allowing <b>marriage</b> between two people of same sex"},
		{id: "6687",totalScore: "12", totalVoterCount: "320",description: "<a href=\"http://en.wikipedia.org/wiki/Academy_(English_school)\">academy schools</a>"},
		{id: "6688",totalScore: "12", totalVoterCount: "320",description: "use of <b>UK military forces</b> in combat operations overseas"},
		{id: "6690",totalScore: "12", totalVoterCount: "320",description: "measures to reduce <b>tax avoidance</b>"},
		{id: "6691",totalScore: "12", totalVoterCount: "320",description: "stronger tax <b>incentives for companies to invest</b> in assets"},
		{id: "6692",totalScore: "12", totalVoterCount: "320",description: "slowing the rise in <b>rail fares</b>"},
		{id: "6693",totalScore: "12", totalVoterCount: "320",description: "lower taxes on <b>fuel for motor vehicles</b>"},
		{id: "6694",totalScore: "12", totalVoterCount: "320",description: "higher taxes on <b>alcoholic drinks</b>"},
		{id: "6696",totalScore: "12", totalVoterCount: "320",description: "the introduction of elected <b>Police and Crime Commissioners</b>"},
		{id: "6698",totalScore: "12", totalVoterCount: "320",description: "<b>fixed periods between parliamentary elections</b>"},
		{id: "6699",totalScore: "12", totalVoterCount: "320",description: "higher <b>taxes on plane tickets</b>"},
		{id: "6697",totalScore: "12", totalVoterCount: "320",description: "selling England&rsquo;s state owned <b>forests</b>"},
		{id: "6702",totalScore: "12", totalVoterCount: "320",description: "spending public money to create <b>guaranteed jobs for young people</b> who have spent a long time unemployed"},
		{id: "6703",totalScore: "12", totalVoterCount: "320",description: "laws to promote <b>equality and human rights</b>"},
		{id: "6704",totalScore: "12", totalVoterCount: "320",description: "financial incentives for <b>low carbon</b> emission <b>electricity generation</b> methods"},
		{id: "6705",totalScore: "12", totalVoterCount: "320",description: "requiring pub companies to offer <b>pub landlords rent-only leases</b>"},
		{id: "6706",totalScore: "12", totalVoterCount: "320",description: "strengthening the <b>Military Covenant</b>"},
		{id: "6707",totalScore: "12", totalVoterCount: "320",description: "restricting the scope of <b>legal aid</b>"},
		{id: "6708",totalScore: "12", totalVoterCount: "320",description: "transferring <b>more powers to the Welsh Assembly</b>"},
		{id: "6709",totalScore: "12", totalVoterCount: "320",description: "transferring <b>more powers to the Scottish Parliament</b>"},
		{id: "6710",totalScore: "12", totalVoterCount: "320",description: "<b>culling badgers</b> to tackle bovine tuberculosis"},
		{id: "6711",totalScore: "12", totalVoterCount: "320",description: "an annual tax on the value of expensive homes (popularly known as a <b>mansion tax</b>)"}
    ];
	
	console.log('issues db: ' + db);

    db.collection('issues', function(err, collection) {
        collection.insert(issues, {safe:true}, function(err, result) {
        	if(err){
        		console.log("ERROR: " + err);
        	}
        });
    });
};

var populateSets = function() {

    var sets = [
		{id: "Summary", issues: [            
			1113,
            1136,
            1132,
            1052,
            1109,
            1110,
            1027,
            1084,
            1065,
            6670,
            6673,
            6674,
            6678,
            984,
            837,
            1079,
            6671,
            6672]},
		{id: "Social", issues: [
            826,
            811,
            1050,
            6686,
            6703]},
		{id: "Foreign Policy", issues: [
            6688,
            1049,
            975,
            984,
            1065,
            1027,
            6706]},
		{id: "Welfare", issues: [
            6672,
            6674,
            6673,
            6684,
            6670,
            6702]},
		{id: "Taxation", issues: [
            6680,
            1110,
            6694,
            6699,
            6693,
            6681,
            1109,
            1124,
            6685,
            6711]},
		{id: "Business", issues: [
            6679,
            6690,
            6691]},
		{id: "Health", issues: [
            6677,
            6676,
            363,
            811]},
		{id: "Education", issues: [
            1074,
            1132,
            6687,
            6682,
            1052]},
		{id: "Reform", issues: [
            6671,
            1113,
            1136,
            996,
            1084,
            837,
            6683,
            6678,
            6698,
            1079,
            6708,
            6709]},
		{id: "Home", issues: [
            1087,
            1071,
            1051,
            6696]},
		{id: "Mist", issues: [
            810,
            1030,
            6692,
            6697,
            1120,
            1053,
            1105,
            6704,
            6705,
            6707,
            6710]}
];

    db.collection('sets', function(err, collection) {
        collection.insert(sets, {safe:true}, function(err, result) {
        	if(err){
        		console.log("ERROR: " + err);
        	}});
    });
};