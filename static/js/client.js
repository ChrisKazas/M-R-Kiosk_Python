"use strict"

$(document).ready(()=>{


  // JqueryUI methods
  $(".select-menu").selectmenu();
  $(".workDoneTxtArea").hide()
  $(".workDoneSaveBtn").hide()
  $(".workDoneCancelBtn").hide()

  // ########### New Work Order ###################################
  $("#newWOdatePicker").datepicker({inline : true});
//  $("#newWoTxtArea").focus()

  // Generate new work order
  $("#newWoSaveBtn").click((e)=>{

     // Grab values from Client Work Order Form
     const wo ={
     workTodo : $("#newWoTxtArea").val(),
     shopName : $("#newWOshopSelectBox").val(),
     mechName : $("#newWOmechSelectBox").val(),
     priority : $("#newWOpriSelectBox").val(),
     dateOpened : $("#newWOdatePicker").val()
     }

     if(wo.workTodo == ""){
       alert("Work Order Description Field Required!!")
     }else if(wo.shopName == "Shops"){
       alert("Shop Name Field Required!!")
     }else if(wo.mechName == "Mechanics"){
       alert("Mechanic Field Required!!")
     }else if(wo.priority == "Priority"){
       alert("Priority Field Required!!")
     }else{
       const url = '/genNewWrkOrd';
       $.ajax({
         url : url,
         data : wo,
         type : 'post'
       })
       .done((data, xhr) => {
         alert("Your Work Order has been generated. Remember!! Safety First!!!");
         // Clean up
         $("#newWoTxtArea").val("");
       })
       .fail((xhr,error) => {
         console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
       });
     }


     // Unit Testing
     console.info(wo.workTodo)
     console.info(wo.mechName)
     console.info(wo.shopName)
     console.info(wo.priority)
     console.info(wo.dateOpened)

  });

  // Save and close work order from WO Generator
  $("#woModalSaveBtn").click((e)=>{

     // Grab top element
     const parent = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.children[6];

     // Grab work order data from UI
     const wo = {
       workDone   : $("#workDoneModalTxtArea").val(),
       workTodo   : parent.children[2].children[1].value,
       shopName   : parent.children[3].children[0].value,
       mechName   : parent.children[3].children[2].value,
       priority   : parent.children[3].children[4].value,
       dateOpened : parent.children[3].children[8].children[0].children[0].value,
       dateClosed : parent.children[3].children[8].children[0].children[0].value
     }

     if(wo.workTodo == "" ){
       alert("Work Done Field Required!!")
     }else if(wo.workDone == ""){
       alert("Work Done Field Required!!")
     }else if(wo.shopName == "Shops"){
       alert("Shop Name Field Required!!")
     }else if(wo.mechName == "Mechanics"){
       alert("Mechanic Field Required!!")
     }else if(wo.priority == "Priority"){
       alert("Priority Field Required!!")
     }else{
       const url = '/addWorkOrder';
       $.ajax({
         url : url,
         data : wo,
         type : 'post'
       })
       .done((data,xhr) => {
         alert("Your Work Has Been Saved");
         // Clean up
         $("#workDoneModalTxtArea").val("");
         $("#newWoTxtArea").val("");
       })
       .fail((xhr, error) => {
         console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
       })
     }

     // Unit Testing
     // console.info("Date Opened: " + wo.dateOpened);
     // console.log("Today: " + wo.dateClosed)


  });

  // UNDER CONSTRUCTION
  $('#newWoReoccurBtn').click((e)=>{alert("Coming Soon!!!")});

  // ########### Shops Administration ###############################################
  $(".shopDelBtn").click((e)=>{

     const shopCard = e.currentTarget.parentElement.parentElement
     const data = {
       shopId : e.currentTarget.parentElement.children[0].dataset.shopid
     }

     const url = '/delShop';

     if(confirm("You sure you want to delete this shop?!?")){
       $.ajax({
         url : url,
         data : data,
         type : 'DELETE'
       })
       .done((data, xhr) => {
         shopCard.remove()
       })
       .fail((xhr, error) => {
         console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
       });
     }

     // Unit Testing
     console.info(shopCard)

  });

  $(".shopEditBtn").click((e)=>{

     let shopId = e.currentTarget.parentElement.children[0].dataset.shopid

     // Unit Testing
     console.info(shopId)

  });

  $("#addShopInput").focus()
  $("#saveNewShopBtn").click((e)=>{

    const data = {
      newShop : $("#addShopInput").val()
    }
    const url = '/addShop';

    $.ajax({
      url : url,
      data : data,
      type : 'post'
    })
    .done((data, xhr) => {
      alert(data.newShop + " has been saved")
      $("#addShopInput").val("")
    })
    .fail((data, xhr, error) => {
       console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
    });

    // Unit Testing
    console.log(data.newShop)
  });


  // ######## Mechanics Administration ##########################################################
  $("#saveNewMechBtn").click((e) => {

    const data = {
      newMech : $("#addMechInput").val()
    }

    const url = '/addMech';

    $.ajax({
      url:url,
      data:data,
      type : 'post'
    })
    .done((data, xhr)=>{
      alert(data.newMech + " has been saved")
      $("#addMechInput").val("")
    })
    .fail((xhr, error)=>{
      console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
      $("#addMechInput").val("")

    });
  });

  // Delete Mechanic from Admin
  $(".mechDelBtn").click((e) => {

     const mechCard = e.currentTarget.parentElement.parentElement
     const data = {
       mechId : e.currentTarget.parentElement.children[0].dataset.mechid
     }
     const url = '/delMech';

     if(confirm("You sure you want to delete this Mechanic?!?")){
       $.ajax({
         url : url,
         data : data,
         type : 'DELETE'
       })
       .done((data, xhr) => {
         mechCard.remove()
       })
       .fail((xhr, error) => {
         console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
       });
     }

     // Unit Testing
     // console.info(mechName)
     //console.info(data.mechId)

  });

  $(".mechEditBtn").click((e)=>{

     let mechName = e.currentTarget.parentElement.children[0].dataset.mechname

     // Unit Testing
     console.info(mechName)

  });



  // ############# Injury Reporting ######################################################
  $("#injRptDatePicker").datepicker({inline : true});
  $("#injRptTxtArea").focus();


  $("#injRptSaveBtn").click((e)=>{

     let injuryDesc = $("#injRptTxtArea").val()
     let mechName = $("#injRptmechSelectBox").val()
     let shopName = $("#injRptShopSelectBox").val()
     let date = $("#injRptDatePicker").val()

     // Unit Testing
     console.info(injuryDesc)
     console.info(mechName)
     console.info(shopName)
     console.info(date)

  });


  // ############ Edit Work Order ########################################################
  $("#searchWoDateStart").datepicker()
  $("#searchWoDateEnd").datepicker()
  $(".woCloseBtn").click((e)=>{

    let parentDiv = e.currentTarget.parentElement

    let textAreaId = parentDiv.children[3].attributes.id.nodeValue
    let workDoneSaveBtn = parentDiv.children[4].attributes.id.nodeValue
    let closeOutBtn = parentDiv.children[5].attributes.id.nodeValue
    let workDoneCancelBtn = parentDiv.children[6].attributes.id.nodeValue

    $("#" + textAreaId).slideDown();
    $("#" + textAreaId).focus();
    $("#" + closeOutBtn).hide()
    $("#" + workDoneSaveBtn).fadeIn()
    $("#" + workDoneCancelBtn).fadeIn()

    console.log(closeOutBtn)
  });


  //
  $(".workDoneSaveBtn").click((e)=>{

    const parent = e.currentTarget.parentElement
    const textAreaId = parent.children[3].attributes.id.nodeValue
    const card = e.currentTarget.parentElement.parentElement

    const wo = {
      id : parent.children[3].dataset.woid,
      workDone : $("#"+textAreaId).val()
    }

    if(wo.workDone == ""){
      alert("Work Done Field Required!!")
    }else{
      const url = '/closeOpenWorkOrder';
      $.ajax({
        url: url,
        data : wo,
        type : 'post'
      })
      .done((data,xhr) => {
        alert("Your work has been saved and work order has been closed out");
        $("#"+textAreaId).slideUp()
        $("#"+textAreaId).val("")
        card.remove()
      }).fail((xhr,error) =>{
        console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
      })
    }

  });

  // Resets Work Order
  $(".workDoneCancelBtn").click((e)=>{

    const parentDiv = e.currentTarget.parentElement;

    const workDoneSaveBtn = parentDiv.children[4].attributes.id.nodeValue;
    const workDoneCancelBtn = parentDiv.children[6].attributes.id.nodeValue;
    const closeOutBtn = parentDiv.children[5].attributes.id.nodeValue;
    const textAreaId = parentDiv.children[3].attributes.id.nodeValue;

    $("#" + workDoneSaveBtn).hide()
    $("#" + workDoneCancelBtn).hide()
    $("#" + closeOutBtn).fadeIn()
    $("#" +textAreaId).slideUp();
  });

  // Work Order Search Button
  $("#searchWoBtn").click((e)=>{
     alert("Coming soon")
/*
     const woCards = document.querySelectorAll(".wo-card")
     woCards.forEach((card)=>{ card.parentElement.remove()})

     const data = {
       mechName  : $("#editWOmechSelectBox").val(),
       shopName  : $("#editWOshopSelectBox").val(),
       priority  : $("#editWOpriSelectBox").val(),
       startDate : $("#searchWoDateStart").val(),
       endDate   : $("#searchWoDateEnd").val()
     }

     const url = '/searchOpenWorkOrders';

     $.ajax({
       url:url,
       data:data,
       type:'post'
     })
     .done((data, xhr)=>{
	console.log(data)
     }).fail((xhr, error)=>{
        console.error("fail " + 'xhr status:' + xhr.status + ' error:' + error);
     });
*/

  });
});

