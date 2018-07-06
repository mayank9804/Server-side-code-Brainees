const express = require('express');
maxPageData = 5;
users = [
			{
				name : "Shashank Tiwari",
				age : 24,
				country : "India"
			},{
				name : "Leo peo",
				age : 12,
				country : "US"
			},{
				name : "Luke D'mello",
				age : 20,
				country : "France"
			},{
				name : "Chris D'Costa",
				age : 21,
				country : 'UK'
			},{
				name : "Hero reo",
				age : 26,
				country : "Russia"
			},{
				name : "Lilly",
				age : 12,
				country : "Japan"
			},{
				name : "Zero",
				age : 12,
				country : "China"
			},{
				name : "kitty",
				age : 20,
				country : "Canada"
			},{
				name : "logan",
				age : 21,
				country : 'Canada'
			},{
				name : "Jane",
				age : 26,
				country : "UK"
			},{
				name : "Bruce Wayne",
				age : 24,
				country : "US"
			},{
				name : "Krrish",
				age : 12,
				country : "India"
			},{
				name : "Peter Parker",
				age : 20,
				country : "US"
			},{
				name : "Lisa Kale",
				age : 21,
				country : 'UK'
			},{
				name : "Robin",
				age : 26,
				country : "Russia"
			}
		];

		
let paginateRouter = express.Router();

function route(){

	// Fetch student list based on what page number was clicked
	// /paginate/student/id
	// Also one can customize how many items can be displayed on page by 
	// sending the counter
    paginateRouter.route('/students/:id').get((req,res)=>{
        if (req.params.id && req.params.id!='') {
            let start = req.params.id * this.maxPageData - this.maxPageData;
            let end = start + this.maxPageData;

            res.status(200).json({
                error:false,
                totalItems:this.users.length,
                users:this.users.slice(start,end)
            });

        }else{
            res.status(403).json({
                error : true,
                message : `Invalid page Id.` 
            });
        }
	})
	.post((req,res)=>{
		if (req.params.id && req.params.id!='') {
			if(req.body.pageLimit)
				maxPageData = req.body.pageLimit;
            let start = req.params.id * this.maxPageData - this.maxPageData;
            let end = start + this.maxPageData;
			console.log(req.body.pageLimit);
            res.status(200).json({
                error:false,
                totalItems:this.users.length,
                users:this.users.slice(start,end)
            });

        }else{
            res.status(403).json({
                error : true,
                message : `Invalid page Id.` 
            });
        }
	})
	//Later
    // paginateRouter.route('/mentors').get((req,res)=>{
       
    // })
    return paginateRouter;
}

module.exports = route();