function autoFillIPSTemplateGoogleDoc(e) {
  // declare variables from Google Sheet
  let investorName = e.values[1];
  let timeStamp = e.values[0];
  let emailID = e.values[2];
  let asset = e.values[4];
  let taxID = e.values[5];
  let returnGoal = parseFloat(e.values[6]).toFixed(2) + "%"; //format to 2 decimal places add percentage sign a percetange sign

  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let formatedTaxId = `${taxID.slice(0, 3)}-${taxID.slice(3, 5)}-${taxID.slice(
    5,
    9
  )}`; //format tax id to follow a generic format

  // convert values from column 3 of Google Sheet to string
  const goals = e.values[3].toString();
  // declare goal variables
  let goal1 = "";
  let goal2 = "";
  let goal3 = "";

  //create an array and parse values from CSV format, store them in an array
  goalsArr = goals.split(",");
  if (goalsArr.length >= 1) goal1 = goalsArr[0];
  if (goalsArr.length >= 2) goal2 = goalsArr[1];
  if (goalsArr.length >= 3) goal3 = goalsArr[2];

  //grab the template file ID to modify
  const file = DriveApp.getFileById(templateID);
  //grab the Google Drive folder ID to place the modied file into
  var folder = DriveApp.getFolderById(folderID);
  //create a copy of the template file to modify, save using the naming conventions below
  var copy = file.makeCopy(investorName + " Investment Policy", folder);
  console.log(copy.getId());

  //modify the Google Drive file
  var doc = DocumentApp.openById(copy.getId());

  var body = doc.getBody();

  body.replaceText("%InvestorName%", investorName);
  body.replaceText("%Date%", timeStamp);

  body.replaceText("%Goal1%", goal1.trim());
  body.replaceText("%Goal2%", goal2.trim());
  body.replaceText("%Goal3%", goal3.trim());

  body.replaceText("%asset%", USDollar.format(asset));
  body.replaceText("%returnGoal%", returnGoal);
  body.replaceText("%taxID%", formatedTaxId);

  doc.saveAndClose();

  //find the file that was just modified, convert to PDF, attach to e-mail, send e-mail
  var attach = DriveApp.getFileById(copy.getId());
  var pdfattach = attach.getAs(MimeType.PDF);
  MailApp.sendEmail(emailID, subject, emailBody, { attachments: [pdfattach] });
}
