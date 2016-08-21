var promiseService = require("../../app/services/promise-service");
var databaseHelper = require("dal");
var appConfig = require("../../app/config");

describe("Initialization", function(){
	it("should start mongo", function(done){
		databaseHelper.startMongo(appConfig.db, function (err, db) {
		  expect(db).toBeDefined();
		  done();
		});
	});
});

describe("while processing the book store value", function(){
	it("should convert Songs of Solomons to songs", function(){
		var storeValue = promiseService.processBookStoreValue("Songs Of Solomon");
		expect(storeValue).toEqual("songs");
	});
});

describe("while saving a promise", function(){
	it("should fail if Promises Data is empty", function(done){
		promiseService.createPromise({}, function(err){
			expect(err).toEqual("You should pass Promises object");
			done();
		});
	});	
	it("should validate book", function(done){
		promiseService.createPromise({ chapter: ""}, function(err){
			expect(err).toEqual("Book Name should not be empty");
			done();
		});
	});
	it("should validate chapter", function(done){
		promiseService.createPromise({ book: "Psalms"}, function(err){
			expect(err).toEqual("Chapter should not be empty");
			done();
		});
	});
	it("should validate verse", function(done){
		promiseService.createPromise({ book: "Psalms", chapter: 12}, function(err){
			expect(err).toEqual("Verse should not be empty");
			done();
		});
	});
	it("should validate Verse Text", function(done){
		promiseService.createPromise({ book: "Psalms", chapter: 12, verse: 2}, function(err){
			expect(err).toEqual("Verse Text should not be empty");
			done();
		});
	});
	it("should return default promise, if there are no records in the system");
	it("should create new record if no records are already present", function(done){
		var promise = {
			book : "Genesis",
			chapter: 10,
			verse: 1,
			text: "Verse Text"
		};
		
    promiseService.createPromise(promise, function (err1, result1){
      expect(err1).toBe(null);
      promiseService.getTodaysPromise(function (err, result){
        expect(result).toBeDefined();
				expect(result.book).toBe("Genesis");
				expect(result.chapter).toBe(10);
				expect(result.verse).toBe(1);
				expect(result.text).toBe("Verse Text");
				done();
			});			
		});
	});
	it("should the record if its already present", function(done){
		var promise = {
			book : "Psalms",
			chapter: 23,
			verse: 2,
			text: "New Verse Text"
		};
		
		promiseService.getTodaysPromise(function(err, result){
			expect(result.book).toBe("Genesis");
			promiseService.createPromise(promise, function(){
				promiseService.getTodaysPromise(function(err1, result1){
					expect(result1.book).toBe("Psalms");
					expect(result1.chapter).toBe(23);
					expect(result1.verse).toBe(2);
					expect(result1.text).toBe("New Verse Text");
					done();
				});			
			});
		});		
	});
});