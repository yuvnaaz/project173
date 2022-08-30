AFRAME.registerComponent("markerhandler", {
    init: async function() {
      var toys = await this.getToys();
  
      this.el.addEventListener("markerFound", () => {
        var markerId = this.el.id;
        this.handleMarkerFound(toys, markerId);
      });
  
      this.el.addEventListener("markerLost", () => {
        this.handleMarkerLost();
      });
    },
    askUserId: function(){
        swal({
          icon: "success",
          title: "Welcome!",
          closeOnClickOutside: false,
          content: {
            element: "input", 
            attribute: {
              placeholder: "Type Your user id Number",
              min: 1,
              type: "number"
            }
          },
        }).then(value=>{uid = value})
        
    
      },

    handleMarkerFound: function(toys, markerId) {
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";
  
      var orderButtton = document.getElementById("order-button");
      var orderSummaryButtton = document.getElementById("order-summary-button");
  
      // Handling Click Events
      orderButtton.addEventListener("click", () => {
        swal({
          icon: "success",
          title: "Thanks For Order !",
          text: "",
          timer: 2000,
          buttons: false
        });
        this.handleOrder(uid, toy)
      });
  
      orderSummaryButtton.addEventListener("click", () => {
        swal({
          icon: "warning",
          title: "Order Summary",
          text: "Work In Progress"
        });
      });
      var ratingButton = document.getElementById("rating-button");
      ratingButton.addEventListener("click",()=>{
        this.handleRating(toy)
      })
      
  
      // Changing Model scale to initial scale
      var toy = toys.filter(toy => toy.id === markerId)[0];
  
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);
    },
    handleRatings: function(toy) {
      // Close Modal
      document.getElementById("rating-modal-div").style.display = "flex";
      document.getElementById("rating-input").value = "0";
  
      var saveRatingButton = document.getElementById("save-rating-button");
      saveRatingButton.addEventListener("click", () => {
        document.getElementById("rating-modal-div").style.display = "none";
        var rating = document.getElementById("rating-input").value;
  
        firebase
          .firestore()
          .collection("toys")
          .doc(toy.id)
          .update({
            rating: rating
          })
          .then(() => {
            swal({
              icon: "success",
              title: "Thanks For Rating!",
              text: "We Hope You Like Toy !!",
              timer: 2500,
              buttons: false
            });
          });
      });
    },
    handleOrder: function(uid, toy) {
        // Reading current UID order details
        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => {
        var details = doc.data();
        if (details["current orders"][toy.id]) {
        details ["current orders"][toy.id]["quantity"] += 1;
        //Calculating Subtotal of item
    
        var currentQuantity = details[ "current orders"][toy.id]["quantity"];
    
        details["current orders"][toy.id]["subtotal"] =
        currentQuantity * toy.price;
        } else {
        details["current orders"][toy.id] = {
        item: toy.toy_name,
        price: toy.price,
        quantity: 1,
        subtotal: toy.price * 1
        };
        }
        details. total_bill += toy.price;
        // Updating Db
        firebase
        .firestore()
        .collection("users")
        .doc(doc.id)
        .update(details);
    })
},
    getToys: async function() {
      return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
          return snap.docs.map(doc => doc.data());
        });
    },
    handleMarkerLost: function() {
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "none";
    },
    handleSummary: function(){
      var orderSummary = firebase.firestore().collection("toys").doc(askUserId).get().then(doc=> doc.data())
      var modalDiv = document.getElementById("modal-div") 
      modalDiv.style.display = "flex"
      var UserDiv = document.getElementById("bill-user-body")
      UserDiv.innerHTML = ""
      var orders = Object.keys(orderSummary.current_orders)
      orders.map(item=>{
        var tr = document.createElement("tr")
        var name = document.createElement("td")
        var price = document.createElement("td")
        var quantity = document.createElement("td")
        var subTotal = document.createElement("td")
        name.innerHTML = orderSummary.current_orders[item].name
        price.innerHTML = "$"+ orderSummary.current_orders[item].price
        quantity.innerHTML = orderSummary.current_orders[item].quantity
        subTotal.innerHTML = "$"+ orderSUmmary.current_orders[item].subTotal
        tr.appendChild(name)
        tr.appendChild(price)
        tr.appendChild(quantity)
        tr.appendChild(subTotal)
        tableDiv.appendChild(tr)
      })
  
      var tr2 = document.createElement("tr")
      var td1 = document.createElement("td")
     td1.setAttribute("class","no-line")
     var td2 = document.createElement("td2")
     td2.setAttribute("class","no-line")
     var td3 = document.createElement("td")
     td3.innerHTML = "Total"
     var td4 = document.createElement("td")
     td4.innerHTML = "$"+ orderSummary.total_bill
  
     tr2.appendChild(td1)
     tr2.appendChild(td2)
     tr2.appendChild(td3)
     tr2.appendChild(td4)
     UserDiv.appendChild(tr2)
  
  
  
  
    },

    
  });


