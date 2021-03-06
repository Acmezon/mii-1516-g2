var Discount = require('../models/discount'),
	IsOver = require('../models/is_over'),
	ActorService = require('./services/service_actors'),
	DiscountService = require('./services/service_discounts'),
	CouponCode = require('coupon-code');

// Returns all discount objects
exports.getDiscounts = function (req, res) {
	console.log("Function-discountsApi-getDiscounts");

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				Discount.find()
				.exec (function (err, discounts) {
					if (err) {
						res.status(500).json({success: false})
					} else {
						res.status(200).json(discounts);
					}
				});
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
};

// Returns all discounts over a product
exports.getDiscountsByProduct = function (req, res) {
	var product_id = req.params.id;
	console.log("Function-discountsApi-getDiscountsByProduct --id: " + product_id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				IsOver.find({product_id: product_id}).select('discount_id')
					.exec(function (err, isovers) {
					if (err) {
						res.status(500).json({success: false});
					} else {

						var discounts_ids = isovers.map(function(isover) {
							return isover.discount_id;
						});

						Discount.find({'_id': {$in: discounts_ids}})
						.exec( function (err, discounts) {
							if (err) {
								res.status(500).json({success: false});
							} else {
								res.status(200).json(discounts);
							}
						});
						
					}
				});
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
};

// Returns if a discount is possible for a product
exports.canRedeemCode = function (req, res) {
	var code = req.body.code,
		product_id = req.body.product_id;
	console.log("Function-discountsApi-canRedeemCode --code: " + code + " --product_id: " + product_id)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin' || role=='customer') {
				if(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code) &&
					CouponCode.validate(code, {parts: 4}).length){

					DiscountService.canRedeemCode(cookie, jwtKey, code, product_id, function (discount) {
						if (discount) {
							res.status(200).json(discount);
						} else {
							res.status(200).json(null);
						}
					});

				} else {
					res.status(200).json(null);
				}
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
}



// Return number of products affected by discount id
exports.getNumberOfProductsAffected = function (req, res) {
	var id = req.params.id;
	console.log("Function-discountsApi-getNumberOfProductsAffected");

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				IsOver.count({discount_id: id})
				.exec (function (err, number) {
					if (err) {
						res.status(500).json({success: false})
					} else {
						res.status(200).json(number);
					}
				});
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
};

// Updates a discount
exports.updateDiscount = function (req, res) {
	var id = req.body.discount_id;
	var value = parseInt(req.body.value);
	console.log("Function-discountsApi-updateDiscount  --id: " + id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				Discount.update({ _id: id }, {$set: {value: value}},{ runValidators: true }, function(err) {
					    if (!err) {
					    	res.status(200).json({success: true});
					    }
					    else {
							res.status(500).json({success: false, message: err});
					    }
					});
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});
}

// Deletes a discount
exports.deleteDiscount = function (req, res) {
	var id = req.body.id;
	console.log("Function-discountsApi-deleteDiscount  --id: " + id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				Discount.remove({ _id: id }, function(err) {
					    if (!err) {
					    	res.status(200).json({success: true});
					    }
					    else {
							res.status(500).json({success: false, message: err});
					    }
					});
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});
};

// Generate a code and returns it.
exports.generateCode = function (req, res) {
	console.log("Function-discountsApi-generateCode");

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				var code = CouponCode.generate({ parts: 4 });
				res.status(200).json(code);
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});
};

// Creates a discount
exports.createDiscount = function (req, res) {
	console.log("Function-discountsApi-createDiscount");

	var value = parseInt(req.body.value) || 0,
		code = req.body.code;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				if(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code) &&
					CouponCode.validate(code, {parts: 4}).length){

					var newDiscount = Discount({
						code : code,
						value : value
					});

					newDiscount.save(function (err, savedDiscount) {
						if (err) {
							res.status(500).json({success: false});
						} else {
							res.status(200).json(savedDiscount)
						}
					});

				} else {
					// Wrond code format
					res.status(500).json({success: false});
				}
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});	
};

// Apply a discount
exports.applyDiscount = function (req, res) {
	var discount_id = req.body.discount_id,
		product_id = req.body.product_id;
	console.log("Function-discountsApi-applyDiscount --discount_id: " + discount_id + " --product_id: " + product_id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {

				IsOver.findOne({product_id: product_id, discount_id: discount_id}).exec(function (err, isover) {
					if (err) {
						res.status(500).json({success: false});
					} else {
						if (isover) {
							// Already applied
							res.status(500).json({success: false});
						} else {

							var new_isover = new IsOver({
								product_id: product_id,
								discount_id: discount_id
							});

							new_isover.save(function (err) {
								if (err) {
									res.status(500).json({success: false});
								} else {
									res.status(200).json({success: true});
								}
							});
						}
					}
				});
				
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});	
};

// Disapply a discount
exports.clearDiscount = function (req, res) {
	var discount_id = req.body.discount_id,
		product_id = req.body.product_id;
	console.log("Function-discountsApi-applyDiscount --discount_id: " + discount_id + " --product_id: " + product_id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {

				IsOver.remove({product_id: product_id, discount_id: discount_id}, function (err) {
					if (err) {
						res.status(500).json({success: false});
					} else {
						res.status(200).json({success: true});
					}
				});
				
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});	
};