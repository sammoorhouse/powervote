var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('issuesdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'issuesdb' database");
        db.collection('issues', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'issues' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
	else{console.log(err)};
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving issue: ' + id);
    db.collection('issues', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
	console.log('Getting all issues');
    db.collection('issues', function(err, collection) {
        collection.find().toArray(function(err, items) {
			console.log(items);
            res.send(items);
        });
    });
};

exports.addVote = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    delete wine._id;
    console.log('Updating issue: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('issues', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
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

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var issues = [
		{id: "363",description: "introducing <b>foundation hospitals</b>"},
		{id: "810",description: "greater <b>regulation of gambling</b>"},
		{id: "811",description: "<b>smoking bans</b>"},
		{id: "826",description: "equal <b>gay rights</b>"},
		{id: "837",description: "a <strong>wholly elected</strong> House of Lords"},
		{id: "975",description: "an <strong>investigation</strong> into the Iraq war"},
		{id: "984",description: "replacing <b>Trident</b> with a new nuclear weapons system"},
		{id: "996",description: "a <b>transparent Parliament</b>"},
		{id: "1027",description: "a referendum on the UK\'s membership of the <b>EU</b>"},
		{id: "1030",description: "measures to <b>prevent climate change</b>"},
		{id: "1049",description: "the <b>Iraq war</b>"},
		{id: "1050",description: "the <b>hunting ban</b>"},
		{id: "1051",description: "introducing <b>ID cards</b>"},
		{id: "1052",description: "university <b>tuition fees</b>"},
		{id: "1053",description: "Labour\'s <b title=\"Including voting to maintain them\">anti-terrorism laws</b>"},
		{id: "1065",description: "more <b>EU integration</b>"},
		{id: "1071",description: "allowing ministers to <b>intervene in inquests</b>"},
		{id: "1074",description: "greater <b>autonomy for schools</b>"},
		{id: "1079",description: "removing <b>hereditary peers</b> from the House of Lords"},
		{id: "1084",description: "a more <a href=\"http://en.wikipedia.org/wiki/Proportional_representation\">proportional system</a> for electing MPs"},
		{id: "1087",description: "a <b>stricter asylum system</b>"},
		{id: "1105",description: "the privatisation of <b>Royal Mail</b>"},
		{id: "1109",description: "encouraging <b>occupational pensions</b>"},
		{id: "1110",description: "increasing the <b>rate of VAT</b>"},
		{id: "1113",description: "an <b>equal number of electors</b> per parliamentary constituency"},
		{id: "1120",description: "capping <b>civil service redundancy payments</b>"},
		{id: "1124",description: "automatic enrolment in <b>occupational pensions</b>"},
		{id: "1132",description: "raising England&rsquo;s <b>undergraduate tuition fee</b> cap to &pound;9,000 per year"},
		{id: "1136",description: "<b>fewer MPs</b> in the House of Commons"},
		{id: "6670",description: "a reduction in spending on <b>welfare benefits</b>"},
		{id: "6671",description: "reducing central government <b>funding of local government</b>"},
		{id: "6672",description: "reducing <b>housing benefit</b> for social tenants deemed to have excess bedrooms (which Labour describe as the \"bedroom tax\")"},
		{id: "6673",description: "paying higher benefits over longer periods for those unable to work due to <b>illness or disability</b>"},
		{id: "6674",description: "raising <b>welfare benefits</b> at least in line with prices"},
		{id: "6676",description: "reforming the <b>NHS</b> so GPs buy services on behalf of their patients"},
		{id: "6677",description: "restricting the provision of services to <b>private patients</b> by the NHS"},
		{id: "6678",description: "greater restrictions on <b>campaigning by third parties</b>, such as charities, during elections"},
		{id: "6679",description: "reducing the rate of <b>corporation tax</b>"},
		{id: "6680",description: "raising the threshold at which people start to pay <b>income tax</b>"},
		{id: "6681",description: "increasing the tax rate applied to <b>income over £150,000</b>"},
		{id: "6682",description: "ending <b>financial support</b> for some 16-19 year olds in training and further education"},
		{id: "6683",description: "local councils keeping money raised from <b>taxes on business premises</b> in their areas"},
		{id: "6684",description: "making local councils responsible for helping those in <b>financial need</b> afford their <b>council tax</b> and reducing the amount spent on such support"},
		{id: "6685",description: "a <b>banker&rsquo;s bonus tax</b>"},
		{id: "6686",description: "allowing <b>marriage</b> between two people of same sex"},
		{id: "6687",description: "<a href=\"http://en.wikipedia.org/wiki/Academy_(English_school)\">academy schools</a>"},
		{id: "6688",description: "use of <b>UK military forces</b> in combat operations overseas"},
		{id: "6690",description: "measures to reduce <b>tax avoidance</b>"},
		{id: "6691",description: "stronger tax <b>incentives for companies to invest</b> in assets"},
		{id: "6692",description: "slowing the rise in <b>rail fares</b>"},
		{id: "6693",description: "lower taxes on <b>fuel for motor vehicles</b>"},
		{id: "6694",description: "higher taxes on <b>alcoholic drinks</b>"},
		{id: "6696",description: "the introduction of elected <b>Police and Crime Commissioners</b>"},
		{id: "6698",description: "<b>fixed periods between parliamentary elections</b>"},
		{id: "6699",description: "higher <b>taxes on plane tickets</b>"},
		{id: "6697",description: "selling England&rsquo;s state owned <b>forests</b>"},
		{id: "6702",description: "spending public money to create <b>guaranteed jobs for young people</b> who have spent a long time unemployed"},
		{id: "6703",description: "laws to promote <b>equality and human rights</b>"},
		{id: "6704",description: "financial incentives for <b>low carbon</b> emission <b>electricity generation</b> methods"},
		{id: "6705",description: "requiring pub companies to offer <b>pub landlords rent-only leases</b>"},
		{id: "6706",description: "strengthening the <b>Military Covenant</b>"},
		{id: "6707",description: "restricting the scope of <b>legal aid</b>"},
		{id: "6708",description: "transferring <b>more powers to the Welsh Assembly</b>"},
		{id: "6709",description: "transferring <b>more powers to the Scottish Parliament</b>"},
		{id: "6710",description: "<b>culling badgers</b> to tackle bovine tuberculosis"},
		{id: "6711",description: "an annual tax on the value of expensive homes (popularly known as a <b>mansion tax</b>)"}
    ];

    db.collection('issues', function(err, collection) {
        collection.insert(issues, {safe:true}, function(err, result) {});
    });

};