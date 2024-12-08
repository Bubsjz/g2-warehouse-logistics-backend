const fs = require('fs')
const path = require('path')


const orderMessage = (orderId, recipientInfo, senderInfo, status, comments) => {
    const title = status === "not approved" ? "Rejected Order" : "Accepted Order"
    const reasonText = status === "not approved" ? "has been rejected" : "has been approved"

    const data = {
        title: title,
        reasonText: reasonText,
        orderId: orderId,
        recipient_name: recipientInfo.recipient_name || "Recipient",
        recipient_surname: recipientInfo.recipient_surname || "",
        recipient_warehouse_name: recipientInfo.recipient_warehouse_name || "Unknown Warehouse",
        sender_name: senderInfo.sender_name || "Sender",
        sender_surname: senderInfo.sender_surname || "",
        sender_email: senderInfo.sender_email || "Unknown Email",
        sender_warehouse_name: senderInfo.sender_warehouse_name || "Unknown Warehouse",
        sender_warehouse_address: senderInfo.sender_warehouse_address || "No Address Provided",
        status: status,
        comments: comments || "No comments provided.",
        rejectionSection: status === "not approved" 
        ? `<div style="padding-top: 2px">
        <h3>Rejection Reason:</h3>
        <p>${comments}</p>
        <div>` 
        : "",
        introMessage: status === "not approved"
        ? "<p>This message is to inform you about an issue with the order you recently sent to our warehouse.</p>"
        : "<p>This message is to inform you about the state of the order you recently sent to our warehouse.</p>",
        issueAddress: status === "not approced"
        ? "<p>To address this issue, please review the order details in our platform and make the necessary corrections before resending it.</p>"
        : ""
    };

    // console.log(recipientInfo)
    // console.log("//////////////////////////")
    // console.log(senderInfo)
    
    const templatePath = path.join(__dirname, "orderTemplate.html");
    let template = fs.readFileSync(templatePath, 'utf-8')

    template = template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '')


    return template

}

module.exports = {
    orderMessage
}