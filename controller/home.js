const express 	= require('express');
const userModel = require.main.require('./models/userModel');
const memberModel	= require.main.require('./models/memberModel');
const categoryModel	= require.main.require('./models/categoryModel');
const carlistModel		=require.main.require('./models/carlistModel');
const router 	= express.Router();
var pdf        = require('html-pdf');
var fs         = require('fs');
var options    = {format:'A4'};


router.get('/', (req, res)=>{
	if(req.cookies['uname'] != null){
		userModel.getcount(function(count){
			console.log(count);
			memberModel.getcount(function(count1){
					//console.log(count);
						var name =req.cookies['uname'];
						//console.log("namemmmmmm",name)
						res.render('home/index', {ac: count, bc: count1,name });
					});		
		
			
		});
	}
	else{
		res.redirect('/login');
	}
	

	//res.render('home/index');// remove it after you have done your work

});

router.get('/ajaxsearch/:id',(req,res)=>{

	var txt = req.body.search_input;

	console.log(txt);

	var word = req.params.id;
	console.log('word value '+word);
	if(word!=null || word!=undefined || txt!=null)
	{
		carlistModel.getsearch(word, function(results){

			var str = "";
			for(i=0;i<results.length;i++)
			{
				str+='<a style="position:relative; left:30px; font-size:20px; margin-top:50px;" href="/user/hmedit/'+results[i].id+'">'+results[i].buyer_uname+'</a><br><br>';

			}
			console.log("in ajax "+str);
			//res.render('user/edit', {users: results});
			res.send(str);

		});
	}
	

});


router.get('/carlist', (req, res)=>{
	
	carlistModel.getAll(function(results){
        console.log(results);
		res.render('home/carlist', {userlist: results});
	});
	
});

router.get('/carlist/delete/:id', (req, res)=>{
	// a_id = req.params.id;
	// console.log(a_id);
	carlistModel.getById(req.params.id, function(results){
    console.log("obj",results);		
    var user = {
			id : req.params.id, 
			car_name: results[0].car_name,
			company: 	results[0].company,	 //user.buyer_uname, user.buyer_email, user.job_desc, user.job_date, user.salary, user.freelancer_uname 
			category:    results[0].category_id, 
			rent_amount:   	 results[0].rent_amount,
			user_image:  results[0].image
			//member: result.member
			 // need to check for radio button
            };
            console.log("car lsit",user);	
        carlistModel.delete(user, function(status){
		if(status){
            carlistModel.getAll(function(results){
                res.render('home/carlist', {userlist: results});
        });
			//res.render('adFreelancerlist/adminFreelancerlist');// need to change the path
		}else{

			res.redirect('/home/carlist');
		}
	});
			//res.render('/adBuyerlist/delete', {userlist:results});
			 //console.log(userlist);
	});
	
})

router.get('/carlist/edit/:id', (req, res)=>{
	// a_id = req.params.id;
	// console.log(a_id);
	carlistModel.getById(req.params.id, function(results){
	console.log("obj",results);	
	categoryModel.getAll(function(result){		
        res.render('home/edit_carlist', {userlist: results, category: result});
	});  
	});
	
});
router.post('/carlist/edit/:id', (req, res)=>{
	// a_id = req.params.id;
	console.log("car id",req.params.id);
	carlistModel.getById(req.params.id, function(results){
	console.log("obj",results);	
	var user = {
		id : req.params.id, 
		car_name: 	  req.body.cname,
		company: req.body.company,  
		rent_amount: req.body.rent,
        category:    req.body.c_id, 
        image:    req.body.image
       
         
	};
	console.log("update", user);
	//console.log(req.body);
	//res.render('home/index');// remove it after you have done your work
	
	 carlistModel.update(user,function(status){
		if(status){
			console.log("inside update");
			carlistModel.getAll(function(results){
			//alert("user info updated");
			//res.render('/home/carlist', {userlist: results});
			res.redirect('/home/carlist');
			});// need to change the path
		}else{
			console.log("did not update");
			//alert("something wrong cannot update");
			res.redirect('/home/edit_carlist');
		}
    });
	
    
       // res.render('home/edit_carlist', {userlist: results});
        
		
	});
	
});





router.get('/addcar', (req, res)=>{
   categoryModel.getAll(function(results){
	//alert("user info updated");
	res.render('home/add_car', {userlist: results});
	});
	//res.render('home/add_car');
});


router.post('/addcar', (req, res)=>{
	
	var user = {

		//id : req.params.id, 
			car_name: req.body.cname,
			company: 	req.body.company,	 //user.buyer_uname, user.buyer_email, user.job_desc, user.job_date, user.salary, user.freelancer_uname 
			category:    req.body.c_id, 
			rent_amount:   	req.body.rent,
			image:  req.body.image
        
	};
	console.log(user);
	//console.log(req.body);
	//res.render('home/index');// remove it after you have done your work
	
	 carlistModel.insert(user,function(status){
		if(status){
			console.log("inside insertion");
			carlistModel.getAll(function(results){
			//alert("user info updated");
			res.render('home/carlist', {userlist: results});
			});// need to change the path
		}else{
			console.log("did not insert");
			//alert("something wrong cannot update");
			res.redirect('/home/add_car');
		}
    });
		
	
});

router.get('/allcategory', (req, res)=>{
	
	categoryModel.getAll(function(results){
        console.log(results);
		res.render('home/all_category', {userlist: results});
	});
	
	
});

router.get('/addcategory', (req, res)=>{

	res.render('home/add_category');
});

router.post('/addcategory', (req, res)=>{
	
	var user = {

		//id : req.params.id, 
			name: req.body.name
			
        
	};
	console.log(user);
	//console.log(req.body);
	//res.render('home/index');// remove it after you have done your work
	
	 categoryModel.insert(user,function(status){
		if(status){
			categoryModel.getAll(function(results){
			//alert("user info updated");
			res.render('home/all_category', {userlist: results});
			});// need to change the path
		}else{
			//alert("something wrong cannot update");
			res.redirect('/home/add_category');
		}
    });
		
	
});




////////////////////////freelancer work//////////////////////////////////////////////////////////
// router.get('/mem_carlist', (req, res)=>{
	
// 	carlistModel.getAll(function(results){
//         //console.log(results);
// 		res.render('home/mem_carlist', {userlist: results});
// 	});
	
	
// });


//////////freelancer work ends here/////////////////////////////////////////////////////////////////////////////////

router.get('/admin_info', (req, res)=>{
	
	//res.render('home/index');// remove it after you have done your work
	userModel.getByname(req.cookies['uname'],function(results){
		res.render('home/admin_info', {userlist: results});
	});
	
});
router.post('/info', (req, res)=>{
	
	var user = {
        fname: 	  req.body.fname,
        username: req.body.uname,  //fname, uname, pass, pass2, email, phone, address1, member(freelancer/buyer) 
        password: req.body.pass,
        email:    req.body.email, 
        phone:    req.body.phone,
        address:  req.body.address1
        //member: req.body.member
         // need to check for radio button
	};
	console.log(user);
	//console.log(req.body);
	//res.render('home/index');// remove it after you have done your work
	
	 userModel.update(user,function(status){
		if(status){
			userModel.getByname(user.username,function(results){
			//alert("user info updated");
			res.render('home/admin_info', {userlist: results});
			});// need to change the path
		}else{
			//alert("something wrong cannot update");
			res.redirect('/home/info');
		}
    });
		
	
});


router.get('/userlist', (req, res)=>{

	userModel.getAll(function(results){
		res.render('home/userlist', {userlist: results});
	});

});
module.exports = router;